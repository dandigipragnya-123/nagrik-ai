import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  MapPin,
  Briefcase,
  IndianRupee,
  GraduationCap,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { CitizenProfile, User as UserType, SupportedLanguage, CasteCategory, OccupationType } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface ProfilePageProps {
  user: UserType | null;
  citizen: CitizenProfile | null;
  language: SupportedLanguage;
  onSaveCitizen: (profile: CitizenProfile) => void;
  onNavigateToSchemes: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  citizen,
  language,
  onSaveCitizen,
  onNavigateToSchemes,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form editable state initialized from citizen
  const [name, setName] = useState(citizen?.name || user?.name || '');
  const [age, setAge] = useState<number>(citizen?.age || 32);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>(
    (citizen?.gender as any) || 'Male'
  );
  const [state, setState] = useState(citizen?.state || 'Karnataka');
  const [district, setDistrict] = useState(citizen?.district || 'Bengaluru Urban');
  const [areaType, setAreaType] = useState<'Rural' | 'Urban'>(
    citizen?.areaType === 'Rural' ? 'Rural' : 'Urban'
  );
  const [occupation, setOccupation] = useState<string>(
    (citizen?.occupation as string) || 'Farmer'
  );
  const [educationLevel, setEducationLevel] = useState(citizen?.educationLevel || 'Secondary (10th)');
  const [annualIncome, setAnnualIncome] = useState<number>(citizen?.annualIncome || 120000);
  const [caste, setCaste] = useState<CasteCategory>(citizen?.caste || 'OBC');
  const [isFarmer, setIsFarmer] = useState<boolean>(citizen?.isFarmer ?? true);
  const [hasDisability, setHasDisability] = useState<boolean>(citizen?.hasDisability ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: CitizenProfile = {
      id: citizen?.id || `cit-${Date.now()}`,
      name: name.trim(),
      age: Number(age),
      gender,
      state,
      district: district.trim(),
      areaType,
      occupation,
      educationLevel,
      annualIncome: Number(annualIncome),
      caste,
      isFarmer,
      hasDisability,
      residentialAddress: `${district}, ${state}`,
    };

    onSaveCitizen(updatedProfile);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl font-black shadow-md border-2 border-white ring-2 ring-orange-200">
              {name.charAt(0) || 'N'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{name || 'Citizen'}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Verified SQLite Account
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email || 'citizen@nagrik.in'}</span>
                <span>•</span>
                <span>ID: {citizen?.id || 'cit-ramesh-01'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Edit Demographic Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details successfully updated and saved into your SQLite database!</span>
          </div>
        )}
      </div>

      {/* Main Profile Details / Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-600" />
              <span>Demographic & Eligibility Details</span>
            </h2>
            <span className="text-xs text-slate-400">Used for scheme eligibility matching</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                />
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {name || '—'}
                </div>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  min={1}
                  max={120}
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                />
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {age} Years
                </div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
              {isEditing ? (
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {gender}
                </div>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">State / UT</label>
              {isEditing ? (
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {state}
                </div>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">District</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                />
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {district}
                </div>
              )}
            </div>

            {/* Area Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Area Type</label>
              {isEditing ? (
                <select
                  value={areaType}
                  onChange={(e) => setAreaType(e.target.value as 'Rural' | 'Urban')}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="Rural">Rural (Village / Gram Panchayat)</option>
                  <option value="Urban">Urban (City / Municipality)</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {areaType}
                </div>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Occupation</label>
              {isEditing ? (
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value as OccupationType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="Farmer">Farmer / Agriculture</option>
                  <option value="Student">Student</option>
                  <option value="Self-Employed">Self-Employed / Artisan / Vendor</option>
                  <option value="Daily Wage Laborer">Daily Wage Laborer / Construction</option>
                  <option value="Salaried Employee">Salaried Employee (Private / Public)</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired / Senior</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {occupation}
                </div>
              )}
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Education Level</label>
              {isEditing ? (
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="Below 10th">Below 10th</option>
                  <option value="Secondary (10th)">Secondary (10th)</option>
                  <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                  <option value="Diploma / ITI">Diploma / ITI</option>
                  <option value="Undergraduate">Undergraduate (College)</option>
                  <option value="Postgraduate & Above">Postgraduate & Above</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {educationLevel}
                </div>
              )}
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Annual Family Income</label>
              {isEditing ? (
                <input
                  type="number"
                  min={0}
                  step={5000}
                  required
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                />
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center space-x-1">
                  <span>₹{annualIncome.toLocaleString('en-IN')} / year</span>
                  <span className="text-[10px] text-slate-500">
                    ({annualIncome <= 100000 ? 'BPL' : annualIncome <= 300000 ? 'Low Income' : 'Middle Income'})
                  </span>
                </div>
              )}
            </div>

            {/* Social Category (Caste) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Social Category</label>
              {isEditing ? (
                <select
                  value={caste}
                  onChange={(e) => setCaste(e.target.value as CasteCategory)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {caste}
                </div>
              )}
            </div>

            {/* Farmer Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Agricultural Status</label>
              {isEditing ? (
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="farmer"
                      checked={isFarmer}
                      onChange={() => setIsFarmer(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Farmer / Landowner</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="farmer"
                      checked={!isFarmer}
                      onChange={() => setIsFarmer(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Non-farmer</span>
                  </label>
                </div>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {isFarmer ? 'Farmer / Cultivator' : 'Non-farmer'}
                </div>
              )}
            </div>

            {/* Disability Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Disability Status (Divyangjan)</label>
              {isEditing ? (
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="disability"
                      checked={hasDisability}
                      onChange={() => setHasDisability(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Yes (Eligible for Divyang quotas)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="disability"
                      checked={!hasDisability}
                      onChange={() => setHasDisability(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              ) : (
                <div className="text-sm font-bold text-slate-900 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  {hasDisability ? 'Person with Disability (Divyangjan)' : 'No Disability'}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes to SQLite</span>
              </button>
            </div>
          )}
        </form>

        {/* Civic Privacy Promise Card */}
        <div className="mt-8 bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-xs text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-blue-950">Strict Citizen Data Sovereignty & Confidentiality</h4>
            <p className="text-blue-800 leading-relaxed">
              Your demographic profile is stored exclusively within your local SQLite database (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">nagrik_database.sqlite</code>).
              It is used strictly to evaluate official criteria for welfare schemes. NagrikAI will never request your bank PIN or full Aadhaar OTP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
