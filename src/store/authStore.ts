// src/store/authStore.ts
import { create } from 'zustand';
import supabase from '@/lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,
  
  signUp: async (email: string, password: string, username: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }
      
      set({ 
        user: data.user, 
        session: data.session,
        loading: false,
        error: null
      });
      return { error: null };
      //eslint-disable-next-line
    } catch (error: any) {
      const errorMessage = error.error_description || error.message || 'Error signing up';
      set({ error: errorMessage, loading: false });
      return { error: error as AuthError };
    }
  },
  
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (error) {
        set({ error: error.message, loading: false });
        return { error };
      }
      
      set({ 
        user: data.user, 
        session: data.session,
        loading: false,
        error: null
      });
      return { error: null };
      //eslint-disable-next-line
    } catch (error: any) {
      const errorMessage = error.error_description || error.message || 'Error signing in';
      set({ error: errorMessage, loading: false });
      return { error: error as AuthError };
    }
  },
  
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null, 
        session: null,
        loading: false,
        error: null
      });
      //eslint-disable-next-line
    } catch (error: any) {
      set({ 
        error: error.message || 'Error signing out',
        loading: false 
      });
    }
  },
  
  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),
}));

export default useAuthStore;