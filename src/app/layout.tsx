import { Inter as FontSans } from 'next/font/google'

import { Footer } from '@/components/footer'
import { QueryClientProviderWrapper } from '@/components/query-client-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toast/toaster'
import { cn } from '@/utils/cn'
import '@/styles/globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
})

type RootLayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: 'Tic tac toe',
    template: '%s | Tic tac toe',
  },
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <QueryClientProviderWrapper>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>

              <Footer />
            </div>
          </QueryClientProviderWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
