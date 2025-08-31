import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';

const AdminLogin: React.FC = () => {
  const [view, setView] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('admin@muhimmath.org');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, resetPasswordForEmail } = useAdmin();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message || 'Invalid login credentials.');
    } else {
      navigate('/admin/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const { error: resetError } = await resetPasswordForEmail(email);

    if (resetError) {
      setError(resetError.message || 'Failed to send reset link.');
    } else {
      setMessage('Password reset link sent! Please check your email.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {view === 'login' ? (
            <motion.div
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="w-8 h-8 text-white" /></div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
                <p className="text-gray-600">Access the Muhimmath admin panel</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter your email" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg" placeholder="Enter your password" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setView('reset')} className="text-sm text-red-600 hover:underline">Forgot Password?</button>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reset-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-8 h-8 text-white" /></div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                <p className="text-gray-600">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-6">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}
                {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">{message}</div>}
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg" placeholder="Enter your email" required />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => setView('login')} className="w-full text-red-600 py-2 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-red-600 hover:text-red-700 text-sm font-medium">← Back to Website</button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
