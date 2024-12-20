import { useState, useRef } from 'react';
import { Send, Image, Mic, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice') => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function ChatInput({ onSendMessage, onStartRecording, onStopRecording }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSendMessage(event.target.result as string, 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
    setIsRecording(!isRecording);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-100 p-4 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 hover:bg-dark-200 rounded-full transition-colors"
        >
          <Smile className="w-5 h-5 text-gray-400" />
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-dark-200 rounded-full transition-colors"
        >
          <Image className="w-5 h-5 text-gray-400" />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-dark-200 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          rows={1}
        />

        <button
          onClick={handleVoiceRecord}
          className={`p-2 hover:bg-dark-200 rounded-full transition-colors ${
            isRecording ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          className="p-2 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
    </motion.div>
  );
}