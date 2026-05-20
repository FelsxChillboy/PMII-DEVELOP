import { auth } from "@/lib/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")
  const isLogin = pathname === "/login"
  const isDashboard = pathname === "/dashboard"
  const isAuth = !!req.auth
  const role = (req.auth?.user as { role?: string })?.role

  if (isAdminRoute) {
    if (!isAuth) {
      const url = new URL("/login", req.nextUrl)
      url.searchParams.set("callbackUrl", pathname)
      return Response.redirect(url)
    }
    if (role !== "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.nextUrl))
    }
    return
  }

  if (isDashboard && !isAuth) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }

  if (isLogin && isAuth) {
    if (role === "ADMIN") {
      return Response.redirect(new URL("/admin", req.nextUrl))
    }
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }
})

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login", "/dashboard"],
}
