import React, { useState } from 'react';
import {
  Landmark,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookmarkPlus,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Building,
  Calendar,
  FileCheck,
  Info,
  RefreshCw,
  X
} from 'lucide-react';
import {
  CitizenProfile,
  SupportedLanguage,
  SchemeEligibilityForm,
  CasteCategory,
  OccupationType,
  Scheme,
  SavedScheme
} from '../types';
import { ALL_SCHEMES, evaluateSchemeEligibility, SchemeMatchResult } from '../data/schemesData';
import { UI_TRANSLATIONS } from '../data/translations';

interface SchemeEligibilityWorkflowProps {
  citizen: CitizenProfile | null;
  onUpdateCitizenProfile: (profile: CitizenProfile) => void;
  onSaveScheme: (scheme: Scheme, status: 'Likely Eligible' | 'May Be Eligible' | 'Not Eligible') => void;
  language: SupportedLanguage;
  onBackToDashboard: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export const SchemeEligibilityWorkflow: React.FC<SchemeEligibilityWorkflowProps> = ({
  citizen,
  onUpdateCitizenProfile,
  onSaveScheme,
  language,
  onBackToDashboard,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [showResults, setShowResults] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'likely' | 'verification' | 'notEligible'>('likely');
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<SchemeMatchResult | null>(null);
  const [savedSuccessNotice, setSavedSuccessNotice] = useState<string | null>(null);

  // Form State initialized from citizen profile
  const [formData, setFormData] = useState<SchemeEligibilityForm>({
    age: citizen?.age || 38,
    gender: (citizen?.gender as any) || 'Male',
    state: citizen?.state || 'Karnataka',
    district: citizen?.district || 'Mandya',
    areaType: (citizen?.areaType as any) || 'Rural',

    occupation: (citizen?.occupation as any) || 'Farmer / Agriculture',
    educationLevel: 'Graduate / Degree',
    institutionType: 'Government',

    annualIncome: citizen?.annualIncome || 140000,
    incomeCategory: (citizen?.incomeBracket as any) || '₹1 Lakh - ₹2.5 Lakh',
    caste: citizen?.caste || 'OBC',

    hasLand: citizen?.hasLand ?? true,
    landAreaAcres: citizen?.landAreaAcres || 2,
    hasRationCard: citizen?.hasRationCard ?? true,
    rationCardType: (citizen?.rationCardType as any) || 'BPL (Below Poverty Line)',
    isDifferentlyAbled: citizen?.isDifferentlyAbled || false,
    isSingleWomanOrWidow: citizen?.isSingleWomanOrWidow || false,
  });

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else {
      // Complete & analyze!
      const updatedProfile: CitizenProfile = {
        id: citizen?.id || 'cit-active',
        name: citizen?.name || 'Citizen',
        email: citizen?.email,
        mobile: citizen?.mobile,
        age: formData.age,
        gender: formData.gender === 'Prefer not to say' ? 'Other' : formData.gender,
        caste: formData.caste,
        annualIncome: formData.annualIncome,
        incomeBracket: formData.incomeCategory,
        state: formData.state,
        district: formData.district,
        areaType: formData.areaType,
        pincode: citizen?.pincode || '560001',
        occupation: formData.occupation,
        educationLevel: formData.educationLevel,
        hasLand: formData.hasLand,
        landAreaAcres: formData.landAreaAcres,
        hasRationCard: formData.hasRationCard,
        rationCardType: formData.rationCardType,
        isDifferentlyAbled: formData.isDifferentlyAbled,
        isStudent: formData.occupation === 'Student / Aspirant',
        isSingleWomanOrWidow: formData.isSingleWomanOrWidow,
        lastUpdated: new Date().toISOString(),
      };

      onUpdateCitizenProfile(updatedProfile);
      setShowResults(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    } else {
      onBackToDashboard();
    }
  };

  // Convert current form to a profile structure for scheme evaluation
  const profileForEvaluation: CitizenProfile = {
    id: citizen?.id || 'cit-temp',
    name: citizen?.name || 'Citizen',
    age: formData.age,
    gender: formData.gender === 'Prefer not to say' ? 'Other' : formData.gender,
    caste: formData.caste,
    annualIncome: formData.annualIncome,
    incomeBracket: formData.incomeCategory,
    state: formData.state,
    district: formData.district,
    areaType: formData.areaType,
    pincode: citizen?.pincode || '560001',
    occupation: formData.occupation,
    hasLand: formData.hasLand,
    landAreaAcres: formData.landAreaAcres,
    hasRationCard: formData.hasRationCard,
    rationCardType: formData.rationCardType,
    isDifferentlyAbled: formData.isDifferentlyAbled,
    isStudent: formData.occupation === 'Student / Aspirant',
    isSingleWomanOrWidow: formData.isSingleWomanOrWidow,
    lastUpdated: new Date().toISOString(),
  };

  // Evaluate schemes into 3 distinct categories
  const allEvaluations = ALL_SCHEMES.map((s) => evaluateSchemeEligibility(s, profileForEvaluation));

  const likelyEligible = allEvaluations.filter((m) => m.isEligible && m.matchScore >= 90);
  const needsVerification = allEvaluations.filter((m) => !m.isEligible && m.matchScore >= 50);
  const notEligible = allEvaluations.filter((m) => m.matchScore < 50);

  const handleSaveToActivity = (scheme: Scheme, status: 'Likely Eligible' | 'May Be Eligible' | 'Not Eligible') => {
    onSaveScheme(scheme, status);
    setSavedSuccessNotice(`"${scheme.title}" has been saved to your activity list.`);
    setTimeout(() => setSavedSuccessNotice(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={showResults ? () => setShowResults(false) : onBackToDashboard}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{showResults ? 'Edit My Details' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Guaranteed: No Aadhaar or Bank details requested</span>
        </div>
      </div>

      {savedSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedSuccessNotice}</span>
        </div>
      )}

      {/* Workflow Step Forms */}
      {!showResults ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md space-y-6">
          {/* Progress Indicator */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-blue-900 uppercase tracking-wider">
                Step {step} of 4: {step === 1 ? 'Personal Details' : step === 2 ? 'Education & Occupation' : step === 3 ? 'Financial Information' : 'Additional Priorities'}
              </span>
              <span className="text-slate-500">{step * 25}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-900 to-teal-600 transition-all duration-300 rounded-full"
                style={{ width: `${step * 25}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Age and location determine eligibility for state and central government schemes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Age (years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender (optional)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State / Union Territory *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g., Mandya, Varanasi, Madurai"
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Area Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Rural', 'Urban', 'Semi-Urban'].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setFormData({ ...formData, areaType: area as any })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.areaType === area
                            ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                        }`}
                      >
                        {area === 'Rural' ? 'Rural (Village)' : area === 'Urban' ? 'Urban (City)' : 'Semi-Urban'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education and Occupation */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">Education & Occupation</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Helps identify occupational subsidies (Kisan, Street Vendor, Artisan) or student scholarships.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Occupation *
                  </label>
                  <select
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value as OccupationType })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Farmer / Agriculture">Farmer / Agriculture (किसान)</option>
                    <option value="Small Business / Street Vendor">Small Business / Street Vendor (रेहड़ी-पटरी)</option>
                    <option value="Daily Wage / Construction Worker">Daily Wage / Construction Worker (दैनिक वेतनभोगी)</option>
                    <option value="Student / Aspirant">Student / Aspirant (विद्यार्थी)</option>
                    <option value="Artisan / Handloom Worker">Artisan / Handloom Worker (पारंपरिक कारीगर)</option>
                    <option value="Homemaker / Self-employed Woman">Homemaker / Self-employed Woman (गृहणी)</option>
                    <option value="Salaried / Private Employee">Salaried / Private Employee (निजी कर्मचारी)</option>
                    <option value="Government Employee">Government Employee (सरकारी कर्मचारी)</option>
                    <option value="Senior Citizen / Retired">Senior Citizen / Retired (वरिष्ठ नागरिक)</option>
                    <option value="Unemployed Youth">Unemployed Youth (बेरोजगार युवा)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Highest Education Level Completed / Pursuing
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="School / 10th / 12th">School (Class 1 to 12)</option>
                    <option value="Diploma / ITI">Diploma / ITI / Vocational Course</option>
                    <option value="Graduate / Degree">Graduate / Bachelor’s Degree</option>
                    <option value="Post-Graduate">Post-Graduate / Professional Master’s</option>
                    <option value="None / Informal">None / Informal Literacy</option>
                  </select>
                </div>

                {formData.occupation === 'Student / Aspirant' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Institution Type
                    </label>
                    <select
                      value={formData.institutionType}
                      onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Government">Government College / School</option>
                      <option value="Government-Aided">Government-Aided Institution</option>
                      <option value="Private">Private Recognized College</option>
                      <option value="Competitive Exam Aspirant">Competitive Examination Aspirant</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">Financial Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Income limits and constitutional categories define welfare entitlements.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Annual Family Income (₹) *
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    required
                    value={formData.annualIncome}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const bracket =
                        val < 100000
                          ? '< ₹1 Lakh'
                          : val <= 250000
                          ? '₹1 Lakh - ₹2.5 Lakh'
                          : val <= 500000
                          ? '₹2.5 Lakh - ₹5 Lakh'
                          : val <= 800000
                          ? '₹5 Lakh - ₹8 Lakh'
                          : '> ₹8 Lakh';
                      setFormData({ ...formData, annualIncome: val, incomeCategory: bracket });
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="text-xs text-emerald-700 font-bold mt-1">
                    ₹{formData.annualIncome.toLocaleString('en-IN')} / year ({formData.incomeCategory})
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Social Category / Caste *
                    </label>
                  </div>

                  <select
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value as CasteCategory })}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Community</option>
                  </select>

                  <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Why we ask this:</strong> Central and State guidelines reserve specific welfare benefits and fee concessions for SC, ST, OBC, EWS, and minority citizens.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information (Optional) */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">Additional Priorities (Optional)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These optional details unlock specialized agricultural, food security, and disability subsidies.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={formData.hasLand}
                    onChange={(e) => setFormData({ ...formData, hasLand: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      Do you or your family own cultivable agricultural land?
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Required for PM-KISAN, Kisan Credit Card, and crop damage relief schemes.
                    </p>
                  </div>
                </label>

                {formData.hasLand && (
                  <div className="pl-7">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cultivable Land Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={formData.landAreaAcres}
                      onChange={(e) => setFormData({ ...formData, landAreaAcres: Number(e.target.value) })}
                      className="w-36 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                    />
                  </div>
                )}

                <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={formData.hasRationCard}
                    onChange={(e) => setFormData({ ...formData, hasRationCard: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Does your family hold a government Ration Card?
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Unlocks Ayushman Bharat ₹5 Lakh health cover and subsidized food rations.
                    </p>
                    {formData.hasRationCard && (
                      <select
                        value={formData.rationCardType}
                        onChange={(e) => setFormData({ ...formData, rationCardType: e.target.value as any })}
                        className="mt-2 text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5"
                      >
                        <option value="BPL (Below Poverty Line)">BPL (Below Poverty Line / Priority Card)</option>
                        <option value="AAY (Antyodaya)">AAY (Antyodaya Anna Yojana - Poorest of Poor)</option>
                        <option value="APL (Above Poverty Line)">APL (Above Poverty Line)</option>
                      </select>
                    )}
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={formData.isDifferentlyAbled}
                    onChange={(e) => setFormData({ ...formData, isDifferentlyAbled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      Person with Disability (Divyangjan)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Qualifies for special disability pensions, aids & assistive technology grants.
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={formData.isSingleWomanOrWidow}
                    onChange={(e) => setFormData({ ...formData, isSingleWomanOrWidow: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      Widow or Single Woman Family Head
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Qualifies for direct monthly basic income transfers (e.g. Gruha Lakshmi, KMUT).
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Form Controls */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-stone-50 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-md active:scale-95 transition-all"
            >
              <span>{step === 4 ? 'Submit & Analyze Eligibility' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View: 3 Clear Categories */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Results Summary Card */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Automated Eligibility Analysis
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  Your Government Scheme Results
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Matched against your age ({formData.age} yrs), state ({formData.state}), income (₹{formData.annualIncome.toLocaleString('en-IN')}), and category ({formData.caste}).
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase">Likely Eligible</div>
                  <div className="text-xl font-black text-emerald-400 leading-none">
                    {likelyEligible.length} Schemes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Categorized Tabs */}
          <div className="grid grid-cols-3 border-b border-stone-200 bg-white p-1.5 rounded-2xl shadow-xs text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveResultTab('likely')}
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                activeResultTab === 'likely'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Likely Eligible</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeResultTab === 'likely' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {likelyEligible.length}
              </span>
            </button>

            <button
              onClick={() => setActiveResultTab('verification')}
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                activeResultTab === 'verification'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Needs Verification</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeResultTab === 'verification' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {needsVerification.length}
              </span>
            </button>

            <button
              onClick={() => setActiveResultTab('notEligible')}
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                activeResultTab === 'notEligible'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Not Eligible</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeResultTab === 'notEligible' ? 'bg-white/20 text-white' : 'bg-stone-100 text-slate-700'}`}>
                {notEligible.length}
              </span>
            </button>
          </div>

          {/* Scheme Cards Display */}
          <div className="space-y-4">
            {(activeResultTab === 'likely'
              ? likelyEligible
              : activeResultTab === 'verification'
              ? needsVerification
              : notEligible
            ).map(({ scheme, isEligible, reasons, missingCriteria }) => {
              const statusLabel =
                activeResultTab === 'likely'
                  ? 'Likely Eligible'
                  : activeResultTab === 'verification'
                  ? 'May Be Eligible'
                  : 'Not Eligible';

              return (
                <div
                  key={scheme.id}
                  className={`bg-white rounded-3xl p-6 border transition-all shadow-xs ${
                    activeResultTab === 'likely'
                      ? 'border-emerald-300 hover:border-emerald-500'
                      : activeResultTab === 'verification'
                      ? 'border-amber-300 hover:border-amber-500'
                      : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-slate-700">
                          {scheme.level === 'Central' ? 'Central Government' : `${scheme.applicableStates?.[0] || 'State'} Government`}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-50 text-blue-800">
                          {scheme.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            activeResultTab === 'likely'
                              ? 'bg-emerald-100 text-emerald-800'
                              : activeResultTab === 'verification'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-slate-600'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {scheme.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {scheme.ministryOrState}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSaveToActivity(scheme, statusLabel)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-slate-700 shrink-0 self-start sm:self-auto"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Save Scheme</span>
                    </button>
                  </div>

                  {/* Financial Benefit Callout */}
                  <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Main Benefit
                      </span>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-950 mt-0.5">
                        {scheme.financialBenefit}
                      </div>
                    </div>
                    {scheme.applicationDeadline && (
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Application Deadline
                        </span>
                        <div className="text-xs font-bold text-red-600 mt-0.5">
                          {scheme.applicationDeadline}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reasons or missing criteria */}
                  <div className="mt-4 space-y-1 text-xs">
                    {activeResultTab === 'likely' && reasons.slice(0, 2).map((r, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}

                    {activeResultTab === 'verification' && missingCriteria.slice(0, 2).map((m, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-amber-800">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span>Needs verification: {m}</span>
                      </div>
                    ))}

                    {activeResultTab === 'notEligible' && missingCriteria.slice(0, 2).map((m, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-slate-500">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Verified from official source: {scheme.lastVerifiedDate}
                    </span>

                    <button
                      onClick={() => setSelectedSchemeDetail({ scheme, isEligible, matchScore: 100, reasons, missingCriteria })}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>View All Requirements & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Disclaimer Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Official Civic Notice:</strong> NagrikAI helps you understand government documents and services. It does not replace government authorities, legal professionals, or official eligibility decisions. Eligibility calculation does not guarantee scheme sanction or approval; final grant is determined by the competent department upon physical document verification.
            </p>
          </div>
        </div>
      )}

      {/* Deep-Dive Scheme Detail Modal */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedSchemeDetail(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/10 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {selectedSchemeDetail.scheme.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {selectedSchemeDetail.scheme.title}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedSchemeDetail.scheme.ministryOrState}
              </p>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Who Can Apply */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Who Can Apply
                </h4>
                <p className="text-xs text-slate-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {selectedSchemeDetail.scheme.whoCanApply || selectedSchemeDetail.scheme.summary}
                </p>
              </div>

              {/* Main Benefits */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Main Benefits & Financial Assistance
                </h4>
                <div className="text-sm font-bold text-emerald-950 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {selectedSchemeDetail.scheme.financialBenefit}
                </div>
              </div>

              {/* Documents Required */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Documents Required Checklist
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedSchemeDetail.scheme.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center space-x-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                      <FileCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Apply Step by Step */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  How to Apply – Step-by-Step
                </h4>
                <div className="space-y-2">
                  {selectedSchemeDetail.scheme.applicationProcess.steps.map((st, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-700 flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadline & Official Portal */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-950">Official Source:</span>
                  <div className="text-blue-700 font-mono text-[11px]">
                    {selectedSchemeDetail.scheme.officialSource}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Verified: {selectedSchemeDetail.scheme.lastVerifiedDate}
                </span>
              </div>
            </div>

            <div className="p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleSaveToActivity(selectedSchemeDetail.scheme, 'Likely Eligible');
                  setSelectedSchemeDetail(null);
                }}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-slate-700 hover:bg-white"
              >
                Save to My Activity
              </button>

              {selectedSchemeDetail.scheme.applicationProcess.onlineUrl && (
                <a
                  href={selectedSchemeDetail.scheme.applicationProcess.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-950 hover:bg-slate-900 text-white text-xs font-bold shadow-xs"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
