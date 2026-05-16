import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function BuatKegiatanPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  async function create(formData: FormData) {
    "use server"
    const session = await auth()
    if (!session?.user) return

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const date = formData.get("date") as string
    const capacity = parseInt(formData.get("capacity") as string) || 0

    if (!title || !slug || !description || !date || !location) return

    await prisma.event.create({
      data: { title, slug, description, location, date: new Date(date), capacity },
    })

    revalidatePath("/admin/kegiatan")
    redirect("/admin/kegiatan")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/kegiatan"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mb-1">
            Buat Kegiatan
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambah kegiatan atau acara baru
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form action={create} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Nama Kegiatan
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Nama kegiatan"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="nama-kegiatan-dalam-url"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
              placeholder="Deskripsi kegiatan"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1.5">
                Tanggal & Waktu
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium mb-1.5">
                Kapasitas Peserta
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                required
                defaultValue={100}
                className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1.5">
              Lokasi
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Lokasi kegiatan"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan
            </button>
            <Link
              href="/admin/kegiatan"
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
