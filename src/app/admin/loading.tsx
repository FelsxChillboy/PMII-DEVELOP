import { Skeleton } from "@/components/Skeleton"

export default function AdminLoading() {
  return (
    <div>
      <div className="h-7 w-36 rounded-lg bg-muted animate-pulse mb-1" />
      <div className="h-4 w-56 rounded-lg bg-muted animate-pulse mb-8" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
