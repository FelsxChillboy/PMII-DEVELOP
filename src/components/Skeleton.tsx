import { cn } from "@/lib/utils"

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-border space-y-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 w-full pt-32 pb-20 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="h-5 w-2/5" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </section>
  )
}
