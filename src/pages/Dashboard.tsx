import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Activity, Moon, Footprints, Flame, Play } from 'lucide-react';

import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

type Medicine = {
  name: string;
  dosage: string;
  schedule: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userDetails } = useAuth();

  /* -------------------- STATES -------------------- */
  const [healthRate, setHealthRate] = useState(75);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepMinutes, setSleepMinutes] = useState(30);
  const [steps, setSteps] = useState(2000);
  const [calories, setCalories] = useState(80);

  const [showSleepAdjust, setShowSleepAdjust] = useState(false);
  const [showStepsAdjust, setShowStepsAdjust] = useState(false);
  const [showCaloriesAdjust, setShowCaloriesAdjust] = useState(false);
  const [isCaloriesManual, setIsCaloriesManual] = useState(false);
  const [isEditingCalories, setIsEditingCalories] = useState(false);

  const [motionStatus, setMotionStatus] = useState<'idle' | 'tracking' | 'no-permission'>('idle');
  const [autoTrack, setAutoTrack] = useState(() => localStorage.getItem('autoTrack') === 'true');

  const [showAlert, setShowAlert] = useState(false);

  // Sleep scheduling states
  const [isSleepScheduled, setIsSleepScheduled] = useState(false);

  /* -------------------- MEDICINES -------------------- */
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('medicines') || '[]');
    } catch {
      return [];
    }
  });

  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medSchedule, setMedSchedule] = useState('');

  /* -------------------- MOTION TRACKING -------------------- */
  useEffect(() => {
    if (!autoTrack) {
      setMotionStatus('idle');
      return;
    }

    const handleMotion = () => {
      setSteps(prev => prev + 1);
      // Calories will be automatically calculated by useEffect
    };

    const startTracking = async () => {
      if (!('DeviceMotionEvent' in window)) {
        setMotionStatus('no-permission');
        return;
      }

      try {
        const DME = DeviceMotionEvent as any;
        if (typeof DME.requestPermission === 'function') {
          const permission = await DME.requestPermission();
          if (permission !== 'granted') {
            setMotionStatus('no-permission');
            return;
          }
        }

        window.addEventListener('devicemotion', handleMotion);
        setMotionStatus('tracking');
      } catch (err) {
        console.error(err);
        setMotionStatus('no-permission');
      }
    };

    startTracking();

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [autoTrack]);

  /* -------------------- HEALTH RATE SIMULATION -------------------- */
  // BPM is now constant at 75

  /* -------------------- HELPERS -------------------- */
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const addMedicine = () => {
    if (!medName.trim()) return;
    const next = [...medicines, { name: medName, dosage: medDosage, schedule: medSchedule }];
    setMedicines(next);
    localStorage.setItem('medicines', JSON.stringify(next));
    setMedName('');
    setMedDosage('');
    setMedSchedule('');
  };

  const removeMedicine = (i: number) => {
    const next = medicines.filter((_, idx) => idx !== i);
    setMedicines(next);
    localStorage.setItem('medicines', JSON.stringify(next));
  };

  const firstName = userDetails?.fullName?.split(' ')[0]?.toUpperCase() || 'SARA';

  // Calculate calories based on steps (0.04 kcal per step)
  const calculateCaloriesFromSteps = (stepCount: number) => {
    return Math.round(stepCount * 0.04 * 100) / 100;
  };

  // Update calories whenever steps change (only in automatic mode)
  useEffect(() => {
    if (!isCaloriesManual) {
      setCalories(calculateCaloriesFromSteps(steps));
    }
  }, [steps, isCaloriesManual]);

  /* -------------------- RENDER -------------------- */
  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col" style={{ backgroundColor: '#3B9B8F' }}>
        {/* Header */}
        <div className="pt-14 px-6 pb-6">
          <h1 className="text-white text-xl">{getGreeting()},</h1>
          <h2 className="text-white text-2xl font-bold">{firstName}!</h2>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#F8F6F3] rounded-t-[2rem] p-5 overflow-y-auto pb-28">
          {/* Vitals */}
          <h3 className="font-semibold mb-3">Your Vitals</h3>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-white rounded-xl p-4 text-center">
              <Activity className="mx-auto mb-1 text-[#3B9B8F]" />
              <div className="text-xl font-bold">{healthRate}</div>
              <div className="text-xs">BPM</div>
            </div>

            <div
              className="bg-white rounded-xl p-4 text-center cursor-pointer"
              onClick={() => setShowSleepAdjust(!showSleepAdjust)}
            >
              <Moon className="mx-auto mb-1 text-[#E8847C]" />
              <div className="text-xl font-bold">
                {sleepHours}h {sleepMinutes}m
              </div>
              <div className="text-xs">Sleep</div>
            </div>
          </div>

          {showSleepAdjust && (
            <div className="bg-white p-4 rounded-xl mb-5">
              <h4 className="font-semibold mb-3">Adjust Sleep Time</h4>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <label className="block text-sm text-gray-600 mb-1">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Math.max(0, Math.min(12, parseInt(e.target.value) || 0)))}
                    className="w-16 text-center border rounded p-2"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={sleepMinutes}
                    onChange={(e) => setSleepMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-16 text-center border rounded p-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Activity */}
          <h3 className="font-semibold mb-3">Activity</h3>

          <div className="bg-white rounded-xl p-4 mb-3 flex items-center justify-between">
            <Footprints />
            <span>{steps.toLocaleString()} steps</span>
            <button onClick={() => setShowStepsAdjust(!showStepsAdjust)}><Play /></button>
          </div>

          {showStepsAdjust && (
            <div className="bg-white p-4 rounded-xl mb-3">
              <h4 className="font-semibold mb-3">Adjust Steps</h4>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={steps}
                  onChange={(e) => {
                    const newSteps = Math.max(0, parseInt(e.target.value) || 0);
                    setSteps(newSteps);
                  }}
                  className="w-32 text-center border rounded p-2 text-lg font-semibold"
                />
                <div className="text-sm text-gray-600 mt-1">steps</div>
                <div className="text-xs text-gray-500 mt-1">Calories: {calculateCaloriesFromSteps(steps)} kcal</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl p-4 mb-5 flex items-center justify-between">
            <Flame />
            <div className="flex items-center gap-2">
              {isEditingCalories ? (
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={calories}
                  onChange={(e) => {
                    setCalories(Math.max(0, parseFloat(e.target.value) || 0));
                    setIsCaloriesManual(true); // Switch to manual mode when editing
                  }}
                  onBlur={() => setIsEditingCalories(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingCalories(false);
                    }
                  }}
                  className="w-20 text-center border rounded p-1 text-sm font-semibold"
                  autoFocus
                />
              ) : (
                <span 
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => setIsEditingCalories(true)}
                >
                  {calories} kcal
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowCaloriesAdjust(!showCaloriesAdjust)}
              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              ⚙️
            </button>
          </div>

          {showCaloriesAdjust && (
            <div className="bg-white p-4 rounded-xl mb-5">
              <h4 className="font-semibold mb-3">Adjust Calories</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode:</span>
                  <button
                    onClick={() => {
                      setIsCaloriesManual(!isCaloriesManual);
                      if (!isCaloriesManual) {
                        // Switching to manual, keep current value
                      } else {
                        // Switching to auto, recalculate from steps
                        setCalories(calculateCaloriesFromSteps(steps));
                      }
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      isCaloriesManual 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {isCaloriesManual ? 'Manual' : 'Auto'}
                  </button>
                </div>
                
                {isCaloriesManual ? (
                  <div className="text-center">
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={calories}
                      onChange={(e) => setCalories(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-32 text-center border rounded p-2 text-lg font-semibold"
                    />
                    <div className="text-sm text-gray-600 mt-1">kcal</div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-600">
                    Auto-calculated from steps: {calculateCaloriesFromSteps(steps)} kcal
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medicines */}
          <h3 className="font-semibold mb-3">Medicines</h3>

          <div className="bg-white rounded-xl p-4 mb-5">
            <div className="flex gap-2 mb-3">
              <input value={medName} onChange={e => setMedName(e.target.value)} placeholder="Name" className="border p-2 rounded w-full" />
              <input value={medDosage} onChange={e => setMedDosage(e.target.value)} placeholder="Dosage" className="border p-2 rounded w-full" />
              <input value={medSchedule} onChange={e => setMedSchedule(e.target.value)} placeholder="Schedule" className="border p-2 rounded w-full" />
              <button onClick={addMedicine} className="bg-[#3B9B8F] text-white px-3 rounded">Add</button>
            </div>

            {medicines.map((m, i) => (
              <div key={i} className="flex justify-between text-sm mb-1">
                <span>{m.name} ({m.dosage})</span>
                <button onClick={() => removeMedicine(i)} className="text-red-500">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <BottomNav />

        {/* Alert */}
        {showAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center">
              <h2 className="font-bold mb-3">Health Alert</h2>
              <p className="mb-4">High heart rate detected.</p>
              <button
                className="bg-[#3B9B8F] text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowAlert(false);
                  navigate('/agentic-action');
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
};

export default Dashboard;
