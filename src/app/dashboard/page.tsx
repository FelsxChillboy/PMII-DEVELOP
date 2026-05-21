import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth, signOut } from "@/lib/auth"
import { User, LogOut, Newspaper, Calendar, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard Anggota",
  description: "Dashboard anggota PR PMII Rayon Teknik UNUSIA Jakarta Pusat.",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = session.user as { name?: string; email?: string; role?: string; image?: string; id?: string }

  const registrations = await prisma.registration.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { event: { select: { id: true, title: true, date: true, slug: true } } },
  })

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg tracking-tight">
              <span className="text-primary">PR</span> PMII
            </span>
          </Link>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
            {user.image ? (
              <Image src={user.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" unoptimized />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {user.name || "Anggota"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
              {user.role === "MEMBER" ? "Member" : user.role === "ADMIN" ? "Admin" : "Anggota"}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/berita" className="p-5 rounded-xl border border-border bg-card hover:hover:bg-secondary/50 transition-colors">
            <Newspaper className="h-5 w-5 text-blue-500 mb-3" />
            <p className="font-medium text-sm">Berita</p>
            <p className="text-xs text-muted-foreground mt-1">Baca berita terbaru</p>
          </Link>
          <Link href="/kegiatan" className="p-5 rounded-xl border border-border bg-card hover:hover:bg-secondary/50 transition-colors">
            <Calendar className="h-5 w-5 text-purple-500 mb-3" />
            <p className="font-medium text-sm">Kegiatan</p>
            <p className="text-xs text-muted-foreground mt-1">Lihat jadwal kegiatan</p>
          </Link>
          <Link href="/kontak" className="p-5 rounded-xl border border-border bg-card hover:hover:bg-secondary/50 transition-colors">
            <Mail className="h-5 w-5 text-amber-500 mb-3" />
            <p className="font-medium text-sm">Kontak</p>
            <p className="text-xs text-muted-foreground mt-1">Hubungi kami</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Kegiatan Saya
            </h2>
            {registrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum mendaftar kegiatan apapun.</p>
            ) : (
              <div className="space-y-3">
                {registrations.map((r) => (
                  <Link key={r.id} href={`/kegiatan`} className="block p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <p className="text-sm font-medium">{r.event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(r.event.date).toLocaleDateString("id-ID")}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold tracking-tight mb-2">
            Selamat Datang
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Selamat datang di dashboard anggota PR PMII Rayon Teknik UNUSIA Jakarta Pusat.
            Kelola keanggotaan Anda, ikuti kegiatan, dan dapatkan informasi terbaru
            seputar organisasi.
          </p>
        </div>
      </div>
    </div>
  )
}
