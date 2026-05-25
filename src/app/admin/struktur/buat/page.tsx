import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createOrganizationMember } from "@/lib/admin-actions"
import { ArrowLeft } from "lucide-react"

export default async function BuatStrukturPage(props: { searchParams?: Promise<{ error?: string }> }) {
  const sp = await props.searchParams
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/struktur"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Tambah Anggota
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambah anggota struktur organisasi
          </p>
        </div>
      </div>

      {sp?.error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
          {sp.error}
        </div>
      )}

      <div className="max-w-2xl">
        <form action={createOrganizationMember} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-1.5">
              Jabatan
            </label>
            <input
              id="position"
              name="position"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Ketua, Sekretaris, dll."
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium mb-1.5">
              Foto
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 file:cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: JPG, PNG, WEBP. Maks 5MB.
            </p>
          </div>

          <div>
            <label htmlFor="instagramUrl" className="block text-sm font-medium mb-1.5">
              Instagram (URL)
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="https://www.instagram.com/username"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Link Instagram profil anggota (opsional)
            </p>
          </div>

          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium mb-1.5">
              Urutan
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Urutan tampil (angka lebih kecil tampil lebih dulu)
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan
            </button>
            <Link
              href="/admin/struktur"
              className="h-11 px-6 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
