import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { requireAdmin } from "@/lib/server/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Users, User as UserIcon, Trash2 } from "lucide-react"

const PER_PAGE = 20

interface Props {
  searchParams?: Promise<{ page?: string }>
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  MEMBER: "Member",
  USER: "User",
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500",
  MEMBER: "bg-blue-500/10 text-blue-500",
  USER: "bg-gray-500/10 text-gray-400",
}

async function updateRole(formData: FormData) {
  "use server"
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) return

  const userId = formData.get("userId") as string
  const role = formData.get("role") as string
  if (!userId || !role) return

  try {
    await prisma.user.update({ where: { id: userId }, data: { role: role as "USER" | "MEMBER" | "ADMIN" } })
    revalidatePath("/admin/pengguna")
  } catch (err) {
    console.error("Update user role failed:", err)
  }
}

async function deleteUser(formData: FormData) {
  "use server"
  const { session, error: authErr } = await requireAdmin()
  if (authErr || !session) return

  const userId = formData.get("userId") as string
  if (!userId) return

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role === "ADMIN") return
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath("/admin/pengguna")
  } catch (err) {
    console.error("Delete user failed:", err)
  }
}

export default async function AdminPengguna({ searchParams }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  const sp = await searchParams
  const page = Math.max(1, Number(sp?.page) || 1)

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { donations: true, registrations: true, news: true } },
      },
    }),
    prisma.user.count(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
          Pengguna
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola pengguna dan hak akses
        </p>
      </div>

      <div className="mb-4 text-xs text-muted-foreground">
        {total} pengguna &middot; Halaman {page} dari {totalPages}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">Nama</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Aktivitas</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Bergabung</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada pengguna.</p>
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center">
                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      {user.name || "Tanpa Nama"}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">
                    {user.email || "-"}
                  </td>
                  <td className="p-4">
                    <form action={updateRole} className="flex items-center gap-1">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        onChange={(e) => e.target.form?.requestSubmit()}
                        className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer ${ROLE_COLORS[user.role] || ""} bg-transparent`}
                      >
                        <option value="USER">User</option>
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </form>
                  </td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">
                    <span className="text-xs">
                      {user._count.donations} donasi &middot; {user._count.registrations} daftar &middot; {user._count.news} berita
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {user.createdAt.toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== "ADMIN" && (
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={`/admin/pengguna?page=${page - 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/pengguna?page=${p}`}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={`/admin/pengguna?page=${page + 1}`}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm transition-colors ${page >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-secondary"}`}
            aria-disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}


