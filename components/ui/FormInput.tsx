// components/ui/FormInput.tsx
// Reusable input with label, error state, and optional right slot
// (the right slot is used for the password eye icon)

interface Props {
    label:        string
    type:         string
    name:         string
    value:        string
    onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    error?:       string        // if present → red border + message
    required?:    boolean
    minLength?:   number
    rightSlot?:   React.ReactNode  // for the eye icon
    autoComplete?: string
    onBlur?: () => void
  }
  
  export default function FormInput({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    error,
    required,
    minLength,
    rightSlot,
    autoComplete,
    onBlur
  }: Props) {
    return (
      <div>
        <label className="block text-gray-400 text-sm mb-1.5">
          {label}
        </label>
  
        {/* Wrapper for input + eye icon */}
        <div className="relative">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            minLength={minLength}
            autoComplete={autoComplete}
            onBlur={onBlur}
            className={`
              w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm
              focus:outline-none transition-colors
              ${rightSlot ? "pr-10" : ""}
              ${error
                ? "border border-red-500 focus:border-red-400"
                : "border border-gray-700 focus:border-orange-500"
              }
            `}
          />
  
          {/* Eye icon or other right-side element */}
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </div>
          )}
        </div>
  
        {/* Inline error message */}
        {error && (
          <p className="text-red-400 text-xs mt-1.5">{error}</p>
        )}
      </div>
    )
  }