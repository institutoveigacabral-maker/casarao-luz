import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/")
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")

  if (isAuthRoute) return NextResponse.next()

  if (!isLoggedIn) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/products/:path*",
    "/seja-luz/:path*",
    "/settings/:path*",
    "/api/projects/:path*",
    "/api/spaces/:path*",
    "/api/boq/:path*",
    "/api/reports/:path*",
    "/api/compliance/:path*",
    "/api/seja-luz/:path*",
  ],
}
