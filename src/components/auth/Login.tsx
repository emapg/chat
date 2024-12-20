import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/chat');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-dark-200 p-8 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-8">
          <MessageSquare className="w-12 h-12 text-primary-500" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-500 hover:text-primary-400">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}