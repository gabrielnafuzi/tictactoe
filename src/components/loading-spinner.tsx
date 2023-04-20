'use client'

import { cn } from '@/utils/cn'

import { Icons } from './icons'

type LoadingSpinnerProps = {
  className?: string
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return <Icons.Spinner className={cn('h-4 w-4 animate-spin', className)} />
}
