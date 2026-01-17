import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { User, Phone, Building2, Droplets, AlertCircle, LogOut, ChevronRight, Edit } from 'lucide-react';

const Profile = () => {
  const { userDetails, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-8 px-6 text-center">
          {/* Profile Avatar */}
          <div className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            {userDetails?.fullName || 'User'}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {userEmail || 'user@email.com'}
          </p>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-5 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          {/* Pregnancy Info */}
          <div className="p-4 rounded-xl mb-5" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold" style={{ color: '#1F2937' }}>Pregnancy Info</h3>
              <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5F3' }}>
                <Edit className="w-4 h-4" style={{ color: '#3B9B8F' }} />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Weeks</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.pregnancyWeeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm" style={{ color: '#6B7280' }}>Months</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.pregnancyMonths} months</span>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <h3 className="text-base font-semibold mb-3" style={{ color: '#1F2937' }}>Medical Information</h3>
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
              <Droplets className="w-5 h-5" style={{ color: '#E8847C' }} />
              <div className="flex-1">
                <span className="text-sm" style={{ color: '#6B7280' }}>Blood Type</span>
                <p className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.bloodType || 'A+'}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
              <AlertCircle className="w-5 h-5" style={{ color: '#10B981' }} />
              <div className="flex-1">
                <span className="text-sm" style={{ color: '#6B7280' }}>Allergies</span>
                <p className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.allergies || 'None'}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
              <Building2 className="w-5 h-5" style={{ color: '#3B9B8F' }} />
              <div className="flex-1">
                <span className="text-sm" style={{ color: '#6B7280' }}>Hospital</span>
                <p className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.hospitalName || "St. Mary's"}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>
          </div>

          {/* Doctor Info */}
          <h3 className="text-base font-semibold mb-3" style={{ color: '#1F2937' }}>Your Doctor</h3>
          <div className="p-4 rounded-xl mb-5" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5F3' }}>
                <User className="w-6 h-6" style={{ color: '#3B9B8F' }} />
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: '#1F2937' }}>{userDetails?.doctorName || 'Dr. Emily Johnson'}</p>
                <p className="text-sm" style={{ color: '#6B7280' }}>OB-GYN</p>
              </div>
              <a 
                href={`tel:${userDetails?.doctorNumber}`}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#3B9B8F' }}
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
            style={{ backgroundColor: '#FEF1EF', color: '#E8847C' }}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>

          <div className="mt-4">
            <button onClick={() => navigate('/emergency-contacts')} className="w-full py-3.5 rounded-xl mb-3 font-semibold" style={{ backgroundColor: '#E8F5F3', color: '#065F46' }}>
              Manage Emergency Contacts
            </button>
            <button onClick={() => navigate('/sos-log')} className="w-full py-3.5 rounded-xl font-semibold" style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
              View SOS Log
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default Profile;
