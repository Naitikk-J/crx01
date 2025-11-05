'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface SignUpPageProps {
  setPage: (page: 'login' | 'signup') => void;
}

declare global {
    interface Window{
        ethereum?: any;
    }
}

export default function SignUpPage({ setPage }: SignUpPageProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast({
        variant: "destructive",
        title: "MetaMask Not Found",
        description: "Please install the MetaMask extension to continue.",
      });
      return;
    }
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
      toast({
        variant: "destructive",
        title: "Wallet Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !walletAddress) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your email address and connect your wallet.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, walletAddress, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred during registration.');
      }

      toast({
        title: "Registration Successful!",
        description: data.message,
      });
      setPage('login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
      console.error('Sign-up failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-text-primary">Create an Account</CardTitle>
          <CardDescription>Join the EcoTrust Exchange market.</CardDescription>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <Button onClick={handleConnectWallet} disabled={loading} className="w-full bg-primary-green hover:bg-primary-green/90 text-white rounded-lg">
              {loading ? 'Connecting...' : 'Connect Wallet to Sign Up'}
            </Button>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-6">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Wallet Connected!</AlertTitle>
                <AlertDescription className="truncate text-xs">
                  {walletAddress}
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg shadow-sm"
                />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={(value: 'buyer' | 'seller') => setRole(value)}>
                      <SelectTrigger className="w-full rounded-lg shadow-sm" id="role">
                          <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              
              <Button type="submit" disabled={loading} className="w-full bg-primary-green hover:bg-primary-green/90 text-white rounded-lg">
                {loading ? 'Processing...' : 'Sign Up'}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('login'); }} className="font-medium text-primary hover:text-primary/90">
              Already have an account? Log In
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
