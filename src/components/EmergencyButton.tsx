import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EmergencyButton = () => {
  const { sendSOS } = useAuth();

  const handleSOS = async () => {
    const confirm = window.confirm('Hold on — tap OK to trigger SOS. This will share your live location with emergency contacts.');
    if (!confirm) return;

    // Try to get location
    let loc: { lat: number; lng: number } | undefined;
    try {
      loc = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return resolve(undefined);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(undefined),
          { timeout: 8000 }
        );
      });
    } catch (e) {
      loc = undefined;
    }

    // In a real app we'd collect live vitals from sensors. Here we simulate.
    const vitals = {
      heartRate: Math.floor(60 + Math.random() * 40),
      bp: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
    };

    sendSOS({ vitals, location: loc });
  };

  return (
    <button
      title="SOS"
      onClick={handleSOS}
      className="-mt-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      style={{ backgroundColor: '#EF4444', color: 'white' }}
    >
      <AlertCircle className="w-6 h-6" />
    </button>
  );
};

export default EmergencyButton;
