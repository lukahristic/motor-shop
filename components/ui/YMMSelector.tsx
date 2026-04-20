// components/ui/YMMSelector.tsx
// "use client" is REQUIRED here because we use useState
// This component runs in the browser, not on the server

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ymmData } from "@/lib/mock-data"

export default function YMMSelector() {
  const router = useRouter()

  // Three pieces of state — one per dropdown
  // Each one starts empty (nothing selected)
  const [selectedYear, setSelectedYear]   = useState<string>("")
  const [selectedMake, setSelectedMake]   = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")

  // --- Derived data (computed from state, not stored separately) ---

  // Available makes = keys of the selected year's data
  // If no year selected, empty array
  const availableMakes: string[] = selectedYear
    ? Object.keys(ymmData[selectedYear])
    : []

  // Available models = array under selected year + make
  const availableModels: string[] = selectedYear && selectedMake
    ? ymmData[selectedYear][selectedMake]
    : []

  // --- Event Handlers ---

  function handleYearChange(year: string) {
    setSelectedYear(year)
    // Reset downstream selections when year changes
    setSelectedMake("")
    setSelectedModel("")
  }

  function handleMakeChange(make: string) {
    setSelectedMake(make)
    // Reset model when make changes
    setSelectedModel("")
  }

  function handleSearch() {
    if (!selectedYear || !selectedMake || !selectedModel) return

    // Navigate to products page with YMM as query params
    // e.g. /products?year=2022&make=Toyota&model=Camry
    router.push(
      `/products?year=${selectedYear}&make=${selectedMake}&model=${selectedModel}`
    )
  }

  // Is the search button ready to activate?
  const isReady = selectedYear && selectedMake && selectedModel

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-3xl mx-auto">

      <h2 className="text-white font-bold text-lg mb-1">
        Find Parts for Your Vehicle
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Select your vehicle to see compatible parts
      </p>

      {/* Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

        {/* Year Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">Select year</option>
            {Object.keys(ymmData)
              .sort((a, b) => Number(b) - Number(a)) // newest first
              .map((year) => (
                <option key={year} value={year}>{year}</option>
              ))
            }
          </select>
        </div>

        {/* Make Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            Make
          </label>
          <select
            value={selectedMake}
            onChange={(e) => handleMakeChange(e.target.value)}
            disabled={!selectedYear} // locked until year is chosen
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Select make</option>
            {availableMakes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake} // locked until make is chosen
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Select model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Search Button */}
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