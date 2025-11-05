'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { LogoIcon } from './icons/LogoIcon';
import { LogOut, UserCircle, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';

export default function Header() {
  const { user, logout } = useAuth();

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const roleDisplay: Record<string, { icon: React.ReactNode, text: string }> = {
    buyer: { icon: <UserCircle className="w-4 h-4 mr-1" />, text: 'Buyer' },
    seller: { icon: <UserCircle className="w-4 h-4 mr-1" />, text: 'Seller' },
    verifier: { icon: <ShieldCheck className="w-4 h-4 mr-1" />, text: 'Verifier' },
    admin: { icon: <ShieldCheck className="w-4 h-4 mr-1" />, text: 'Admin' },
  }

  return (
    <header className="bg-neutral-card shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoIcon className="text-primary-green" />
            <h1 className="ml-2 text-xl font-bold text-text-primary">EcoTrust Exchange</h1>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-text-primary">{truncateAddress(user.walletAddress)}</p>
                  <p className="text-xs text-text-secondary">{user.email}</p>
                </div>
                 <Badge variant="secondary" className="capitalize flex items-center">
                    {roleDisplay[user.role]?.icon}
                    {roleDisplay[user.role]?.text || user.role}
                </Badge>
                <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
                <div className="w-16 h-8 bg-muted rounded-md animate-pulse" />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
