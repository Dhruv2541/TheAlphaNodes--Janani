import React from 'react';
import { Home, Calendar, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmergencyButton from './EmergencyButton';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: Calendar, path: '/calendar', label: 'Calendar' },
    { icon: Heart, path: '/health', label: 'Health' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/ai-chat' || location.pathname === '/agentic-action';
    }
    return location.pathname === path;
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 pb-6 pt-3 px-6 border-t z-50 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#E5E7EB' }}
    >
      <div className="flex justify-between items-center max-w-[320px] mx-auto">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 p-2 transition-all hover:scale-110"
            style={{ color: isActive(item.path) ? '#3B9B8F' : '#9CA3AF' }}
          >
            <item.icon 
              className="w-6 h-6" 
              strokeWidth={isActive(item.path) ? 2.5 : 2}
            />
          </button>
        ))}

        <EmergencyButton />

        {navItems.slice(2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 p-2 transition-all hover:scale-110"
            style={{ color: isActive(item.path) ? '#3B9B8F' : '#9CA3AF' }}
          >
            <item.icon 
              className="w-6 h-6" 
              strokeWidth={isActive(item.path) ? 2.5 : 2}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
