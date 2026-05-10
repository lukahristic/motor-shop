// components/admin/YMMManager.tsx
"use client"

import { useState }           from "react"
import { useRouter }          from "next/navigation"
import { SerializedYear, SerializedMake } from "@/types"

interface Props {
  initialYears: SerializedYear[]
}

export default function YMMManager({ initialYears }: Props) {
  const router                          = useRouter()
  const [years, setYears]               = useState(initialYears)
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const [expandedMake, setExpandedMake] = useState<number | null>(null)

  // ── Input states ─────────────────────────────────────
  const [newYear,  setNewYear]  = useState("")
  const [newMake,  setNewMake]  = useState<Record<number, string>>({})
  const [newModel, setNewModel] = useState<Record<number, string>>({})

  // ── Loading states ───────────────────────────────────
  const [loading, setLoading] = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  function showError(msg: string) {
    setError(msg)
    setTimeout(() => setError(null), 4000)
  }

  // ── Add Year ─────────────────────────────────────────
  async function handleAddYear() {
    if (!newYear.trim()) return
    setLoading("year")

    try {
      const res  = await fetch("/api/admin/ymm/years", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ year: Number(newYear) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setNewYear("")
      router.refresh()

      // Optimistic update — add to local state immediately
      setYears((prev) => [
        { id: json.data.id, year: json.data.year, makes: [] },
        ...prev,
      ])
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add year")
    } finally {
      setLoading(null)
    }
  }

  // ── Delete Year ──────────────────────────────────────
  async function handleDeleteYear(yearId: number, yearNum: number) {
    const confirmed = window.confirm(
      `Delete ${yearNum}? This will also delete all makes and models under it.`
    )
    if (!confirmed) return
    setLoading(`delete-year-${yearId}`)

    try {
      const res = await fetch(`/api/admin/ymm/years/${yearId}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setYears((prev) => prev.filter((y) => y.id !== yearId))
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete year")
    } finally {
      setLoading(null)
    }
  }

  // ── Add Make ─────────────────────────────────────────
  async function handleAddMake(yearId: number) {
    const name = newMake[yearId]?.trim()
    if (!name) return
    setLoading(`make-${yearId}`)

    try {
      const res  = await fetch("/api/admin/ymm/makes", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, yearId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setNewMake((prev) => ({ ...prev, [yearId]: "" }))
      setYears((prev) =>
        prev.map((y) =>
          y.id === yearId
            ? { ...y, makes: [...y.makes, { ...json.data, models: [] }] }
            : y
        )
      )
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add make")
    } finally {
      setLoading(null)
    }
  }

  // ── Delete Make ──────────────────────────────────────
  async function handleDeleteMake(makeId: number, yearId: number, makeName: string) {
    const confirmed = window.confirm(
      `Delete ${makeName}? This will also delete all models under it.`
    )
    if (!confirmed) return
    setLoading(`delete-make-${makeId}`)

    try {
      const res  = await fetch(`/api/admin/ymm/makes/${makeId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setYears((prev) =>
        prev.map((y) =>
          y.id === yearId
            ? { ...y, makes: y.makes.filter((m) => m.id !== makeId) }
            : y
        )
      )
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete make")
    } finally {
      setLoading(null)
    }
  }

  // ── Add Model ────────────────────────────────────────
  async function handleAddModel(makeId: number, yearId: number) {
    const name = newModel[makeId]?.trim()
    if (!name) return
    setLoading(`model-${makeId}`)

    try {
      const res  = await fetch("/api/admin/ymm/models", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, makeId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setNewModel((prev) => ({ ...prev, [makeId]: "" }))
      setYears((prev) =>
        prev.map((y) =>
          y.id === yearId
            ? {
                ...y,
                makes: y.makes.map((m) =>
                  m.id === makeId
                    ? { ...m, models: [...m.models, json.data] }
                    : m
                ),
              }
            : y
        )
      )
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add model")
    } finally {
      setLoading(null)
    }
  }

  // ── Delete Model ─────────────────────────────────────
  async function handleDeleteModel(modelId: number, makeId: number, yearId: number) {
    setLoading(`delete-model-${modelId}`)

    try {
      const res  = await fetch(`/api/admin/ymm/models/${modelId}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      setYears((prev) =>
        prev.map((y) =>
          y.id === yearId
            ? {
                ...y,
                makes: y.makes.map((m) =>
                  m.id === makeId
                    ? { ...m, models: m.models.filter((mo) => mo.id !== modelId) }
                    : m
                ),
              }
            : y
        )
      )
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete model")
    } finally {
      setLoading(null)
    }
  }

  // ── Render ───────────────────────────────────────────
  return (
    <div>

      {/* Error toast */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Add Year */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-3">Add Year</h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            placeholder="e.g. 2024"
            min="1900"
            max="2100"
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 w-36"
          />
          <button
            onClick={handleAddYear}
            disabled={loading === "year" || !newYear}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading === "year" ? "Adding..." : "Add Year"}
          </button>
        </div>
      </div>

      {/* Years List */}
      <div className="space-y-4">
        {years.map((year) => (
          <div
            key={year.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
          >
            {/* Year Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <button
                onClick={() =>
                  setExpandedYear(expandedYear === year.id ? null : year.id)
                }
                className="flex items-center gap-3 text-white font-semibold hover:text-orange-400 transition-colors"
              >
                <span className={`text-xs transition-transform ${
                  expandedYear === year.id ? "rotate-90" : ""
                }`}>
                  ▶
                </span>
                {year.year}
                <span className="text-gray-500 text-xs font-normal">
                  {year.makes.length} makes
                </span>
              </button>

              <button
                onClick={() => handleDeleteYear(year.id, year.year)}
                disabled={loading === `delete-year-${year.id}`}
                className="text-red-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
              >
                {loading === `delete-year-${year.id}` ? "Deleting..." : "Delete"}
              </button>
            </div>

            {/* Makes (expanded) */}
            {expandedYear === year.id && (
              <div className="border-t border-gray-800 px-5 py-4">

                {/* Add Make Input */}
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newMake[year.id] ?? ""}
                    onChange={(e) =>
                      setNewMake((prev) => ({
                        ...prev,
                        [year.id]: e.target.value,
                      }))
                    }
                    placeholder="Add make e.g. Toyota"
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 flex-1 max-w-xs"
                  />
                  <button
                    onClick={() => handleAddMake(year.id)}
                    disabled={loading === `make-${year.id}` || !newMake[year.id]}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                  >
                    {loading === `make-${year.id}` ? "Adding..." : "+ Make"}
                  </button>
                </div>

                {/* Makes List */}
                {year.makes.length === 0 ? (
                  <p className="text-gray-600 text-sm">No makes yet</p>
                ) : (
                  <div className="space-y-3">
                    {year.makes.map((make) => (
                      <div
                        key={make.id}
                        className="border border-gray-800 rounded-lg overflow-hidden"
                      >
                        {/* Make Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/50">
                          <button
                            onClick={() =>
                              setExpandedMake(
                                expandedMake === make.id ? null : make.id
                              )
                            }
                            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
                          >
                            <span className={`text-xs transition-transform ${
                              expandedMake === make.id ? "rotate-90" : ""
                            }`}>
                              ▶
                            </span>
                            {make.name}
                            <span className="text-gray-500 text-xs">
                              {make.models.length} models
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteMake(make.id, year.id, make.name)
                            }
                            disabled={loading === `delete-make-${make.id}`}
                            className="text-red-500 hover:text-red-400 text-xs transition-colors disabled:opacity-50"
                          >
                            {loading === `delete-make-${make.id}`
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>

                        {/* Models (expanded) */}
                        {expandedMake === make.id && (
                          <div className="px-4 py-3">

                            {/* Add Model Input */}
                            <div className="flex gap-3 mb-3">
                              <input
                                type="text"
                                value={newModel[make.id] ?? ""}
                                onChange={(e) =>
                                  setNewModel((prev) => ({
                                    ...prev,
                                    [make.id]: e.target.value,
                                  }))
                                }
                                placeholder="Add model e.g. Camry"
                                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 flex-1 max-w-xs"
                              />
                              <button
                                onClick={() =>
                                  handleAddModel(make.id, year.id)
                                }
                                disabled={
                                  loading === `model-${make.id}` ||
                                  !newModel[make.id]
                                }
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                              >
                                {loading === `model-${make.id}`
                                  ? "Adding..."
                                  : "+ Model"}
                              </button>
                            </div>

                            {/* Models List */}
                            {make.models.length === 0 ? (
                              <p className="text-gray-600 text-sm">
                                No models yet
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {make.models.map((model) => (
                                  <div
                                    key={model.id}
                                    className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5"
                                  >
                                    <span className="text-gray-300 text-xs">
                                      {model.name}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleDeleteModel(
                                          model.id,
                                          make.id,
                                          year.id
                                        )
                                      }
                                      disabled={
                                        loading ===
                                        `delete-model-${model.id}`
                                      }
                                      className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-1 disabled:opacity-50"
                                    >
                                      {loading === `delete-model-${model.id}`
                                        ? "..."
                                        : "✕"}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {years.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No years yet. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  )
}