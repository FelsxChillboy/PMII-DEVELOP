import { z } from "zod"

export const NewsSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(200),
  slug: z.string().min(1, "Slug wajib diisi").max(200).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  content: z.string().min(1, "Konten wajib diisi"),
  imageUrl: z.string().max(500).optional(),
  published: z.boolean().default(false),
})

export const EventSchema = z.object({
  title: z.string().min(1, "Nama kegiatan wajib diisi").max(200),
  slug: z.string().min(1, "Slug wajib diisi").max(200).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi").max(200),
  date: z.string().min(1, "Tanggal wajib diisi"),
  capacity: z.number().int().min(1, "Kapasitas minimal 1"),
  type: z.string().max(100).optional(),
  time: z.string().max(50).optional(),
  image: z.string().max(500).optional(),
  dateEnd: z.string().optional(),
})

export const UpdateRegistrationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
})

export const UpdateUserRoleSchema = z.object({
  role: z.enum(["USER", "MEMBER", "ADMIN"]),
})

export const OrganizationMemberSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200),
  position: z.string().min(1, "Jabatan wajib diisi").max(200),
  photoUrl: z.string().max(500).optional(),
  instagramUrl: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
})
