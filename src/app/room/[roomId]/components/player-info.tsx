import { type User } from 'next-auth'

import { UserAvatar } from '@/components/user-avatar'

type PlayerInfoProps = {
  user: User
  isRoomOwner: boolean
}

export const PlayerInfo = ({ user, isRoomOwner }: PlayerInfoProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <UserAvatar user={user} />

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        <span className="block max-w-[120px] truncate" title={user.name!}>
          {user.name}
        </span>{' '}
        <strong>{isRoomOwner ? '(X)' : '(O)'}</strong>
      </p>
    </div>
  )
}
