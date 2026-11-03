import React, { useState } from 'react';
import {
  BookmarkCheck,
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Eye,
  Filter
} from 'lucide-react';
import { SavedScheme, TrackedApplication, DocumentAnalysis, SupportedLanguage, CitizenProfile } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface MyActivityPageProps {
  citizen: CitizenProfile | null;
  savedSchemes: SavedScheme[];
  recentDocuments: any[];
  applications: TrackedApplication[];
  language: SupportedLanguage;
  onRemoveSavedScheme: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onUpdateApplicationStatus: (id: string, status: TrackedApplication['status']) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (app: TrackedApplication) => void;
  onNavigateToSchemes: () => void;
  onNavigateToDocuments: () => void;
}

export const MyActivityPage: React.FC<MyActivityPageProps> = ({
  citizen,
  savedSchemes,
  recentDocuments,
  applications,
  language,
  onRemoveSavedScheme,
  onDeleteDocument,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onAddApplication,
  onNavigateToSchemes,
  onNavigateToDocuments,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState<'schemes' | 'documents' | 'tracker'>('schemes');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New application form state
  const [newSchemeName, setNewSchemeName] = useState('');
  const [newTrackingNo, setNewTrackingNo] = useState('');
  const [newStatus, setNewStatus] = useState<TrackedApplication['status']>('Draft');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchemeName.trim()) return;

    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      schemeOrDocName: newSchemeName.trim(),
      trackingNumber: newTrackingNo.trim() || `ACK-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedDate: new Date().toLocaleDateString('en-IN'),
      status: newStatus,
      nextFollowUpDate: newFollowUp || '30-11-2026',
      notes: newNotes.trim() || 'Tracked by citizen on NagrikAI portal.',
    };

    onAddApplication(newApp);
    setNewSchemeName('');
    setNewTrackingNo('');
    setNewFollowUp('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Citizen Workspace & Activity</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Activity & Records
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review your saved schemes, analyzed official documents, and active application follow-ups stored in SQLite.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center bg-stone-100 p-1.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'schemes'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved Schemes ({savedSchemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'documents'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documents ({recentDocuments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'tracker'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Tracker ({applications.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Schemes */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Saved Government Schemes</span>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                {savedSchemes.length} bookmarked
              </span>
            </h2>

            <button
              onClick={onNavigateToSchemes}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              <span>Check New Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {savedSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-3">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Saved Schemes Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Run the Government Scheme Eligibility check to find schemes tailored to your occupation, income, and state, then click "Save Scheme" to track them here.
              </p>
              <button
                onClick={onNavigateToSchemes}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Start Scheme Eligibility Check
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSchemes.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.eligibility_status === 'Likely Eligible'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.eligibility_status}
                      </span>
                      <button
                        onClick={() => onRemoveSavedScheme(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {item.scheme_name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {item.ministry}
                    </p>

                    <div className="mt-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">Key Benefit: </span>
                      {item.benefits}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Saved on {item.created_at || 'Recent'}
                    </span>
                    {item.official_portal && (
                      <a
                        href={item.official_portal}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Analyzed Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Recently Analyzed Documents</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                {recentDocuments.length} processed
              </span>
            </h2>

            <button
              onClick={onNavigateToDocuments}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              <span>Analyze New Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentDocuments.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Documents Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Upload any government notice, certificate, challan, or scheme circular to see what it means in simple plain language without confusing bureaucratic jargon.
              </p>
              <button
                onClick={onNavigateToDocuments}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Upload Document Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {doc.fileName || doc.document_title || 'Government Document'}
                        </h3>
                        <span className="text-[10px] bg-stone-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                          {doc.documentType || 'Official Record'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {doc.summary || doc.explanation || 'Analyzed and simplified by NagrikAI.'}
                      </p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-2 font-medium">
                        <span>Analyzed on {doc.date || 'Recent'}</span>
                        {doc.referenceNumber && (
                          <span>• Ref: <strong className="text-slate-600">{doc.referenceNumber}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onNavigateToDocuments()}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Studio</span>
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete record from SQLite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Tracked Applications */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span>Application Status & Deadline Tracker</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                {applications.length} active
              </span>
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track New Application</span>
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-stone-300">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Applications Being Tracked</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Keep track of your government scheme acknowledgements, ration card updates, driving licence applications, and important follow-up dates in one place.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Add Your First Application
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{app.schemeOrDocName}</h3>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {app.trackingNumber}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Submitted: <strong className="text-slate-700">{app.submittedDate}</strong></span>
                        <span>• Next Follow-up: <strong className="text-orange-700 font-bold">{app.nextFollowUpDate || 'None'}</strong></span>
                      </div>
                      {app.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                          {app.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                      {/* Status selector */}
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as TrackedApplication['status'])}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                          app.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : app.status === 'Action Required'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : app.status === 'Under Verification'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Verification">Under Verification</option>
                        <option value="Action Required">Action Required</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Track New Application</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Save your official acknowledgement number to track timelines.
            </p>

            <form onSubmit={handleCreateApplication} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scheme or Document Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM Kisan Samman Nidhi"
                  value={newSchemeName}
                  onChange={(e) => setNewSchemeName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Acknowledgement / Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DL-2026-981742"
                  value={newTrackingNo}
                  onChange={(e) => setNewTrackingNo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TrackedApplication['status'])}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Verification">Under Verification</option>
                    <option value="Action Required">Action Required</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={newFollowUp}
                    onChange={(e) => setNewFollowUp(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Verification visit pending at Taluk office on Thursday"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
