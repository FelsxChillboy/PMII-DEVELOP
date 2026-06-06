import { Skeleton } from "@/components/Skeleton"

export default function BeritaDetailLoading() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-3/4 mb-8" />
      <Skeleton className="h-64 w-full mb-8 rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </article>
  )
}
