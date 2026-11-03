import React, { useState } from 'react';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  IndianRupee,
  Calendar,
  FileCheck,
  Building,
  UserCheck,
  Sparkles,
  ChevronRight,
  Info,
  ShieldCheck,
  X,
  Share2
} from 'lucide-react';
import { Scheme, CitizenProfile, SupportedLanguage } from '../types';
import { ALL_SCHEMES, evaluateSchemeEligibility, SchemeMatchResult } from '../data/schemesData';
import { UI_TRANSLATIONS } from '../data/translations';

interface SchemeFinderProps {
  citizen: CitizenProfile | null;
  language: SupportedLanguage;
  onOpenLogin: () => void;
  onTrackScheme: (schemeName: string) => void;
}

export const SchemeFinder: React.FC<SchemeFinderProps> = ({
  citizen,
  language,
  onOpenLogin,
  onTrackScheme,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'eligible' | 'central' | 'state'>('eligible');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalScheme, setActiveModalScheme] = useState<SchemeMatchResult | null>(null);

  // Evaluate all schemes with the citizen profile
  const schemeMatches: SchemeMatchResult[] = ALL_SCHEMES.map((scheme) =>
    evaluateSchemeEligibility(scheme, citizen)
  );

  const categories = [
    'All',
    'Agriculture & Farming',
    'Healthcare & Insurance',
    'Education & Scholarships',
    'Housing & Sanitation',
    'Women & Child Development',
    'Financial Inclusion & Business',
    'Social Security & Pension',
  ];

  // Filtering
  const filteredMatches = schemeMatches.filter(({ scheme, isEligible }) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${scheme.title} ${scheme.ministryOrState} ${scheme.summary} ${scheme.category}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Filter Type
    if (filterType === 'eligible' && !isEligible) return false;
    if (filterType === 'central' && scheme.level !== 'Central') return false;
    if (filterType === 'state' && scheme.level !== 'State') return false;

    // Category
    if (selectedCategory !== 'All' && scheme.category !== selectedCategory) return false;

    return true;
  });

  const eligibleCount = schemeMatches.filter((m) => m.isEligible).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Landmark className="w-4 h-4" />
              <span>National Welfare Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {t.schemeFinderTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {t.schemeFinderSubtitle}
            </p>
          </div>

          {!citizen && (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 self-start lg:self-auto"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.loginPrompt}</span>
            </button>
          )}
        </div>

        {/* Search & Quick Filter Pills */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name e.g., PM-KISAN, Ayushman, Post-Matric Scholarship, Gruha Lakshmi..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Level & Match Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilterType('eligible')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'eligible'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.filterEligible} ({eligibleCount})</span>
              </button>

              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {t.filterAll} ({ALL_SCHEMES.length})
              </button>

              <button
                onClick={() => setFilterType('central')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'central'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {t.filterCentral}
              </button>

              <button
                onClick={() => setFilterType('state')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'state'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {t.filterState}
              </button>
            </div>

            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map(({ scheme, isEligible, reasons, missingCriteria }) => (
          <div
            key={scheme.id}
            className={`rounded-2xl p-5 border flex flex-col justify-between transition-all bg-white shadow-xs hover:shadow-md ${
              isEligible
                ? 'border-emerald-300 ring-1 ring-emerald-200/60'
                : 'border-stone-200'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700">
                  {scheme.level === 'Central' ? 'Central Scheme' : `${scheme.applicableStates?.[0] || 'State'} Scheme`}
                </span>

                {isEligible ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Eligible</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-slate-500">
                    <Info className="w-3 h-3" />
                    <span>Criteria Mismatch</span>
                  </span>
                )}
              </div>

              {/* Title & Ministry */}
              <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
                {scheme.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-medium">
                {scheme.ministryOrState}
              </p>

              {/* Financial Benefit Badge */}
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Assistance Value:
                </div>
                <div className="text-xs font-extrabold text-emerald-950 mt-0.5">
                  {scheme.financialBenefit}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {scheme.summary}
              </p>

              {/* Eligibility Preview Pill */}
              <div className="mt-3 text-xs">
                {isEligible ? (
                  <div className="text-emerald-700 bg-emerald-50/60 p-2 rounded-lg text-[11px] font-medium border border-emerald-100">
                    ✓ {reasons[0]}
                  </div>
                ) : (
                  <div className="text-slate-500 bg-stone-50 p-2 rounded-lg text-[11px] font-medium border border-stone-200">
                    ⚠️ {missingCriteria[0] || 'Requires profile review'}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-medium">
                Verified: {scheme.lastVerifiedDate}
              </span>

              <button
                onClick={() => setActiveModalScheme({ scheme, isEligible, matchScore: 100, reasons, missingCriteria })}
                className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>View Details & Apply</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
          <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No schemes found matching this filter</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your search query or selecting "All Schemes" tab.
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-stone-100 text-xs font-semibold text-slate-700 hover:bg-stone-200"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-5 sm:p-6 relative">
              <button
                onClick={() => setActiveModalScheme(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Landmark className="w-4 h-4" />
                <span>{activeModalScheme.scheme.category}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeModalScheme.scheme.title}
              </h2>

              <p className="text-xs text-slate-300 mt-1">
                {activeModalScheme.scheme.ministryOrState}
              </p>

              {/* Status Banner */}
              <div className="mt-3 flex items-center space-x-2">
                {activeModalScheme.isEligible ? (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>You are fully eligible based on your Citizen Pass!</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Check eligibility criteria below</span>
                  </span>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Financial Assistance */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>{t.benefits}</span>
                </div>
                <div className="text-sm font-extrabold text-emerald-950 mt-1">
                  {activeModalScheme.scheme.financialBenefit}
                </div>
                <p className="text-xs text-emerald-900 mt-1">
                  {activeModalScheme.scheme.summary}
                </p>
              </div>

              {/* Why You Qualify Breakdown */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.whyYouQualify}</span>
                </div>

                {activeModalScheme.reasons.length > 0 && (
                  <ul className="space-y-1.5">
                    {activeModalScheme.reasons.map((r, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeModalScheme.missingCriteria.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-stone-200">
                    <div className="text-[11px] font-bold text-amber-900 mb-1">
                      Criteria to verify:
                    </div>
                    <ul className="space-y-1">
                      {activeModalScheme.missingCriteria.map((m, idx) => (
                        <li key={idx} className="text-xs text-amber-800 flex items-start space-x-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Required Documents */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>{t.requiredDocs}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalScheme.scheme.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-800 font-medium flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Process Steps */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>Step-by-Step Official Application Process</span>
                </div>
                <div className="space-y-2">
                  {activeModalScheme.scheme.applicationProcess.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-slate-700 flex items-start space-x-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </div>
                  ))}
                </div>

                {activeModalScheme.scheme.applicationProcess.offlineOffice && (
                  <div className="mt-2 text-xs text-slate-500 font-medium">
                    📍 <strong>Offline Assistance:</strong> {activeModalScheme.scheme.applicationProcess.offlineOffice}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Official Source: {activeModalScheme.scheme.officialSource}</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onTrackScheme(activeModalScheme.scheme.title);
                    setActiveModalScheme(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-slate-700 hover:bg-white"
                >
                  Track Application
                </button>

                {activeModalScheme.scheme.applicationProcess.onlineUrl && (
                  <a
                    href={activeModalScheme.scheme.applicationProcess.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>{t.applyOnline}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
