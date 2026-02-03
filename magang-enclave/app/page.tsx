'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      'superadmin': '/dashboard-superAdmin',
      'admin': '/admin/beranda',
      'direktur': '/direktur/beranda',
      'approver': '/approver/beranda',
      'secretary': '/approver/beranda',
      'general': '/user/beranda',
      'adk': '/adk/beranda',
    };

    const route = roleRoutes[user.role] || '/login';
    router.replace(route);
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Memuat...</p>
      </div>
    </div>
  );
}
