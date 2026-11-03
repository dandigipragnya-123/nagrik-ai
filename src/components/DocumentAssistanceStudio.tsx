import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Calendar,
  IndianRupee,
  Building,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Send,
  Eye,
  FileCheck2,
  FileWarning,
  MessageSquare
} from 'lucide-react';
import { DocumentAnalysis, CitizenProfile, SupportedLanguage, DocumentQuestionAnswer } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

interface DocumentAssistanceStudioProps {
  citizen: CitizenProfile | null;
  language: SupportedLanguage;
  onBackToDashboard: () => void;
  onDocumentAnalyzed?: (analysis: DocumentAnalysis) => void;
}

export const DocumentAssistanceStudio: React.FC<DocumentAssistanceStudioProps> = ({
  citizen,
  language,
  onBackToDashboard,
  onDocumentAnalyzed,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Uploaded file state
  const [file, setFile] = useState<{
    name: string;
    size: string;
    type: string;
    base64: string;
    previewUrl?: string;
  } | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysis | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Follow-up Question State
  const [userQuestion, setUserQuestion] = useState('');
  const [answeringQuestion, setAnsweringQuestion] = useState(false);
  const [qaHistory, setQaHistory] = useState<DocumentQuestionAnswer[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and handle file
  const handleFileSelection = (selectedFile: File) => {
    setValidationError(null);
    setAnalysisResult(null);

    // 1. Format check
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    const isAllowedExt = allowedExtensions.includes(ext);
    const isAllowedMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(selectedFile.type);

    if (!isAllowedExt && !isAllowedMime) {
      setValidationError('Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG file.');
      return;
    }

    // 2. Max size 10 MB
    if (selectedFile.size > 10 * 1024 * 1024) {
      setValidationError('File size exceeds the 10 MB limit. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      // 3. Password-protected PDF quick check
      if (selectedFile.type === 'application/pdf' || ext === 'pdf') {
        const rawPrefix = atob(base64.slice(0, 4000).split(',')[1] || '');
        if (rawPrefix.includes('/Encrypt')) {
          setValidationError('This PDF is password-protected. Please remove the password and re-upload.');
          return;
        }
      }

      setFile({
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        type: selectedFile.type || 'application/pdf',
        base64,
        previewUrl: selectedFile.type.startsWith('image/') ? base64 : undefined,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleExplainDocument = async () => {
    if (!file) return;

    setAnalyzing(true);
    setValidationError(null);
    setUploadProgress(15);

    // Progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 250);

    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64: file.base64,
          mimeType: file.type,
          fileName: file.name,
          language: selectedLanguage,
          citizenProfile: citizen,
        }),
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        if (onDocumentAnalyzed) {
          onDocumentAnalyzed(data.analysis);
        }
      } else {
        throw new Error(data.error || 'Failed to analyze document.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setValidationError(err.message || 'Unable to process document. Please check the file and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Test with verified sample
  const handleSelectSample = (sample: any) => {
    setFile({
      name: sample.title,
      size: '1.2 MB',
      type: 'application/pdf',
      base64: 'data:application/pdf;base64,SAMPLE',
    });
    setAnalysisResult(null);
    setValidationError(null);

    // Trigger analysis with sample text
    setAnalyzing(true);
    setUploadProgress(40);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentText: sample.fullOfficialText,
            fileName: sample.title,
            language: selectedLanguage,
            citizenProfile: citizen,
          }),
        });
        const data = await res.json();
        if (data.success && data.analysis) {
          setAnalysisResult(data.analysis);
          if (onDocumentAnalyzed) {
            onDocumentAnalyzed(data.analysis);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAnalyzing(false);
        setUploadProgress(100);
      }
    }, 600);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || answeringQuestion || !analysisResult) return;

    const q = userQuestion.trim();
    setUserQuestion('');
    setAnsweringQuestion(true);

    try {
      const res = await fetch('/api/documents/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          documentAnalysis: analysisResult,
          language: selectedLanguage,
        }),
      });
      const data = await res.json();

      const newQA: DocumentQuestionAnswer = {
        id: `qa-${Date.now()}`,
        question: q,
        answer: data.answer || 'Information is not explicitly mentioned in this document.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setQaHistory((prev) => [...prev, newQA]);
    } catch (err) {
      console.error(err);
    } finally {
      setAnsweringQuestion(false);
    }
  };

  const handleDeleteDocument = () => {
    setFile(null);
    setAnalysisResult(null);
    setQaHistory([]);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {file && (
          <button
            onClick={handleDeleteDocument}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </button>
        )}
      </div>

      {/* Hero Explainer Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Document Assistance Service
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          Understand Your Government Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Have a government document you don't understand? Upload it here. We will explain it in simple language without complicated legal terminology.
        </p>

        {/* Upload Rules Badge */}
        <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-slate-200 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span><strong>Accepted formats:</strong> PDF, JPG, JPEG, PNG</span>
          <span>•</span>
          <span><strong>Maximum size:</strong> 10 MB</span>
          <span>•</span>
          <span><strong>PDF limit:</strong> 20 pages</span>
          <span>•</span>
          <span>One document at a time</span>
        </div>
      </div>

      {validationError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span className="font-medium">{validationError}</span>
        </div>
      )}

      {/* Upload Box (if no file chosen yet) */}
      {!file && (
        <div className="space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
          />

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-3xl p-8 sm:p-12 text-center bg-white cursor-pointer hover:bg-emerald-50/20 transition-all shadow-xs group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Drag & Drop your document here, or Browse
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Upload court notices, land records (Pahani/7-12), pension orders, scheme sanction letters, or caste certificate renewals.
            </p>

            <button
              type="button"
              className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Browse Files on Device
            </button>
          </div>

          {/* Quick Verified Samples */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Or try one of these verified government document samples:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_DOCUMENTS.slice(0, 3).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-3 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs"
                >
                  <div className="font-bold text-slate-900 line-clamp-1">{sample.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 mt-1">{sample.previewSnippet}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* File Selected State (Before Analysis) */}
      {file && !analysisResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {file.size} • Ready for analysis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Replace File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="hidden"
              />
            </div>
          </div>

          {/* Explanation Language Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Preferred Explanation Language:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    selectedLanguage === lang.code
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  <div>{lang.nativeName}</div>
                  <div className="text-[10px] opacity-80">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          {analyzing && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Reading and translating official text...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            disabled={analyzing}
            onClick={handleExplainDocument}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analysing with AI OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain My Document</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Results Display (Sections A through H) */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Metadata Bar */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {analysisResult.documentType}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-stone-100 text-slate-700">
                  {analysisResult.issuingAuthority}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {analysisResult.fileName}
              </h2>
            </div>

            <button
              onClick={handleDeleteDocument}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Document</span>
            </button>
          </div>

          {/* Section A & B: What Is This & Why Important */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section A: What is this document? */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                <FileText className="w-4 h-4" />
                <span>A. What is this document?</span>
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-normal bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                {analysisResult.whatIsThis}
              </p>
            </div>

            {/* Section B: Why is it important? */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>B. Why is it important?</span>
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-normal bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                {analysisResult.whyImportant}
              </p>
            </div>
          </div>

          {/* Section C: Important Information */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              <span>C. Important Information</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Applicant / Owner Name
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {analysisResult.importantInfo?.applicantName || 'Not Mentioned'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Reference / Order Number
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                  {analysisResult.importantInfo?.referenceNumber || analysisResult.referenceNumber || 'Not Mentioned'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Issuing Department
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {analysisResult.importantInfo?.issuingAuthority || analysisResult.issuingAuthority}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Issue Date
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {analysisResult.importantInfo?.issueDate || analysisResult.documentDate || 'Not Mentioned'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Expiry Date
                </div>
                <div className="text-xs font-bold text-red-600 mt-0.5">
                  {analysisResult.importantInfo?.expiryDate || analysisResult.validityExpiryDate || 'Not mentioned in the document'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Fees, Penalties or Subsidies
                </div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">
                  {analysisResult.importantInfo?.feesOrSubsidies || analysisResult.feesAndCosts || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Important Dates & Deadlines */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-red-700 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>D. Important Dates</span>
            </span>

            {analysisResult.importantDates && analysisResult.importantDates.length > 0 ? (
              <div className="space-y-2">
                {analysisResult.importantDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-red-50/50 border border-red-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{item.label}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                    <span className="font-bold text-red-700 shrink-0 ml-3">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-stone-50 rounded-2xl">
                Not mentioned in the document.
              </p>
            )}
          </div>

          {/* Section E: What should I do next? */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>E. What should I do next? (Action Checklist)</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                Click step to mark completed
              </span>
            </div>

            <div className="space-y-2.5">
              {(analysisResult.whatNext || []).map((action) => {
                const isDone = !!completedSteps[action.stepNumber];
                return (
                  <div
                    key={action.stepNumber}
                    onClick={() =>
                      setCompletedSteps((prev) => ({
                        ...prev,
                        [action.stepNumber]: !prev[action.stepNumber],
                      }))
                    }
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-slate-600'
                        : 'bg-white border-stone-200 hover:border-emerald-300 text-slate-900'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          Step {action.stepNumber}: {action.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-slate-600">
                          {action.whereToProceed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section F: Documents You May Need */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 flex items-center space-x-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>F. Documents You May Need</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(analysisResult.documentsNeeded || []).map((doc, idx) => (
                <div key={idx} className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs font-semibold text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section G: How Can I Verify This Document? */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>G. How Can I Verify This Document?</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-slate-900 block mb-1">Official Verification Portals:</strong>
                <div className="space-y-1.5">
                  {analysisResult.verificationGuide?.officialPortals?.map((p, pIdx) => (
                    <a
                      key={pIdx}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline font-bold"
                    >
                      {p.name} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <strong className="text-slate-900 block mb-1">Physical Verification Office:</strong>
                <p className="text-slate-600 leading-relaxed">
                  {analysisResult.verificationGuide?.physicalOffice || 'Local Taluk Office / Gram Panchayat'}
                </p>
                <div className="text-[11px] text-slate-500 mt-2">
                  {analysisResult.verificationGuide?.cscGuidance}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-1">
              {analysisResult.verificationGuide?.disclaimer ||
                'NagrikAI helps you understand government documents and services. It does not replace government authorities, legal professionals, or official verification decisions.'}
            </p>
          </div>

          {/* Section H: Ask a Question About This Document */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-700 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>H. Ask a Question About This Document</span>
            </span>
            <p className="text-xs text-slate-500">
              Have a specific question about dates, fees, or where to go? Ask below and get an exact answer grounded in your uploaded document:
            </p>

            {/* Q&A History */}
            {qaHistory.length > 0 && (
              <div className="space-y-3 pt-2">
                {qaHistory.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span className="text-blue-600">Q:</span>
                      <span>{item.question}</span>
                    </div>
                    <div className="text-slate-700 leading-relaxed pl-4 border-l-2 border-emerald-500">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Input Form */}
            <form onSubmit={handleAskQuestion} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="e.g., Is there any penalty for late submission? Where is the office?"
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={!userQuestion.trim() || answeringQuestion}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                {answeringQuestion ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
