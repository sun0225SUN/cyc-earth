import { Logo } from '@/components/common/logo'
import { ThemeToggle } from '@/components/theme/toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo />
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
