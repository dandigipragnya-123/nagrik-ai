import React from 'react';
import {
  Landmark,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookmarkCheck,
  Newspaper,
  PhoneCall,
  Globe,
  Trash2,
  ExternalLink,
  HelpCircle,
  FileCheck2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { User, CitizenProfile, SupportedLanguage, SavedScheme, GovUpdate } from '../types';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';
import { GOV_UPDATES } from '../data/updatesData';

interface MainDashboardProps {
  user: User | null;
  citizen: CitizenProfile | null;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onSelectService: (service: 'schemes' | 'documents') => void;
  onOpenUpdates: () => void;
  onOpenMyActivity: () => void;
  onOpenVoice: () => void;
  savedSchemes: SavedScheme[];
  recentDocuments: any[];
  onRemoveSavedScheme?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
  onOpenDocumentDetail?: (doc: any) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  user,
  citizen,
  language,
  setLanguage,
  onSelectService,
  onOpenUpdates,
  onOpenMyActivity,
  onOpenVoice,
  savedSchemes,
  recentDocuments,
  onRemoveSavedScheme,
  onDeleteDocument,
  onOpenDocumentDetail,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const userName = user?.name || citizen?.name || 'Citizen';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold tracking-wider uppercase mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NagrikAI Digital Citizen Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Hello, {userName}! How can we help you today?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Select one of our primary services below to get clear, step-by-step guidance in simple language.
          </p>
        </div>
      </div>

      {/* Two Large, Attractive Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Government Scheme Eligibility */}
        <div
          onClick={() => onSelectService('schemes')}
          className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-stone-200 hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/15 transition-all"></div>

          <div>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-900 group-hover:text-white transition-all shadow-xs">
              <Landmark className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
              Service 1 • Automated Matching
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-blue-900 transition-colors">
              Government Scheme Eligibility
            </h2>

            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
              Find government schemes that you may be eligible for based on your details.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Central & State welfare programs (PM-KISAN, Ayushman, Scholarships)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No sensitive numbers asked (no Aadhaar, bank accounts, or OTPs)</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-950 text-white font-bold text-sm shadow-md group-hover:bg-blue-900 active:scale-95 transition-all"
            >
              <span>Check My Eligibility</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600">
              4-Step Guided Form
            </span>
          </div>
        </div>

        {/* Card 2: Document Assistance */}
        <div
          onClick={() => onSelectService('documents')}
          className="bg-white rounded-3xl p-7 sm:p-8 border-2 border-stone-200 hover:border-emerald-600 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>

          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs">
              <FileText className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              Service 2 • Plain Language Decoder
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 group-hover:text-emerald-950 transition-colors">
              Document Assistance
            </h2>

            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
              Upload a government document and understand what it means in simple language.
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Plain explanations, key dates, deadlines, and action checklists</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Supports PDF, JPG, PNG with interactive follow-up Q&A</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-md group-hover:bg-emerald-800 active:scale-95 transition-all"
            >
              <span>Understand My Document</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600">
              Instant Analysis & OCR
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recently Viewed Documents & Saved Schemes (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recently Viewed Documents */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-base font-bold text-slate-900">
                  Recently Viewed Documents
                </h3>
              </div>
              <button
                onClick={() => onSelectService('documents')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Upload New Document
              </button>
            </div>

            {recentDocuments && recentDocuments.length > 0 ? (
              <div className="space-y-2.5">
                {recentDocuments.slice(0, 3).map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between hover:bg-white hover:shadow-xs transition-all"
                  >
                    <div
                      onClick={() => onOpenDocumentDetail && onOpenDocumentDetail(doc)}
                      className="cursor-pointer flex items-center space-x-3 flex-1 min-w-0"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {doc.fileName || doc.documentType}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {doc.documentType} • {doc.issuingAuthority}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      <button
                        onClick={() => onOpenDocumentDetail && onOpenDocumentDetail(doc)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      {onDeleteDocument && (
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-500">
                  No documents analyzed yet.
                </p>
                <button
                  onClick={() => onSelectService('documents')}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Upload your first document
                </button>
              </div>
            )}
          </div>

          {/* Saved Scheme Results */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Saved Scheme Results
                </h3>
              </div>
              <button
                onClick={() => onSelectService('schemes')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Find More Schemes
              </button>
            </div>

            {savedSchemes && savedSchemes.length > 0 ? (
              <div className="space-y-2.5">
                {savedSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {scheme.schemeTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {scheme.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                        {scheme.benefit}
                      </div>
                    </div>

                    {onRemoveSavedScheme && (
                      <button
                        onClick={() => onRemoveSavedScheme(scheme.id)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-500">
                  No saved schemes yet.
                </p>
                <button
                  onClick={() => onSelectService('schemes')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Check your eligibility to save schemes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Updates, Language & Help (1 Col) */}
        <div className="space-y-6">
          {/* Important Government Updates Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Important Govt Updates
                </h3>
              </div>
              <button
                onClick={onOpenUpdates}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {GOV_UPDATES.slice(0, 3).map((upd) => (
                <div key={upd.id} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {upd.category}
                    </span>
                    <span>{upd.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {upd.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {upd.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Language Selection Quick Bar */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Language Selection
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              View document explanations and scheme guidelines in your mother tongue:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-blue-950 text-white shadow-2xs ring-2 ring-blue-500/20'
                      : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Help & Support Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <PhoneCall className="w-4 h-4" />
              <span>National Citizen Helplines</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Toll-free government helplines for direct civic assistance:
            </p>

            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Ayushman Bharat:</span>
                <strong className="text-amber-400">14555</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">PM-KISAN DBT:</span>
                <strong className="text-amber-400">155261</strong>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Kisan Call Centre:</span>
                <strong className="text-amber-400">1800-180-1551</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">National Food / Ration:</span>
                <strong className="text-amber-400">1967</strong>
              </div>
            </div>

            <button
              onClick={onOpenVoice}
              className="mt-4 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Ask Voice Sahayak (बोलकर पूछें)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
