import '@/styles/globals.css'
import '@/styles/view-transition.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/theme/provider'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

export const metadata: Metadata = {
  title: 'Cyc Earth',
  description: 'Cyc Earth',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={cn(geist.className)}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
