import { Skeleton } from "../../ui/skeleton"

export default function SummarySkeleton() {
  return (
    <div className="flex w-full justify-between gap-10">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-2">
          <Skeleton className="mb-5 h-30 w-[260px]" />
        </div>
      ))}
    </div>
  )
}
