import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileFrame from '@/components/MobileFrame';
import { User, Calendar, Stethoscope, Phone, Droplets, AlertCircle, Pill, Building2, FileText, ChevronRight } from 'lucide-react';

const PersonalDetails = () => {
  const [fullName, setFullName] = useState('');
  const [pregnancyWeeks, setPregnancyWeeks] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [countryCode] = useState('+91');
  const [doctorNumber, setDoctorNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [previousComplication, setPreviousComplication] = useState('');
  const [allergies, setAllergies] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [notes, setNotes] = useState('');
  
  const { saveDetails } = useAuth();
  const navigate = useNavigate();

  const handleWeeksChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 0 && num <= 38)) {
      setPregnancyWeeks(value);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10);
    setDoctorNumber(limitedDigits);
    
    // Validate
    if (limitedDigits.length > 0 && limitedDigits.length !== 10) {
      setPhoneError('Mobile number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const isPhoneValid = doctorNumber.length === 10;

  const isFormValid = 
    fullName.trim() !== '' &&
    pregnancyWeeks !== '' &&
    doctorName.trim() !== '' &&
    isPhoneValid &&
    bloodType.trim() !== '' &&
    previousComplication.trim() !== '' &&
    allergies.trim() !== '' &&
    hospitalName.trim() !== '';

  const handleSave = () => {
    if (isFormValid) {
      saveDetails({
        fullName,
        pregnancyWeeks: parseInt(pregnancyWeeks),
        doctorName,
        doctorNumber: `${countryCode} ${doctorNumber}`,
        bloodType,
        previousComplication,
        allergies,
        hospitalName,
        notes,
      });
      navigate('/dashboard');
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[844px] flex flex-col" style={{ backgroundColor: '#3B9B8F' }}>
        {/* Header */}
        <div className="pt-14 pb-4 px-6 flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <span className="font-mono text-sm" style={{ color: 'white' }}>&lt;/&gt;</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-t-[2rem] px-5 py-5 overflow-y-auto pb-8" style={{ backgroundColor: '#F8F6F3' }}>
          <h1 className="text-xl font-semibold mb-1" style={{ color: '#E8847C', fontFamily: 'Playfair Display, serif' }}>Personal Details</h1>
          <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
            Please fill out the information below to help us better support your pregnancy
          </p>

          <div className="space-y-2.5">
            {/* Full Name */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
              <User className="w-5 h-5" style={{ color: '#3B9B8F' }} />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {/* Pregnancy Weeks */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
              <Calendar className="w-5 h-5" style={{ color: '#3B9B8F' }} />
              <span className="text-sm" style={{ color: '#6B7280' }}>Pregnancy Weeks</span>
              <div className="flex-1" />
              <input
                type="number"
                min="0"
                max="38"
                placeholder="32"
                value={pregnancyWeeks}
                onChange={(e) => handleWeeksChange(e.target.value)}
                className="w-12 text-right bg-transparent border-none outline-none text-gray-700"
              />
              <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>

            {/* Doctor Name */}
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
              <Stethoscope className="w-5 h-5" style={{ color: '#3B9B8F' }} />
              <span className="text-sm" style={{ color: '#6B7280' }}>Doctor Name</span>
              <div className="flex-1" />
              <input
                type="text"
                placeholder="Dr. Emily Johnson"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-32 text-right bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
              />
              <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            </div>

            {/* Doctor Number with Country Code */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'white' }}>
                <Phone className="w-5 h-5" style={{ color: '#3B9B8F' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Doctor Number</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium" style={{ color: '#3B9B8F' }}>{countryCode}</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={doctorNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={10}
                    className="w-24 text-right bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                  />
                </div>
              </div>
              {phoneError && (
                <p className="text-xs px-3" style={{ color: '#DC2626' }}>{phoneError}</p>
              )}
              {doctorNumber.length > 0 && doctorNumber.length === 10 && (
                <p className="text-xs px-3" style={{ color: '#10B981' }}>✓ Valid phone number</p>
              )}
            </div>

            {/* Additional Information Section */}
            <div className="pt-3">
              <h2 className="text-base font-semibold mb-2.5" style={{ color: '#1F2937' }}>Additional Information</h2>
              
              {/* Blood Type */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-2.5" style={{ backgroundColor: 'white' }}>
                <Droplets className="w-5 h-5" style={{ color: '#E8847C' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Blood Type :</span>
                <input
                  type="text"
                  placeholder="A+"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Previous Complication */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-2.5" style={{ backgroundColor: 'white' }}>
                <AlertCircle className="w-5 h-5" style={{ color: '#10B981' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Previous Complication:</span>
                <input
                  type="text"
                  placeholder="Nothing"
                  value={previousComplication}
                  onChange={(e) => setPreviousComplication(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Allergies */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-2.5" style={{ backgroundColor: 'white' }}>
                <Pill className="w-5 h-5" style={{ color: '#E8847C' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Allergies:</span>
                <input
                  type="text"
                  placeholder="Penicillin"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Hospital Names */}
              <div className="flex items-center gap-3 p-3 rounded-xl mb-2.5" style={{ backgroundColor: 'white' }}>
                <Building2 className="w-5 h-5" style={{ color: '#E8847C' }} />
                <span className="text-sm" style={{ color: '#6B7280' }}>Hospital Names:</span>
                <input
                  type="text"
                  placeholder="St. Mary's Hospital,Anand..."
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Notes */}
              <div className="rounded-xl p-3" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                  <span className="text-sm" style={{ color: '#6B7280' }}>Notes / Special Needs</span>
                </div>
                <textarea
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 resize-none h-12 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="w-full py-3.5 font-semibold rounded-xl mt-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#E8847C', color: 'white' }}
          >
            Save Details
          </button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default PersonalDetails;
