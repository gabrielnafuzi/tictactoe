import { type User } from '@prisma/client'
import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { ScrollArea } from '@/components/scroll-area'
import { db } from '@/lib/db'
import { formatDate } from '@/utils/format-date'

const getRoomsForUser = (userId: User['id']) => {
  return db.room.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

type RoomListProps = {
  userId: User['id']
}

export const RoomList = async ({ userId }: RoomListProps) => {
  const rooms = await getRoomsForUser(userId)

  return (
    <ScrollArea className="mt-10 h-96 w-80 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Your rooms</h4>

        {rooms.map((room) => (
          <Link
            className={buttonVariants({
              variant: 'outline',
              className: 'my-2 w-full text-sm',
            })}
            href={`/room/${room.id}`}
            key={room.id}
          >
            {formatDate(room.createdAt, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}
