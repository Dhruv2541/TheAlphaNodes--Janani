import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import jananiBackground from '@/assets/janani-background.png';

const ResetPassword = () => {
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const isFormValid = email.trim() !== '' && otp.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '' && newPassword === confirmPassword;

  const handleResetPassword = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(data.detail || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-xl font-semibold text-center mb-4" style={{ color: '#3B9B8F' }}>Reset Password</h2>
            <p className="text-sm text-center mb-4" style={{ color: '#6B7280' }}>
              Enter the OTP sent to your email and your new password.
            </p>

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
              <input
                id="otp"
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-center text-red-600">Passwords do not match</p>
            )}

            {message && (
              <p className={`text-sm text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={!isFormValid || loading}
              className="w-full py-3.5 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E8847C', color: 'white' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full py-3.5 font-semibold rounded-xl border transition-all"
              style={{ backgroundColor: 'white', borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default ResetPassword;