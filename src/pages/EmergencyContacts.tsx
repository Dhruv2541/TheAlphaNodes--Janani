import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import { Phone, Plus, Trash, ChevronRight, ArrowLeft } from 'lucide-react';

const EmergencyContacts = () => {
  const { emergencyContacts, setEmergencyContacts } = useAuth();
  const [contacts, setContacts] = useState(emergencyContacts || []);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const addContact = () => {
    const digits = phone.replace(/\D/g, '');
    if (!name.trim() || digits.length !== 10) return;
    const next = [...contacts, { name: name.trim(), phone: digits }];
    setContacts(next);
    setEmergencyContacts(next);
    setName('');
    setPhone('');
  };

  const removeContact = (idx: number) => {
    const next = contacts.filter((_, i) => i !== idx);
    setContacts(next);
    setEmergencyContacts(next);
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-4 px-6 flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Emergency Contacts</h1>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-6 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="w-full max-w-[380px] mx-auto space-y-5">
            <div className="bg-white p-4 rounded-2xl shadow-sm overflow-visible">
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <input
                  className="w-full sm:flex-1 min-w-0 px-4 py-3 rounded-lg border border-gray-200 placeholder:text-gray-400"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className="w-full sm:w-28 flex-none px-4 py-3 rounded-lg border border-gray-200 placeholder:text-gray-400"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => {
                      // keep only digits and limit to 10
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(digits);
                    }}
                  />
                  <button
                    onClick={addContact}
                    disabled={!name.trim() || phone.replace(/\D/g, '').length !== 10}
                    className={`w-full sm:w-auto px-3 sm:px-4 py-3 rounded-lg bg-[#3B9B8F] text-white flex items-center justify-center gap-2 shadow-sm flex-none ${
                      !name.trim() || phone.replace(/\D/g, '').length !== 10 ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Add the people who should receive your SOS alerts (doctor, family, workplace emergency contact).</p>
              {phone.length > 0 && phone.replace(/\D/g, '').length < 10 && (
                <p className="mt-1 text-xs text-red-500">Phone must be 10 digits.</p>
              )}
            </div>

            <div className="space-y-3">
              {contacts.length === 0 && (
                <div className="p-4 rounded-xl bg-white">
                  <p className="text-sm text-gray-600">No emergency contacts yet. Add one above.</p>
                </div>
              )}

              {contacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center"><Phone className="w-5 h-5 text-[#065F46]"/></div>
                    <div>
                      <div className="font-medium text-sm text-[#1F2937]">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeContact(i)} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                      <Trash className="w-4 h-4 text-red-600"/>
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default EmergencyContacts;
