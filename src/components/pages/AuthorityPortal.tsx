import { useAuth } from '@/contexts/AuthContext';
import VerificationQueue from '../VerificationQueue';

export default function AuthorityPortal() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Authority Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Review and verify new carbon credit projects. Welcome, <span className="font-semibold capitalize">{user?.role}</span>.
        </p>
      </div>
      <VerificationQueue />
    </div>
  );
}
