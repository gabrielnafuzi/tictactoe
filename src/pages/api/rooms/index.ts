import { type NextApiRequest, type NextApiResponse } from 'next'

import { withMethods } from '@/lib/api-middleware/with-methods'
import { getServerAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res })

  if (!session) {
    return res.status(403).end()
  }

  const { user } = session

  if (req.method === 'POST') {
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

      return res.status(200).json(newRoom)
    } catch (error) {
      return res.status(500).json({ error: 'Error creating a new room' })
    }
  }
}

export default withMethods(['POST'], handler)
