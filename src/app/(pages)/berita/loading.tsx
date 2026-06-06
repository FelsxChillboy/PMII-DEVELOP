import { Skeleton } from "@/components/Skeleton"

export default function BeritaLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
