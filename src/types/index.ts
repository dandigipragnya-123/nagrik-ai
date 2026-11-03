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

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface CitizenProfile {
  id: string;
  userId?: string;
  mobile?: string;
  email?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other' | 'Prefer not to say' | string;
  caste: CasteCategory;
  annualIncome: number; // in INR
  incomeBracket?: '< ₹1 Lakh' | '₹1 Lakh - ₹2.5 Lakh' | '₹2.5 Lakh - ₹5 Lakh' | '₹5 Lakh - ₹8 Lakh' | '> ₹8 Lakh' | string;
  state: string;
  district: string;
  areaType?: 'Rural' | 'Urban' | 'Semi-Urban';
  pincode?: string;
  occupation: OccupationType | string;
  educationLevel?: string;
  hasLand?: boolean;
  landAreaAcres?: number;
  hasRationCard?: boolean;
  rationCardType?: 'AAY (Antyodaya)' | 'BPL (Below Poverty Line)' | 'APL (Above Poverty Line)' | 'None' | string;
  isDifferentlyAbled?: boolean;
  isStudent?: boolean;
  isSingleWomanOrWidow?: boolean;
  isFarmer?: boolean;
  hasDisability?: boolean;
  residentialAddress?: string;
  lastUpdated?: string;
}

export interface SchemeEligibilityForm {
  // Step 1: Personal
  age: number;
  gender: 'Male' | 'Female' | 'Transgender' | 'Prefer not to say';
  state: string;
  district: string;
  areaType: 'Rural' | 'Urban' | 'Semi-Urban';

  // Step 2: Education & Occupation
  occupation: OccupationType;
  educationLevel: 'School / 10th / 12th' | 'Diploma / ITI' | 'Graduate / Degree' | 'Post-Graduate' | 'None / Informal';
  institutionType?: 'Government' | 'Government-Aided' | 'Private' | 'Competitive Exam Aspirant';

  // Step 3: Financial
  annualIncome: number;
  incomeCategory: '< ₹1 Lakh' | '₹1 Lakh - ₹2.5 Lakh' | '₹2.5 Lakh - ₹5 Lakh' | '₹5 Lakh - ₹8 Lakh' | '> ₹8 Lakh';
  caste: CasteCategory;

  // Step 4: Additional (optional)
  hasLand: boolean;
  landAreaAcres?: number;
  hasRationCard: boolean;
  rationCardType?: 'AAY (Antyodaya)' | 'BPL (Below Poverty Line)' | 'APL (Above Poverty Line)' | 'None';
  isDifferentlyAbled: boolean;
  isSingleWomanOrWidow: boolean;
}

export interface DocumentQuestionAnswer {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileSize?: string;
  fileData?: string; // base64 preview
  mimeType?: string;

  // Citizen-friendly structured sections (Section A to G)
  whatIsThis?: string; // 2-3 simple sentences explaining what the document is
  whyImportant?: string; // Purpose and why citizen needs it
  importantInfo?: {
    applicantName?: string;
    referenceNumber?: string;
    issuingAuthority?: string;
    issueDate?: string;
    expiryDate?: string;
    feesOrSubsidies?: string;
    addressOrProperty?: string;
    importantConditions?: string;
  };
  importantDates?: Array<{
    label: string;
    date: string;
    isDeadline: boolean;
    description: string;
  }>;
  whatNext?: Array<{
    stepNumber: number;
    title: string;
    description: string;
    requiredDocuments: string[];
    whereToProceed: string;
    isCompleted?: boolean;
  }>;
  documentsNeeded?: string[];
  verificationGuide?: {
    authenticationMethod: string;
    officialPortals: Array<{
      name: string;
      url: string;
      purpose: string;
    }>;
    physicalOffice: string;
    cscGuidance: string;
    disclaimer: string;
  };

  // Follow-up Q&A
  qaList?: DocumentQuestionAnswer[];

  urgencyLevel: 'High' | 'Medium' | 'Low' | 'Expired';
  plainSummary: string;
  documentType: string;
  issuingAuthority: string;
  referenceNumber?: string;
  documentDate?: string;
  validityExpiryDate?: string;
  feesAndCosts?: string;
  requiredActionSummary?: string;
  nextSteps?: Array<{
    id: string;
    stepNumber: number;
    title: string;
    description: string;
    requiredDocuments: string[];
    whereToProceed: string;
    isCompleted?: boolean;
  }>;
  verificationGuidance?: any;
  matchedSchemes?: string[];
  analyzedAt: string;
  targetLanguage: SupportedLanguage;
}

export interface Scheme {
  id: string;
  title: string;
  name?: string;
  ministryOrState: string;
  ministry?: string;
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
  whoCanApply?: string;
  financialBenefit: string;
  benefitsSummary?: string;
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
  applicationDeadline?: string;
  officialSource: string;
  officialPortalUrl?: string;
  lastVerifiedDate: string;
  tag?: 'Popular' | 'High Subsidy' | 'Direct Benefit' | 'Fast Track';
}

export interface SavedScheme {
  id: string;
  userId?: string;
  citizen_id?: string;
  schemeId?: string;
  scheme_id?: string;
  schemeTitle?: string;
  schemeName?: string;
  scheme_name?: string;
  ministry?: string;
  category?: string;
  benefit?: string;
  benefits?: string;
  status?: 'Likely Eligible' | 'May Be Eligible' | 'Not Eligible' | string;
  eligibility_status?: string;
  official_portal?: string;
  officialPortal?: string;
  savedAt?: string;
  created_at?: string;
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
  status: 'Draft' | 'Submitted' | 'Under Verification' | 'Action Required' | 'Approved' | 'Rejected' | 'Requires Clarification' | 'Approved / Sanctioned' | string;
  notes: string;
  nextFollowUpDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioAvailable?: boolean;
}
