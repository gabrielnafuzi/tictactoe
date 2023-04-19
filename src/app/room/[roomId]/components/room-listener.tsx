'use client'

import { useEffect, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { clientPusher } from '@/lib/pusher/client'

type RoomListenerProps = {
  roomId: string
}

export const RoomListener = ({ roomId }: RoomListenerProps) => {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    const channel = clientPusher.subscribe(`room-${roomId}`)

    channel.bind('joined-room', () => {
      startTransition(() => {
        router.refresh()
      })
    })

    channel.bind('started-room', () => {
      startTransition(() => {
        router.refresh()
      })
    })

    return () => {
      channel.unsubscribe()
      channel.unbind_all()
    }
  }, [roomId, router])

  return null
}
