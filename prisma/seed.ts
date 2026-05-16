import { PrismaClient } from "@prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import bcrypt from "bcryptjs"
import { config } from "dotenv"
config({ path: ".env.local" })

const url = process.env.DATABASE_URL || ""
const adapter = new PrismaMariaDb(url)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  const hashedPassword = await bcrypt.hash("admin123", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@pmii-unusia.ac.id" },
    update: {},
    create: {
      name: "Admin PMII",
      email: "admin@pmii-unusia.ac.id",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log(`Admin user: ${admin.email} (password: admin123)`)

  const member = await prisma.user.upsert({
    where: { email: "member@pmii-unusia.ac.id" },
    update: {},
    create: {
      name: "Member Rayon",
      email: "member@pmii-unusia.ac.id",
      password: hashedPassword,
      role: "MEMBER",
    },
  })
  console.log(`Member user: ${member.email} (password: admin123)`)

  const users = [
    { name: "Ahmad Fauzi", email: "ahmad@example.com", role: "USER" as const },
    { name: "Siti Nurhaliza", email: "siti@example.com", role: "MEMBER" as const },
    { name: "Budi Santoso", email: "budi@example.com", role: "USER" as const },
    { name: "Dewi Lestari", email: "dewi@example.com", role: "MEMBER" as const },
  ]
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password: hashedPassword },
    })
  }
  console.log(`${users.length} additional users created`)

  const newsData = [
    {
      title: "Rapat Kerja PR PMII Rayon Teknik 2025/2026",
      slug: "rapat-kerja-pr-pmii-rayon-teknik-2025-2026",
      content: `**Jakarta, 15 Maret 2025** — PR PMII Rayon Teknik UNUSIA Jakarta Pusat menggelar Rapat Kerja (Raker) untuk periode 2025/2026 di Aula Fakultas Teknik. Kegiatan ini dihadiri oleh seluruh kader aktif dan pengurus rayon.\n\nRaker membahas program kerja satu tahun ke depan, termasuk agenda kaderisasi, diskusi ilmiah, dan pengembangan organisasi berbasis digital. Ketua PR PMII Rayon Teknik menekankan pentingnya kolaborasi dan inovasi dalam setiap program.\n\n"Kita harus bergerak maju dengan memanfaatkan teknologi digital untuk menjangkau lebih banyak kader dan masyarakat," ujarnya.`,
      published: true,
      authorId: admin.id,
    },
    {
      title: "Diskusi Ilmiah: Peran Teknologi dalam Dakwah Kampus",
      slug: "diskusi-ilmiah-peran-teknologi-dalam-dakwah-kampus",
      content: `**Jakarta, 22 Maret 2025** — Divisi Keilmuan PR PMII Rayon Teknik UNUSIA sukses menyelenggarakan diskusi ilmiah bertema "Peran Teknologi dalam Dakwah Kampus di Era Digital".\n\nDiskusi menghadirkan dua narasumber: akademisi Fakultas Teknik dan aktivis dakwah kampus. Antusiasme peserta terlihat dari sesi tanya jawab yang berlangsung interaktif.\n\n"Mahasiswa teknik harus mampu menjadi jembatan antara ilmu pengetahuan dan nilai-nilai Islam," ungkap salah satu narasumber.`,
      published: true,
      authorId: admin.id,
    },
    {
      title: "Pengumuman: Pendaftaran Calon Kader Baru 2025",
      slug: "pendaftaran-calon-kader-baru-2025",
      content: `**Jakarta** — PR PMII Rayon Teknik UNUSIA Jakarta Pusat membuka pendaftaran Calon Kader Baru (CKB) untuk tahun 2025.\n\n**Persyaratan:**\n1. Mahasiswa aktif Fakultas Teknik UNUSIA\n2. Mengisi formulir pendaftaran online\n3. Bersedia mengikuti rangkaian MAPABA (Masa Penerimaan Anggota Baru)\n\nPendaftaran dibuka dari 1 April s.d. 30 April 2025. Informasi lebih lanjut hubungi Sekretariat PR PMII Rayon Teknik.`,
      published: true,
      authorId: admin.id,
    },
  ]

  for (const news of newsData) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: news,
    })
  }
  console.log(`${newsData.length} news articles created`)

  const events = [
    {
      title: "MAPABA PR PMII Rayon Teknik 2025",
      slug: "mapaba-pr-pmii-rayon-teknik-2025",
      description: "Masa Penerimaan Anggota Baru (MAPABA) PR PMII Rayon Teknik UNUSIA Jakarta Pusat. Kegiatan ini bertujuan untuk memperkenalkan nilai-nilai pergerakan dan Ahlussunnah wal Jama'ah kepada calon kader baru.",
      date: new Date("2025-05-10T08:00:00Z"),
      location: "Aula Fakultas Teknik UNUSIA",
      capacity: 100,
    },
    {
      title: "Seminar Nasional: Kepemimpinan Berbasis Digital",
      slug: "seminar-nasional-kepemimpinan-digital",
      description: "Seminar nasional yang menghadirkan pembicara dari berbagai latar belakang untuk membahas tantangan kepemimpinan di era digital.",
      date: new Date("2025-06-15T09:00:00Z"),
      location: "Auditorium UNUSIA",
      capacity: 200,
    },
    {
      title: "Bakti Sosial: Mengajar di Panti Asuhan",
      slug: "bakti-sosial-mengajar-panti-asuhan",
      description: "Kegiatan bakti sosial mengajar dan berbagi dengan anak-anak panti asuhan di sekitar Jakarta Pusat.",
      date: new Date("2025-07-20T07:00:00Z"),
      location: "Panti Asuhan Al-Ikhlas, Jakarta Pusat",
      capacity: 50,
    },
  ]

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    })
  }
  console.log(`${events.length} events created`)

  const donations = [
    { amount: 500000, status: "SUCCESS" as const, type: "ONE_TIME" as const, userId: member.id, message: "Semangat kaderisasi!" },
    { amount: 100000, status: "SUCCESS" as const, type: "ONE_TIME" as const, userId: null, message: "Dari donatur anonim" },
    { amount: 250000, status: "SUCCESS" as const, type: "ONE_TIME" as const, userId: member.id, message: null },
    { amount: 750000, status: "SUCCESS" as const, type: "ONE_TIME" as const, userId: null, message: "Lancar terus kegiatannya" },
    { amount: 150000, status: "PENDING" as const, type: "ONE_TIME" as const, userId: null, message: null },
  ]
  for (const d of donations) {
    await prisma.donation.create({ data: d })
  }
  console.log(`${donations.length} donations created`)

  const contacts = [
    { name: "Rudi Hermawan", email: "rudi@example.com", subject: "Kerjasama Kegiatan", message: "Saya tertarik untuk bekerjasama dalam kegiatan seminar yang akan datang. Mohon info lebih lanjut." },
    { name: "Ani Wijaya", email: "ani@example.com", subject: "Pertanyaan Pendaftaran", message: "Bagaimana cara mendaftar sebagai calon kader baru? Apakah ada persyaratan khusus?" },
    { name: "Fajar Nugroho", email: "fajar@example.com", subject: "Donasi dan Zakat", message: "Apakah PR PMII menerima donasi dalam bentuk zakat mal? Mohon informasinya." },
  ]
  for (const c of contacts) {
    await prisma.contact.create({ data: c })
  }
  console.log(`${contacts.length} contacts created`)

  const financialReports = [
    { title: "Donasi Kaderisasi", type: "INCOME" as const, amount: 500000, category: "Kaderisasi", date: new Date("2025-03-01") },
    { title: "Donasi Kegiatan", type: "INCOME" as const, amount: 750000, category: "Kegiatan", date: new Date("2025-03-05") },
    { title: "Sewa Aula Raker", type: "EXPENSE" as const, amount: 200000, category: "Operasional", date: new Date("2025-03-10") },
    { title: "Konsumsi Raker", type: "EXPENSE" as const, amount: 350000, category: "Kegiatan", date: new Date("2025-03-10") },
    { title: "Donasi Umum", type: "INCOME" as const, amount: 250000, category: "Sosial", date: new Date("2025-03-15") },
    { title: "ATK dan Cetak", type: "EXPENSE" as const, amount: 150000, category: "Operasional", date: new Date("2025-03-20") },
    { title: "Dana Sosial", type: "EXPENSE" as const, amount: 100000, category: "Sosial", date: new Date("2025-03-25") },
    { title: "Donasi Alumni", type: "INCOME" as const, amount: 1000000, category: "Kaderisasi", date: new Date("2025-04-01") },
  ]
  for (const r of financialReports) {
    await prisma.financialReport.create({ data: r })
  }
  console.log(`${financialReports.length} financial reports created`)

  console.log("Seeding selesai!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
