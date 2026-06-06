import { Skeleton } from "@/components/Skeleton"

export default function KegiatanLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-border space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
