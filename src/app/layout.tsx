import { Inter as FontSans } from 'next/font/google'

import { Footer } from '@/components/footer'
import { QueryClientProviderWrapper } from '@/components/query-client-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toast/toaster'
import '@/styles/globals.css'
import { cn } from '@/utils/cn'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

type RootLayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: 'Tic Tac Toe',
    template: '%s | Tic Tac Toe',
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <QueryClientProviderWrapper>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>

              <Footer />
            </div>
          </QueryClientProviderWrapper>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
