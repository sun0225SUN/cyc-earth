import { Header } from '@/components/layout/header'
import { CycMap } from '@/components/map'
import { PanelProfile } from '@/components/panel/profile'
import { DataTable } from '@/components/table'

export default async function Home() {
  return (
    <div className='mx-auto flex flex-col px-20'>
      <Header />

      <div className='mt-6 flex'>
        <div className='w-1/4'>
          <PanelProfile />
        </div>

        <div className='flex w-3/4 flex-col gap-5'>
          <div className='h-[70vh]'>
            <CycMap />
          </div>
          <DataTable />
        </div>
      </div>
    </div>
  )
}
