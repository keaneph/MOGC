import { NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { getUserRole } from "@/lib/auth"

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

      if (!user) {
        return NextResponse.redirect(`${origin}/auth/login`)
      }

      if (!user.email?.endsWith("@g.msuiit.edu.ph")) {
        await supabase.auth.signOut()
        return NextResponse.redirect(
          `${origin}/auth/error?error=invalid-domain`
        )
      }

      const role = await getUserRole()

      if (!role) {
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth/error?error=no-profile`)
      }

      return NextResponse.redirect(
        `${origin}/${role}/getting-started?toast=success`
      )
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
