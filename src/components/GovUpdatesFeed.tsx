import React, { useState } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Tag, 
  Filter,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { GovUpdate, SupportedLanguage } from '../types';
import { GOV_UPDATES } from '../data/updatesData';
import { UI_TRANSLATIONS } from '../data/translations';

interface GovUpdatesFeedProps {
  language: SupportedLanguage;
}

export const GovUpdatesFeed: React.FC<GovUpdatesFeedProps> = ({ language }) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Deadline Extension',
    'Scheme Launch',
    'DBT Subsidy',
    'Order & Gazette',
    'Advisory',
  ];

  const filteredUpdates = GOV_UPDATES.filter((upd) => {
    if (activeCategory === 'All') return true;
    return upd.category === activeCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Newspaper className="w-4 h-4" />
              <span>Official Civic Gazette & Alerts</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Government Updates & Deadlines Feed
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Authentic announcements directly verified against Press Information Bureau (PIB), Gazette of India, and official central/state portals.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Official Source Grounded</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Urgent Notification Ticker */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-amber-950 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="p-1 rounded-full bg-amber-200 text-amber-800 shrink-0">
            <Flame className="w-4 h-4" />
          </span>
          <span className="font-semibold">
            <strong>Active Nationwide Deadline:</strong> Mandatory Aadhaar Biometric e-KYC on Ration Cards (NFSA) and PM-KISAN ends December 2026. Complete at your nearest Fair Price Shop or CSC.
          </span>
        </div>
      </div>

      {/* Updates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUpdates.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.isUrgent
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {item.category}
                </span>

                <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
                {item.title}
              </h3>

              <div className="text-[11px] text-slate-500 font-medium mt-1">
                {item.department}
              </div>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                {item.summary}
              </p>

              {item.applicableCategory && (
                <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: <strong>{item.applicableCategory}</strong></span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified: {item.sourceName}</span>
              </div>

              <a
                href={item.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-bold hover:underline"
              >
                <span>Read Official Release</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
