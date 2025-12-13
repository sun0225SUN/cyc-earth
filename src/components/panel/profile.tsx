import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/trpc/server'

export async function PanelProfile() {
  const athlete = await api.athlete.getAthlete()

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card p-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="size-24 border-4 border-background shadow-md">
          <AvatarImage
            src={athlete?.profile ?? ''}
            alt="用户头像"
            className="object-cover"
          />
          <AvatarFallback className="text-xl font-semibold">
            {athlete?.firstname?.[0] ?? ''}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {athlete?.firstname} {athlete?.lastname}
          </h1>
          <p className="text-muted-foreground mt-1">
            骑行爱好者
          </p>
        </div>
      </div>
    </div>
  )
}
