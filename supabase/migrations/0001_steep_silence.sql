/*
  # Initial Chat Application Schema

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text)
      - avatar_url (text)
      - status (text)
      - is_online (boolean)
      - last_seen (timestamp)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - conversations
      - id (uuid)
      - type (text: 'direct' or 'group')
      - name (text, for group chats)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - conversation_participants
      - conversation_id (uuid)
      - profile_id (uuid)
      - joined_at (timestamp)
      - last_read_at (timestamp)
    
    - messages
      - id (uuid)
      - conversation_id (uuid)
      - sender_id (uuid)
      - content (text)
      - type (text: 'text', 'image', 'file', 'voice')
      - metadata (jsonb, for additional data like file URLs)
      - is_edited (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - message_reactions
      - message_id (uuid)
      - profile_id (uuid)
      - emoji (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT '',
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation participants table
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, profile_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'file', 'voice')),
  metadata JSONB DEFAULT '{}',
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message reactions table
CREATE TABLE message_reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, profile_id, emoji)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Conversation participants policies
CREATE POLICY "Users can view participants of their conversations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants AS cp
      WHERE cp.conversation_id = conversation_id
      AND cp.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can join conversations"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid());

-- Message reactions policies
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions to messages in their conversations"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages
      JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id
      WHERE messages.id = message_reactions.message_id
      AND conversation_participants.profile_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();