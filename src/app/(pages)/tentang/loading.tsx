import { Skeleton } from "@/components/Skeleton"

export default function TentangLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div>
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-3">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-5 w-32 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
