// components/ui/ImageUpload.tsx
// Handles image upload directly to Cloudinary from the browser.
// Uses unsigned upload preset — no server involved in the upload.
// Shows preview, progress bar, and error states.

"use client"

import {
  useState,
  useRef,
  useCallback,
  DragEvent,
  ChangeEvent,
} from "react"
import Image from "next/image"

interface Props {
  currentImageUrl?: string | null  // existing image (for edit form)
  onUploadComplete: (url: string) => void  // called with the Cloudinary URL
  onClear?:         () => void             // called when image is removed
}

interface UploadState {
  status:   "idle" | "uploading" | "success" | "error"
  progress: number
  error:    string
}

export default function ImageUpload({
  currentImageUrl,
  onUploadComplete,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [preview,  setPreview]  = useState<string | null>(
    currentImageUrl ?? null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [upload,   setUpload]   = useState<UploadState>({
    status:   "idle",
    progress: 0,
    error:    "",
  })

  // ── Upload to Cloudinary ────────────────────────────
  async function uploadToCloudinary(file: File) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUpload({ status: "error", progress: 0, error: "File must be an image" })
      return
    }

    // Validate file size — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUpload({
        status:   "error",
        progress: 0,
        error:    "Image must be smaller than 5MB",
      })
      return
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUpload({ status: "uploading", progress: 0, error: "" })

    try {
      const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

      const formData = new FormData()
      formData.append("file",         file)
      formData.append("upload_preset", uploadPreset)
      formData.append("folder",        "motorshop/products")

      // Use XMLHttpRequest so we can track upload progress
      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100)
              setUpload((prev) => ({ ...prev, progress: pct }))
            }
          })

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText))
            } else {
              reject(new Error("Upload failed"))
            }
          })

          xhr.addEventListener("error", () =>
            reject(new Error("Network error during upload"))
          )

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
          )
          xhr.send(formData)
        }
      )

      // Update preview to Cloudinary URL and call parent
      setPreview(result.secure_url)
      setUpload({ status: "success", progress: 100, error: "" })
      onUploadComplete(result.secure_url)

      // Revoke the local object URL to free memory
      URL.revokeObjectURL(localUrl)
    } catch (err) {
      setPreview(currentImageUrl ?? null)
      setUpload({
        status:   "error",
        progress: 0,
        error:    err instanceof Error ? err.message : "Upload failed",
      })
    }
  }

  // ── File input change handler ───────────────────────
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadToCloudinary(file)
  }

  // ── Drag and drop handlers ──────────────────────────
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadToCloudinary(file)
  }, [])

  // ── Clear image ─────────────────────────────────────
  function handleClear() {
    setPreview(null)
    setUpload({ status: "idle", progress: 0, error: "" })
    if (inputRef.current) inputRef.current.value = ""
    onClear?.()
  }

  // ── Render ──────────────────────────────────────────
  return (
    <div>
      <label className="block text-gray-400 text-sm mb-2">
        Product Image
      </label>

      {preview ? (
        /* ── Preview state ──────────────────────────── */
        <div className="relative">
          <div className="relative w-full h-56 rounded-xl overflow-hidden
                          border border-gray-700 bg-gray-800">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-cover"
            />

            {/* Upload progress overlay */}
            {upload.status === "uploading" && (
              <div className="absolute inset-0 bg-black/60 flex flex-col
                              items-center justify-center gap-3">
                <div className="w-48 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full
                               transition-all duration-200"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                <p className="text-white text-sm font-medium">
                  Uploading {upload.progress}%
                </p>
              </div>
            )}

            {/* Success indicator */}
            {upload.status === "success" && (
              <div className="absolute top-3 right-3 bg-green-600
                              text-white text-xs font-bold px-2 py-1
                              rounded-lg flex items-center gap-1">
                <i className="ti ti-check" aria-hidden="true" />
                Uploaded
              </div>
            )}
          </div>

          {/* Action buttons below preview */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={upload.status === "uploading"}
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700
                         disabled:opacity-50 text-gray-300 hover:text-white
                         text-xs font-semibold rounded-lg transition-colors
                         flex items-center justify-center gap-1.5"
            >
              <i className="ti ti-refresh text-sm" aria-hidden="true" />
              Change image
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={upload.status === "uploading"}
              className="px-4 py-2 bg-gray-800 hover:bg-red-900/30
                         border border-transparent hover:border-red-700
                         disabled:opacity-50 text-gray-500 hover:text-red-400
                         text-xs font-semibold rounded-lg transition-colors"
            >
              <i className="ti ti-trash text-sm" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop zone ─────────────────────────────── */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            w-full h-44 rounded-xl border-2 border-dashed
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-200
            ${isDragging
              ? "border-orange-500 bg-orange-500/5 scale-[1.01]"
              : "border-gray-700 hover:border-orange-500/50 bg-gray-800/50"
            }
          `}
          role="button"
          tabIndex={0}
          aria-label="Upload product image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click()
            }
          }}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center
                           justify-center transition-colors ${
                             isDragging ? "bg-orange-500/20" : "bg-gray-800"
                           }`}>
            <i
              className={`ti ti-cloud-upload text-2xl transition-colors ${
                isDragging ? "text-orange-400" : "text-gray-500"
              }`}
              aria-hidden="true"
            />
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm font-medium">
              {isDragging ? "Drop your image here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-gray-600 text-xs mt-1">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {upload.status === "error" && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs
                        bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
          <i className="ti ti-alert-circle shrink-0" aria-hidden="true" />
          {upload.error}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}