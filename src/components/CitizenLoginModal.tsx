import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Wallet, 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Award,
  ArrowRight
} from 'lucide-react';
import { CitizenProfile, CasteCategory, OccupationType, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { ALL_SCHEMES, evaluateSchemeEligibility } from '../data/schemesData';

interface CitizenLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizen: CitizenProfile | null;
  onSaveCitizen: (profile: CitizenProfile) => void;
  language: SupportedLanguage;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

const PRESET_CITIZENS: CitizenProfile[] = [
  {
    id: 'preset-ramesh',
    name: 'Ramesh Gowda',
    age: 46,
    gender: 'Male',
    caste: 'OBC',
    annualIncome: 140000,
    incomeBracket: '₹1 Lakh - ₹2.5 Lakh',
    state: 'Karnataka',
    district: 'Mandya',
    areaType: 'Rural',
    pincode: '571401',
    occupation: 'Farmer / Agriculture',
    hasLand: true,
    landAreaAcres: 2.5,
    hasRationCard: true,
    rationCardType: 'BPL (Below Poverty Line)',
    isDifferentlyAbled: false,
    isStudent: false,
    isSingleWomanOrWidow: false,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'preset-priya',
    name: 'Priya Kumari',
    age: 20,
    gender: 'Female',
    caste: 'SC',
    annualIncome: 180000,
    incomeBracket: '₹1 Lakh - ₹2.5 Lakh',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    areaType: 'Semi-Urban',
    pincode: '221002',
    occupation: 'Student / Aspirant',
    hasLand: false,
    hasRationCard: true,
    rationCardType: 'BPL (Below Poverty Line)',
    isDifferentlyAbled: false,
    isStudent: true,
    isSingleWomanOrWidow: false,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'preset-lakshmi',
    name: 'Lakshmi Ammal',
    age: 52,
    gender: 'Female',
    caste: 'OBC',
    annualIncome: 85000,
    incomeBracket: '< ₹1 Lakh',
    state: 'Tamil Nadu',
    district: 'Madurai',
    areaType: 'Rural',
    pincode: '625001',
    occupation: 'Artisan / Handloom Worker',
    hasLand: false,
    hasRationCard: true,
    rationCardType: 'AAY (Antyodaya)',
    isDifferentlyAbled: false,
    isStudent: false,
    isSingleWomanOrWidow: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'preset-rizwan',
    name: 'Mohammad Rizwan',
    age: 34,
    gender: 'Male',
    caste: 'Minority',
    annualIncome: 160000,
    incomeBracket: '₹1 Lakh - ₹2.5 Lakh',
    state: 'Telangana',
    district: 'Hyderabad',
    areaType: 'Urban',
    pincode: '500002',
    occupation: 'Small Business / Street Vendor',
    hasLand: false,
    hasRationCard: true,
    rationCardType: 'BPL (Below Poverty Line)',
    isDifferentlyAbled: false,
    isStudent: false,
    isSingleWomanOrWidow: false,
    lastUpdated: new Date().toISOString(),
  },
];

export const CitizenLoginModal: React.FC<CitizenLoginModalProps> = ({
  isOpen,
  onClose,
  citizen,
  onSaveCitizen,
  language,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [name, setName] = useState(citizen?.name || '');
  const [age, setAge] = useState<number>(citizen?.age || 38);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Transgender' | 'Other'>((citizen?.gender as any) || 'Male');
  const [caste, setCaste] = useState<CasteCategory>(citizen?.caste || 'OBC');
  const [annualIncome, setAnnualIncome] = useState<number>(citizen?.annualIncome || 150000);
  const [state, setState] = useState(citizen?.state || 'Karnataka');
  const [district, setDistrict] = useState(citizen?.district || 'Bengaluru');
  const [areaType, setAreaType] = useState<'Rural' | 'Urban' | 'Semi-Urban'>((citizen?.areaType as any) || 'Rural');
  const [pincode, setPincode] = useState(citizen?.pincode || '560001');
  const [occupation, setOccupation] = useState<OccupationType>((citizen?.occupation as any) || 'Farmer / Agriculture');
  const [hasLand, setHasLand] = useState(citizen?.hasLand ?? true);
  const [landAreaAcres, setLandAreaAcres] = useState<number>(citizen?.landAreaAcres || 2);
  const [hasRationCard, setHasRationCard] = useState(citizen?.hasRationCard ?? true);
  const [rationCardType, setRationCardType] = useState<'AAY (Antyodaya)' | 'BPL (Below Poverty Line)' | 'APL (Above Poverty Line)' | 'None'>(
    (citizen?.rationCardType as any) || 'BPL (Below Poverty Line)'
  );
  const [isDifferentlyAbled, setIsDifferentlyAbled] = useState(citizen?.isDifferentlyAbled || false);
  const [isStudent, setIsStudent] = useState(citizen?.isStudent || false);
  const [isSingleWomanOrWidow, setIsSingleWomanOrWidow] = useState(citizen?.isSingleWomanOrWidow || false);

  if (!isOpen) return null;

  // Calculate live preview of eligible schemes based on currently chosen inputs
  const currentDraftProfile: CitizenProfile = {
    id: citizen?.id || 'citizen-active',
    name: name.trim() || 'Citizen',
    age,
    gender,
    caste,
    annualIncome,
    incomeBracket:
      annualIncome < 100000
        ? '< ₹1 Lakh'
        : annualIncome <= 250000
        ? '₹1 Lakh - ₹2.5 Lakh'
        : annualIncome <= 500000
        ? '₹2.5 Lakh - ₹5 Lakh'
        : annualIncome <= 800000
        ? '₹5 Lakh - ₹8 Lakh'
        : '> ₹8 Lakh',
    state,
    district: district.trim() || 'General District',
    areaType,
    pincode: pincode.trim() || '110001',
    occupation,
    hasLand,
    landAreaAcres: hasLand ? landAreaAcres : 0,
    hasRationCard,
    rationCardType: hasRationCard ? rationCardType : 'None',
    isDifferentlyAbled,
    isStudent,
    isSingleWomanOrWidow,
    lastUpdated: new Date().toISOString(),
  };

  const eligibleCount = ALL_SCHEMES.filter(
    (s) => evaluateSchemeEligibility(s, currentDraftProfile).isEligible
  ).length;

  const handleApplyPreset = (preset: CitizenProfile) => {
    setName(preset.name);
    setAge(preset.age);
    setGender((preset.gender as any) || 'Male');
    setCaste(preset.caste);
    setAnnualIncome(preset.annualIncome);
    setState(preset.state);
    setDistrict(preset.district);
    setAreaType((preset.areaType as any) || 'Rural');
    setPincode(preset.pincode || '560001');
    setOccupation((preset.occupation as any) || 'Farmer / Agriculture');
    setHasLand(preset.hasLand ?? false);
    setLandAreaAcres(preset.landAreaAcres || 2);
    setHasRationCard(preset.hasRationCard ?? false);
    setRationCardType((preset.rationCardType as any) || 'BPL (Below Poverty Line)');
    setIsDifferentlyAbled(preset.isDifferentlyAbled ?? false);
    setIsStudent(preset.isStudent ?? false);
    setIsSingleWomanOrWidow(preset.isSingleWomanOrWidow ?? false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCitizen(currentDraftProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Digital Citizen Identity Pass</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {t.loginPrompt}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            {t.loginSubtitle}
          </p>

          {/* Live Eligibility Badge in Header */}
          <div className="mt-3 inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{eligibleCount}</strong> Government Schemes currently match this profile
            </span>
          </div>
        </div>

        {/* Quick Demo Presets */}
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t.quickPresets}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_CITIZENS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-2 rounded-xl border text-xs transition-all ${
                  name === preset.name
                    ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-xs ring-1 ring-orange-300'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold truncate">{preset.name}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  {preset.state} • {preset.occupation.split('/')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Personal & Demographic */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>Personal & Demographic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.age} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="110"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Male">Male / पुरुष</option>
                  <option value="Female">Female / महिला</option>
                  <option value="Transgender">Transgender / तृतीय लिंगी</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.category} *
                </label>
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value as CasteCategory)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="General">General (Unreserved)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="Minority">Minority Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.annualIncome} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    required
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Wallet className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                  ₹{annualIncome.toLocaleString('en-IN')} / year
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Residential Address */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Residential Address & Domicile</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.state} *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.district} *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g., Mandya"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.areaType}
                </label>
                <select
                  value={areaType}
                  onChange={(e) => setAreaType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Rural">Rural (Village / Gram)</option>
                  <option value="Urban">Urban (City / Town)</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Occupation & Livelihood Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              <span>Occupation & Socio-Economic Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.occupation} *
                </label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value as OccupationType)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Farmer / Agriculture">Farmer / Agriculture (किसान)</option>
                  <option value="Small Business / Street Vendor">Small Business / Street Vendor (रेहड़ी-पटरी विक्रेता)</option>
                  <option value="Daily Wage / Construction Worker">Daily Wage / Construction Worker (दैनिक वेतनभोगी/श्रमिक)</option>
                  <option value="Student / Aspirant">Student / Aspirant (विद्यार्थी)</option>
                  <option value="Artisan / Handloom Worker">Artisan / Handloom Worker (पारंपरिक कारीगर/शिल्पकार)</option>
                  <option value="Homemaker / Self-employed Woman">Homemaker / Self-employed Woman (गृहणी/महिला उद्यमी)</option>
                  <option value="Salaried / Private Employee">Salaried / Private Employee (निजी कर्मचारी)</option>
                  <option value="Government Employee">Government Employee (सरकारी कर्मचारी)</option>
                  <option value="Senior Citizen / Retired">Senior Citizen / Retired (वरिष्ठ नागरिक/सेवानिवृत्त)</option>
                  <option value="Unemployed Youth">Unemployed Youth (बेरोजगार युवा)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.rationCard}
                </label>
                <select
                  value={rationCardType}
                  onChange={(e) => setRationCardType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BPL (Below Poverty Line)">BPL (Below Poverty Line / Priority Card)</option>
                  <option value="AAY (Antyodaya)">AAY (Antyodaya Anna Yojana - Poorest of Poor)</option>
                  <option value="APL (Above Poverty Line)">APL (Above Poverty Line / Non-Priority)</option>
                  <option value="None">No Ration Card</option>
                </select>
              </div>
            </div>

            {/* Checkboxes & Special Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/80">
                <input
                  type="checkbox"
                  checked={hasLand}
                  onChange={(e) => setHasLand(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  {t.hasLand}
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/80">
                <input
                  type="checkbox"
                  checked={isDifferentlyAbled}
                  onChange={(e) => setIsDifferentlyAbled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  {t.differentlyAbled}
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/80">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  {t.studentStatus}
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/80">
                <input
                  type="checkbox"
                  checked={isSingleWomanOrWidow}
                  onChange={(e) => setIsSingleWomanOrWidow(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  {t.singleWoman}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Details saved locally on your device for instant scheme eligibility.</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all"
              >
                <span>{t.saveProfile}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
