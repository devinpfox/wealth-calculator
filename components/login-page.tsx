/**
 * Mock Login Page Component
 * Branded login screen that accepts any credentials
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Don't allow empty username
    if (!username.trim()) {
      return;
    }

    setIsLoggingIn(true);

    // Simulate a brief loading state for realism
    setTimeout(() => {
      onLogin(username.trim());
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-citadel-navy via-citadel-navy-light to-citadel-navy flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Citadel Wealth
          </h1>
          <p className="text-citadel-cream/80 text-lg">
            Investment Performance Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-citadel-navy mb-2">
              Welcome
            </h2>
            <p className="text-citadel-navy-light text-sm">
              Sign in to access your investment comparison tools
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-citadel-navy mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-citadel-gold focus:outline-none focus:ring-2 focus:ring-citadel-gold/20 transition-colors text-citadel-navy"
                placeholder="Enter your username"
                disabled={isLoggingIn}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-citadel-navy mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-citadel-gold focus:outline-none focus:ring-2 focus:ring-citadel-gold/20 transition-colors text-citadel-navy"
                placeholder="Enter your password"
                disabled={isLoggingIn}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn || !username.trim()}
              className="w-full bg-gradient-to-r from-citadel-gold to-yellow-500 text-citadel-navy font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-citadel-gold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-citadel-navy"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-citadel-navy-light">
              Secure access to premium investment analytics
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <p className="text-citadel-cream/60 text-sm">
            Compare gold, silver, and stock market performance with institutional-grade tools
          </p>
        </div>
      </div>
    </div>
  );
}
