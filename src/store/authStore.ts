import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  setUser: (user: Profile | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUp: async (email, password, username) => {
    const { error: signUpError, data } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { username }
      }
    });
    if (signUpError) throw signUpError;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          avatar_url: null,
          status: '',
          is_online: true
        });
      
      if (profileError) throw profileError;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  updateProfile: async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', useAuthStore.getState().user?.id);
    
    if (error) throw error;
    
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  }
}));