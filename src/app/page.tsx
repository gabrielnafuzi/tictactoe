import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { getCurrentUser } from '@/lib/auth'

import { CreateRoom } from './room/components/create-room'
import { RoomList } from './room/components/room-list'

export default async function IndexPage() {
  const user = await getCurrentUser()

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

      {/* @ts-expect-error - Server component */}
      {user && <RoomList />}
    </main>
  )
}
