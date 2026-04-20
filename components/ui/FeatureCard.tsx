// components/ui/FeatureCard.tsx
// Moved out of page.tsx so it can be reused anywhere in the app

// We import the interface from our shared types file
// (We'll add FeatureCardProps to types/index.ts in a moment)

interface FeatureCardProps {
    title: string
    description: string
  }
  
  export default function FeatureCard({ title, description }: FeatureCardProps) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-orange-400 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    )
  }