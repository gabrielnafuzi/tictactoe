'use client'

import { type User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

import { cn } from '@/utils/cn'

import { Button, buttonVariants } from '../components/button'

type HeaderProps = {
  user: User | undefined
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="top-0 z-40 w-full bg-background">
      <div className="flex h-16 items-center justify-between border-b px-8 py-4">
        <Link href="/" className="font-bold">
          Tic Tac Toe
        </Link>

        <nav>
          {user ? (
            <Button onClick={() => signOut()} size="sm" className="px-4">
              Logout
            </Button>
          ) : (
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ size: 'sm' }), 'px-4')}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
