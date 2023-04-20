import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { getCurrentUser } from '@/lib/auth'

import { CreateRoom } from '../room/components/create-room'
import { RoomList } from '../room/components/room-list'

export default async function IndexPage() {
  const user = await getCurrentUser()

  return (
    <main className="flex w-full flex-col items-center justify-center px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">Tic Tac Toe</h1>
      <p className="mb-4 text-xl">
        {user ? (
          <>
            Hello, <strong>{user.name}</strong>!
          </>
        ) : (
          <>You are not logged in.</>
        )}
      </p>

      {!!user && <CreateRoom />}

      {!user && (
        <Link href="/auth/login" className={buttonVariants()}>
          Login
        </Link>
      )}

      {/* @ts-expect-error - Server component */}
      {user && <RoomList userId={user.id} />}
    </main>
  )
}
