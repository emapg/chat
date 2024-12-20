import { Profile } from '../../types';

interface UserAvatarProps {
  user: Profile;
  className?: string;
}

export default function UserAvatar({ user, className = '' }: UserAvatarProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={user.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${user.id}`}
        alt={user.username}
        className="rounded-full w-full h-full object-cover"
      />
      {user.is_online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-200 rounded-full" />
      )}
    </div>
  );
}