import { Header } from '@/components/layout/header'
import { CycMap } from '@/components/map'
import { api } from '@/trpc/server'

export default async function Home() {
  const athlete = await api.athlete.getAthlete()
  return (
    <div className='mx-auto flex flex-col px-20'>
      <Header />
      <div className='mt-6 flex flex-1 items-center'>
        <h1 className='w-1/4'>
          {athlete?.firstname} {athlete?.lastname}
        </h1>
        <div className='h-[80vh] w-3/4'>
          <CycMap />
        </div>
      </div>
    </div>
  )
}
