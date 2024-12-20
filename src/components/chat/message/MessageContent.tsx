import { Message } from '../../../types';

interface MessageContentProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageContent({ message, isOwn }: MessageContentProps) {
  if (message.type === 'text') {
    return (
      <p className={`text-sm ${isOwn ? 'text-white' : 'text-gray-100'}`}>
        {message.content}
      </p>
    );
  }

  if (message.type === 'image') {
    return (
      <img
        src={message.content}
        alt="message"
        className="max-w-sm rounded-lg"
      />
    );
  }

  return null;
}