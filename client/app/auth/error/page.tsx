import Link from "next/link"
import Image from "next/image"

export default function Page({ searchParams, }: { searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col items-center text-center gap-4">
        <Image
          src="/error.png"
          alt="Error illustration"
          width={500}
          height={500}
          className="drop-shadow-xxl -mt-40"
        />

        <h1 className="text-2xl font-semibold tracking-wide">
          Sorry, something went wrong.
        </h1>

        {error ? (
          <div className="flex flex-col items-center gap-20">
            <p className="text-sm text-muted-foreground tracking-wide">
              {error === "invalid-domain"
                ? "Please sign in with your school email (@g.msuiit.edu.ph)."
                : `Code error: ${error}`}
            </p>

            {error === "invalid-domain" && (
              <Link
                href="/auth/login"
                className="text-xs text-link hover:underline tracking-wide cursor-pointer"
              >
                Back to login
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground tracking-wide">
            An unspecified error occurred.
          </p>
        )}
      </div>
    </div>
  )
}
