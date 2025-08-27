'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import supabase from '@/lib/supabase';
import AuthRedirect from '@/components/AuthRedirect';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { setUser, setSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, router]);

  return (
    <>
      <AuthRedirect />
      {children}
    </>
  );
}