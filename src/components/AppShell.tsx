'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import LoginPage from '@/components/pages/LoginPage';
import SignUpPage from '@/components/pages/SignUpPage';
import UserPortal from '@/components/pages/UserPortal';
import AuthorityPortal from '@/components/pages/AuthorityPortal';
import { Skeleton } from './ui/skeleton';

export default function AppShell() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<'login' | 'signup'>('login');

  const renderContent = () => {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
      );
    }

    if (user) {
      if (user.role === 'admin' || user.role === 'verifier') {
        return <AuthorityPortal />;
      }
      return <UserPortal />;
    }

    if (page === 'login') {
      return <LoginPage setPage={setPage} />;
    }

    if (page === 'signup') {
      return <SignUpPage setPage={setPage} />;
    }
  };

  return (
    <>
      <Header />
      <main>
        {renderContent()}
      </main>
    </>
  );
}
