import React from 'react';
import { ShieldAlert, ExternalLink, PhoneCall, Heart, Landmark, Globe } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-16 border-t border-slate-800">
      {/* Disclaimer Strip */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">
              {t.disclaimerTitle}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-5xl">
              {t.disclaimerText} All scheme details, eligibility guidelines, and document procedures are compiled from official Gazette notifications and verified portals of the Government of India and respective State Governments. AI outputs serve exclusively to clarify bureaucratic language and improve civic awareness.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
              ना
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">
              Nagrik<span className="text-orange-500">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.portalTagline}. Empowering Indian citizens across rural and urban landscapes to navigate official administration with total clarity.
          </p>
          <div className="text-[11px] text-slate-500">
            Supports Hindi, Kannada, Telugu, Tamil, Marathi, Bengali & English.
          </div>
        </div>

        {/* Official Portals */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Key Government Portals
          </h5>
          <ul className="space-y-1.5 text-xs">
            <li>
              <a
                href="https://myscheme.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>myScheme.gov.in</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </li>
            <li>
              <a
                href="https://www.digilocker.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>DigiLocker Digital Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </li>
            <li>
              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>PM-KISAN Samman Nidhi</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </li>
            <li>
              <a
                href="https://beneficiary.nha.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>Ayushman Bharat PM-JAY</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </li>
            <li>
              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center space-x-1"
              >
                <span>CPGRAMS Public Grievances</span>
                <ExternalLink className="w-3 h-3 text-slate-600" />
              </a>
            </li>
          </ul>
        </div>

        {/* National Citizen Helplines */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>National Citizen Helplines</span>
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <strong className="text-slate-200">14555</strong> / <strong className="text-slate-200">1800-111-565</strong> (Ayushman Bharat)
            </li>
            <li>
              <strong className="text-slate-200">155261</strong> (PM-KISAN DBT Helpline)
            </li>
            <li>
              <strong className="text-slate-200">1800-180-1551</strong> (Kisan Call Centre)
            </li>
            <li>
              <strong className="text-slate-200">1967</strong> (National Food Security / Ration)
            </li>
            <li>
              <strong className="text-slate-200">1930</strong> (National Cyber Crime Helpline)
            </li>
            <li>
              <strong className="text-slate-200">1915</strong> (National Consumer Helpline)
            </li>
          </ul>
        </div>

        {/* Regional Language Coverage */}
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Multilingual Accessibility</span>
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            All documents and procedures translated with conversational audio in ಕನ್ನಡ, हिन्दी, తెలుగు, தமிழ், मराठी, বাংলা, and English.
          </p>
          <div className="pt-2 text-[11px] text-slate-500">
            सत्यमेव जयते • Non-commercial Public Service Innovation
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-slate-500 text-[11px]">
        NagrikAI • Designed for Bharat • Bridging Legal Information into Simple Local Language
      </div>
    </footer>
  );
};
