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

  if (req.method === 'PATCH') {
    const roomId = req.query.roomId as string

    const room = await db.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return res.status(404).json({ error: 'Room not found' })
    }

    try {
      const newRoom = await db.room.update({
        where: { id: roomId },
        data: {
          playerTwoId: user.id,
        },
      })

      serverPusher.trigger(CHANNELS.roomId(roomId), EVENTS.secondPlayerJoined, {
        playerTwo: user,
      })

      return res.status(200).json(newRoom)
    } catch (error) {
      return res.status(500).json({ error: 'Error updating room' })
    }
  }
}

export default withMethods(['PATCH'], handler)
