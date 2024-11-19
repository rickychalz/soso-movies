// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { Eye, Mail } from "lucide-react";
import { authService } from '../../../lib/authService';
import useAuthStore from '../../../store/auth-context';

const LoginForm = ({ onClose, onRedirect }: { onClose?: () => void; onRedirect?: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      try {
        const response = await authService.login({ email, password });
        login(response);
  
        if (onClose) onClose();      
        if (onRedirect) onRedirect();  
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto mb-0 max-w-xl space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="relative border-gray-500">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-[#191919] focus:border-teal-600 focus:outline-teal-600"
              placeholder="Enter email"
              required
            />
            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <Mail/>
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-[#191919] focus:border-teal-600 outline-teal-600"
              placeholder="Enter password"
              required
            />
            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
              <Eye/>
            </span>
          </div>
        </div>
        <div className="flex">
          <button
            type="submit"
            disabled={loading}
            className="inline-block rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white w-full disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;