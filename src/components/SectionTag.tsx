import { cn } from "@/lib/utils"

interface SectionTagProps {
  children: React.ReactNode
  className?: string
}

export default function SectionTag({ children, className }: SectionTagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-primary font-medium",
        className
      )}
    >
      <span className="h-px w-8 bg-linear-to-r from-primary to-accent animate-gradient" />
      <span className="relative">
        {children}
        <span className="absolute -right-1.5 -top-1 h-1.5 w-1.5 rounded-full bg-accent/60" />
      </span>
    </div>
  )
}
