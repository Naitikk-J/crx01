'use client';

import { useState } from 'react';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface LoginPageProps {
  setPage: (page: 'login' | 'signup') => void;
}

declare global {
    interface Window{
        ethereum?: Eip1193Provider
    }
}

export default function LoginPage({ setPage }: LoginPageProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          variant: "destructive",
          title: "Wallet Connection Failed",
          description: "Could not connect to MetaMask. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
        toast({
            variant: "destructive",
            title: "MetaMask Not Found",
            description: "Please install the MetaMask extension to continue.",
        });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !password) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
      }
      
      login(data.token);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text-primary">Login to EcoTrust</CardTitle>
          <CardDescription>Connect your wallet and enter your password.</CardDescription>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <Button onClick={handleConnectWallet} disabled={loading} className="w-full bg-primary hover:bg-primary/90 rounded-lg">
              {loading ? 'Connecting...' : 'Connect Wallet to Login'}
            </Button>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Wallet Connected!</AlertTitle>
                <AlertDescription className="truncate text-xs">
                  {walletAddress}
                </AlertDescription>
              </Alert>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter password from email"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg shadow-sm"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 rounded-lg">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup'); }} className="font-medium text-primary-green hover:text-primary-green/90">
              Don't have an account? Sign Up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
