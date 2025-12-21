'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Higher-order component that protects routes from unauthenticated access
 * and validates token validity
 */

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    const { token, isLoading, validateToken, logout } = useAuth();
    const router = useRouter();
    const intervalInMinutes = 5 //in minutes
    useEffect(() => {
      if (!isLoading && !token) {
        router.push('/auth/login');
      }
    }, [token, isLoading, router]);

    useEffect(() => {
      if (!token) return;

      // Validate token periodically (every 5 minutes)
      const tokenRefreshInterval = setInterval(async () => {
        const isValid = await validateToken();
        if (!isValid) {
          logout();
          router.push('/auth/login');
        }
      }, intervalInMinutes * 60 * 1000); // 5 minutes

      return () => clearInterval(tokenRefreshInterval);
    }, [token, validateToken, logout, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!token) {
      return null;
    }

    return <Component {...props} />;
  };
}
