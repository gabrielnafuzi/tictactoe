import { type Room } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'

import { boardValues } from '@/constants'
import { authOptions, getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { type SquareValue } from '@/types'

import { Game } from './components/game'
import { JoinRoomButton } from './components/join-room-button'
import { PlayerInfo } from './components/player-info'
import { RoomListener } from './components/room-listener'
import { StartRoomButton } from './components/start-game-button'

type RoomPageProps = {
  params: {
    roomId: string
  }
}

const getRoom = async (roomId: Room['id']) => {
  const maybeBoom = await db.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      gameState: true,
      owner: true,
      playerTwo: true,
    },
  })

  if (!maybeBoom) {
    return null
  }

  return maybeBoom
}

export default async function RoomPage({ params }: RoomPageProps) {
  const roomId = params.roomId as string
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || '/auth/login')
  }

  const room = await getRoom(roomId)

  if (!room) {
    notFound()
  }

  const isOwner = room.ownerId === user.id
  const hasPlayerTwo = !!room.playerTwoId
  const lastGameState = room.gameState.at(-1)
  const winner = lastGameState?.winner

  const winnerName =
    winner === boardValues.X ? room.owner.name : room.playerTwo?.name

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <div className="mb-10">
        Room ID: <strong>{room?.id}</strong>
      </div>

      <div className="mb-10 flex flex-col items-center gap-10">
        <div className="grid max-w-sm grid-cols-3 items-center gap-6">
          <PlayerInfo user={room.owner} isRoomOwner />

          <p className="text-center">VS</p>

          {hasPlayerTwo ? (
            <PlayerInfo user={room.playerTwo!} isRoomOwner={false} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Waiting for player 2
              </p>
            </div>
          )}
        </div>

        {!isOwner && !hasPlayerTwo && (
          <JoinRoomButton roomId={room.id} userId={user.id} />
        )}

        {room.status === 'LOBBY' && hasPlayerTwo && isOwner && (
          <StartRoomButton roomId={room.id} />
        )}

        {room.status === 'LOBBY' && hasPlayerTwo && !isOwner && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Waiting for the room owner to start the game
          </p>
        )}
      </div>

      {room.status === 'IN_PROGRESS' && (
        <Game
          gameState={{
            ...lastGameState!,
            createdAt: lastGameState?.createdAt.toISOString() ?? '',
            board: JSON.parse(
              (lastGameState?.board as string) ?? '[]'
            ) as Array<SquareValue>,
          }}
          currentUserBoardValue={
            room.ownerId === user.id ? boardValues.X : boardValues.O
          }
          isWatching={room.ownerId !== user.id && room.playerTwoId !== user.id}
        />
      )}

      {room.status === 'FINISHED' && (
        <div className="text-center">
          <p className="mb-4 text-2xl">
            {!winner && 'It was a draw! 🤝'}

            {winner && (
              <>
                <strong>{winnerName}</strong>{' '}
                <span className="text-slate-600 dark:text-slate-400">
                  won the game!{' '}
                  <span role="img" aria-label="Tada!">
                    🎉
                  </span>
                </span>
              </>
            )}
          </p>
        </div>
      )}

      <RoomListener roomId={room.id} />
    </main>
  )
}
