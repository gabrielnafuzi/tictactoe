import ClientPusher from 'pusher-js'

import { env } from '@/env.mjs'

export const clientPusher = new ClientPusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
})
