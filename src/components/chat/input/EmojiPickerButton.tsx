import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface EmojiPickerButtonProps {
  showPicker: boolean;
  onToggle: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiPickerButton({ showPicker, onToggle, onEmojiSelect }: EmojiPickerButtonProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-dark-200 rounded-full transition-colors"
      >
        <Smile className="w-5 h-5 text-gray-400" />
      </button>

      {showPicker && (
        <div className="absolute bottom-20 right-4">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onEmojiSelect(emojiData.emoji);
              onToggle();
            }}
          />
        </div>
      )}
    </>
  );
}