import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { Check, CheckCircle2 } from 'lucide-react';

const AgenticAction = () => {
  const { userDetails } = useAuth();
  const navigate = useNavigate();
  const [actions, setActions] = useState([
    { id: 1, text: 'Rescheduled 10:00 AM meeting to "Rest Block".', checked: true },
    { id: 2, text: `Notified Dr.${userDetails?.doctorName || 'Emily'} (Ob-gyn) with your recent vitals.`, checked: true },
    { id: 3, text: "Drafted a 'sick leave' email to your manager for approval.", checked: false },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleAction = (id: number) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, checked: !action.checked } : action
    ));
  };

  const handleConfirmAndCall = () => {
    setShowSuccess(true);
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        {/* Header */}
        <div className="pt-14 pb-5 px-6">
          {/* Empty header area for status bar */}
        </div>

        {/* Content */}
        <div className="flex-1 rounded-t-[2rem] px-5 py-8 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          {/* Success Checkmark */}
          <div className="flex justify-center mb-5">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
            >
              <CheckCircle2 className="w-14 h-14" style={{ color: '#10B981' }} />
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-xl font-semibold text-center mb-8"
            style={{ color: '#1F2937', fontFamily: 'Playfair Display, serif' }}
          >
            I have taken action to protect you
          </h1>

          {/* Action Items */}
          <div className="space-y-3 mb-8">
            {actions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer"
                style={{ backgroundColor: 'rgba(59, 155, 143, 0.08)' }}
                onClick={() => toggleAction(action.id)}
              >
                <div 
                  className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                  style={{ 
                    backgroundColor: action.checked ? '#3B9B8F' : 'transparent',
                    borderColor: action.checked ? '#3B9B8F' : '#9CA3AF'
                  }}
                >
                  {action.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#1F2937' }}>{action.text}</p>
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmAndCall}
            className="w-full py-3.5 font-semibold rounded-xl"
            style={{ backgroundColor: '#E8847C', color: 'white' }}
          >
            Confirm & Call Doctor
          </button>
        </div>

        {/* AI Assistant Button */}
        <div className="absolute bottom-24 right-5">
          <div 
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
            style={{ backgroundColor: '#3B9B8F' }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#E8847C' }}
            >
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>
        </div>

        <BottomNav />

        {/* Success Modal */}
        {showSuccess && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl mx-5 p-8 animate-scale-in w-full max-w-[340px] text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
              >
                <CheckCircle2 className="w-14 h-14" style={{ color: '#10B981' }} />
              </div>
              <h2 
                className="text-xl font-semibold mb-2"
                style={{ color: '#1F2937', fontFamily: 'Playfair Display, serif' }}
              >
                Success!
              </h2>
              <p className="mb-6" style={{ color: '#6B7280' }}>
                Your doctor has been notified and a call is being connected. Please stay calm.
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3 font-semibold rounded-xl"
                style={{ backgroundColor: '#3B9B8F', color: 'white' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
};

export default AgenticAction;
