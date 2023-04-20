'use client'

import { type Room, type User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { httpClient } from '@/lib/http-client'

type JoinRoomButtonProps = {
  roomId: Room['id']
  userId: User['id']
}

type JoinRoomPayload = {
  userId: User['id']
  roomId: Room['id']
}

const joinRoom = ({ roomId, userId }: JoinRoomPayload) => {
  return httpClient.patch(`/api/rooms/${roomId}/join`, { userId })
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
      {joinRoomMutation.isLoading && <LoadingSpinner className="mr-2" />}
      Join Room as Player 2
    </Button>
  )
}
