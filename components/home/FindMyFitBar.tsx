// components/home/FindMyFitBar.tsx
// Compact YMM bar that sits below the hero.
// Not the main focus anymore — just a utility bar for repeat customers.

"use client"

import { useState, useEffect } from "react"
import { useRouter }           from "next/navigation"

export default function FindMyFitBar() {
  const router = useRouter()

  const [years,   setYears]   = useState<string[]>([])
  const [makes,   setMakes]   = useState<string[]>([])
  const [models,  setModels]  = useState<string[]>([])

  const [selectedYear,  setSelectedYear]  = useState("")
  const [selectedMake,  setSelectedMake]  = useState("")
  const [selectedModel, setSelectedModel] = useState("")

  const [loadingYears,  setLoadingYears]  = useState(true)
  const [loadingMakes,  setLoadingMakes]  = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)

  useEffect(() => {
    fetch("/api/ymm/years")
      .then((r) => r.json())
      .then((j) => setYears(j.data.map(String)))
      .finally(() => setLoadingYears(false))
  }, [])

  useEffect(() => {
    if (!selectedYear) { setMakes([]); return }
    setLoadingMakes(true)
    fetch(`/api/ymm/makes?year=${selectedYear}`)
      .then((r) => r.json())
      .then((j) => setMakes(j.data))
      .finally(() => setLoadingMakes(false))
  }, [selectedYear])

  useEffect(() => {
    if (!selectedYear || !selectedMake) { setModels([]); return }
    setLoadingModels(true)
    fetch(`/api/ymm/models?year=${selectedYear}&make=${selectedMake}`)
      .then((r) => r.json())
      .then((j) => setModels(j.data))
      .finally(() => setLoadingModels(false))
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

  function handleSearch() {
    if (!selectedYear || !selectedMake || !selectedModel) return
    router.push(
      `/products?year=${selectedYear}&make=${selectedMake}&model=${selectedModel}`
    )
  }

  const isReady = selectedYear && selectedMake && selectedModel

  const selectClass = `
    bg-gray-800 border border-gray-700 text-white rounded-lg
    px-3 py-2 text-sm focus:outline-none focus:border-orange-500
    transition-colors disabled:opacity-40 disabled:cursor-not-allowed
    flex-1 min-w-[110px]
  `

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        {/* Label */}
        <p className="text-gray-500 text-xs font-semibold uppercase
                      tracking-widest mb-3 flex items-center gap-2">
          <i className="ti ti-search text-orange-500" aria-hidden="true" />
          Find parts for my vehicle
        </p>

        {/* Selects + button row */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            disabled={loadingYears}
            className={selectClass}
          >
            <option value="">
              {loadingYears ? "Loading..." : "Year"}
            </option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Make */}
          <select
            value={selectedMake}
            onChange={(e) => handleMakeChange(e.target.value)}
            disabled={!selectedYear || loadingMakes}
            className={selectClass}
          >
            <option value="">
              {loadingMakes ? "Loading..." : "Make"}
            </option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Model */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake || loadingModels}
            className={selectClass}
          >
            <option value="">
              {loadingModels ? "Loading..." : "Model"}
            </option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Find button */}
          <button
            onClick={handleSearch}
            disabled={!isReady}
            className={`
              px-5 py-2 rounded-lg text-sm font-bold transition-all
              whitespace-nowrap
              ${isReady
                ? "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            {isReady ? `Find parts →` : "Find parts"}
          </button>
        </div>
      </div>
    </div>
  )
}