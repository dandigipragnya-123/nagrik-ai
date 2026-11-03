export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr' | 'bn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';

export type OccupationType =
  | 'Farmer / Agriculture'
  | 'Small Business / Street Vendor'
  | 'Daily Wage / Construction Worker'
  | 'Salaried / Private Employee'
  | 'Government Employee'
  | 'Student / Aspirant'
  | 'Unemployed Youth'
  | 'Senior Citizen / Retired'
  | 'Homemaker / Self-employed Woman'
  | 'Artisan / Handloom Worker';

export interface CitizenProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other';
  caste: CasteCategory;
  annualIncome: number; // in INR
  incomeBracket: '< ₹1 Lakh' | '₹1 Lakh - ₹2.5 Lakh' | '₹2.5 Lakh - ₹5 Lakh' | '₹5 Lakh - ₹8 Lakh' | '> ₹8 Lakh';
  state: string;
  district: string;
  areaType: 'Rural' | 'Urban' | 'Semi-Urban';
  pincode: string;
  occupation: OccupationType;
  hasLand: boolean;
  landAreaAcres?: number;
  hasRationCard: boolean;
  rationCardType?: 'AAY (Antyodaya)' | 'BPL (Below Poverty Line)' | 'APL (Above Poverty Line)' | 'None';
  isDifferentlyAbled: boolean;
  isStudent: boolean;
  isSingleWomanOrWidow: boolean;
  lastUpdated: string;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize?: string;
  documentType: string;
  issuingAuthority: string;
  referenceNumber?: string;
  documentDate?: string;
  validityExpiryDate?: string;
  urgencyLevel: 'High' | 'Medium' | 'Low' | 'Expired';
  plainSummary: string;
  importantDates: Array<{
    label: string;
    date: string;
    isDeadline: boolean;
    description: string;
  }>;
  feesAndCosts: string;
  requiredActionSummary: string;
  nextSteps: Array<{
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    requiredDocuments: string[];
    whereToProceed: string;
    isCompleted?: boolean;
  }>;
  verificationGuidance: {
    authenticationMethod: string;
    officialPortals: Array<{
      name: string;
      url: string;
      purpose: string;
    }>;
    physicalOffice: string;
    cscGuidance: string;
    officialDisclaimer: string;
  };
  matchedSchemes?: string[];
  rawExtractedText?: string;
  analyzedAt: string;
  targetLanguage: SupportedLanguage;
}

export interface Scheme {
  id: string;
  title: string;
  ministryOrState: string;
  level: 'Central' | 'State';
  applicableStates?: string[]; // empty means all India
  category:
    | 'Agriculture & Farming'
    | 'Healthcare & Insurance'
    | 'Education & Scholarships'
    | 'Housing & Sanitation'
    | 'Women & Child Development'
    | 'Financial Inclusion & Business'
    | 'Social Security & Pension';
  summary: string;
  financialBenefit: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    gender?: 'All' | 'Female' | 'Male';
    allowedCastes?: CasteCategory[];
    maxAnnualIncome?: number;
    occupations?: OccupationType[];
    landRequirement?: 'Must own land' | 'Landless only' | 'Any';
    areaType?: 'Rural' | 'Urban' | 'Any';
    specialConditions?: string[];
  };
  requiredDocuments: string[];
  applicationProcess: {
    onlineUrl?: string;
    offlineOffice?: string;
    steps: string[];
  };
  officialSource: string;
  lastVerifiedDate: string;
  tag?: 'Popular' | 'High Subsidy' | 'Direct Benefit' | 'Fast Track';
}

export interface GovUpdate {
  id: string;
  title: string;
  department: string;
  date: string;
  category: 'Scheme Launch' | 'Deadline Extension' | 'DBT Subsidy' | 'Order & Gazette' | 'Advisory';
  summary: string;
  officialSourceUrl: string;
  sourceName: string;
  isUrgent: boolean;
  applicableCategory?: string;
  verifiedBadge: boolean;
}

export interface TrackedApplication {
  id: string;
  schemeOrDocName: string;
  trackingNumber: string;
  submittedDate: string;
  status: 'Draft' | 'Submitted' | 'Under Verification' | 'Requires Clarification' | 'Approved / Sanctioned';
  notes: string;
  nextFollowUpDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
}
