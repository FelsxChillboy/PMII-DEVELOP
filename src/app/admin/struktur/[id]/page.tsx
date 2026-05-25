import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { updateOrganizationMember } from "@/lib/admin-actions"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditStrukturPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  const isAdmin = (session.user as { role?: string }).role === "ADMIN"
  if (!isAdmin) redirect("/admin")

  const { id } = await params
  const member = await prisma.organizationMember.findUnique({ where: { id } })
  if (!member) notFound()

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
            Edit Anggota
          </h1>
          <p className="text-sm text-muted-foreground">{member.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form action={updateOrganizationMember} className="space-y-6">
          <input type="hidden" name="id" value={member.id} />

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={member.name}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
              defaultValue={member.position}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Foto Saat Ini
            </label>
            {member.photoUrl ? (
              <div className="mb-3">
                <img src={member.photoUrl} alt="" className="h-24 w-24 rounded-lg object-cover border border-border" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs mb-3">
                Tidak ada foto
              </div>
            )}
            <label htmlFor="photo" className="block text-sm font-medium mb-1.5">
              Ganti Foto
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 file:cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Kosongkan jika tidak ingin mengganti foto. Format: JPG, PNG, WEBP.
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
              defaultValue={member.instagramUrl || ""}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="https://www.instagram.com/username"
            />
          </div>

          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium mb-1.5">
              Urutan
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={member.sortOrder}
              className="w-full h-11 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Simpan Perubahan
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
