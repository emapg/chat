import { format } from 'date-fns';
import { Users } from 'lucide-react';
import { Conversation } from '../../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick
}: ConversationItemProps) {
  const lastMessage = conversation.last_message;
  const participants = conversation.participants || [];

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-3 hover:bg-dark-300 transition-colors ${
        isActive ? 'bg-dark-300' : ''
      }`}
    >
      {conversation.type === 'group' ? (
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 flex items-center justify-center bg-primary-500 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      ) : (
        <img
          src={participants[0]?.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${participants[0]?.id}`}
          alt="avatar"
          className="w-12 h-12 rounded-full"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-white font-medium truncate">
            {conversation.name || participants.map(p => p.username).join(', ')}
          </h3>
          {lastMessage && (
            <span className="text-xs text-gray-400">
              {format(new Date(lastMessage.created_at), 'HH:mm')}
            </span>
          )}
        </div>

        {lastMessage && (
          <p className="text-sm text-gray-400 truncate">
            {lastMessage.type === 'text' ? lastMessage.content : '📎 Attachment'}
          </p>
        )}
      </div>
    </button>
  );
}