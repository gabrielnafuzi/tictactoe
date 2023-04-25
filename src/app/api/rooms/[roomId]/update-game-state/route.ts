import { type PlayerMark } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'
import { serverPusher } from '@/lib/pusher/server'
import { calculateWinner } from '@/utils/calculate-winner'

import { routeContextSchema, type RouteContext } from '../schema'

const playerMark: Record<PlayerMark, PlayerMark> = {
  O: 'O',
  X: 'X',
}

const playerMarkSchema = z.union([
  z.literal(playerMark.O),
  z.literal(playerMark.X),
  z.literal(null),
])

const updateRoomSchema = z.object({
  board: z.array(playerMarkSchema).refine((board) => board.length === 9, {
    message: 'Board must be an array of 9 elements.',
  }),
  nextTurn: z.enum([playerMark.O, playerMark.X]),
})

export const PATCH = async (req: Request, context: RouteContext) => {
  const { params } = routeContextSchema.parse(context)
  const session = await getServerAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const { user } = session

  const { roomId } = params

  const room = await db.room.findUnique({
    where: { id: roomId },
  })

  if (!room) {
    return NextResponse.json({ message: 'Room not found' }, { status: 404 })
  }

  if (room.ownerId !== user.id && room.playerTwoId !== user.id) {
    return NextResponse.json(
      { message: 'Not authorized to update this room' },
      { status: 403 }
    )
  }

  const json = await req.json()
  const { board, nextTurn } = updateRoomSchema.parse(json)

  try {
    const { winner, line } = calculateWinner(board) ?? {}

    const newRoomGameState = await Promise.all([
      db.roomGameState.create({
        data: {
          board: JSON.stringify(board),
          nextTurn,
          winner,
          winnerCombination: JSON.stringify(line ?? [null, null, null]),
          roomId,
        },
      }),

      serverPusher.trigger(CHANNELS.roomId(roomId), EVENTS.roomUpdate, {
        board,
        nextTurn,
        winner,
        winnerCombination: line ?? null,
      }),
    ])

    if (winner || board.every((square) => square !== null)) {
      await db.room.update({
        where: { id: roomId },
        data: {
          status: 'FINISHED',
        },
      })
    }

    return NextResponse.json(newRoomGameState, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
