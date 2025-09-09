// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Initialize Supabase SSR client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set(name, value)
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          req.cookies.delete(name)
          res.cookies.delete(name)
        },
      },
    }
  )

  // Get active session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl


  // Protect dashboard + discovery routes
  const protectedPaths = ["/dashboard", "/dashboard/user", "/dashboard/user/discovery", "/dashboard/admin"]
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Enforce email confirmation for authenticated users
  if (isProtected && session) {
    // Get user info from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is not confirmed, redirect to /check-email
    if (user && !user.email_confirmed_at && !user.confirmed_at) {
      return NextResponse.redirect(new URL("/check-email", req.url));
    }

    // Example: check if profile exists (your `/api/me` endpoint)
    const profileRes = await fetch(`${req.nextUrl.origin}/api/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (!profileRes.ok) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }

    const profile = await profileRes.json()
    if (!profile?.id) {
      return NextResponse.redirect(new URL("/onboarding", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
