import { NextResponse } from 'next/server'

import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export const POST = async (_req: Request) => {
  const session = await getServerAuthSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
  }

  const { user } = session

  try {
    const newRoom = await db.room.create({
      data: {
        ownerId: user.id,
        gameState: {
          create: {
            board: '[null, null, null, null, null, null, null, null, null]',
            nextTurn: 'X',
          },
        },
      },
    })

    return NextResponse.json(newRoom, { status: 201 })
  } catch {
    return NextResponse.json(null, { status: 500 })
  }
}
