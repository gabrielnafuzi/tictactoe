'use client'

import { type Room } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/button'
import { Icons } from '@/components/icons'

type StartRoomButtonProps = {
  roomId: Room['id']
}

type JoinRoomPayload = {
  roomId: Room['id']
}

const startRoom = async ({ roomId }: JoinRoomPayload) => {
  const res = await fetch(`/api/rooms/${roomId}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res.json()
}

const useStartRoomMutation = () => {
  return useMutation({
    mutationFn: startRoom,
  })
}

export const StartRoomButton = ({ roomId }: StartRoomButtonProps) => {
  const startRoomMutation = useStartRoomMutation()

  const handleStartRoom = () => {
    startRoomMutation.mutate({ roomId })
  }

  return (
    <Button onClick={handleStartRoom} disabled={startRoomMutation.isLoading}>
      {startRoomMutation.isLoading && (
        <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Start Game
    </Button>
  )
}
