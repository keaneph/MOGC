import Link from "next/link"
import Image from "next/image"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const error = typeof params.error === "string" ? params.error : undefined

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/error.png"
          alt="Error illustration"
          width={300}
          height={300}
          className="drop-shadow-xxl -mt-40"
        />

        <h1 className="text-2xl font-semibold tracking-wide">
          Sorry, something went wrong.
        </h1>

        {error ? (
          <div className="flex flex-col items-center gap-20">
            <p className="text-muted-foreground text-sm tracking-wide">
              {error === "invalid-domain"
                ? "Please sign in with your school email (@g.msuiit.edu.ph)."
                : error === "no-profile"
                  ? "Your profile could not be found. Please contact support."
                  : `Code error: ${error}`}
            </p>

            {(error === "invalid-domain" || error === "no-profile") && (
              <Link
                href="/auth/login"
                className="text-link cursor-pointer text-xs tracking-wide hover:underline"
              >
                Back to login
              </Link>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm tracking-wide">
            An unspecified error occurred.
          </p>
        )}
      </div>
    </div>
  )
}
