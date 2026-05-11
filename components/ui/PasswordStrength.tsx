// components/ui/PasswordStrength.tsx
// Shows a visual strength bar as the user types their password

interface Props {
    password: string
  }
  
  // Returns 0-4 based on how strong the password is
  function getStrength(password: string): number {
    if (password.length === 0) return 0
    let score = 0
    if (password.length >= 8)                    score++ // min length
    if (password.length >= 12)                   score++ // good length
    if (/[A-Z]/.test(password))                  score++ // has uppercase
    if (/[0-9]/.test(password))                  score++ // has number
    if (/[^A-Za-z0-9]/.test(password))           score++ // has symbol
    return Math.min(score, 4)
  }
  
  const levels = [
    { label: "Too short",  color: "bg-red-500",    width: "w-1/4"  },
    { label: "Weak",       color: "bg-orange-500",  width: "w-2/4"  },
    { label: "Fair",       color: "bg-yellow-500",  width: "w-3/4"  },
    { label: "Strong",     color: "bg-green-500",   width: "w-full" },
  ]
  
  export default function PasswordStrength({ password }: Props) {
    if (password.length === 0) return null
  
    const strength = getStrength(password)
    const level    = levels[Math.max(0, strength - 1)]
  
    return (
      <div className="mt-2">
        {/* Strength bar track */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${level.color} ${level.width}`}
          />
        </div>
  
        {/* Label */}
        <p className={`text-xs mt-1 ${
          strength <= 1 ? "text-red-400"    :
          strength === 2 ? "text-orange-400" :
          strength === 3 ? "text-yellow-400" :
          "text-green-400"
        }`}>
          {level.label}
        </p>
      </div>
    )
  }