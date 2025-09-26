import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';

interface LoginProps {
  onSwitchToSignUp: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignUp, onBack }) => {
  const [email, setEmail] = useState('testpatient@medlink.com');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl shadow-2xl animate-fade-in">
        <div className="text-center">
            <div className="inline-block bg-primary p-4 rounded-full mb-4">
               <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
              </svg>
            </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to MedLink</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your health portal.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          <div className="flex items-center justify-end text-sm">
             <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Forgot password?
              </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-blue-300 transition-all duration-300"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
         <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignUp} className="font-medium text-primary hover:text-primary-dark">
                Sign up
              </button>
            </p>
            <p>
              <button onClick={onBack} className="font-medium text-secondary hover:text-dark">
                &larr; Go back to role selection
              </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;