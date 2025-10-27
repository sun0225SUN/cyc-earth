import { Logo } from '@/components/common/logo'
import { LanguageToggle } from '@/components/language/toggle'
import { ThemeToggle } from '@/components/theme/toggle'

export function Header() {
  return (
    <header className='sticky top-0 z-50 flex h-20 items-center justify-between bg-background'>
      <Logo className='size-10 font-logo' />
      <div className='flex items-center gap-4'>
        <LanguageToggle className='size-6' />
        <ThemeToggle className='size-6' />
      </div>
    </header>
  )
}
