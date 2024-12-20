import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import ThreeBackground from '../ui/ThreeBackground';
import MessageBubble from './message/MessageBubble';
import ChatInput from './input/ChatInput';
import ConversationList from './sidebar/ConversationList';
import ChatHeader from './header/ChatHeader';

export default function Chat() {
  const { user } = useAuthStore();
  const {
    messages,
    conversations,
    sendMessage,
    currentConversation,
    setCurrentConversation,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentConversation) {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [currentConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'voice') => {
    if (!user) return;
    await sendMessage(content, type);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    // Implement call functionality
    console.log(`Starting ${type} call`);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-dark-100">
      <ThreeBackground />
      
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 border-r border-dark-300"
          >
            <ConversationList
              conversations={conversations}
              currentConversationId={currentConversation?.id}
              onSelect={setCurrentConversation}
              onNewChat={() => {/* Implement new chat */}}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <ChatHeader
              conversation={currentConversation}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              onStartCall={handleStartCall}
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  currentUser={user}
                  onReaction={() => {/* Implement reactions */}}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4">
              <ChatInput
                onSendMessage={handleSendMessage}
                onStartRecording={() => {/* Implement recording */}}
                onStopRecording={() => {/* Implement recording */}}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}