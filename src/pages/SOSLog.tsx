import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import { FileText, ArrowLeft } from 'lucide-react';

const SOSLog = () => {
  const { sosLog } = useAuth();
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-4 px-6 flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">SOS Log</h1>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-5 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          <div className="space-y-3">
            {(!sosLog || sosLog.length === 0) && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
                <p className="text-sm text-muted-foreground">No SOS events yet.</p>
              </div>
            )}

            {sosLog.map((entry: any, i: number) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><FileText className="w-5 h-5 text-slate-600"/></div>
                  <div>
                    <div className="font-medium" style={{ color: '#1F2937' }}>{entry.timestamp}</div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{entry.userEmail || 'Unknown user'}</div>
                  </div>
                </div>

                <div className="text-sm text-[#374151]">
                  <div><strong>Location:</strong> {entry.location ? `${entry.location.lat.toFixed(4)}, ${entry.location.lng.toFixed(4)}` : 'Unavailable'}</div>
                  <div><strong>Vitals:</strong> {entry.vitals ? JSON.stringify(entry.vitals) : 'N/A'}</div>
                  <div><strong>Contacts:</strong> {entry.contacts ? entry.contacts.map((c:any) => c.name + ' ('+c.phone+')').join(', ') : 'None'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default SOSLog;
