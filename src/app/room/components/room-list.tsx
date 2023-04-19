import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function RoomList() {
  const user = await getCurrentUser()

  const rooms = await db.room.findMany({
    where: {
      ownerId: user!.id,
    },
  })

  return (
    <ul className="mt-10 space-y-4">
      {rooms.map((room) => (
        <li key={room.id}>
          <Link
            className={buttonVariants({
              variant: 'outline',
              className: 'w-full',
            })}
            href={`/room/${room.id}`}
          >
            {room.id}
          </Link>
        </li>
      ))}
    </ul>
  )
}
