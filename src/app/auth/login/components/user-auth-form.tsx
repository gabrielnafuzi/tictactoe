'use client'

import { useState, type HTMLAttributes } from 'react'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/button'
import { Icons } from '@/components/icons'
import { LoadingSpinner } from '@/components/loading-spinner'
import { cn } from '@/utils/cn'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export const UserAuthForm = ({ className, ...props }: UserAuthFormProps) => {
  const [isDiscordLoading, setIsDiscordLoading] = useState(false)
  const [isGitHubLoading, setIsGitHubLoading] = useState(false)
  const searchParams = useSearchParams()

  return (
    <div className={cn('grid gap-4', className)} {...props}>
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
          <LoadingSpinner className="mr-2" />
        ) : (
          <Icons.Discord className="mr-2 h-4 w-4" />
        )}{' '}
        Discord
      </Button>

      <Button
        onClick={() => {
          setIsGitHubLoading(true)
          signIn('github')
        }}
        disabled={isGitHubLoading}
        variant="secondary"
      >
        {isGitHubLoading ? (
          <LoadingSpinner className="mr-2" />
        ) : (
          <Icons.GitHub className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </Button>
    </div>
  )
}
