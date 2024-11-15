import { useState } from 'react';
// Import from react-router-dom
import { Eye, Mail, User } from "lucide-react";
import { authService } from '../../../lib/authService';
import useAuthStore from '../../../store/auth-context';

const RegisterForm = ({ onClose, onRedirect }: { onClose?: () => void; onRedirect?: () => void }) => {
    const [username, setUsername] = useState('');
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
        const response = await authService.register({ username, email, password });
        login(response);
  
        if (onClose) onClose();       // Close modal
        if (onRedirect) onRedirect();  // Redirect if provided
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="relative">
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-[#191919] focus:border-teal-600 focus:outline-teal-600"
          placeholder="Enter username"
          required
        />
        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <User className="h-4 w-4 text-gray-400" />
        </span>
      </div>

      <div className="relative">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-[#191919] focus:border-teal-600 focus:outline-teal-600"
          placeholder="Enter email"
          required
        />
        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <Mail className="h-4 w-4 text-gray-400" />
        </span>
      </div>

      <div className="relative">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg p-4 pe-12 text-sm shadow-sm bg-[#191919] focus:border-teal-600 focus:outline-teal-600"
          placeholder="Enter password"
          required
        />
        <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <Eye className="h-4 w-4 text-gray-400" />
        </span>
      </div>

      <button
        type="submit"
        className="block w-full rounded-lg bg-teal-600 px-5 py-3 text-sm font-medium text-white"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
