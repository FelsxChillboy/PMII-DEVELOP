export default function Loading() {
  return (
    <div>
      <div className="h-8 w-32 bg-secondary/50 rounded-lg animate-pulse mb-8" />
      <div className="h-20 bg-secondary/50 rounded-xl animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="aspect-square bg-secondary/30 animate-pulse" />
            <div className="p-2 space-y-1">
              <div className="h-3 bg-secondary/50 rounded animate-pulse" />
              <div className="h-2 bg-secondary/30 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
