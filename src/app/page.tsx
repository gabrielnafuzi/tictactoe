import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

import { CreateRoom } from './room/components/create-room'

export default async function IndexPage() {
  const user = await getCurrentUser()

  const rooms = await db.room.findMany({
    where: {
      ownerId: user!.id,
    },
  })

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-4xl font-bold">Tic tac toe</h1>
      <p className="mb-4 text-xl">
        {user ? (
          <>
            Welcome back, <strong>{user.name}</strong>!
          </>
        ) : (
          <>You are not signed in.</>
        )}
      </p>

      <CreateRoom />

      {!user && (
        <Link
          href="/auth/login"
          className={buttonVariants({ variant: 'link' })}
        >
          Sign in
        </Link>
      )}

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
    </main>
  )
}
