'use client'

import Link from 'next/link'
import LogoIcon from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href='/'
      className={cn('flex items-center gap-2 transition-all duration-200 hover:opacity-90', className)}
    >
      <LogoIcon className='size-12' />
      <span className='text-2xl font-bold'>
        <span className='text-primary'>cyc</span>
        <span className='text-foreground'>earth</span>
      </span>
    </Link>
  )
}
