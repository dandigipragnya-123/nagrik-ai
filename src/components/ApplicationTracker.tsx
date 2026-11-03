import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  ExternalLink,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { TrackedApplication, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface ApplicationTrackerProps {
  applications: TrackedApplication[];
  onAddApplication: (app: TrackedApplication) => void;
  onUpdateStatus: (id: string, status: TrackedApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
  language: SupportedLanguage;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onAddApplication,
  onUpdateStatus,
  onDeleteApplication,
  language,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newDate, setNewDate] = useState('15-12-2026');
  const [newNotes, setNewNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddApplication({
      id: `app-${Date.now()}`,
      schemeOrDocName: newTitle.trim(),
      trackingNumber: newRef.trim() || `ACK-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedDate: new Date().toLocaleDateString('en-IN'),
      status: 'Submitted',
      notes: newNotes.trim() || 'Application submitted at citizen portal.',
      nextFollowUpDate: newDate,
    });

    setNewTitle('');
    setNewRef('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: TrackedApplication['status']) => {
    switch (status) {
      case 'Approved / Sanctioned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approved / Sanctioned</span>
          </span>
        );
      case 'Under Verification':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            <span>Under Verification</span>
          </span>
        );
      case 'Requires Clarification':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Action Required</span>
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-300">
            Submitted
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-slate-700">
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4" />
              <span>Citizen Application & Deadline Tracker</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              My Government Applications & Deadlines
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Track pending scheme acknowledgments, document validity renewals, and upcoming biometric or e-KYC deadlines in one place.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-slate-700 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Track New Application</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
          {['All', 'Requires Clarification', 'Under Verification', 'Submitted', 'Approved / Sanctioned'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-purple-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(item.status)}
                <span className="font-mono text-xs font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded">
                  Ref: {item.trackingNumber}
                </span>
                <span className="text-[11px] text-slate-400">
                  Added on: {item.submittedDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {item.schemeOrDocName}
              </h3>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:self-center shrink-0">
              <div className="text-left md:text-right bg-stone-50 md:bg-transparent p-2.5 md:p-0 rounded-xl border md:border-0 border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Deadline / Follow-up:
                </div>
                <div className="text-xs font-extrabold text-red-600 flex items-center md:justify-end space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.nextFollowUpDate}</span>
                </div>
              </div>

              {/* Status Selector */}
              <select
                value={item.status}
                onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                className="text-xs bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500"
              >
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Verification">Under Verification</option>
                <option value="Requires Clarification">Requires Clarification</option>
                <option value="Approved / Sanctioned">Approved / Sanctioned</option>
              </select>

              <button
                onClick={() => onDeleteApplication(item.id)}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove from tracker"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No applications in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add deadlines from the Document Simplifier or click "Track New Application" above.
            </p>
          </div>
        )}
      </div>

      {/* Add New Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-purple-900 text-white p-5">
              <h3 className="text-lg font-bold">Track a Government Application</h3>
              <p className="text-xs text-purple-200 mt-0.5">
                Save an acknowledgment number or deadline reminder.
              </p>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheme or Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Kisan Credit Card Renewal / Ayushman Card"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application / Acknowledgment No.
                </label>
                <input
                  type="text"
                  value={newRef}
                  onChange={(e) => setNewRef(e.target.value)}
                  placeholder="e.g. KA-2026-94812"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-up Deadline Date
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. 15-12-2026"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Action Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Carry original land records and Aadhaar to Nadakacheri."
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                >
                  Save to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
