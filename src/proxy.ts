import { auth } from "@/lib/auth"

export default auth((req) => {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isLogin = req.nextUrl.pathname === "/login"

  if (isAdmin && !req.auth) {
    const url = new URL("/login", req.nextUrl)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return Response.redirect(url)
  }

  if (isLogin && req.auth) {
    return Response.redirect(new URL("/admin", req.nextUrl))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
