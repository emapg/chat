export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string;
  is_online: boolean;
  last_seen: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  metadata: Record<string, any>;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  reactions?: MessageReaction[];
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  created_at: string;
  updated_at: string;
  participants?: Profile[];
  last_message?: Message;
}

export interface MessageReaction {
  message_id: string;
  profile_id: string;
  emoji: string;
  created_at: string;
  profile?: Profile;
}