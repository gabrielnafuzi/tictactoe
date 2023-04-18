import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

const roomSchema = z.object({
  id: z.string(),
})

export const createRoom = async () => {
  const res = await fetch('/api/rooms', { method: 'POST' })
  const data = await res.json()

  return roomSchema.parse(data)
}

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: createRoom,
  })
}
