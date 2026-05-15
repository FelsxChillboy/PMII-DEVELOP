import { Skeleton } from "@/components/Skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-border">
            <Skeleton className="h-5 w-5 mb-3" />
            <Skeleton className="h-7 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
