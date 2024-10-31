import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signup(email, password, role);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      console.error('Sign-up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-white p-12 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-coral-400 rounded-r-full" style={{ backgroundColor: '#ff9f76' }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-tl-full opacity-50" />
        
        <div className="max-w-md mx-auto mt-20">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <h2 className="text-3xl font-bold mb-12">Task Management System</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Password must be at least 8 characters long and contain numbers or symbols
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 relative group"
            >
              <span className="absolute right-0 top-0 h-full w-12 bg-coral-400 rounded-r-md flex items-center justify-center transition-all duration-300 group-hover:w-full" style={{ backgroundColor: '#ff9f76' }}>
                →
              </span>
              <span className="relative z-10">CREATE ACCOUNT</span>
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-coral-400 hover:text-coral-500" style={{ color: '#ff9f76' }}>
                LOGIN
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-teal-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-32 h-32 mx-auto mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-xl">Join Our Community</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;