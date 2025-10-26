import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/header'
import { api } from '@/trpc/server'

export default async function Home() {
  const athlete = await api.athlete.getAthlete()
  const t = await getTranslations('common')

  return (
    <div className='mx-auto flex flex-col px-16'>
      <Header />

      <div className='flex h-screen flex-col items-center justify-center gap-5'>
        <h1 className='font-bold text-2xl'>{t('title')}</h1>
        <h1 className='font-bold text-2xl'>Athlete</h1>
        <p className='text-lg'>{athlete?.username}</p>
      </div>
    </div>
  )
}
