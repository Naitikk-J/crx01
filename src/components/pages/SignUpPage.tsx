'use client';

import { useState } from 'react';
import { BrowserProvider, Eip1193Provider } from 'ethers';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

interface SignUpPageProps {
  setPage: (page: 'login' | 'signup') => void;
}

declare global {
    interface Window{
        ethereum?: Eip1193Provider
    }
}

export default function SignUpPage({ setPage }: SignUpPageProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter your email address.",
      });
      return;
    }

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
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const walletAddress = accounts[0];

      await axios.post('/api/auth/register', { email, walletAddress, role });

      toast({
        title: "Registration Successful!",
        description: "Please check your email for your password, then log in.",
      });
      setPage('login');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'An unknown error occurred.';
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: errorMessage,
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
          <form onSubmit={handleSignUp} className="space-y-6">
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
              {loading ? 'Processing...' : 'Connect Wallet & Sign Up'}
            </Button>
          </form>
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
