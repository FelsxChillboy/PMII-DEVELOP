import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/server/auth"
import Link from "next/link"
import { deleteOrganizationMember } from "@/lib/admin-actions"
import { Plus, ExternalLink, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

const PER_PAGE = 20

async function getMembers(page: number) {
  try {
    const [members, total] = await Promise.all([
      prisma.organizationMember.findMany({
        orderBy: { sortOrder: "asc" },
        take: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
      }),
      prisma.organizationMember.count(),
    ])
    return { members, total }
  } catch {
    return null
  }
}

export default async function AdminStruktur(props: { searchParams?: Promise<{ page?: string }> }) {
  const sp = await props.searchParams
  const page = Math.max(1, Number(sp?.page) || 1)
  const data = await getMembers(page)
  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Struktur Organisasi
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola kepengurusan organisasi
          </p>
        </div>
        <Link
          href="/admin/struktur/buat"
          className="inline-flex h-9 px-4 items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Anggota
        </Link>
      </div>

      {!data && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500 mb-6">
          Database tidak terhubung.
        </div>
      )}

      {data && (
        <div className="mb-4 text-xs text-muted-foreground">
          {data.total} anggota &middot; Halaman {page} dari {totalPages}
        </div>
      )}

      <div className="rounded-xl border border-border overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/30 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Foto</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Nama</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Jabatan</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Urutan</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Instagram</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.members.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Belum ada anggota. Klik &quot;Tambah Anggota&quot; untuk memulai.
                  </td>
                </tr>
              )}
              {data?.members.map((item, i) => (
                <tr key={item.id} className="hover:bg-secondary/30 hover:scale-[1.002] transition-all duration-200 animate-scale-in" style={{ animationDelay: `${i * 0.03}s` }}>
                  <td className="p-4">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                        -
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4 text-muted-foreground">{item.position}</td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">{item.sortOrder}</td>
                  <td className="p-4 hidden md:table-cell">
                    {item.instagramUrl ? (
                      <a href={item.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                        <InstagramIcon className="h-3 w-3" />
                        Buka
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/struktur/${item.id}`} className="inline-flex items-center gap-1 text-primary hover:underline text-xs">
                        Edit <ExternalLink className="h-3 w-3" />
                      </Link>
                      <form action={deleteOrganizationMember}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-xs transition-colors">
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <Link
            href={`/admin/struktur?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all ${page <= 1 ? "pointer-events-none opacity-30 border-border/30" : "border-border hover:bg-secondary hover:border-primary/30"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/struktur?page=${p}`}
              className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full text-sm font-medium transition-all ${p === page ? "bg-linear-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-105" : "border border-border hover:bg-secondary hover:border-primary/30"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/struktur?page=${page + 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm transition-all ${page >= totalPages ? "pointer-events-none opacity-30 border-border/30" : "border-border hover:bg-secondary hover:border-primary/30"}`}
            aria-disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
