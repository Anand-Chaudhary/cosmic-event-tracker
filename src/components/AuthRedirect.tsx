'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function AuthRedirect() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  return null;
}
