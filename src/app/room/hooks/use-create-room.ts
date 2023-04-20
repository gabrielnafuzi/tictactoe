import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { httpClient } from '@/lib/http-client'

const roomSchema = z.object({
  id: z.string(),
})

export const createRoom = async () => {
  const data = await httpClient.post('/api/rooms')

  return roomSchema.parse(data)
}

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: createRoom,
  })
}
