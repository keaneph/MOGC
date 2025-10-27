import Image from "next/image"

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

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

        {params?.error ? (
          <p className="text-sm text-muted-foreground tracking-wide">
            Code error: {params.error}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground tracking-wide">
            An unspecified error occurred.
          </p>
        )}
      </div>
    </div>
  )
}
