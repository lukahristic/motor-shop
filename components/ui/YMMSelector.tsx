// components/ui/YMMSelector.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function YMMSelector() {
  const router = useRouter()

  // Selection state
  const [selectedYear, setSelectedYear]   = useState<string>("")
  const [selectedMake, setSelectedMake]   = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")

  // Data state — fetched from real API
  const [years, setYears]   = useState<string[]>([])
  const [makes, setMakes]   = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])

  // Loading states — one per dropdown
  const [loadingYears,  setLoadingYears]  = useState(true)
  const [loadingMakes,  setLoadingMakes]  = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)

  // ── Fetch years on mount ──────────────────────────────
  useEffect(() => {
    async function fetchYears() {
      try {
        const res  = await fetch("/api/ymm/years")
        const json = await res.json()
        setYears(json.data.map(String))
      } catch (err) {
        console.error("Failed to fetch years:", err)
      } finally {
        setLoadingYears(false)
      }
    }
    fetchYears()
  }, []) // empty array = runs once on mount

  // ── Fetch makes when year changes ─────────────────────
  useEffect(() => {
    if (!selectedYear) {
      setMakes([])
      return
    }

    async function fetchMakes() {
      setLoadingMakes(true)
      try {
        const res  = await fetch(`/api/ymm/makes?year=${selectedYear}`)
        const json = await res.json()
        setMakes(json.data)
      } catch (err) {
        console.error("Failed to fetch makes:", err)
      } finally {
        setLoadingMakes(false)
      }
    }
    fetchMakes()
  }, [selectedYear]) // runs every time selectedYear changes

  // ── Fetch models when make changes ────────────────────
  useEffect(() => {
    if (!selectedYear || !selectedMake) {
      setModels([])
      return
    }

    async function fetchModels() {
      setLoadingModels(true)
      try {
        const res  = await fetch(`/api/ymm/models?year=${selectedYear}&make=${selectedMake}`)
        const json = await res.json()
        setModels(json.data)
      } catch (err) {
        console.error("Failed to fetch models:", err)
      } finally {
        setLoadingModels(false)
      }
    }
    fetchModels()
  }, [selectedYear, selectedMake]) // runs when either changes

  // ── Handlers ──────────────────────────────────────────
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

  function handleSearch() {
    if (!selectedYear || !selectedMake || !selectedModel) return
    router.push(
      `/products?year=${selectedYear}&make=${selectedMake}&model=${selectedModel}`
    )
  }

  const isReady = selectedYear && selectedMake && selectedModel

  // ── Reusable dropdown renderer ─────────────────────────
  function Dropdown({
    label,
    value,
    options,
    disabled,
    loading,
    placeholder,
    onChange,
  }: {
    label: string
    value: string
    options: string[]
    disabled: boolean
    loading: boolean
    placeholder: string
    onChange: (val: string) => void
  }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">
            {loading ? "Loading..." : placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-white font-bold text-lg mb-1">
        Find Parts for Your Vehicle
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Select your vehicle to see compatible parts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Dropdown
          label="Year"
          value={selectedYear}
          options={years}
          disabled={false}
          loading={loadingYears}
          placeholder="Select year"
          onChange={handleYearChange}
        />
        <Dropdown
          label="Make"
          value={selectedMake}
          options={makes}
          disabled={!selectedYear}
          loading={loadingMakes}
          placeholder="Select make"
          onChange={handleMakeChange}
        />
        <Dropdown
          label="Model"
          value={selectedModel}
          options={models}
          disabled={!selectedMake}
          loading={loadingModels}
          placeholder="Select model"
          onChange={(val) => setSelectedModel(val)}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={!isReady}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          isReady
            ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
            : "bg-gray-700 opacity-50 cursor-not-allowed"
        }`}
      >
        {isReady
          ? `Find parts for ${selectedYear} ${selectedMake} ${selectedModel}`
          : "Select your vehicle above"
        }
      </button>
    </div>
  )
}