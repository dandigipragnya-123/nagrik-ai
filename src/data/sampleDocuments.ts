import { DocumentAnalysis } from '../types';

export interface SampleDocumentItem {
  id: string;
  title: string;
  docType: string;
  department: string;
  date: string;
  previewSnippet: string;
  fullOfficialText: string;
  precomputedAnalysis: Partial<DocumentAnalysis>;
}

export const SAMPLE_DOCUMENTS: SampleDocumentItem[] = [
  {
    id: 'sample-kcc',
    title: 'Kisan Credit Card (KCC) Crop Loan Verification & Interest Subvention Notice',
    docType: 'Agricultural Banking Notice / Interest Subvention Order',
    department: 'State Level Bankers’ Committee & Dept of Agriculture',
    date: '14-10-2026',
    previewSnippet: 'Notice to KCC holders regarding mandatory annual crop inspection, Aadhaar-NPCI mapping, and 3% prompt repayment incentive.',
    fullOfficialText: `GOVERNMENT OF INDIA / STATE LEVEL BANKERS' COMMITTEE
REF NO: SLBC/KCC/REV-2026/89412
DATE OF ISSUE: 14th October 2026

SUBJECT: NOTICE FOR ANNUAL INSPECTION, MANDATORY E-KYC AND PROMPT REPAYMENT INCENTIVE (PRI) CLAIM UNDER KISAN CREDIT CARD (KCC) SCHEME

To: All KCC Account Beneficiaries, Rural Branches, District Mandya / Tumakuru / Belagavi

1. Reference is made to Ministry of Agriculture & Farmers Welfare Circular No. AGRI-11025/3/2026 regarding Modified Interest Subvention Scheme (MISS).
2. All eligible farmers holding KCC crop loan limits up to ₹3,00,000/- are hereby notified that the concessional base interest rate is fixed at 7% per annum. Farmers ensuring prompt repayment within 12 months from disbursement date shall receive an additional prompt repayment subvention of 3%, reducing the effective interest burden to 4% p.a.
3. DEADLINE & MANDATORY ACTION REQUIRED:
   (a) Submission of latest Record of Rights (RoR / Pahani / 7-12) showing standing Kharif/Rabi crop cultivation must be completed at the home bank branch on or before 15th December 2026.
   (b) Mandatory Aadhaar-NPCI bank account seeding must be verified at the branch or through micro-ATM to avoid suspension of interest subsidy benefit.
   (c) Outstanding crop loan dues for Kharif 2025-26 cycle must be renewed/repaid by 31st January 2027 to retain the 3% interest relief.
4. PENALTY CLAUSE: Default in renewal or failure to provide land records by the stipulated cut-off date will disqualify the borrower from interest subvention, attracting normal commercial lending rates of 11.85% p.a. plus penal interest.
5. Official authentication can be verified on the JanSamarth Portal (jansamarth.in) or by visiting the Block Assistant Director of Agriculture office.

By Order of Nodal Officer, State Level Bankers' Committee`,
    precomputedAnalysis: {
      documentType: 'Official Banking Notice / KCC Crop Loan Order',
      issuingAuthority: 'State Level Bankers’ Committee & Dept of Agriculture, Govt of India',
      referenceNumber: 'SLBC/KCC/REV-2026/89412',
      documentDate: '14 October 2026',
      validityExpiryDate: '15 December 2026',
      urgencyLevel: 'High',
      feesAndCosts: 'Effective Interest Rate: 4% p.a. (if repaid on time), otherwise jumps to 11.85% p.a.',
      requiredActionSummary: 'Submit updated Land RoR/Pahani and verify Aadhaar-NPCI account linking at your home bank branch before 15 December 2026.',
    },
  },
  {
    id: 'sample-pmay',
    title: 'PMAY-Gramin Second Installment Geo-tagging & Construction Sanction Order',
    docType: 'Housing Sanction & DBT Milestone Release Notice',
    department: 'Block Development Office, Ministry of Rural Development',
    date: '28-09-2026',
    previewSnippet: 'Sanction letter releasing 2nd installment of ₹45,000 upon verified plinth level geo-tagging under Pradhan Mantri Awas Yojana.',
    fullOfficialText: `OFFICE OF THE BLOCK DEVELOPMENT OFFICER (BDO)
RURAL DEVELOPMENT & PANCHAYAT RAJ DEPARTMENT
ORDER NO: BDO/PMAY-G/PHASE-III/SANCTION/2026-0921
DATE: 28th September 2026

ORDER OF SANCTION AND STAGE VERIFICATION: PRADHAN MANTRI AWAS YOJANA (GRAMIN)

Beneficiary ID: KA-PMAYG-2025-881940
Beneficiary Name: Smt. Gangamma W/o Late Siddaraju
Panchayat: Doddaballapura Gram Panchayat, Bengaluru Rural

1. In continuation of Sanction Order No. 4410 dated 12th February 2026 granting administrative sanction of ₹1,20,000/- for construction of pucca residential unit under PMAY-G;
2. Whereas the Gram Panchayat Technical Assistant has completed physical inspection and uploaded stage-1 Geo-tagged photographs confirming completion of foundation and plinth level;
3. Sanction is hereby accorded for disbursement of Second Installment amounting to ₹45,000/- (Rupees Forty-Five Thousand only) directly to the beneficiary’s Aadhaar-seeded Bank Account (PFMS Transaction ID: PFMS-2026-KA-49102).
4. CONDITIONS & NEXT TIMELINES:
   - The beneficiary must carry out roof casting and lintel level construction within 60 days from the date of fund credit (Deadline: 30th November 2026).
   - Upon completion of lintel level, the beneficiary must notify the Village Secretary for stage-2 mobile geo-tagging via the AwaasApp.
   - Separate grant of ₹12,000/- for toilet construction under Swachh Bharat Mission (Gramin) and 90 person-days wages under MGNREGA are being processed concurrently.
5. WARNING: In case construction is abandoned or funds utilized for non-housing purposes, recovery proceedings under the Public Demands Recovery Act will be initiated.
6. Verify status on AwaasSoft (pmayg.nic.in) using your 7-digit registration number.`,
    precomputedAnalysis: {
      documentType: 'PMAY-G Financial Sanction & Milestone Order',
      issuingAuthority: 'Office of the Block Development Officer (BDO), Rural Development Dept',
      referenceNumber: 'BDO/PMAY-G/PHASE-III/SANCTION/2026-0921',
      documentDate: '28 September 2026',
      validityExpiryDate: '30 November 2026',
      urgencyLevel: 'Medium',
      feesAndCosts: 'Grant of ₹45,000 released; Additional ₹12,000 for toilet under SBM pending',
      requiredActionSummary: 'Complete roof and lintel construction within 60 days (before 30 Nov 2026) and request Village Secretary for stage-2 AwaasApp geo-tagging.',
    },
  },
  {
    id: 'sample-caste-income',
    title: 'Revenue Department - Caste & Income Certificate Renewal & Verification Summons',
    docType: 'Statutory Revenue Authority Notice',
    department: 'Office of the Tahsildar / Taluk Magistrate, Revenue Department',
    date: '02-11-2026',
    previewSnippet: 'Official summons for verification of Category-IIA / OBC non-creamy layer certificate validity and income declaration.',
    fullOfficialText: `COURT OF THE TAHSILDAR & EXECUTIVE TALUK MAGISTRATE
REVENUE DEPARTMENT, GOVT OF KARNATAKA / MAHARASHTRA
CASE NO: REV/CERT-VERIF/2026/10492
DATE: 2nd November 2026

NOTICE UNDER SECTION 4 OF THE SCHEDULED CASTES, SCHEDULED TRIBES AND OTHER BACKWARD CLASSES (RESERVATION OF APPOINTMENTS ETC.) ACT

To: The Applicant / Certificate Holder
Subject: Renewal and Statutory Cross-Verification of Category/OBC Non-Creamy Layer Certificate No: RD00384910482

1. Records indicate that your Caste and Income Certificate issued on 15th December 2021 has attained expiry upon completion of the statutory 5-year validity period ending 14th December 2026.
2. In accordance with Government Order No. SWD-119-REV-2024, candidates claiming benefits under State education reservations, public recruitment, or government scholarship portals must hold an active Barcode-digitized certificate.
3. You are hereby called upon to present yourself or your authorized representative along with the following primary documents before the Revenue Inspector at Nadakacheri / Taluk Administrative Complex on or before 25th November 2026:
   (i) Original School Leaving Certificate / Transfer Certificate showing recorded caste.
   (ii) Three consecutive years (2023-24, 2024-25, 2025-26) Agriculture / Salary / Business Income declaration or ITR-V.
   (iii) Aadhaar Card and Smart Ration card of parents and applicant.
   (iv) Affidavit on ₹20/- e-stamp paper affirming non-creamy layer status.
4. Failure to appear or submit digital renewal via Seva Sindhu / Nadakacheri portal before 25th November 2026 shall result in cancellation of reserved status and revocation of barcode credentials from the state digital repository.

Seal & Signature:
Tahsildar & Taluk Executive Magistrate`,
    precomputedAnalysis: {
      documentType: 'Statutory Revenue Summons / Certificate Expiry Notice',
      issuingAuthority: 'Office of the Tahsildar & Executive Taluk Magistrate, Revenue Dept',
      referenceNumber: 'REV/CERT-VERIF/2026/10492',
      documentDate: '02 November 2026',
      validityExpiryDate: '25 November 2026',
      urgencyLevel: 'High',
      feesAndCosts: 'Statutory application fee: ₹40/- at Nadakacheri/CSC; ₹20/- e-stamp affidavit',
      requiredActionSummary: 'Submit 3-year income proof and school transfer certificate for OBC non-creamy layer renewal before 25 November 2026.',
    },
  },
  {
    id: 'sample-ration-kyc',
    title: 'Dept of Food & Civil Supplies - Mandatory Ration Card e-KYC & Aadhaar Seeding',
    docType: 'Public Distribution Order / Ration Card Biometric Advisory',
    department: 'Department of Food, Civil Supplies and Consumer Affairs',
    date: '10-10-2026',
    previewSnippet: 'Order mandating POS biometric verification for all family members listed on BPL/AAY ration cards to prevent ration quota suspension.',
    fullOfficialText: `DEPARTMENT OF FOOD, CIVIL SUPPLIES & CONSUMER AFFAIRS
NOTIFICATION NO: FCS/NFSA/E-KYC/MANDATORY/2026-44
DATE: 10th October 2026

ORDER: MANDATORY BIOMETRIC E-KYC OF BENEFICIARIES UNDER THE NATIONAL FOOD SECURITY ACT (NFSA) AND ONE NATION ONE RATION CARD (ONORC)

1. Pursuant to directives issued by the Department of Food and Public Distribution, Government of India, all beneficiaries possessing Antyodaya Anna Yojana (AAY) and Priority Household (BPL) ration cards are instructed to undergo 100% biometric e-KYC.
2. It has been observed that in several family ration cards, biometric authentication of children aged 5+ and elderly family members has not been updated in the Central UIDAI repository.
3. INSTRUCTIONS TO ALL CITIZENS:
   - Every individual member whose name appears on the ration card must visit the nearest Fair Price Shop (FPS / Ration Dukan) or Common Service Centre (CSC).
   - Biometric authentication (Fingerprint / Iris / Face Auth via Mera Ration App) must be completed free of charge on the e-POS machine.
   - The fair price dealer is strictly prohibited from charging any fee for e-KYC authentication.
4. CRUCIAL DEADLINE:
   The nationwide window for biometric verification closes on 31st December 2026. Names of members failing e-KYC by this date will be temporarily deactivated from the subsidized grain allocation roster from January 2027.
5. Official Toll-free helpline for grievance and FPS assistance: 1967 / 1800-425-9339. Check card status on nfsa.gov.in.

Director of Food and Civil Supplies`,
    precomputedAnalysis: {
      documentType: 'Public Distribution System (PDS) Statutory Directive',
      issuingAuthority: 'Department of Food, Civil Supplies & Consumer Affairs',
      referenceNumber: 'FCS/NFSA/E-KYC/MANDATORY/2026-44',
      documentDate: '10 October 2026',
      validityExpiryDate: '31 December 2026',
      urgencyLevel: 'Medium',
      feesAndCosts: 'FREE (Dealers cannot charge any fee for e-KYC authentication)',
      requiredActionSummary: 'All family members on the ration card must visit their local ration dealer for fingerprint/face e-KYC on the POS machine before 31 December 2026.',
    },
  },
  {
    id: 'sample-epfo-pension',
    title: 'EPFO Notification - Digital Life Certificate (Jeevan Pramaan) & EPS Pension',
    docType: 'Social Security / Pension Disbursement Directive',
    department: 'Employees’ Provident Fund Organisation, Ministry of Labour & Employment',
    date: '20-10-2026',
    previewSnippet: 'Advisory for EPS-95 pensioners to submit annual Digital Life Certificate using Face Authentication to ensure uninterrupted pension.',
    fullOfficialText: `EMPLOYEES' PROVIDENT FUND ORGANISATION (EPFO)
HEAD OFFICE, NEW DELHI
CIRCULAR NO: PENSION/DLC-FACE/2026/7821
DATE: 20th October 2026

ADVISORY TO ALL EPS-95 PENSIONERS: TIMELY SUBMISSION OF DIGITAL LIFE CERTIFICATE (JEEVAN PRAMAAN PATRA) FOR UNINTERRUPTED PENSION DISBURSEMENT

1. All pensioners drawing pension under the Employees' Pension Scheme, 1995 (EPS-95) are informed that under the simplified DLC framework, Life Certificates are valid for exactly 12 months from the date of previous submission.
2. In accordance with the Ministry of Electronics and IT (MeitY) guidelines, pensioners no longer need to stand in physical bank queues. Submission can be completed directly from home using Android smartphones via the "Jeevan Pramaan Face App" utilizing Aadhaar facial recognition.
3. Alternatively, pensioners may visit any of the following authorized touchpoints:
   - Postman / Gramin Dak Sevak through India Post Payments Bank (IPPB) doorstep service.
   - Any CSC (Common Service Centre) or Citizen Service Kiosk.
   - Nearest EPFO Regional / District Office or pension disbursing bank branch.
4. IMPORTANT REMINDER:
   - Check the expiry date printed on your previous Jeevan Pramaan acknowledgment slip.
   - If submitted in November 2025, your renewal deadline is 30th November 2026.
   - Delay beyond 12 months results in automatic pause of monthly pension credit until submission is verified.
5. Online authentication confirmation can be checked on member.epfindia.gov.in or Jeevan Pramaan portal (jeevanpramaan.gov.in).

Central Provident Fund Commissioner`,
    precomputedAnalysis: {
      documentType: 'EPFO Social Security & Pension Directive',
      issuingAuthority: 'Employees’ Provident Fund Organisation (EPFO), Ministry of Labour & Employment',
      referenceNumber: 'PENSION/DLC-FACE/2026/7821',
      documentDate: '20 October 2026',
      validityExpiryDate: '30 November 2026',
      urgencyLevel: 'Medium',
      feesAndCosts: 'FREE on mobile Jeevan Pramaan Face App; ₹70 nominal fee if using IPPB doorstep postman service',
      requiredActionSummary: 'Submit Digital Life Certificate via smartphone Face App, Postman, or bank before your 12-month cycle expires to prevent pension interruption.',
    },
  },
];
