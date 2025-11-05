'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AppShell from '@/components/AppShell';

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-bg font-body">
        <AppShell />
      </div>
    </AuthProvider>
  );
}
