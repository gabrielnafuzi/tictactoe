import { Header } from '@/components/header'
import { getCurrentUser } from '@/lib/auth'

type LayoutProps = {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getCurrentUser()

  return (
    <div>
      <Header user={user} />

      <div>{children}</div>
    </div>
  )
}
