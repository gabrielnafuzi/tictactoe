import { Board } from '@/components/board'
import { db } from '@/lib/db'

type RoomPageProps = {
  params: {
    roomId: string
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId as string

  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
  })

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <div className="mb-10">
        Room owner ID: <strong>{room?.ownerId}</strong>
      </div>

      <section className="max-w-lg">
        <Board />
      </section>
    </main>
  )
}
