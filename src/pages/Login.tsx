import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import jananiBackground from '@/assets/janani-background.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = () => {
    if (isFormValid) {
      login(email, password);
      navigate('/personal-details');
    }
  };

  const handleGoogleLogin = () => {
    window.open('https://accounts.google.com/signin', '_blank');
  };

  const handleFacebookLogin = () => {
    window.open('https://www.facebook.com/login', '_blank');
  };

  return (
    <MobileFrame>
      <div
        className="min-h-[844px] flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${jananiBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F0E8]/95" />

        <div className="flex-1" />

        <div className="rounded-t-[2.5rem] px-8 py-6 relative z-10" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right mb-2">
              <button onClick={() => navigate('/forgot-password')} className="text-red-500 text-sm hover:underline">Forgot Password?</button>
            </div>

            <button
              onClick={handleLogin}
              disabled={!isFormValid}
              className="w-full py-3.5 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E8847C', color: 'white' }}
            >
              Continue
            </button>

            <p className="text-center text-xs" style={{ color: '#6B7280' }}>
              By continuing, you agree to our{' '}
              <span className="font-medium" style={{ color: '#3B9B8F' }}>Terms of Service</span>
              {' '}and{' '}
              <span className="font-medium" style={{ color: '#3B9B8F' }}>Privacy Policy</span>
            </p>

            <p className="text-center text-sm mt-3">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-primary font-semibold">Sign up</button>
            </p>

            <div className="pt-4">
              <p className="text-center text-sm mb-3" style={{ color: '#6B7280' }}>Or login with</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleFacebookLogin}
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:brightness-110 transition-all hover:scale-110"
                  style={{ backgroundColor: '#1877F2' }}
                  aria-label="Login with Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:brightness-95 transition-all hover:scale-110 border"
                  style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
                  aria-label="Login with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Login;
