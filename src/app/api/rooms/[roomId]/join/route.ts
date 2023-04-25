import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'
import { serverPusher } from '@/lib/pusher/server'

import { routeContextSchema, type RouteContext } from '../schema'

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

  try {
    const [newRoom] = await Promise.all([
      db.room.update({
        where: { id: roomId },
        data: { playerTwoId: user.id },
      }),

      serverPusher.trigger(CHANNELS.roomId(roomId), EVENTS.secondPlayerJoined, {
        playerTwo: user,
      }),
    ])

    return NextResponse.json(newRoom, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }

    return NextResponse.json(null, { status: 500 })
  }
}
