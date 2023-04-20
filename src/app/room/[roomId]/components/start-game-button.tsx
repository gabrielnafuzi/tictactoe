'use client'

import { type Room } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

import { Button } from '@/components/button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { httpClient } from '@/lib/http-client'

type StartRoomButtonProps = {
  roomId: Room['id']
  disabled?: boolean
}

type JoinRoomPayload = {
  roomId: Room['id']
}

const startRoom = ({ roomId }: JoinRoomPayload) => {
  return httpClient.post(`/api/rooms/${roomId}/start`)
}

const useStartRoomMutation = () => {
  return useMutation({
    mutationFn: startRoom,
  })
}

export const StartRoomButton = ({
  roomId,
  disabled = false,
}: StartRoomButtonProps) => {
  const startRoomMutation = useStartRoomMutation()

  const handleStartRoom = () => {
    startRoomMutation.mutate({ roomId })
  }

  return (
    <Button
      onClick={handleStartRoom}
      disabled={startRoomMutation.isLoading || disabled}
    >
      {startRoomMutation.isLoading && <LoadingSpinner className="mr-2" />}
      Start Game
    </Button>
  )
}
