import '@/styles/globals.css'
import '@/styles/view-transition.css'
import '@/styles/mapbox.css'

import type { Metadata } from 'next'
import { Analytics } from '@/components/common/analytics'
import { ThemeProvider } from '@/components/theme/provider'
import { geist } from '@/fonts'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

export const metadata: Metadata = {
  title: 'Cyc Earth',
  description: 'Cyc Earth',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  return (
    <html
      lang='zh'
      className={cn(geist.className)}
      suppressHydrationWarning
    >
      <body>
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
      </body>
    </html>
  )
}
