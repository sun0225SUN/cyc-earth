'use client'

import Link from 'next/link'
import LogoIcon from '@/assets/logo.svg'
import { fontLogo } from '@/fonts'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href='/'>
      <div className='flex h-16 items-center gap-2 font-bold text-4xl'>
        <LogoIcon className={cn('size-12 cursor-pointer', className)} />
        <div className={cn(fontLogo.className, 'flex-shrink-0 tracking-wide')}>
          cyc
        </div>
      </div>
    </Link>
  )
}
