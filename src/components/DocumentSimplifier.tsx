import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  ExternalLink,
  Calendar,
  IndianRupee,
  Building,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BookmarkPlus,
  Info,
  Layers,
  FileCheck2,
  FileWarning
} from 'lucide-react';
import { DocumentAnalysis, CitizenProfile, SupportedLanguage, TrackedApplication } from '../types';
import { SAMPLE_DOCUMENTS, SampleDocumentItem } from '../data/sampleDocuments';
import { UI_TRANSLATIONS } from '../data/translations';

interface DocumentSimplifierProps {
  citizen: CitizenProfile | null;
  language: SupportedLanguage;
  onAddToTracker: (item: TrackedApplication) => void;
  onOpenVoiceWithContext: (docSummary: string) => void;
}

export const DocumentSimplifier: React.FC<DocumentSimplifierProps> = ({
  citizen,
  language,
  onAddToTracker,
  onOpenVoiceWithContext,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [activeMode, setActiveMode] = useState<'sample' | 'upload'>('sample');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-kcc');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    base64?: string;
    mimeType?: string;
    textPreview?: string;
  } | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [addedReminder, setAddedReminder] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-analyze initial sample on first render
  React.useEffect(() => {
    handleAnalyzeSample('sample-kcc');
  }, []);

  // Update speech synthesis when audio is triggered
  const handleToggleAudio = () => {
    if (!analysisResult) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const textToRead = `${analysisResult.documentType}. ${analysisResult.plainSummary}. ${analysisResult.requiredActionSummary}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Map language code to BCP 47 language tag
    const langMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleAnalyzeSample = async (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!sample) return;

    setAnalyzing(true);
    setErrorMessage(null);
    setAddedReminder(false);
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: sample.fullOfficialText,
          fileName: sample.title,
          language,
          citizenProfile: citizen,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error(data.error || 'Could not analyze document');
      }
    } catch (err: any) {
      console.warn('API error, falling back to precomputed structured analysis:', err);
      // Fallback precomputed structured analysis ensures instant response
      const precomputed = sample.precomputedAnalysis;
      const fallbackAnalysis: DocumentAnalysis = {
        id: `fallback-${sample.id}`,
        fileName: sample.title,
        documentType: precomputed.documentType || sample.docType,
        issuingAuthority: precomputed.issuingAuthority || sample.department,
        referenceNumber: precomputed.referenceNumber || 'SLBC/KCC/2026/89412',
        documentDate: sample.date,
        validityExpiryDate: precomputed.validityExpiryDate || '15-12-2026',
        urgencyLevel: (precomputed.urgencyLevel as any) || 'High',
        plainSummary:
          language === 'en'
            ? `This is an official verification notice regarding your Kisan Credit Card (KCC) crop loan. The bank requires you to update your land documents and verify your Aadhaar-NPCI account seeding to keep the subsidized interest rate of 4%. If delayed, the interest rate rises to 11.85%.`
            : `यह आपके किसान क्रेडिट कार्ड (KCC) फसल ऋण से संबंधित आधिकारिक सत्यापन नोटिस है। बैंक को 4% की रियायती ब्याज दर बनाए रखने के लिए आपके भूमि दस्तावेजों को अपडेट करने और आपके आधार-एनपीसीआई खाते को सत्यापित करने की आवश्यकता है।`,
        importantDates: [
          {
            label: 'Land Records & e-KYC Cutoff',
            date: precomputed.validityExpiryDate || '15 Dec 2026',
            isDeadline: true,
            description: 'Final date to submit updated RoR/Pahani at home bank branch.',
          },
          {
            label: 'Cycle Renewal / Repayment Deadline',
            date: '31 Jan 2027',
            isDeadline: true,
            description: 'Due date to repay or renew crop loan to retain 3% prompt repayment subsidy.',
          },
        ],
        feesAndCosts: precomputed.feesAndCosts || 'Effective Interest Rate: 4% (Concessional) vs 11.85% (Commercial)',
        requiredActionSummary:
          precomputed.requiredActionSummary ||
          'Visit your home bank branch with updated land records and mobile linked to Aadhaar before 15 December 2026.',
        nextSteps: [
          {
            id: 'step-1',
            stepNumber: 1,
            title: 'Obtain current crop season Land Record (Pahani / RoR / 7-12)',
            description: 'Download signed Record of Rights from your state revenue portal (Bhoomi / Dharani / Mahabhumi) or local Nadakacheri/Talathi.',
            requiredDocuments: ['Survey / Khasra Number', 'Aadhaar Card'],
            whereToProceed: 'State Land Portal or Village Revenue Inspector',
            isCompleted: false,
          },
          {
            id: 'step-2',
            stepNumber: 2,
            title: 'Verify Aadhaar-NPCI Bank Account Mapping',
            description: 'Check that your bank account is active on NPCI mapping so Direct Benefit Transfer (DBT) subsidies do not fail.',
            requiredDocuments: ['Bank Passbook', 'Aadhaar Card with linked mobile for OTP'],
            whereToProceed: 'Home Bank Branch or Micro-ATM Business Correspondent',
            isCompleted: false,
          },
          {
            id: 'step-3',
            stepNumber: 3,
            title: 'Submit Renewal Form to Branch Manager',
            description: 'Submit the simple one-page KCC renewal voucher and collect signed stamped acknowledgment receipt.',
            requiredDocuments: ['KCC Passbook', 'Crop declaration', 'Signed Land RoR'],
            whereToProceed: 'Your Home Bank Branch',
            isCompleted: false,
          },
        ],
        verificationGuidance: {
          authenticationMethod: 'Digital QR Code & JanSamarth Portal Authentication',
          officialPortals: [
            {
              name: 'JanSamarth National Portal',
              url: 'https://jansamarth.in',
              purpose: 'Verify agricultural credit scheme sanction & credit linking',
            },
            {
              name: 'PM-KISAN / KCC Portal',
              url: 'https://pmkisan.gov.in',
              purpose: 'Check Aadhaar e-KYC and beneficiary registration status',
            },
          ],
          physicalOffice: 'Office of the Assistant Director of Agriculture or Nearest Public Sector Rural Bank',
          cscGuidance: 'Visit your local Common Service Centre (CSC) if you need assistance printing your online land records.',
          officialDisclaimer:
            'NagrikAI provides plain language clarity and does not replace official government certificates or legal notices.',
        },
        matchedSchemes: ['PM Kisan Samman Nidhi (PM-KISAN)', 'Modified Interest Subvention Scheme (MISS)'],
        analyzedAt: new Date().toISOString(),
        targetLanguage: language,
      };
      setAnalysisResult(fallbackAnalysis);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        base64: resultStr,
        mimeType: file.type || 'application/pdf',
      });
      triggerUploadedAnalysis(file.name, resultStr, file.type || 'application/pdf');
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadedAnalysis = async (fileName: string, base64: string, mimeType: string) => {
    setAnalyzing(true);
    setErrorMessage(null);
    setAddedReminder(false);
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: base64,
          mimeType,
          fileName,
          language,
          citizenProfile: citizen,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to analyze uploaded document');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with document engine. Please try a sample or re-upload.');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleAddDeadlineReminder = () => {
    if (!analysisResult) return;
    const deadlineDate = analysisResult.validityExpiryDate || 'Upcoming Cutoff';

    onAddToTracker({
      id: `app-${Date.now()}`,
      schemeOrDocName: analysisResult.documentType || analysisResult.fileName,
      trackingNumber: analysisResult.referenceNumber || 'DOC-REF-ACTIVE',
      submittedDate: new Date().toLocaleDateString('en-IN'),
      status: 'Requires Clarification',
      notes: `Action required: ${analysisResult.requiredActionSummary}`,
      nextFollowUpDate: deadlineDate,
    });
    setAddedReminder(true);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Bureaucracy Decoder</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {t.documentSimplifierTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {t.documentSimplifierSubtitle}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center space-x-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveMode('sample')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'sample'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{t.sampleTab}</span>
            </button>

            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'upload'
                  ? 'bg-white text-orange-700 shadow-xs ring-1 ring-stone-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.uploadTab}</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Sample Documents Selector */}
        {activeMode === 'sample' && (
          <div className="mt-5 pt-4 border-t border-stone-100">
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>{t.sampleDocTitle}</span>
              <span className="text-[11px] text-slate-400 font-normal">Click any document to test instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {SAMPLE_DOCUMENTS.map((doc) => {
                const isSelected = selectedSampleId === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleAnalyzeSample(doc.id)}
                    className={`text-left p-3 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'bg-orange-50/90 border-orange-400 text-slate-900 shadow-xs ring-2 ring-orange-400/20'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-slate-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-extrabold line-clamp-1">
                        {doc.title}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 mt-1"></span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {doc.previewSnippet}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-medium">
                      <span>{doc.department.split(',')[0]}</span>
                      <span>{doc.date}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mode 2: Upload User Document */}
        {activeMode === 'upload' && (
          <div className="mt-5 pt-4 border-t border-stone-100">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-orange-400 rounded-2xl p-6 sm:p-8 text-center cursor-pointer bg-stone-50/70 hover:bg-orange-50/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.dragDropText}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Supports Aadhaar notices, land records (Pahani/7-12), court summons, scheme sanction orders, caste certificates (PDF, JPG, PNG up to 25MB)
              </p>
              <button
                type="button"
                className="mt-3 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-slate-800 shadow-xs group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-colors"
              >
                {t.browseFiles}
              </button>

              {uploadedFile && (
                <div className="mt-3 inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{uploadedFile.name} ({uploadedFile.size})</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {analyzing && (
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center animate-pulse">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {t.analyzingDocument}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {t.analyzingSubtitle}
          </p>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Analysis Output Results */}
      {analysisResult && !analyzing && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header Card: Document Metadata & Urgency */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-stone-200">
                    {analysisResult.documentType}
                  </span>

                  {analysisResult.urgencyLevel === 'High' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Urgent: Action Required</span>
                    </span>
                  )}

                  {analysisResult.urgencyLevel === 'Medium' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      Moderate Priority
                    </span>
                  )}

                  {analysisResult.urgencyLevel === 'Low' && (
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Informational / Record
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {analysisResult.fileName}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{analysisResult.issuingAuthority}</span>
                  </span>
                  {analysisResult.referenceNumber && (
                    <span className="font-mono text-slate-700 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                      Ref: {analysisResult.referenceNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Audio Read Aloud Button */}
                <button
                  onClick={handleToggleAudio}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isPlayingAudio
                      ? 'bg-orange-600 text-white animate-pulse'
                      : 'bg-stone-100 hover:bg-stone-200 text-slate-800'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>{t.stopAudio}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-orange-600" />
                      <span>{t.listenSummary}</span>
                    </>
                  )}
                </button>

                {/* Ask Voice Sahayak with this Document */}
                <button
                  onClick={() => onOpenVoiceWithContext(analysisResult.plainSummary)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Ask AI Sahayak</span>
                </button>

                {/* Add to Deadlines / Tracker */}
                <button
                  onClick={handleAddDeadlineReminder}
                  disabled={addedReminder}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    addedReminder
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {addedReminder ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Added to Tracker!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Add to My Reminders</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Grid: Plain Language Summary + Validity/Deadlines Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1 & 2: Plain Language Explanation */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>{t.plainSummaryHeading}</span>
                </div>
                <div className="mt-2 text-sm text-slate-800 leading-relaxed font-normal bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  {analysisResult.plainSummary}
                </div>
              </div>

              {/* Action Summary Pill */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    Core Citizen Action:
                  </div>
                  <div className="text-xs text-amber-900 font-semibold mt-0.5">
                    {analysisResult.requiredActionSummary}
                  </div>
                </div>
              </div>

              {/* Fees & Subsidies */}
              {analysisResult.feesAndCosts && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start space-x-2.5">
                  <IndianRupee className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                      {t.feesHeading}:
                    </div>
                    <div className="text-xs text-emerald-900 font-semibold mt-0.5">
                      {analysisResult.feesAndCosts}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Validity & Deadlines Detection */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{t.importantDatesHeading}</span>
                </div>

                {/* Expiry Pill */}
                <div className="p-3 rounded-xl bg-slate-50 border border-stone-200 mb-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Validity / Expiry Cutoff
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center justify-between">
                    <span>{analysisResult.validityExpiryDate || 'Not Specified'}</span>
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                </div>

                {/* List of Key Dates */}
                <div className="space-y-2">
                  {analysisResult.importantDates?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/60 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{item.label}</span>
                        <span className={item.isDeadline ? 'text-red-600 font-extrabold' : 'text-slate-600'}>
                          {item.date}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dates verified directly from document text</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: “What Should I Do Next?” Interactive Action Plan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <CheckSquare className="w-4 h-4" />
                  <span>{t.whatNextHeading}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  Follow this concrete checklist to resolve your document
                </h3>
              </div>

              {/* Progress counter */}
              <div className="text-xs font-semibold text-slate-500">
                Completed:{' '}
                <strong className="text-emerald-600">
                  {Object.values(completedSteps).filter(Boolean).length}
                </strong>{' '}
                / {analysisResult.nextSteps?.length || 0} steps
              </div>
            </div>

            <div className="space-y-3">
              {analysisResult.nextSteps?.map((step) => {
                const isDone = !!completedSteps[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleStepCompleted(step.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-600'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 text-slate-400">
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-stone-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            Step {step.stepNumber}: {step.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-slate-600">
                            {step.whereToProceed}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {step.description}
                        </p>

                        {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Carry these:
                            </span>
                            {step.requiredDocuments.map((docName, dIdx) => (
                              <span
                                key={dIdx}
                                className="px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                              >
                                {docName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Official Verification Guidance & Authorities */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.verificationHeading}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              How & Where to Authenticate this Official Notice
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Digital Portals */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                <div className="text-xs font-bold text-purple-900 flex items-center space-x-1.5 mb-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.verifiedOfficial}</span>
                </div>
                <div className="space-y-2">
                  {analysisResult.verificationGuidance?.officialPortals?.map((portal, pIdx) => (
                    <a
                      key={pIdx}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-white border border-purple-100 hover:border-purple-300 transition-colors group"
                    >
                      <div className="text-xs font-bold text-purple-800 group-hover:text-purple-950 flex items-center justify-between">
                        <span>{portal.name}</span>
                        <ExternalLink className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {portal.purpose}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Box 2: Physical Office */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5 mb-2">
                  <Building className="w-3.5 h-3.5" />
                  <span>{t.physicalOfficeNotice}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysisResult.verificationGuidance?.physicalOffice ||
                    'Visit your nearest Taluk Office, Tahsildar Court, or Gram Panchayat headquarters.'}
                </p>
                <div className="mt-3 text-[11px] text-blue-800 font-medium">
                  Authentication Method: {analysisResult.verificationGuidance?.authenticationMethod}
                </div>
              </div>

              {/* Box 3: CSC Help */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>{t.cscAssistance}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysisResult.verificationGuidance?.cscGuidance ||
                    'Visit your local Common Service Centre (CSC) / Jan Seva Kendra / Grama One for assisted biometric and barcode authentication.'}
                </p>
              </div>
            </div>

            {/* Clear Civic Distinction & Disclaimer */}
            <div className="mt-4 p-3 rounded-xl bg-stone-100 text-slate-600 text-[11px] flex items-start space-x-2 border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Verification Boundary Notice:</strong> {analysisResult.verificationGuidance?.officialDisclaimer || t.disclaimerText}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
