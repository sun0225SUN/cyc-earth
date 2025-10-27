import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/trpc/server'

export async function PanelProfile() {
  const athlete = await api.athlete.getAthlete()

  return (
    <h1 className='flex flex-col gap-2'>
      <Avatar className='size-16'>
        <AvatarImage
          src={athlete?.profile ?? ''}
          alt='avatar'
        />
        <AvatarFallback>{athlete?.firstname?.[0] ?? ''}</AvatarFallback>
      </Avatar>
      <p className='font-bold text-xl'>
        {athlete?.firstname} {athlete?.lastname}
      </p>
    </h1>
  )
}
