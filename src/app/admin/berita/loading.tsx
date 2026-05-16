import { Skeleton } from "@/components/Skeleton"

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded-lg bg-muted animate-pulse mt-1" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
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
