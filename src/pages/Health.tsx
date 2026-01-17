import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { Heart, Activity, Droplets, Thermometer } from 'lucide-react';

const Health = () => {
  const { userDetails } = useAuth();

  const healthTips = [
    { icon: Heart, title: 'Heart Health', description: 'Your heart rate is within normal range', color: '#E8847C' },
    { icon: Activity, title: 'Activity Level', description: 'Keep up with light exercises daily', color: '#3B9B8F' },
    { icon: Droplets, title: 'Hydration', description: 'Remember to drink 8-10 glasses of water', color: '#60A5FA' },
    { icon: Thermometer, title: 'Temperature', description: 'Normal body temperature maintained', color: '#F59E0B' },
  ];

  // Medicines (shared via localStorage key 'medicines')
  const [medicines, setMedicines] = useState<Array<{name:string,dosage:string,schedule:string}>>(() => {
    try { return JSON.parse(localStorage.getItem('medicines') || '[]'); } catch { return []; }
  });
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medSchedule, setMedSchedule] = useState('');

  useEffect(() => { try { localStorage.setItem('medicines', JSON.stringify(medicines)); } catch {} }, [medicines]);

  const addMedicine = () => {
    if (!medName.trim()) return;
    const next = [...medicines, { name: medName.trim(), dosage: medDosage.trim(), schedule: medSchedule.trim() }];
    setMedicines(next);
    setMedName(''); setMedDosage(''); setMedSchedule('');
    try { window.dispatchEvent(new CustomEvent('medicinesUpdated', { detail: next })); } catch {}
  };

  const removeMedicine = (i:number) => setMedicines(m => m.filter((_,idx)=>idx!==i));

  // dispatch update when medicines change (remove/edit)
  useEffect(() => {
    try { window.dispatchEvent(new CustomEvent('medicinesUpdated', { detail: medicines })); } catch {}
  }, [medicines]);

  // inline edit schedule
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [tempSchedule, setTempSchedule] = useState('');

  const startEdit = (i:number) => {
    setEditingIdx(i);
    setTempSchedule(medicines[i]?.schedule || '');
  };

  const saveEdit = (i:number) => {
    const next = medicines.map((m, idx) => idx === i ? { ...m, schedule: tempSchedule } : m);
    setMedicines(next);
    setEditingIdx(null);
    setTempSchedule('');
    try { window.dispatchEvent(new CustomEvent('medicinesUpdated', { detail: next })); } catch {}
  };

  const cancelEdit = () => { setEditingIdx(null); setTempSchedule(''); };

  // Diet generator state (uses localStorage 'dietPlans')
  const [dietQuery, setDietQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<number>(() => Number(userDetails?.pregnancyWeeks || 32));
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Gujarati');
  const [dietPlans, setDietPlans] = useState<Record<number, Array<{day:string, breakfast:string, lunch:string, dinner:string}>>>(() => {
    try { return JSON.parse(localStorage.getItem('dietPlans') || '{}'); } catch { return {}; }
  });

  useEffect(() => { try { localStorage.setItem('dietPlans', JSON.stringify(dietPlans)); } catch {} }, [dietPlans]);

  const trimesterForWeek = (w:number) => { if (w <= 12) return 1; if (w <= 27) return 2; return 3; };

  const generateDiet = (week = selectedWeek) => {
    const w = Number(week || userDetails?.pregnancyWeeks || 32);
    const tri = trimesterForWeek(w);
    const allergyText = userDetails?.allergies ? String(userDetails?.allergies).toLowerCase() : '';
    const prefs = String(dietQuery || '').toLowerCase();

    // basic pools (kept short here; Dashboard has fuller pools)
    const breakfastPool:any = {
      1: ['Oats porridge with banana', 'Poha with peas', 'Idli with sambar'],
      2: ['Vegetable upma', 'Egg and spinach omelette', 'Milk smoothie with oats'],
      3: ['Spinach dal with toast', 'Greek yogurt with nuts', 'Besan cheela with veggies']
    };
    const lunchPool:any = {
      1: ['Khichdi with ghee', 'Lentil soup with roti', 'Grilled paneer salad'],
      2: ['Brown rice with dal and veg', 'Chicken curry (lean) with roti', 'Rajma with rice'],
      3: ['Spinach dal with rice', 'Fish curry with rice', 'Mixed bean salad with chapati']
    };
    const dinnerPool:any = {
      1: ['Light vegetable soup with toast', 'Steamed veggies and dal'],
      2: ['Grilled fish or tofu with veggies', 'Dal with chapati and greens'],
      3: ['Protein-rich lentil stew with rice', 'Chicken stew with vegetables']
    };
    const snackPool:any = {
      1: ['Fresh fruit salad', 'Roasted chickpeas'],
      2: ['Mixed nuts (small)', 'Carrot sticks with hummus'],
      3: ['Dates and walnuts', 'Protein smoothie']
    };

    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const plan:any[] = [];
    for (let i=0;i<7;i++){
      const rand = (arr:any[]) => arr[Math.floor(Math.random()*arr.length)];
      let breakfast = rand(breakfastPool[tri]);
      let lunch = rand(lunchPool[tri]);
      let dinner = rand(dinnerPool[tri]);
      let snack = rand(snackPool[tri]);
      if (prefs.includes('vegetarian')) {
        breakfast = breakfast.replace(/chicken|fish/gi,'paneer'); lunch = lunch.replace(/chicken|fish/gi,'paneer'); dinner = dinner.replace(/chicken|fish/gi,'paneer');
      }
      if (allergyText) {
        const note = ` (Avoid: ${userDetails?.allergies})`;
        if (breakfast.toLowerCase().includes(allergyText)) breakfast += note;
        if (lunch.toLowerCase().includes(allergyText)) lunch += note;
        if (dinner.toLowerCase().includes(allergyText)) dinner += note;
      }
      plan.push({ day: days[i], breakfast: `${breakfast} — nourishing.`, lunch: `${lunch} Snack: ${snack}.`, dinner: `${dinner} — light.` });
    }

    const next = { ...dietPlans, [w]: plan };
    setDietPlans(next);
  };

  const clearDietForWeek = (week = selectedWeek) => {
    const w = Number(week);
    if (!dietPlans[w]) return;
    const next = { ...dietPlans };
    delete next[w];
    setDietPlans(next);
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-5 px-6">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Health
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your wellness overview
          </p>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-5 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          {/* Pregnancy Progress */}
          <div className="p-4 rounded-xl mb-5" style={{ backgroundColor: 'white' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#1F2937' }}>Pregnancy Progress</h3>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8F5F3' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${((userDetails?.pregnancyWeeks || 32) / 40) * 100}%`,
                    backgroundColor: '#3B9B8F'
                  }}
                />
              </div>
              <span className="text-sm font-medium" style={{ color: '#3B9B8F' }}>
                {userDetails?.pregnancyWeeks || 32}/40 weeks
              </span>
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {40 - (userDetails?.pregnancyWeeks || 32)} weeks to go! You're doing great! 🎉
            </p>
          </div>

          {/* Health Metrics */}
          <h3 className="text-base font-semibold mb-3" style={{ color: '#1F2937' }}>Health Metrics</h3>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {healthTips.map((tip, index) => (
              <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${tip.color}20` }}
                >
                  <tip.icon className="w-5 h-5" style={{ color: tip.color }} />
                </div>
                <p className="font-medium text-sm mb-1" style={{ color: '#1F2937' }}>{tip.title}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Weekly Summary */}
          <h3 className="text-base font-semibold mb-3" style={{ color: '#1F2937' }}>This Week</h3>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'white' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Avg. Heart Rate</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>72 BPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Avg. Sleep</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>7h 30m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Daily Steps</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>3,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: '#6B7280' }}>Calories Burned</span>
                <span className="font-medium" style={{ color: '#1F2937' }}>1,200 kcal</span>
              </div>
            </div>
          </div>

          {/* Diet & Medicines Section */}
          <div className="mt-5 space-y-4">
            {/* Diet AI Generator */}
            <div className="diet-card">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Diet Suggestions</div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Week</label>
                  <input type="number" min={1} max={40} value={selectedWeek} onChange={(e)=>setSelectedWeek(Number(e.target.value || 1))} className="w-20 px-2 py-1 rounded-lg border" />
                  <label className="text-xs text-gray-400">Cuisine</label>
                  <select value={selectedCuisine} onChange={(e)=>setSelectedCuisine(e.target.value)} className="w-32 px-2 py-1 rounded-lg border">
                    <option value="Gujarati">Gujarati</option>
                    <option value="South-Indian">South-Indian</option>
                    <option value="North-Indian">North-Indian</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <textarea value={dietQuery} onChange={(e)=>setDietQuery(e.target.value)} placeholder="Preferences (e.g. vegetarian, avoid nuts)" className="w-full px-4 py-3 rounded-2xl border mb-3 placeholder:text-gray-400" />

              <div className="diet-controls mb-3">
                <button onClick={() => { setDietQuery('vegetarian'); generateDiet(selectedWeek); }} className="preset-btn">Vegetarian</button>
                <button onClick={() => { setDietQuery('low sugar'); generateDiet(selectedWeek); }} className="preset-btn">Low Sugar</button>
                <button onClick={() => { setDietQuery('iron-rich'); generateDiet(selectedWeek); }} className="preset-btn">Iron-rich</button>
                <button onClick={() => { setDietQuery('avoid nuts'); generateDiet(selectedWeek); }} className="preset-btn">No Nuts</button>
                <button onClick={() => { setDietQuery(''); generateDiet(selectedWeek); }} className="preset-btn primary">Suggest for me</button>
              </div>

              <div className="diet-actions mb-3">
                <button onClick={()=>generateDiet(selectedWeek)} className="btn primary">Generate</button>
                <button onClick={()=>clearDietForWeek(selectedWeek)} className="btn ghost">Clear Week</button>
                <button onClick={()=>{ setDietQuery(''); }} className="btn ghost">Reset</button>
              </div>

              {dietPlans[selectedWeek] ? (
                <div className="diet-plan">
                  <div className="text-xs text-gray-500 mb-1">Plan for week {selectedWeek} (saved)</div>
                  {dietPlans[selectedWeek].map((d, i) => (
                    <div key={i} className="diet-day">
                      <div className="meal-title">{d.day}</div>
                      <div className="meal-desc"><strong>Breakfast:</strong> {d.breakfast}</div>
                      <div className="meal-desc"><strong>Lunch:</strong> {d.lunch}</div>
                      <div className="meal-desc"><strong>Dinner:</strong> {d.dinner}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">No plan generated for this week yet. Use Generate to create one.</div>
              )}
            </div>

            {/* Medicines management (on Health page) */}
            <div className="diet-card">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">Medicines</div>
                <div className="text-xs text-gray-400">Manage</div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input placeholder="Medicine name" value={medName} onChange={(e)=>setMedName(e.target.value)} className="flex-1 px-4 py-3 rounded-full border border-gray-200 placeholder:text-gray-400" />
                  <input placeholder="Dosage" value={medDosage} onChange={(e)=>setMedDosage(e.target.value)} className="w-28 px-4 py-3 rounded-full border border-gray-200 placeholder:text-gray-400" />
                  <input placeholder="Schedule" value={medSchedule} onChange={(e)=>setMedSchedule(e.target.value)} className="w-32 px-4 py-3 rounded-full border border-gray-200 placeholder:text-gray-400" />
                  <button onClick={addMedicine} className="px-4 py-2 rounded-full bg-[#3B9B8F] text-white">Add</button>
                </div>

                {medicines.length === 0 ? (
                  <div className="text-xs text-gray-500">No medicines added.</div>
                ) : (
                  medicines.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{m.name} <span className="text-xs text-gray-500">{m.dosage}</span></div>
                        {editingIdx === i ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input value={tempSchedule} onChange={(e)=>setTempSchedule(e.target.value)} placeholder="e.g. 10:00 AM or after lunch" className="px-3 py-1 rounded-lg border" />
                            <button onClick={()=>saveEdit(i)} className="px-3 py-1 rounded-full bg-[#3B9B8F] text-white text-xs">Save</button>
                            <button onClick={cancelEdit} className="px-3 py-1 rounded-full bg-gray-100 text-xs">Cancel</button>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            <span>{m.schedule || 'Not set'}</span>
                            <button onClick={()=>startEdit(i)} className="text-xs text-[#3B9B8F]">Edit</button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={()=>removeMedicine(i)} className="text-sm text-red-500">Remove</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default Health;
