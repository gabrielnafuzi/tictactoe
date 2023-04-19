'use client'

import { type Room, type User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/button'
import { Icons } from '@/components/icons'

type JoinRoomButtonProps = {
  roomId: Room['id']
  userId: User['id']
}

type JoinRoomPayload = {
  userId: User['id']
  roomId: Room['id']
}

const joinRoom = async ({ roomId, userId }: JoinRoomPayload) => {
  const res = await fetch(`/api/rooms/${roomId}/join`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  })

  return res.json()
}

const useJoinRoomMutation = () => {
  return useMutation({
    mutationFn: joinRoom,
  })
}

export const JoinRoomButton = ({ roomId, userId }: JoinRoomButtonProps) => {
  const joinRoomMutation = useJoinRoomMutation()

  const handleJoinRoom = () => {
    joinRoomMutation.mutate({ roomId, userId })
  }

  return (
    <Button onClick={handleJoinRoom} disabled={joinRoomMutation.isLoading}>
      {joinRoomMutation.isLoading && (
        <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Join Room as Player 2
    </Button>
  )
}
