import { Skeleton } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-7 w-20 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-44 rounded-lg bg-muted animate-pulse mt-1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-border bg-card space-y-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={i} className="p-4"><Skeleton className="h-4 w-16" /></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="p-4"><Skeleton className="h-4 w-full" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
