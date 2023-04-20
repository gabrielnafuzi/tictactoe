import { type Metadata } from 'next'

import { LoginErrorMessage } from './components/login-error-message'
import { UserAuthForm } from './components/user-auth-form'
import { type ErrorKey } from './errors'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

type LoginPageProps = {
  searchParams: { error?: ErrorKey }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <>
      <div className="container flex min-h-screen w-full flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <UserAuthForm />
          </div>
        </div>
      </div>

      <LoginErrorMessage error={searchParams.error} />
    </>
  )
}
