import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        if (!user.email?.endsWith("@g.msuiit.edu.ph")) {
          await supabase.auth.signOut()
          return NextResponse.redirect(
            `${origin}/auth/error?error=invalid-domain`
          )
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profile?.role === "student") {
          return NextResponse.redirect(`${origin}/student/getting-started`)
        } else if (profile?.role === "counselor") {
          return NextResponse.redirect(`${origin}/counselor/getting-started`)
        } else {
          return NextResponse.redirect(`${origin}/`)
        }
      }

      return NextResponse.redirect(`${origin}/auth/login`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
