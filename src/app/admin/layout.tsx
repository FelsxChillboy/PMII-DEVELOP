import { redirect } from "next/navigation"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Mail,
  LogOut,
  ChevronRight,
  Users,
  ImageIcon,
  ClipboardList,
  GitBranch,
} from "lucide-react"
async function logoutAction() {
  "use server"
  await signOut({ redirectTo: "/" })
}

const SIDEBAR = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "Kegiatan", href: "/admin/kegiatan", icon: Calendar },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Audit Log", href: "/admin/audit", icon: ClipboardList },
  { label: "Kontak", href: "/admin/kontak", icon: Mail },
  { label: "Struktur", href: "/admin/struktur", icon: GitBranch },
  { label: "Pengguna", href: "/admin/pengguna", icon: Users },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/dashboard")

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <aside className="w-64 shrink-0 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <Link href="/admin" className="font-heading font-bold text-lg tracking-tight">
            <span className="text-gradient">PR PMII</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Panel Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-l-2 hover:border-primary transition-all"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              <ChevronRight className="h-3 w-3 ml-auto opacity-30" />
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {session.user.name || session.user.email}
          </div>
          {!isAdmin && (
            <div className="px-3 text-xs text-yellow-500">
              Akses terbatas — hubungi admin
            </div>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
