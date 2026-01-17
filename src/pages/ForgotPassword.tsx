import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import { Mail } from 'lucide-react';
import jananiBackground from '@/assets/janani-background.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '';

  const handleSendOTP = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP sent to your email');
        // Navigate to reset password page with email
        navigate('/reset-password', { state: { email } });
      } else {
        setMessage(data.detail || 'Failed to send OTP');
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
            <h2 className="text-xl font-semibold text-center mb-4" style={{ color: '#3B9B8F' }}>Forgot Password</h2>
            <p className="text-sm text-center mb-4" style={{ color: '#6B7280' }}>
              Enter your email address and we'll send you an OTP to reset your password.
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

            {message && (
              <p className={`text-sm text-center ${message.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={!isFormValid || loading}
              className="w-full py-3.5 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E8847C', color: 'white' }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3.5 font-semibold rounded-xl border transition-all"
              style={{ backgroundColor: 'white', borderColor: '#E5E7EB', color: '#6B7280' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default ForgotPassword;