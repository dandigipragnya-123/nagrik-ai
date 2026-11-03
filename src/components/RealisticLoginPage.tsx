import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Lock,
  UserCheck,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Globe,
  Building,
  CheckSquare,
  HelpCircle
} from 'lucide-react';
import { CitizenProfile, SupportedLanguage, CasteCategory, OccupationType } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { ALL_SCHEMES, evaluateSchemeEligibility } from '../data/schemesData';

interface RealisticLoginPageProps {
  onLoginSuccess: (citizen: CitizenProfile) => void;
  language: SupportedLanguage;
  onCancel?: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'
];

export const RealisticLoginPage: React.FC<RealisticLoginPageProps> = ({
  onLoginSuccess,
  language,
  onCancel,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [authMethod, setAuthMethod] = useState<'otp' | 'password' | 'register'>('otp');
  const [mobile, setMobile] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('citizen@123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);

  // Registration Form States
  const [regName, setRegName] = useState('Ramesh Gowda');
  const [regMobile, setRegMobile] = useState('9876543210');
  const [regAge, setRegAge] = useState<number>(46);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Transgender' | 'Other'>('Male');
  const [regCaste, setRegCaste] = useState<CasteCategory>('OBC');
  const [regIncome, setRegIncome] = useState<number>(140000);
  const [regState, setRegState] = useState('Karnataka');
  const [regDistrict, setRegDistrict] = useState('Mandya');
  const [regAreaType, setRegAreaType] = useState<'Rural' | 'Urban' | 'Semi-Urban'>('Rural');
  const [regPincode, setRegPincode] = useState('571401');
  const [regOccupation, setRegOccupation] = useState<OccupationType>('Farmer / Agriculture');
  const [regHasLand, setRegHasLand] = useState(true);
  const [regLandAcres, setRegLandAcres] = useState<number>(2.5);
  const [regHasRationCard, setRegHasRationCard] = useState(true);
  const [regRationCardType, setRegRationCardType] = useState<'AAY (Antyodaya)' | 'BPL (Below Poverty Line)' | 'APL (Above Poverty Line)' | 'None'>('BPL (Below Poverty Line)');
  const [regIsDifferentlyAbled, setRegIsDifferentlyAbled] = useState(false);
  const [regIsStudent, setRegIsStudent] = useState(false);
  const [regIsSingleWomanOrWidow, setRegIsSingleWomanOrWidow] = useState(false);

  // 1. Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setSimulatedOtpNotice(data.simulatedOtp);
        setOtp(data.simulatedOtp || '123456');
        setSuccessMessage(data.message);
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with SQLite backend.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.registered && data.citizen) {
          onLoginSuccess(data.citizen);
        } else {
          // Switch to registration tab with mobile pre-filled
          setRegMobile(data.mobile);
          setAuthMethod('register');
          setSuccessMessage('Mobile verified! Please confirm your citizen demographic details to store in SQLite.');
        }
      } else {
        throw new Error(data.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: mobile, password }),
      });
      const data = await res.json();

      if (data.success && data.citizen) {
        onLoginSuccess(data.citizen);
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // 4. Register Citizen in SQLite
  const handleRegisterCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const newCitizenProfile = {
      name: regName,
      mobile: regMobile,
      password: 'citizen@123',
      age: regAge,
      gender: regGender,
      caste: regCaste,
      annualIncome: regIncome,
      state: regState,
      district: regDistrict,
      areaType: regAreaType,
      pincode: regPincode,
      occupation: regOccupation,
      hasLand: regHasLand,
      landAreaAcres: regHasLand ? regLandAcres : 0,
      hasRationCard: regHasRationCard,
      rationCardType: regHasRationCard ? regRationCardType : 'None',
      isDifferentlyAbled: regIsDifferentlyAbled,
      isStudent: regIsStudent,
      isSingleWomanOrWidow: regIsSingleWomanOrWidow,
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCitizenProfile),
      });
      const data = await res.json();

      if (data.success && data.citizen) {
        onLoginSuccess(data.citizen);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving to SQLite database.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click test preset
  const handleQuickDemoCitizen = (presetMobile: string, presetName: string) => {
    setMobile(presetMobile);
    setAuthMethod('otp');
    setOtpSent(false);
    setSuccessMessage(`Selected ${presetName} (+91 ${presetMobile}). Click "Request OTP" to authenticate from SQLite.`);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Official Civic Banner */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Top Tiranga Strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

        {/* Portal SSO Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-md ring-2 ring-white/20">
                ना
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                    Meri Pehchaan • Jan Parichay SSO
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    SQLite Active
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                  Citizen Digital Gateway & Scheme Pass
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  National Single Sign-On for citizen welfare schemes, document simplification, and automated eligibility verification.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-2 rounded-xl shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Auth Method Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-3 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              setAuthMethod('otp');
              setErrorMessage(null);
            }}
            className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all ${
              authMethod === 'otp'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>Mobile OTP Login (मोबाईल ओटीपी)</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('password');
              setErrorMessage(null);
            }}
            className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all ${
              authMethod === 'password'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Citizen ID & Password</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('register');
              setErrorMessage(null);
            }}
            className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-all ${
              authMethod === 'register'
                ? 'border-orange-600 text-orange-900 bg-white rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Register New Nagrik (नया पंजीकरण)</span>
          </button>
        </div>

        {/* Messages & Alerts */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Mobile & OTP Flow */}
        {authMethod === 'otp' && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter Registered 10-Digit Mobile Number *
                    </label>
                    <div className="flex rounded-xl shadow-xs border border-stone-300 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                      <span className="inline-flex items-center px-3.5 bg-stone-100 text-slate-700 font-bold text-sm border-r border-stone-300">
                        +91 (IND)
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="flex-1 px-3.5 py-3 text-sm font-semibold text-slate-900 bg-white focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      A 6-digit Aadhaar / Digital Identity OTP will be dispatched to this number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobile.length < 10}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Generate One-Time Password (OTP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
                    <span>OTP sent to: <strong>+91 {mobile}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-orange-700 font-bold hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full tracking-widest text-center text-xl font-mono font-bold px-3 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                      <span>Resend OTP in <strong>45s</strong></span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Open Citizen Portal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Pre-seeded SQLite Citizens for quick test */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pre-Seeded SQLite Citizens</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Click any citizen profile stored in our SQLite database to auto-fill their credentials:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoCitizen('9876543210', 'Ramesh Gowda')}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all text-xs"
                >
                  <div className="font-bold text-slate-900">Ramesh Gowda (Farmer)</div>
                  <div className="text-[10px] text-slate-500">Karnataka • Mandya • 9876543210</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">PM-KISAN & KCC Eligible</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoCitizen('9812345678', 'Priya Kumari')}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all text-xs"
                >
                  <div className="font-bold text-slate-900">Priya Kumari (SC Student)</div>
                  <div className="text-[10px] text-slate-500">Uttar Pradesh • Varanasi • 9812345678</div>
                  <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Post-Matric Scholarship</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoCitizen('9944556677', 'Lakshmi Ammal')}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all text-xs"
                >
                  <div className="font-bold text-slate-900">Lakshmi Ammal (Artisan & Widow)</div>
                  <div className="text-[10px] text-slate-500">Tamil Nadu • Madurai • 9944556677</div>
                  <div className="text-[10px] text-blue-600 font-semibold mt-0.5">KMUT & Vishwakarma Eligible</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoCitizen('9700112233', 'Mohammad Rizwan')}
                  className="w-full text-left p-2.5 rounded-xl bg-white border border-stone-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all text-xs"
                >
                  <div className="font-bold text-slate-900">Mohammad Rizwan (Street Vendor)</div>
                  <div className="text-[10px] text-slate-500">Telangana • Hyderabad • 9700112233</div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">PM SVANidhi Microloan</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Password Login Flow */}
        {authMethod === 'password' && (
          <div className="p-6 sm:p-8 max-w-md mx-auto">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number or Citizen ID *
                </label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210 or cit-ramesh-01"
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Citizen Portal Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  Default test password for all seeded accounts is <strong className="text-slate-800">citizen@123</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Log In to NagrikAI'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Citizen Demographic Registration (stored in SQLite) */}
        {authMethod === 'register' && (
          <form onSubmit={handleRegisterCitizen} className="p-6 sm:p-8 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center space-x-2 text-xs text-emerald-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Your demographic information will be securely saved into the local SQLite database to automatically calculate scheme eligibility.
              </span>
            </div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name (as per Aadhaar) *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="110"
                  required
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={regGender}
                  onChange={(e) => setRegGender(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Male">Male / पुरुष</option>
                  <option value="Female">Female / महिला</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Social Category / Caste *
                </label>
                <select
                  value={regCaste}
                  onChange={(e) => setRegCaste(e.target.value as CasteCategory)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Family Income (₹) *
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  required
                  value={regIncome}
                  onChange={(e) => setRegIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <div className="text-[10px] text-slate-500 mt-0.5">
                  ₹{regIncome.toLocaleString('en-IN')} / year
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / UT *
                </label>
                <select
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
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
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Area Type
                </label>
                <select
                  value={regAreaType}
                  onChange={(e) => setRegAreaType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Rural">Rural (Village / Gram)</option>
                  <option value="Urban">Urban (City / Town)</option>
                  <option value="Semi-Urban">Semi-Urban</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={regPincode}
                  onChange={(e) => setRegPincode(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Occupation *
                </label>
                <select
                  value={regOccupation}
                  onChange={(e) => setRegOccupation(e.target.value as OccupationType)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Farmer / Agriculture">Farmer / Agriculture (किसान)</option>
                  <option value="Small Business / Street Vendor">Small Business / Street Vendor</option>
                  <option value="Daily Wage / Construction Worker">Daily Wage / Construction Worker</option>
                  <option value="Student / Aspirant">Student / Aspirant</option>
                  <option value="Artisan / Handloom Worker">Artisan / Handloom Worker</option>
                  <option value="Homemaker / Self-employed Woman">Homemaker / Self-employed Woman</option>
                  <option value="Salaried / Private Employee">Salaried / Private Employee</option>
                  <option value="Senior Citizen / Retired">Senior Citizen / Retired</option>
                  <option value="Unemployed Youth">Unemployed Youth</option>
                </select>
              </div>
            </div>

            {/* Special checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-100">
              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regHasLand}
                  onChange={(e) => setRegHasLand(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-medium text-slate-700">
                  Owns agricultural land (for PM-KISAN & credit)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regHasRationCard}
                  onChange={(e) => setRegHasRationCard(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-medium text-slate-700">
                  Holds Ration Card (BPL / Antyodaya / Priority)
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regIsStudent}
                  onChange={(e) => setRegIsStudent(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-medium text-slate-700">
                  Currently Enrolled Student / Aspirant
                </span>
              </label>

              <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regIsSingleWomanOrWidow}
                  onChange={(e) => setRegIsSingleWomanOrWidow(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-medium text-slate-700">
                  Widow or Single Woman Household Head
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-slate-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Save to SQLite & Check Eligibility</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
