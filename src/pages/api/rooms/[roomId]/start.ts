import { type NextApiRequest, type NextApiResponse } from 'next'

import { withMethods } from '@/lib/api-middleware/with-methods'
import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'
import { serverPusher } from '@/lib/pusher/server'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res })

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === 'POST') {
    const roomId = req.query.roomId as string

    const room = await db.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    if (user.id !== room.ownerId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this room' })
    }

    if (!room.playerTwoId) {
      return res.status(403).json({ error: 'Room is not full' })
    }

    try {
      const newRoom = await db.room.update({
        where: { id: roomId },
        data: {
          status: 'IN_PROGRESS',
        },
      })

      serverPusher.trigger(CHANNELS.roomId(roomId), EVENTS.roomStarted, newRoom)

      return res.status(200).json(newRoom)
    } catch (error) {
      return res.status(500).json({ error: 'Error updating room' })
    }
  }
}

export default withMethods(['POST'], handler)
