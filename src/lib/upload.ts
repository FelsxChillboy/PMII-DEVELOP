import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
})

export async function uploadImage(file: File, folder = "pmii-news"): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const fs = require("fs")
    const path = require("path")
    const uploadDir = path.join(process.cwd(), "public", "uploads", "news")
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
    fs.writeFileSync(path.join(uploadDir, filename), buffer)
    return `/uploads/news/${filename}`
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const base64 = buffer.toString("base64")
  const dataUri = `data:${file.type};base64,${base64}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [{ width: 1200, height: 630, crop: "fill", quality: "auto" }],
  })

  return result.secure_url
}

export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || "",
    enabled: !!process.env.CLOUDINARY_CLOUD_NAME,
  }
}
