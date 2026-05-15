import { cn } from "@/lib/utils"

interface SectionTagProps {
  children: React.ReactNode
  className?: string
}

export default function SectionTag({ children, className }: SectionTagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary font-medium",
        className
      )}
    >
      <span className="h-px w-6 bg-primary" />
      {children}
    </div>
  )
}
