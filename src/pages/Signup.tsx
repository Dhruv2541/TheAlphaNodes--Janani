import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import { Mail, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import jananiBackground from '@/assets/janani-background.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  

  const { signup } = useAuth();
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '' && name.trim() !== '';
  const isPasswordValid = password.length >= 6 && password === confirmPassword;

  const handleSignup = () => {
    if (!isFormValid || !isPasswordValid) return;
    signup(email, name);
    navigate('/personal-details');
  };

  const handleSubmit = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    const data = await res.json();

    console.log("Backend response:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Signup successful");
    } else {
      alert(data.detail || "Signup failed");
    }

  } catch (err) {
    console.error("API error:", err);
  }
};


  return (
    <MobileFrame>
      <div
        className="min-h-[844px] flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${jananiBackground})`, backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F0E8]/95" />

        <button
          onClick={() => navigate('/')}
          className="absolute top-14 left-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-6 relative z-10">
          <h1 className="text-3xl font-semibold text-[#1F2937]">Signup</h1>
          <p className="text-sm text-[#6B7280] mt-1">Join the Janani family</p>
        </div>

        <div className="rounded-t-[2.5rem] px-8 py-10 relative z-10" style={{ backgroundColor: '#F5F0E8' }}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create Password"
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

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button onClick={handleSignup} className="w-full py-3.5 font-semibold rounded-xl shadow-lg transition-all">Submit</button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
                <button onClick={() => navigate('/')} className="text-primary font-semibold">Login</button>
            </p>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Signup;
