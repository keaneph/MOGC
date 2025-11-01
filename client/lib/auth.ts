import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

/**
 * Gets the user's role from their profile
 * @returns The user's role ("student" | "counselor" | null)
 */
export async function getUserRole(): Promise<"student" | "counselor" | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.role) {
    return null
  }

  const role = profile.role.toLowerCase()
  if (role === "student" || role === "counselor") {
    return role as "student" | "counselor"
  }

  return null
}

/**
 * Verifies that the user has the required role, redirects if not
 * @param requiredRole The role required to access the route
 * @param redirectPath Optional path to redirect to if role doesn't match (defaults to appropriate role's getting-started page)
 */
export async function requireRole(
  requiredRole: "student" | "counselor",
  redirectPath?: string
) {
  const userRole = await getUserRole()

  if (!userRole) {
    redirect("/auth/login")
  }

  if (userRole !== requiredRole) {
    // Redirect to the user's appropriate getting-started page
    const targetPath = redirectPath || `/${userRole}/getting-started`
    redirect(targetPath)
  }

  return userRole
}
