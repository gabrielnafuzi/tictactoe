'use client'

import { useEffect } from 'react'

import { toast } from '@/components/toast/use-toast'

import { errors, type ErrorKey } from '../errors'

type LoginErrorMessageProps = {
  error?: ErrorKey
}

export const LoginErrorMessage = ({ error }: LoginErrorMessageProps) => {
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errors[error] || errors.default,
        })
      }, 0)
    }
  }, [error])

  return null
}
