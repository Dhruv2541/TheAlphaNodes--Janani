import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserDetails {
  fullName: string;
  pregnancyWeeks: number;
  pregnancyMonths: number;
  doctorName: string;
  doctorNumber: string;
  bloodType: string;
  previousComplication: string;
  allergies: string;
  hospitalName: string;
  notes: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  hasCompletedDetails: boolean;
  userEmail: string;
  userDetails: UserDetails | null;
  emergencyContacts: Array<{ name: string; phone: string; relation?: string }>;
  sosLog: Array<any>;
  login: (email: string, password: string) => void;
  signup: (email: string, name: string) => void;
  saveDetails: (details: UserDetails) => void;
  setEmergencyContacts: (contacts: Array<{ name: string; phone: string; relation?: string }>) => void;
  sendSOS: (payload: { vitals?: any; location?: { lat: number; lng: number } }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedDetails, setHasCompletedDetails] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{ name: string; phone: string; relation?: string }>>([]);
  const [sosLog, setSosLog] = useState<Array<any>>([]);

  const login = (email: string, password: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const signup = (email: string, name: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const setEmergencyContactsHandler = (contacts: Array<{ name: string; phone: string; relation?: string }>) => {
    setEmergencyContacts(contacts);
  };

  const sendSOS = ({ vitals, location }: { vitals?: any; location?: { lat: number; lng: number } }) => {
    // In a real app this would POST to an emergency backend and trigger SMS/push.
    const timestamp = new Date().toISOString();
    const entry = { timestamp, vitals: vitals || null, location: location || null, contacts: emergencyContacts, userEmail };
    setSosLog((s) => [entry, ...s]);
    // For now, also log and alert so the developer/tester sees action
    // eslint-disable-next-line no-console
    console.log('SOS sent:', entry);
    try {
      // show a quick browser alert to confirm
      // window is available in browser runtime
      // @ts-ignore
      if (typeof window !== 'undefined' && window.alert) window.alert('SOS sent — emergency contacts alerted.');
    } catch (e) {
      /* ignore */
    }
  };

  const saveDetails = (details: UserDetails) => {
    setUserDetails(details);
    setHasCompletedDetails(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setHasCompletedDetails(false);
    setUserEmail('');
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      hasCompletedDetails,
      userEmail,
      userDetails,
      emergencyContacts,
      sosLog,
      login,
      signup,
      saveDetails,
      setEmergencyContacts: setEmergencyContactsHandler,
      sendSOS,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
