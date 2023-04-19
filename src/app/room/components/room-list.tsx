import { type User } from '@prisma/client'
import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { db } from '@/lib/db'

const getRoomsForUser = (userId: User['id']) => {
  return db.room.findMany({
    where: {
      ownerId: userId,
    },
  })
}

type RoomListProps = {
  userId: User['id']
}

export async function RoomList({ userId }: RoomListProps) {
  const rooms = await getRoomsForUser(userId)

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
