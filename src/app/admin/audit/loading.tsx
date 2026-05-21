export default function Loading() {
  return (
    <div>
      <div className="h-8 w-40 bg-secondary/50 rounded-lg animate-pulse mb-8" />
      <div className="space-y-2 mb-4">
        <div className="h-8 w-96 bg-secondary/30 rounded-lg animate-pulse" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="space-y-0 divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="h-5 w-16 bg-secondary/50 rounded animate-pulse" />
              <div className="h-5 w-20 bg-secondary/50 rounded animate-pulse" />
              <div className="h-5 w-32 bg-secondary/50 rounded animate-pulse hidden sm:block" />
              <div className="h-5 w-24 bg-secondary/50 rounded animate-pulse" />
              <div className="h-5 w-36 bg-secondary/50 rounded animate-pulse hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
