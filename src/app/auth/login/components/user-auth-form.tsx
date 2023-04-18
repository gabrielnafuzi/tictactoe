'use client'

import { useState, type HTMLAttributes } from 'react'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/button'
import { Icons } from '@/components/icons'
import { cn } from '@/utils/cn'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isDiscordLoading, setIsDiscordLoading] = useState(false)
  const searchParams = useSearchParams()

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Button
        onClick={() => {
          setIsDiscordLoading(true)

          signIn('discord', {
            callbackUrl: searchParams?.get('from') || '/',
          })
        }}
        disabled={isDiscordLoading}
        variant="secondary"
      >
        {isDiscordLoading ? (
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.Discord className="mr-2 h-4 w-4" />
        )}{' '}
        Sign in with Discord
      </Button>
    </div>
  )
}
