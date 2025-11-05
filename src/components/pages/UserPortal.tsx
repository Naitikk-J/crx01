import { useAuth } from '@/contexts/AuthContext';
import Marketplace from '../Marketplace';

export default function UserPortal() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Welcome, {user?.email}</h1>
        <p className="text-text-secondary mt-1">Browse and trade carbon credits on the open marketplace.</p>
      </div>
      <Marketplace />
    </div>
  );
}
