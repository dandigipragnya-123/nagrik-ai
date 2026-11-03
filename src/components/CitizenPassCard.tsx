import React from 'react';
import { 
  Award, 
  MapPin, 
  User, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  ArrowRight,
  Landmark,
  BadgeCheck
} from 'lucide-react';
import { CitizenProfile, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { ALL_SCHEMES, evaluateSchemeEligibility } from '../data/schemesData';

interface CitizenPassCardProps {
  citizen: CitizenProfile | null;
  onOpenEdit: () => void;
  onViewSchemes: () => void;
  language: SupportedLanguage;
}

export const CitizenPassCard: React.FC<CitizenPassCardProps> = ({
  citizen,
  onOpenEdit,
  onViewSchemes,
  language,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  if (!citizen) {
    return (
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-blue-800">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0 border border-white/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Citizen Profile Required
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {t.loginPrompt}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                {t.loginSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEdit}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all shrink-0"
          >
            <span>{t.loginPrompt}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const eligibleCount = ALL_SCHEMES.filter(
    (s) => evaluateSchemeEligibility(s, citizen).isEligible
  ).length;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
      {/* Subtle Tiranga corner accents */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        {/* Citizen Identity Details */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-white/20">
              {citizen.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-xs" title="Demographic Verified">
              <BadgeCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {citizen.name}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-orange-500/20 text-orange-300 border border-orange-400/30">
                {citizen.caste} Category
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Age: {citizen.age} yrs
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{citizen.district}, {citizen.state} ({citizen.areaType})</span>
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="text-amber-300 font-medium">
                {citizen.occupation.split('/')[0]}
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="text-slate-300">
                Income: ₹{citizen.annualIncome.toLocaleString('en-IN')}/yr
              </span>
            </div>
          </div>
        </div>

        {/* Live Matched Schemes Widget & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/5 p-2 sm:p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-slate-300 font-medium">
                {t.eligibleSchemes}
              </div>
              <div className="text-lg font-extrabold text-emerald-400 leading-none">
                {eligibleCount}{' '}
                <span className="text-xs font-semibold text-slate-400">
                  / {ALL_SCHEMES.length} schemes
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={onViewSchemes}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>View Schemes</span>
            </button>

            <button
              onClick={onOpenEdit}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Edit Citizen Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
