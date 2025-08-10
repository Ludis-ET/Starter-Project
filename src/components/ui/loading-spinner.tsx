import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8"
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600",
        sizeClasses[size],
        className
      )}
    />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner className="mr-3" />
      <span className="text-gray-600">{text}</span>
    </div>
  )
}
