// components/admin/CompatibilityManager.tsx
"use client"

import { useState, useEffect } from "react"
import { VehicleCompatibility } from "@/types"

interface Props {
  productId: number
}

export default function CompatibilityManager({ productId }: Props) {

  // ── Existing compatibility list ───────────────────────
  const [vehicles, setVehicles] = useState<VehicleCompatibility[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // ── YMM selector state ────────────────────────────────
  const [years,   setYears]   = useState<string[]>([])
  const [makes,   setMakes]   = useState<string[]>([])
  const [models,  setModels]  = useState<Array<{ id: number; name: string }>>([])

  const [selectedYear,  setSelectedYear]  = useState("")
  const [selectedMake,  setSelectedMake]  = useState("")
  const [selectedModel, setSelectedModel] = useState("")

  const [loadingYears,  setLoadingYears]  = useState(true)
  const [loadingMakes,  setLoadingMakes]  = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const [adding,        setAdding]        = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  function showError(msg: string) {
    setError(msg)
    setTimeout(() => setError(null), 4000)
  }

  // ── Fetch existing compatibility on mount ─────────────
  useEffect(() => {
    async function fetchCompatibility() {
      try {
        const res  = await fetch(
          `/api/admin/products/${productId}/compatibility`
        )
        const json = await res.json()
        setVehicles(json.data)
      } catch {
        showError("Failed to load compatibility data")
      } finally {
        setLoadingList(false)
      }
    }
    fetchCompatibility()
  }, [productId])

  // ── Fetch years on mount ──────────────────────────────
  useEffect(() => {
    async function fetchYears() {
      try {
        const res  = await fetch("/api/ymm/years")
        const json = await res.json()
        setYears(json.data.map(String))
      } catch {
        showError("Failed to load years")
      } finally {
        setLoadingYears(false)
      }
    }
    fetchYears()
  }, [])

  // ── Fetch makes when year changes ─────────────────────
  useEffect(() => {
    if (!selectedYear) { setMakes([]); return }

    async function fetchMakes() {
      setLoadingMakes(true)
      try {
        const res  = await fetch(`/api/ymm/makes?year=${selectedYear}`)
        const json = await res.json()
        setMakes(json.data)
      } catch {
        showError("Failed to load makes")
      } finally {
        setLoadingMakes(false)
      }
    }
    fetchMakes()
  }, [selectedYear])

  // ── Fetch models when make changes ────────────────────
  // Returns full model objects with IDs (not just names)
  useEffect(() => {
    if (!selectedYear || !selectedMake) { setModels([]); return }

    async function fetchModels() {
      setLoadingModels(true)
      try {
        // We need model IDs — fetch from a new endpoint below
        const res  = await fetch(
          `/api/ymm/models-with-ids?year=${selectedYear}&make=${selectedMake}`
        )
        const json = await res.json()
        setModels(json.data)
      } catch {
        showError("Failed to load models")
      } finally {
        setLoadingModels(false)
      }
    }
    fetchModels()
  }, [selectedYear, selectedMake])

  function handleYearChange(year: string) {
    setSelectedYear(year)
    setSelectedMake("")
    setSelectedModel("")
    setMakes([])
    setModels([])
  }

  function handleMakeChange(make: string) {
    setSelectedMake(make)
    setSelectedModel("")
    setModels([])
  }

  // ── Add compatibility ─────────────────────────────────
  async function handleAdd() {
    if (!selectedModel) return
    setAdding(true)
    setError(null)

    try {
      const res  = await fetch(
        `/api/admin/products/${productId}/compatibility`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ modelId: Number(selectedModel) }),
        }
      )
      const json = await res.json()

      if (!res.ok) throw new Error(json.error)

      // Add to list immediately (optimistic update)
      setVehicles((prev) => [...prev, json.data])

      // Reset selectors
      setSelectedYear("")
      setSelectedMake("")
      setSelectedModel("")
      setMakes([])
      setModels([])
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to add compatibility"
      )
    } finally {
      setAdding(false)
    }
  }

  // ── Remove compatibility ──────────────────────────────
  async function handleRemove(compatibilityId: number) {
    try {
      const res = await fetch(
        `/api/admin/products/${productId}/compatibility/${compatibilityId}`,
        { method: "DELETE" }
      )
      const json = await res.json()

      if (!res.ok) throw new Error(json.error)

      // Remove from list immediately
      setVehicles((prev) =>
        prev.filter((v) => v.compatibilityId !== compatibilityId)
      )
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Failed to remove compatibility"
      )
    }
  }

  const isReady = selectedYear && selectedMake && selectedModel

  return (
    <div className="mt-8">

      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-white font-semibold text-lg">
          Vehicle Compatibility
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Add the vehicles this product is compatible with
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Add Vehicle Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <p className="text-gray-400 text-sm font-medium mb-4">
          Add a compatible vehicle
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

          {/* Year */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs uppercase tracking-wide">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={loadingYears}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 disabled:opacity-40"
            >
              <option value="">
                {loadingYears ? "Loading..." : "Select year"}
              </option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Make */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs uppercase tracking-wide">
              Make
            </label>
            <select
              value={selectedMake}
              onChange={(e) => handleMakeChange(e.target.value)}
              disabled={!selectedYear || loadingMakes}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 disabled:opacity-40"
            >
              <option value="">
                {loadingMakes ? "Loading..." : "Select make"}
              </option>
              {makes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-xs uppercase tracking-wide">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake || loadingModels}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 disabled:opacity-40"
            >
              <option value="">
                {loadingModels ? "Loading..." : "Select model"}
              </option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

        </div>

        <button
          onClick={handleAdd}
          disabled={!isReady || adding}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {adding ? "Adding..." : "+ Add Vehicle"}
        </button>
      </div>

      {/* Compatible Vehicles List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-800">
          <p className="text-gray-400 text-sm font-medium">
            Compatible vehicles
            <span className="ml-2 text-gray-600 font-normal">
              ({vehicles.length})
            </span>
          </p>
        </div>

        {loadingList ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-gray-600 text-sm">
              No vehicles added yet. Use the form above to add compatibility.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.compatibilityId}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  {/* Year badge */}
                  <span className="bg-gray-800 text-orange-400 text-xs font-medium px-2.5 py-1 rounded-full">
                    {vehicle.year}
                  </span>
                  <span className="text-white text-sm">
                    {vehicle.make} {vehicle.model}
                  </span>
                </div>
                <button
                  onClick={() => handleRemove(vehicle.compatibilityId)}
                  className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}