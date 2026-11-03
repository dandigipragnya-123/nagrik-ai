/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { MainDashboard } from './components/MainDashboard';
import { SchemeEligibilityWorkflow } from './components/SchemeEligibilityWorkflow';
import { DocumentAssistanceStudio } from './components/DocumentAssistanceStudio';
import { GovUpdatesFeed } from './components/GovUpdatesFeed';
import { MyActivityPage } from './components/MyActivityPage';
import { ProfilePage } from './components/ProfilePage';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { Footer } from './components/Footer';
import {
  SupportedLanguage,
  CitizenProfile,
  User as UserType,
  SavedScheme,
  TrackedApplication,
  Scheme,
  DocumentAnalysis
} from './types';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('nagrik_lang');
    return (saved as SupportedLanguage) || 'en';
  });

  // Current authenticated user (from SQLite)
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('nagrik_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Current citizen demographic profile (from SQLite)
  const [citizen, setCitizen] = useState<CitizenProfile | null>(() => {
    const saved = localStorage.getItem('nagrik_citizen');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Active view tab: 'dashboard' | 'schemes' | 'documents' | 'updates' | 'activity' | 'profile'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // SQLite data state
  const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [applications, setApplications] = useState<TrackedApplication[]>([]);

  // UI state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeDocSummaryForVoice, setActiveDocSummaryForVoice] = useState<string | undefined>(undefined);
  const [dbStatusNotice, setDbStatusNotice] = useState<string | null>(null);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('nagrik_lang', language);
  }, [language]);

  // Sync user & citizen state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('nagrik_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nagrik_user');
    }
  }, [user]);

  useEffect(() => {
    if (citizen) {
      localStorage.setItem('nagrik_citizen', JSON.stringify(citizen));
    } else {
      localStorage.removeItem('nagrik_citizen');
    }
  }, [citizen]);

  // Load user data from SQLite when citizen / user is available
  useEffect(() => {
    if (citizen?.id) {
      fetchUserDataFromDb(citizen.id);
    }
  }, [citizen?.id]);

  const showToast = (message: string) => {
    setDbStatusNotice(message);
    setTimeout(() => setDbStatusNotice(null), 4000);
  };

  const fetchUserDataFromDb = async (citizenId: string) => {
    // 1. Fetch saved schemes
    try {
      const res = await fetch(`/api/user/saved-schemes?citizenId=${encodeURIComponent(citizenId)}`);
      const data = await res.json();
      if (data.success && data.savedSchemes) {
        setSavedSchemes(data.savedSchemes);
      }
    } catch (err) {
      console.warn('Error fetching saved schemes from SQLite:', err);
    }

    // 2. Fetch document analysis history
    try {
      const res = await fetch(`/api/documents/history/${encodeURIComponent(citizenId)}`);
      const data = await res.json();
      if (data.success && data.documents) {
        setRecentDocuments(data.documents);
      }
    } catch (err) {
      console.warn('Error fetching document history from SQLite:', err);
    }

    // 3. Fetch tracked applications
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(citizenId)}`);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.warn('Error fetching applications from SQLite:', err);
    }
  };

  const handleAuthSuccess = (authenticatedUser: UserType, authenticatedCitizen: CitizenProfile) => {
    setUser(authenticatedUser);
    setCitizen(authenticatedCitizen);
    setCurrentTab('dashboard');
    showToast(`Authenticated as ${authenticatedUser.name || authenticatedCitizen.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    setCitizen(null);
    localStorage.removeItem('nagrik_user');
    localStorage.removeItem('nagrik_citizen');
    setCurrentTab('dashboard');
    showToast('Signed out successfully.');
  };

  const handleUpdateCitizenProfile = async (updatedProfile: CitizenProfile) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
      const data = await res.json();
      if (data.success && data.citizen) {
        setCitizen(data.citizen);
        showToast('Profile updated & synchronized in SQLite.');
      } else {
        setCitizen(updatedProfile);
      }
    } catch (err) {
      setCitizen(updatedProfile);
    }
  };

  const handleSaveScheme = async (scheme: Scheme, status: 'Likely Eligible' | 'May Be Eligible' | 'Not Eligible') => {
    const citizenId = citizen?.id || user?.id || 'cit-ramesh-01';
    try {
      const res = await fetch('/api/user/saved-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenId,
          schemeId: scheme.id,
          schemeName: scheme.name,
          ministry: scheme.ministry,
          benefits: scheme.benefitsSummary,
          eligibilityStatus: status,
          officialPortal: scheme.officialPortalUrl,
        }),
      });
      const data = await res.json();
      if (data.success && data.savedScheme) {
        setSavedSchemes((prev) => [data.savedScheme, ...prev]);
        showToast(`Saved "${scheme.name}" to your SQLite records!`);
      }
    } catch (err) {
      console.warn('Could not save scheme to SQLite:', err);
    }
  };

  const handleRemoveSavedScheme = async (id: string) => {
    setSavedSchemes((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/user/saved-schemes/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      showToast('Scheme removed from saved records.');
    } catch (err) {
      console.warn('Could not delete saved scheme in SQLite:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setRecentDocuments((prev) => prev.filter((d) => d.id !== id));
    try {
      await fetch(`/api/documents/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      showToast('Document record deleted permanently from SQLite.');
    } catch (err) {
      console.warn('Could not delete document record in SQLite:', err);
    }
  };

  const handleDocumentAnalyzed = (analysis: DocumentAnalysis) => {
    // Add to recent documents state and toast
    setRecentDocuments((prev) => [
      {
        id: analysis.id,
        fileName: analysis.fileName,
        documentType: analysis.importantInfo?.issuingAuthority || 'Official Document',
        summary: analysis.whatIsThis,
        date: new Date().toLocaleDateString('en-IN'),
        referenceNumber: analysis.importantInfo?.referenceNumber,
      },
      ...prev,
    ]);
    showToast('Document analyzed & record stored in SQLite database.');
  };

  const handleAddApplication = async (newApp: TrackedApplication) => {
    setApplications((prev) => [newApp, ...prev]);
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newApp,
          citizenId: citizen?.id || 'cit-ramesh-01',
        }),
      });
      showToast('Application record created in SQLite.');
    } catch (err) {
      console.warn('Could not save application in SQLite:', err);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: TrackedApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    try {
      await fetch(`/api/applications/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast(`Application status updated to ${status}.`);
    } catch (err) {
      console.warn('Could not update application status in SQLite:', err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    try {
      await fetch(`/api/applications/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      showToast('Application record removed.');
    } catch (err) {
      console.warn('Could not delete application in SQLite:', err);
    }
  };

  const handleOpenVoiceWithContext = (summaryText: string) => {
    setActiveDocSummaryForVoice(summaryText);
    setIsVoiceModalOpen(true);
  };

  // If user is NOT authenticated, display clean, trustworthy Login / Sign Up page first
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          language={language}
        />
        <Footer language={language} />
      </div>
    );
  }

  // Authenticated Citizen Portal Flow
  return (
    <div className="min-h-screen bg-stone-100/70 text-slate-900 flex flex-col font-sans selection:bg-orange-200 selection:text-orange-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        user={user}
        citizen={citizen}
        savedCount={savedSchemes.length + recentDocuments.length}
        onOpenVoice={() => {
          setActiveDocSummaryForVoice(undefined);
          setIsVoiceModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Database Status Toast Notification */}
      {dbStatusNotice && (
        <div className="sticky top-16 z-30 max-w-6xl mx-auto px-4 sm:px-6 pt-2">
          <div className="bg-emerald-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between border border-emerald-700 animate-in fade-in slide-in-from-top-2">
            <span className="font-medium">
              💾 <strong>SQLite Database:</strong> {dbStatusNotice}
            </span>
            <button
              onClick={() => setDbStatusNotice(null)}
              className="text-emerald-300 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-14">
        {/* View 1: Main Dashboard (Service Cards, Recent Docs, Saved Schemes, Helplines) */}
        {currentTab === 'dashboard' && (
          <MainDashboard
            user={user}
            citizen={citizen}
            language={language}
            setLanguage={setLanguage}
            onSelectService={(service) => setCurrentTab(service)}
            onOpenUpdates={() => setCurrentTab('updates')}
            onOpenMyActivity={() => setCurrentTab('activity')}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
            savedSchemes={savedSchemes}
            recentDocuments={recentDocuments}
            onRemoveSavedScheme={handleRemoveSavedScheme}
            onDeleteDocument={handleDeleteDocument}
            onOpenDocumentDetail={() => setCurrentTab('documents')}
          />
        )}

        {/* View 2: Government Scheme Eligibility (4-step guided workflow) */}
        {currentTab === 'schemes' && (
          <SchemeEligibilityWorkflow
            citizen={citizen}
            language={language}
            onUpdateCitizenProfile={handleUpdateCitizenProfile}
            onSaveScheme={handleSaveScheme}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {/* View 3: Document Assistance Studio (Upload limitations, Sections A-G, Q&A) */}
        {currentTab === 'documents' && (
          <DocumentAssistanceStudio
            citizen={citizen}
            language={language}
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onDocumentAnalyzed={handleDocumentAnalyzed}
          />
        )}

        {/* View 4: Important Government Updates */}
        {currentTab === 'updates' && (
          <div className="max-w-5xl mx-auto">
            <GovUpdatesFeed language={language} />
          </div>
        )}

        {/* View 5: My Activity (Saved Schemes, Analyzed Documents, Application Tracker) */}
        {currentTab === 'activity' && (
          <MyActivityPage
            citizen={citizen}
            savedSchemes={savedSchemes}
            recentDocuments={recentDocuments}
            applications={applications}
            language={language}
            onRemoveSavedScheme={handleRemoveSavedScheme}
            onDeleteDocument={handleDeleteDocument}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onDeleteApplication={handleDeleteApplication}
            onAddApplication={handleAddApplication}
            onNavigateToSchemes={() => setCurrentTab('schemes')}
            onNavigateToDocuments={() => setCurrentTab('documents')}
          />
        )}

        {/* View 6: Citizen Profile (Demographic & Eligibility Details synced to SQLite) */}
        {currentTab === 'profile' && (
          <ProfilePage
            user={user}
            citizen={citizen}
            language={language}
            onSaveCitizen={handleUpdateCitizenProfile}
            onNavigateToSchemes={() => setCurrentTab('schemes')}
          />
        )}
      </main>

      {/* Multilingual Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        setLanguage={setLanguage}
        citizen={citizen}
        activeDocumentSummary={activeDocSummaryForVoice}
      />

      {/* Official Civic Footer */}
      <Footer language={language} />
    </div>
  );
}
