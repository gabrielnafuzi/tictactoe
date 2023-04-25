import { z } from 'zod'

export const routeContextSchema = z.object({
  params: z.object({
    roomId: z.string(),
  }),
})

export type RouteContext = z.infer<typeof routeContextSchema>
