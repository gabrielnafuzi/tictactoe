import { Skeleton } from '@/components/skeleton'

const SquareSkeleton = () => {
  return (
    <Skeleton className="min-h-[100px] w-full max-w-[96px] rounded-xl p-6 sm:max-w-[140px] sm:p-8">
      <div className="h-[72px] w-[72px]" />
    </Skeleton>
  )
}

export default function Loading() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <div className="mb-10 flex items-center gap-2">
        Room owner ID: <Skeleton className="h-4 w-56 rounded p-2" />
      </div>

      <section className="max-w-lg">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-10 w-28 rounded-lg p-2" />

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_value, index) => (
              <SquareSkeleton key={`square-skeleton-${index}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
