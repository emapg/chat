import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Message, Profile } from '../../types';
import { Smile, Check, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface MessageBubbleProps {
  message: Message;
  currentUser: Profile;
  onReaction: (emoji: string) => void;
}

export default function MessageBubble({ message, currentUser, onReaction }: MessageBubbleProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isOwn = message.sender_id === currentUser.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        <img
          src={message.sender?.avatar_url || `https://api.dicebear.com/7.x/avatars/svg?seed=${message.sender_id}`}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        
        <div className={`relative group ${isOwn ? 'bg-primary-500' : 'bg-dark-200'} rounded-2xl p-3`}>
          {message.type === 'text' && (
            <p className={`text-sm ${isOwn ? 'text-white' : 'text-gray-100'}`}>
              {message.content}
            </p>
          )}
          
          {message.type === 'image' && (
            <img
              src={message.content}
              alt="message"
              className="max-w-sm rounded-lg"
            />
          )}

          <div className="absolute bottom-0 right-0 transform translate-y-full pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-8 right-0">
                <EmojiPicker onEmojiClick={(emojiData) => {
                  onReaction(emojiData.emoji);
                  setShowEmojiPicker(false);
                }} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <span>{format(new Date(message.created_at), 'HH:mm')}</span>
            {isOwn && (
              message.is_edited ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
            )}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-2">
              {message.reactions.map((reaction, index) => (
                <span key={index} className="text-sm">{reaction.emoji}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}