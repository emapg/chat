import { Menu, Search, Phone, Video } from 'lucide-react';
import { Conversation, Profile } from '../../../types';
import UserAvatar from '../../shared/UserAvatar';

interface ChatHeaderProps {
  conversation: Conversation;
  onToggleSidebar: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
}

export default function ChatHeader({
  conversation,
  onToggleSidebar,
  onStartCall
}: ChatHeaderProps) {
  const participants = conversation.participants || [];
  const isGroup = conversation.type === 'group';
  const title = conversation.name || participants.map(p => p.username).join(', ');
  
  const getOnlineStatus = () => {
    if (isGroup) {
      const onlineCount = participants.filter(p => p.is_online).length;
      return `${onlineCount} online`;
    }
    return participants[0]?.is_online ? 'online' : 'offline';
  };

  return (
    <div className="bg-dark-200 border-b border-dark-300 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-dark-300 rounded-full lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>

          {isGroup ? (
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant) => (
                <UserAvatar
                  key={participant.id}
                  user={participant}
                  className="w-10 h-10 border-2 border-dark-200"
                />
              ))}
            </div>
          ) : (
            <UserAvatar user={participants[0]} className="w-10 h-10" />
          )}

          <div>
            <h2 className="text-white font-medium">{title}</h2>
            <p className="text-sm text-gray-400">{getOnlineStatus()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartCall('audio')}
            className="p-2 hover:bg-dark-300 rounded-full"
          >
            <Phone className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => onStartCall('video')}
            className="p-2 hover:bg-dark-300 rounded-full"
          >
            <Video className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-dark-300 rounded-full">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}