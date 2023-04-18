'use client'

import { type ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/query-client'

type QueryClientProviderProps = {
  children: ReactNode
}

export const QueryClientProviderWrapper = ({
  children,
}: QueryClientProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
