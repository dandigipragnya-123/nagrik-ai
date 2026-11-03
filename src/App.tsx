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
import { apiClient } from './utils/apiClient';

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
    const resSchemes = await apiClient.get<{ savedSchemes?: SavedScheme[] }>(
      `/api/user/saved-schemes?citizenId=${encodeURIComponent(citizenId)}`
    );
    if (resSchemes.success && resSchemes.data?.savedSchemes) {
      setSavedSchemes(resSchemes.data.savedSchemes);
    }

    // 2. Fetch document analysis history
    const resDocs = await apiClient.get<{ documents?: any[] }>(
      `/api/documents/history/${encodeURIComponent(citizenId)}`
    );
    if (resDocs.success && resDocs.data?.documents) {
      setRecentDocuments(resDocs.data.documents);
    }

    // 3. Fetch tracked applications
    const resApps = await apiClient.get<{ applications?: TrackedApplication[] }>(
      `/api/applications/${encodeURIComponent(citizenId)}`
    );
    if (resApps.success && resApps.data?.applications) {
      setApplications(resApps.data.applications);
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
    const result = await apiClient.post<{ citizen?: CitizenProfile }>('/api/auth/register', updatedProfile);
    if (result.success && result.data?.citizen) {
      setCitizen(result.data.citizen);
      showToast('Profile updated & synchronized in SQLite.');
    } else {
      setCitizen(updatedProfile);
      if (result.error) showToast(result.error);
    }
  };

  const handleSaveScheme = async (scheme: Scheme, status: 'Likely Eligible' | 'May Be Eligible' | 'Not Eligible') => {
    const citizenId = citizen?.id || user?.id || 'cit-ramesh-01';
    const result = await apiClient.post<{ savedScheme?: SavedScheme }>('/api/user/saved-schemes', {
      citizenId,
      schemeId: scheme.id,
      schemeName: scheme.name || scheme.title,
      ministry: scheme.ministry || scheme.ministryOrState,
      benefits: scheme.benefitsSummary || scheme.financialBenefit,
      eligibilityStatus: status,
      officialPortal: scheme.officialPortalUrl || scheme.officialSource,
    });

    if (result.success) {
      if (result.data?.savedScheme) {
        setSavedSchemes((prev) => [result.data!.savedScheme!, ...prev]);
      }
      showToast(`Saved "${scheme.name || scheme.title}" to your SQLite records!`);
    } else if (result.error) {
      showToast(result.error);
    }
  };

  const handleRemoveSavedScheme = async (id: string) => {
    setSavedSchemes((prev) => prev.filter((s) => s.id !== id));
    await apiClient.delete(`/api/user/saved-schemes/${encodeURIComponent(id)}`);
    showToast('Scheme removed from saved records.');
  };

  const handleDeleteDocument = async (id: string) => {
    setRecentDocuments((prev) => prev.filter((d) => d.id !== id));
    await apiClient.delete(`/api/documents/${encodeURIComponent(id)}`);
    showToast('Document record deleted permanently from SQLite.');
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
    const result = await apiClient.post('/api/applications', {
      ...newApp,
      citizenId: citizen?.id || 'cit-ramesh-01',
    });
    if (result.success) {
      showToast('Application record created in SQLite.');
    } else if (result.error) {
      showToast(result.error);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: TrackedApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    await apiClient.put(`/api/applications/${encodeURIComponent(id)}`, { status });
    showToast(`Application status updated to ${status}.`);
  };

  const handleDeleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    await apiClient.delete(`/api/applications/${encodeURIComponent(id)}`);
    showToast('Application record removed.');
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
