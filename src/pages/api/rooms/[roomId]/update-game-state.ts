import { type PlayerMark } from '@prisma/client'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { z } from 'zod'

import { withMethods } from '@/lib/api-middleware/with-methods'
import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'
import { serverPusher } from '@/lib/pusher/server'
import { calculateWinner } from '@/utils/calculate-winner'

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res })

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === 'PATCH') {
    const roomId = req.query.roomId as string

    const room = await db.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    if (room.ownerId !== user.id && room.playerTwoId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this room' })
    }

    const { board, nextTurn } = updateRoomSchema.parse(req.body)

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

      return res.status(200).json(newRoomGameState)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues })
      }

      return res.status(500).json({ error: 'Error updating room' })
    }
  }
}

export default withMethods(['PATCH'], handler)
