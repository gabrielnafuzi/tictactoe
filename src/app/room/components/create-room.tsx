'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/button'
import { Icons } from '@/components/icons'

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
      {createRoomMutation.isLoading && (
        <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
      )}
      Create Game
    </Button>
  )
}
