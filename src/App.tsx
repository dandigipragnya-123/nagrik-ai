/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CitizenPassCard } from './components/CitizenPassCard';
import { CitizenLoginModal } from './components/CitizenLoginModal';
import { RealisticLoginPage } from './components/RealisticLoginPage';
import { DocumentSimplifier } from './components/DocumentSimplifier';
import { SchemeFinder } from './components/SchemeFinder';
import { GovUpdatesFeed } from './components/GovUpdatesFeed';
import { ApplicationTracker } from './components/ApplicationTracker';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { Footer } from './components/Footer';
import { SupportedLanguage, CitizenProfile, TrackedApplication } from './types';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('nagrik_lang');
    return (saved as SupportedLanguage) || 'en';
  });

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

  const [applications, setApplications] = useState<TrackedApplication[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('documents');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [activeDocSummaryForVoice, setActiveDocSummaryForVoice] = useState<string | undefined>(undefined);
  const [dbStatusNotice, setDbStatusNotice] = useState<string | null>(null);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('nagrik_lang', language);
  }, [language]);

  // Sync citizen state with localStorage
  useEffect(() => {
    if (citizen) {
      localStorage.setItem('nagrik_citizen', JSON.stringify(citizen));
    } else {
      localStorage.removeItem('nagrik_citizen');
    }
  }, [citizen]);

  // Load applications from SQLite whenever citizen changes
  useEffect(() => {
    if (citizen?.id) {
      fetchApplicationsFromDb(citizen.id);
    } else {
      // Auto-load default citizen from SQLite on first visit if none selected
      fetchDefaultCitizen();
    }
  }, [citizen?.id]);

  const fetchDefaultCitizen = async () => {
    try {
      const res = await fetch('/api/citizen/profile/cit-ramesh-01');
      const data = await res.json();
      if (data.success && data.citizen) {
        setCitizen(data.citizen);
      }
    } catch (err) {
      console.warn('Could not auto-fetch default SQLite citizen:', err);
    }
  };

  const fetchApplicationsFromDb = async (citizenId: string) => {
    try {
      const res = await fetch(`/api/applications/${citizenId}`);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.warn('Error fetching applications from SQLite:', err);
    }
  };

  const handleSaveCitizen = async (profile: CitizenProfile) => {
    // Save to SQLite backend
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success && data.citizen) {
        setCitizen(data.citizen);
        setDbStatusNotice(`Citizen details saved to SQLite database successfully!`);
        setTimeout(() => setDbStatusNotice(null), 4000);
      } else {
        setCitizen(profile);
      }
    } catch (err) {
      setCitizen(profile);
    }
  };

  const handleLoginSuccess = (authenticatedCitizen: CitizenProfile) => {
    setCitizen(authenticatedCitizen);
    setCurrentTab('documents');
    setDbStatusNotice(`Authenticated from SQLite database as ${authenticatedCitizen.name}!`);
    setTimeout(() => setDbStatusNotice(null), 4000);
  };

  const handleAddToTracker = async (item: TrackedApplication) => {
    setApplications((prev) => [item, ...prev]);

    // Save to SQLite backend
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          citizenId: citizen?.id || 'cit-ramesh-01',
        }),
      });
      setDbStatusNotice('Application record saved into SQLite database.');
      setTimeout(() => setDbStatusNotice(null), 3500);
    } catch (err) {
      console.warn('Could not save application to SQLite:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: TrackedApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );

    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn('Could not update application in SQLite:', err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));

    try {
      await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete application in SQLite:', err);
    }
  };

  const handleOpenVoiceWithContext = (summaryText: string) => {
    setActiveDocSummaryForVoice(summaryText);
    setIsVoiceModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-slate-900 flex flex-col font-sans selection:bg-orange-200 selection:text-orange-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        citizen={citizen}
        onOpenLogin={() => setCurrentTab('login')}
        onOpenVoice={() => {
          setActiveDocSummaryForVoice(undefined);
          setIsVoiceModalOpen(true);
        }}
      />

      {/* Database Status Toast Notification */}
      {dbStatusNotice && (
        <div className="sticky top-16 z-30 max-w-7xl mx-auto px-4 sm:px-6 pt-2">
          <div className="bg-emerald-800 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between border border-emerald-700 animate-in fade-in slide-in-from-top-2">
            <span className="font-medium">
              💾 <strong>SQLite Database:</strong> {dbStatusNotice}
            </span>
            <button
              onClick={() => setDbStatusNotice(null)}
              className="text-emerald-200 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-12 space-y-6">
        {/* If tab is 'login', render the full realistic civic login page */}
        {currentTab === 'login' ? (
          <RealisticLoginPage
            onLoginSuccess={handleLoginSuccess}
            language={language}
            onCancel={citizen ? () => setCurrentTab('documents') : undefined}
          />
        ) : (
          <>
            {/* Citizen Digital Pass Header Widget */}
            <CitizenPassCard
              citizen={citizen}
              onOpenEdit={() => setCurrentTab('login')}
              onViewSchemes={() => setCurrentTab('schemes')}
              language={language}
            />

            {/* Tab 1: Document Simplification Studio */}
            {currentTab === 'documents' && (
              <DocumentSimplifier
                citizen={citizen}
                language={language}
                onAddToTracker={handleAddToTracker}
                onOpenVoiceWithContext={handleOpenVoiceWithContext}
              />
            )}

            {/* Tab 2: Scheme Finder */}
            {currentTab === 'schemes' && (
              <SchemeFinder
                citizen={citizen}
                language={language}
                onOpenLogin={() => setCurrentTab('login')}
                onTrackScheme={(schemeName) => {
                  handleAddToTracker({
                    id: `track-${Date.now()}`,
                    schemeOrDocName: schemeName,
                    trackingNumber: `SCHEME-${Math.floor(100000 + Math.random() * 900000)}`,
                    submittedDate: new Date().toLocaleDateString('en-IN'),
                    status: 'Draft',
                    notes: 'Application draft initiated from Scheme Finder.',
                    nextFollowUpDate: '30-11-2026',
                  });
                  setCurrentTab('tracker');
                }}
              />
            )}

            {/* Tab 3: Government Updates */}
            {currentTab === 'updates' && <GovUpdatesFeed language={language} />}

            {/* Tab 4: Application & Deadline Tracker */}
            {currentTab === 'tracker' && (
              <ApplicationTracker
                applications={applications}
                onAddApplication={handleAddToTracker}
                onUpdateStatus={handleUpdateStatus}
                onDeleteApplication={handleDeleteApplication}
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Citizen Profile Modal (quick edit) */}
      <CitizenLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        citizen={citizen}
        onSaveCitizen={handleSaveCitizen}
        language={language}
      />

      {/* Multilingual Voice Assistant Modal ("Nagrik Sahayak") */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        setLanguage={setLanguage}
        citizen={citizen}
        activeDocumentSummary={activeDocSummaryForVoice}
      />

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
}
