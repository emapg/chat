import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Conversation, Message, Profile } from '../types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type?: Message['type'], metadata?: Record<string, any>) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation });
    if (conversation) {
      get().fetchMessages(conversation.id);
    }
  },

  fetchConversations: async () => {
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(
          profile:profiles(*)
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({ conversations: data, loading: false });
  },

  fetchMessages: async (conversationId: string) => {
    set({ loading: true });
    
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*),
        reactions:message_reactions(
          *,
          profile:profiles(*)
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    set({ messages: data, loading: false });
  },

  sendMessage: async (content, type = 'text', metadata = {}) => {
    const conversation = get().currentConversation;
    if (!conversation) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        content,
        type,
        metadata
      });

    if (error) {
      set({ error: error.message });
    }
  },

  subscribeToMessages: () => {
    const conversation = get().currentConversation;
    if (!conversation) return;

    const subscription = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: message } = await supabase
              .from('messages')
              .select(`
                *,
                sender:profiles(*),
                reactions:message_reactions(
                  *,
                  profile:profiles(*)
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (message) {
              set((state) => ({
                messages: [...state.messages, message]
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  unsubscribeFromMessages: () => {
    const conversation = get().currentConversation;
    if (conversation) {
      supabase.channel(`messages:${conversation.id}`).unsubscribe();
    }
  },
}));