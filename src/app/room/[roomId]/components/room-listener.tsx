'use client'

import { useEffect } from 'react'

import { type User } from '@prisma/client'
import { useRouter } from 'next/navigation'

import { LoadingSpinner } from '@/components/loading-spinner'
import { useToast } from '@/components/toast/use-toast'
import { clientPusher } from '@/lib/pusher/client'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'

type RoomListenerProps = {
  roomId: string
}

export const RoomListener = ({ roomId }: RoomListenerProps) => {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const channel = clientPusher.subscribe(CHANNELS.roomId(roomId))

    channel.bind(EVENTS.pusherSubscriptionSucceeded, () => {
      channel.bind(EVENTS.secondPlayerJoined, (data: { playerTwo: User }) => {
        toast({
          title: (
            <>
              {data.playerTwo.name}{' '}
              <span className="text-slate-500 dark:text-slate-200">
                joined as player two.
              </span>
            </>
          ),
        })

        router.refresh()
      })

      channel.bind(EVENTS.roomStarted, () => {
        toast({
          title: 'The game has started',
          description: (
            <div className="flex items-center">
              <span>Loading game</span>
              <LoadingSpinner className="ml-2" />
            </div>
          ),
          duration: 2000,
        })

        router.refresh()
      })
    })

    return () => {
      channel.unsubscribe()
      channel.unbind_all()
    }
  }, [roomId, router, toast])

  return null
}
