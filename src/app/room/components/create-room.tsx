'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import { LoadingSpinner } from '@/components/loading-spinner'

import { useCreateRoom } from '../hooks/use-create-room'

export const CreateRoom = () => {
  const createRoomMutation = useCreateRoom()
  const router = useRouter()

  const handleCreateRoom = () => {
    createRoomMutation.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/room/${data.id}`)
      },
    })
  }

  return (
    <Button onClick={handleCreateRoom} disabled={createRoomMutation.isLoading}>
      {createRoomMutation.isLoading && <LoadingSpinner className="mr-2" />}
      Create room
    </Button>
  )
}
