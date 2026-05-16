const CACHE_NAME = "pr-pmii-cache-v1"
const OFFLINE_URL = "/"

const STATIC_ASSETS = [
  "/",
  "/tentang",
  "/berita",
  "/kegiatan",
  "/donasi",
  "/transparansi",
  "/kontak",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.warn("SW install cache failed:", err))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      }).catch(() => cachedResponse || caches.match(OFFLINE_URL))

      return cachedResponse || fetchPromise
    }).catch(() => caches.match(OFFLINE_URL))
  )
})
