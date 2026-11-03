import React from 'react';
import { 
  FileText, 
  Landmark, 
  Newspaper, 
  CheckSquare, 
  Mic, 
  UserCheck, 
  Globe, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { SupportedLanguage, CitizenProfile } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  citizen: CitizenProfile | null;
  onOpenLogin: () => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  citizen,
  onOpenLogin,
  onOpenVoice,
}) => {
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Civic Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              भारत सरकार / Government Citizen Assistance Service
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">
              सत्यमेव जयते • Non-Commercial Public Interest Initiative
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline text-slate-300">
              National Helpline: <strong className="text-amber-400">1800-11-0031</strong>
            </span>
            <span className="text-slate-400">|</span>
            <div className="flex items-center space-x-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Portals Grounded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div 
            onClick={() => setCurrentTab('documents')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-emerald-700 flex items-center justify-center text-white shadow-sm font-bold text-lg ring-2 ring-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">ना</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Nagrik<span className="text-orange-600">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-orange-100 text-orange-800 border border-orange-200">
                  Citizen Bridge
                </span>
              </div>
              <p className="text-xs text-slate-700 hidden sm:block font-medium">
                {t.portalTagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setCurrentTab('documents')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'documents'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>{t.navDocuments}</span>
            </button>

            <button
              onClick={() => setCurrentTab('schemes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'schemes'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>{t.navSchemes}</span>
            </button>

            <button
              onClick={() => setCurrentTab('updates')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'updates'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-600" />
              <span>{t.navUpdates}</span>
            </button>

            <button
              onClick={() => setCurrentTab('tracker')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'tracker'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-purple-600" />
              <span>{t.navTracker}</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2">
            {/* Voice Assistant Button */}
            <button
              onClick={onOpenVoice}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
              title="Voice Assistant"
            >
              <Mic className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">{t.navVoice}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 bg-white border border-stone-300 hover:border-stone-400 text-slate-800 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="font-bold">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-stone-100">
                    Select Language / भाषा चुनें
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                        language === lang.code
                          ? 'bg-orange-50/80 text-orange-900 font-bold'
                          : 'text-slate-700 font-medium'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[11px] text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Citizen Profile / Login Button */}
            {citizen ? (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {citizen.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold leading-tight truncate max-w-[100px]">
                    {citizen.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 leading-none">
                    {citizen.state} • {citizen.caste}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.loginPrompt}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-around mt-2 pt-2 border-t border-stone-100 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('documents')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'documents' ? 'text-orange-600 font-bold' : 'text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[11px] mt-0.5">{t.navDocuments}</span>
          </button>
          <button
            onClick={() => setCurrentTab('schemes')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'schemes' ? 'text-orange-600 font-bold' : 'text-slate-700'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span className="text-[11px] mt-0.5">{t.navSchemes}</span>
          </button>
          <button
            onClick={() => setCurrentTab('updates')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'updates' ? 'text-orange-600 font-bold' : 'text-slate-700'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-[11px] mt-0.5">{t.navUpdates}</span>
          </button>
          <button
            onClick={() => setCurrentTab('tracker')}
            className={`flex flex-col items-center py-1 px-2 rounded-md ${
              currentTab === 'tracker' ? 'text-orange-600 font-bold' : 'text-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[11px] mt-0.5">{t.navTracker}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
