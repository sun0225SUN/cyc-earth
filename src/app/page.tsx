import { ThemeToggle } from '@/components/theme/toggle'
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/server'

export default async function Home() {
  const athlete = await api.athlete.getAthlete()

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-5'>
      <h1 className='font-bold text-2xl'>Athlete</h1>
      <p className='text-lg'>{athlete?.username}</p>
      <Button>Click me</Button>
      <ThemeToggle />
    </div>
  )
}
