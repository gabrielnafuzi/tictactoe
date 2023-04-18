import { Inter as FontSans } from 'next/font/google'

import { QueryClientProviderWrapper } from '@/components/query-client-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/toast/toaster'
import '@/styles/globals.css'
import { cn } from '@/utils/cn'

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
    <html
      lang="en"
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}
    >
      <head />
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
