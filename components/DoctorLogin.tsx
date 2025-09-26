import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

interface DoctorLoginProps {
  onBack: () => void;
}

const DoctorLogin: React.FC<DoctorLoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('doctor@medlink.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-slate-300 p-4">
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl shadow-2xl animate-fade-in">
        <div className="text-center">
            <div className="inline-block bg-secondary p-4 rounded-full mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h5m-5 4h5"/>
              </svg>
            </div>
          <h2 className="text-3xl font-bold text-gray-900">Provider Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the healthcare dashboard.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Not a provider?{' '}
          <button onClick={onBack} className="font-medium text-primary hover:text-primary-dark">
            Go back
          </button>
        </p>
      </div>
    </div>
  );
};

export default DoctorLogin;
