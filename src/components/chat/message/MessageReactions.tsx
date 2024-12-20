import { MessageReaction } from '../../../types';

interface MessageReactionsProps {
  reactions: MessageReaction[];
}

export default function MessageReactions({ reactions }: MessageReactionsProps) {
  if (!reactions?.length) return null;

  return (
    <div className="flex gap-1 mt-2">
      {reactions.map((reaction, index) => (
        <span key={index} className="text-sm">{reaction.emoji}</span>
      ))}
    </div>
  );
}