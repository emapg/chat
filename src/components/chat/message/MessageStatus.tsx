import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface MessageStatusProps {
  createdAt: string;
  isOwn: boolean;
  isEdited: boolean;
}

export default function MessageStatus({ createdAt, isOwn, isEdited }: MessageStatusProps) {
  return (
    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
      <span>{format(new Date(createdAt), 'HH:mm')}</span>
      {isOwn && (
        isEdited ? <CheckCheck className="w-4 h-4" /> : <Check className="w-4 h-4" />
      )}
    </div>
  );
}