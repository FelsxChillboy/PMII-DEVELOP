"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    news: Array<{ id: string; title: string; slug: string; type: string }>
    events: Array<{ id: string; title: string; slug: string; type: string }>
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery("")
      setResults(null)
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (q.length < 2) {
      setResults(null)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        if (data.success) setResults(data.data)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  function goTo(type: string, slug: string) {
    setOpen(false)
    if (type === "news") router.push(`/berita/${slug}`)
    else router.push("/kegiatan")
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Cari"
      >
        <Search className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari berita atau kegiatan..."
                className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {results && (
              <div className="max-h-80 overflow-y-auto p-2">
                {results.news.length === 0 && results.events.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground text-center">
                    Tidak ada hasil untuk &quot;{query}&quot;
                  </p>
                )}
                {results.news.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Berita</p>
                    {results.news.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => goTo("news", item.slug)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
                {results.events.length > 0 && (
                  <div>
                    <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Kegiatan</p>
                    {results.events.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => goTo("event", item.slug)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!results && query.length > 0 && !loading && (
              <p className="p-4 text-sm text-muted-foreground text-center">
                Minimal 2 karakter untuk mencari
              </p>
            )}

            {!query && (
              <div className="p-4 text-xs text-muted-foreground text-center">
                Cari berita atau kegiatan...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
