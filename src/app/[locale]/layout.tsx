import '@/styles/globals.css'
import '@/styles/view-transition.css'
import '@/styles/mapbox.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { Analytics } from '@/components/common/analytics'
import { ThemeProvider } from '@/components/theme/provider'
import { geist } from '@/fonts'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

export const metadata: Metadata = {
  title: 'Cyc Earth',
  description: 'Cyc Earth',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

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
              <Analytics />
            </ThemeProvider>
          </TRPCReactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
