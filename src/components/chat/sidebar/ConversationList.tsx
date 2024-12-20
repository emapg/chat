import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Conversation } from '../../../types';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelect,
  onNewChat
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => 
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participants?.some(p => 
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full bg-dark-200">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-300 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ConversationItem
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              onClick={() => onSelect(conversation)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}