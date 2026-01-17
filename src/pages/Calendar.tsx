import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import BottomNav from '@/components/BottomNav';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const { userDetails } = useAuth();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  const currentMonthDate = new Date(selectedYear, selectedMonth);
  const currentMonth = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Appointments state
  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('appointments') || '[]');
    } catch {
      return [
        { id: 1, day: 15, month: selectedMonth, year: selectedYear, title: 'Doctor Checkup', time: '10:00 AM' },
        { id: 2, day: 22, month: selectedMonth, year: selectedYear, title: 'Ultrasound', time: '2:00 PM' },
        { id: 3, day: 28, month: selectedMonth, year: selectedYear, title: 'Blood Test', time: '9:00 AM' },
      ];
    }
  });

  // Add appointment modal state
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  // Appointment functions
  const addAppointment = () => {
    if (!appointmentTitle.trim() || !appointmentTime.trim() || selectedDate === null) return;

    // Check if the selected date is in the past
    const today = new Date();
    const selectedDateTime = new Date(selectedYear, selectedMonth, selectedDate);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (selectedDateTime < todayDate) {
      setErrorMessage('Cannot add appointments to past dates. Please select a future date.');
      return;
    }

    const newAppointment = {
      id: Date.now(),
      day: selectedDate,
      month: selectedMonth,
      year: selectedYear,
      title: appointmentTitle,
      time: appointmentTime,
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Reset form
    setAppointmentTitle('');
    setAppointmentTime('');
    setSelectedDate(null);
    setErrorMessage(''); // Clear error message on success
    setShowAddAppointment(false);
  };

  const deleteAppointment = (id: number) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== id);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  // Get appointments for current month
  const currentMonthAppointments = appointments.filter(
    apt => apt.month === selectedMonth && apt.year === selectedYear
  );

  // Check if a date has appointments
  const hasAppointment = (day: number) => {
    return currentMonthAppointments.some(apt => apt.day === day);
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col relative" style={{ backgroundColor: '#3B9B8F' }}>
        <div className="pt-14 pb-5 px-6">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Calendar
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Track your appointments
          </p>
        </div>

        <div className="flex-1 rounded-t-[2rem] px-5 py-5 overflow-y-auto pb-28" style={{ backgroundColor: '#F8F6F3' }}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: 'rgba(59, 155, 143, 0.1)' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#3B9B8F' }} />
            </button>
            <h2 className="text-lg font-semibold" style={{ color: '#1F2937' }}>{currentMonth}</h2>
            <button 
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: 'rgba(59, 155, 143, 0.1)' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#3B9B8F' }} />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium py-2" style={{ color: '#6B7280' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const isToday = day === currentDate.getDate() && selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear();
              const dayHasAppointment = hasAppointment(day);
              const isPastDate = new Date(selectedYear, selectedMonth, day) < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
              
              return (
                <div
                  key={day}
                  onClick={() => {
                    if (!isPastDate) {
                      setSelectedDate(day);
                      setErrorMessage('');
                      setShowAddAppointment(true);
                    }
                  }}
                  className={`aspect-square rounded-full flex items-center justify-center text-sm relative transition-opacity ${
                    isToday ? 'font-bold' : ''
                  } ${
                    isPastDate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isToday ? '#3B9B8F' : 'transparent',
                    color: isToday ? 'white' : isPastDate ? '#9CA3AF' : '#1F2937',
                  }}
                >
                  {day}
                  {dayHasAppointment && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: '#E8847C' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming Appointments */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>Upcoming Appointments</h3>
            <button
              onClick={() => {
                setShowAddAppointment(true);
                setErrorMessage('');
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#3B9B8F] text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {currentMonthAppointments.length === 0 ? (
              <div className="p-4 rounded-xl text-center text-gray-500" style={{ backgroundColor: 'white' }}>
                No appointments scheduled for {currentMonth}
              </div>
            ) : (
              currentMonthAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'white' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5F3' }}>
                    <span className="font-bold" style={{ color: '#3B9B8F' }}>{apt.day}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#1F2937' }}>{apt.title}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{apt.time}</p>
                  </div>
                  <button
                    onClick={() => deleteAppointment(apt.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Appointment Modal */}
        {showAddAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Appointment</h3>
                <button
                  onClick={() => {
                    setShowAddAppointment(false);
                    setSelectedDate(null);
                    setAppointmentTitle('');
                    setAppointmentTime('');
                    setErrorMessage('');
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span>{selectedDate} {currentMonth.split(' ')[0]}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Title</label>
                  <input
                    type="text"
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                    placeholder="e.g., Doctor Checkup"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9B8F]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9B8F]"
                  />
                </div>

                <button
                  onClick={addAppointment}
                  disabled={!appointmentTitle.trim() || !appointmentTime.trim()}
                  className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#3B9B8F' }}
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default Calendar;
