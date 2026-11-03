import { Scheme, CitizenProfile } from '../types';

export const ALL_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM Kisan Samman Nidhi (PM-KISAN)',
    ministryOrState: 'Ministry of Agriculture & Farmers Welfare, Central Govt',
    level: 'Central',
    category: 'Agriculture & Farming',
    summary: 'Direct income support of ₹6,000 per year transferred into bank accounts in 3 equal installments of ₹2,000.',
    financialBenefit: '₹6,000 / year (Direct DBT in 3 installments of ₹2,000)',
    eligibility: {
      minAge: 18,
      occupations: ['Farmer / Agriculture'],
      landRequirement: 'Must own land',
      specialConditions: ['Small and marginal landholder farmer family with cultivable land in land records.'],
    },
    requiredDocuments: [
      'Aadhaar Card (Mandatory biometric linking)',
      'Land Records (RoR / Pahani / 7/12 extract / Khatauni)',
      'Active Bank Account linked to Aadhaar (NPCI mapped)',
      'Mobile Number linked to Aadhaar for e-KYC',
    ],
    applicationProcess: {
      onlineUrl: 'https://pmkisan.gov.in',
      offlineOffice: 'Nearest Gram Panchayat / Taluk Agriculture Office or Common Service Centre (CSC)',
      steps: [
        'Visit pmkisan.gov.in and click on "New Farmer Registration"',
        'Enter Aadhaar number and mobile number; verify with OTP',
        'Enter land details (Survey/Khasra number, Sub-division, area in hectares)',
        'Upload RoR land ownership extract and bank passbook proof',
        'Complete mandatory biometric/facial e-KYC on the portal or app',
      ],
    },
    officialSource: 'https://pmkisan.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Direct Benefit',
  },
  {
    id: 'pm-jay',
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    ministryOrState: 'National Health Authority (NHA), Central Govt',
    level: 'Central',
    category: 'Healthcare & Insurance',
    summary: 'Cashless health insurance coverage of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.',
    financialBenefit: '₹5,00,000 / family / year cashless hospitalization at empaneled hospitals',
    eligibility: {
      maxAnnualIncome: 250000,
      specialConditions: [
        'Families identified under SECC / BPL / AAY criteria, or all Senior Citizens aged 70+ irrespective of income.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Ration Card (BPL / Antyodaya / Priority Household card)',
      'Active Mobile number for OTP verification',
    ],
    applicationProcess: {
      onlineUrl: 'https://beneficiary.nha.gov.in',
      offlineOffice: 'Ayushman Mitra counter at any District Government Hospital or CSC',
      steps: [
        'Open beneficiary.nha.gov.in or download the Ayushman App',
        'Log in with mobile OTP and search your family by Aadhaar or Ration Card number',
        'Authenticate your e-KYC using Aadhaar OTP, Iris, or Face Auth',
        'Download instant Ayushman Golden Card (PVC card available via CSC)',
      ],
    },
    officialSource: 'https://pmjay.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'High Subsidy',
  },
  {
    id: 'pm-svanidhi',
    title: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    ministryOrState: 'Ministry of Housing and Urban Affairs, Central Govt',
    level: 'Central',
    category: 'Financial Inclusion & Business',
    summary: 'Collateral-free working capital micro-loans starting at ₹10,000 up to ₹50,000 with 7% interest subsidy and cashback on digital transactions.',
    financialBenefit: '₹10,000 (1st Tranche), ₹20,000 (2nd Tranche), ₹50,000 (3rd Tranche) @ 7% interest subsidy',
    eligibility: {
      minAge: 18,
      occupations: ['Small Business / Street Vendor', 'Daily Wage / Construction Worker'],
      areaType: 'Urban',
      specialConditions: [
        'Urban street vendors holding a Certificate of Vending / ID card issued by Urban Local Bodies (ULBs) or Recommendation letter.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Certificate of Vending / Vendor ID Card from Municipality / ULB',
      'Bank Account Passbook or cancelled cheque',
      'Mobile number linked to Aadhaar',
    ],
    applicationProcess: {
      onlineUrl: 'https://pmsvanidhi.mohua.gov.in',
      offlineOffice: 'Municipal Corporation / Town Municipality or nearest Public Sector Bank',
      steps: [
        'Check vending status at Municipal Corporation or Town Vending Committee (TVC)',
        'Log into pmsvanidhi.mohua.gov.in with Aadhaar-linked mobile',
        'Select preferred lending bank / MFI and request ₹10,000 initial loan',
        'Get digital disbursement within 7-10 working days',
      ],
    },
    officialSource: 'https://pmsvanidhi.mohua.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Fast Track',
  },
  {
    id: 'pm-awas-gramin',
    title: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    ministryOrState: 'Ministry of Rural Development, Central Govt',
    level: 'Central',
    category: 'Housing & Sanitation',
    summary: 'Financial assistance of ₹1.20 Lakh in plains and ₹1.30 Lakh in hilly/difficult areas for pucca house construction, plus 90 days MGNREGA wages.',
    financialBenefit: '₹1,20,000 - ₹1,30,000 grant + ₹12,000 Swachh Bharat toilet grant + MGNREGA wages',
    eligibility: {
      maxAnnualIncome: 200000,
      areaType: 'Rural',
      specialConditions: [
        'Houseless or living in kutcha / dilapidated 0-2 room houses without a pukka roof.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card of all adult family members',
      'Job Card (MGNREGA)',
      'Bank Account passbook linked to Aadhaar (DBT active)',
      'Consent to geo-tag existing kutcha house',
    ],
    applicationProcess: {
      onlineUrl: 'https://pmayg.nic.in',
      offlineOffice: 'Gram Panchayat Secretary / Village Development Officer (VDO) / BDO Office',
      steps: [
        'Registration is done through the Gram Sabha prioritized waitlist (Awaas+)',
        'Gram Panchayat Secretary conducts geo-tagging of existing house',
        'Sanction order issued by Block Development Office',
        'Funds released directly into bank account in 3 construction milestones',
      ],
    },
    officialSource: 'https://pmayg.nic.in',
    lastVerifiedDate: 'November 2026',
    tag: 'High Subsidy',
  },
  {
    id: 'post-matric-scholarship',
    title: 'Post-Matric Scholarship for SC / ST / OBC / EWS Students',
    ministryOrState: 'Ministry of Social Justice & Empowerment, Central & State Govt',
    level: 'Central',
    category: 'Education & Scholarships',
    summary: '100% compulsory non-refundable fees reimbursement plus monthly maintenance allowance for post-secondary education.',
    financialBenefit: 'Full tuition fees covered + ₹4,000 - ₹13,500/yr maintenance allowance',
    eligibility: {
      minAge: 15,
      maxAge: 32,
      allowedCastes: ['SC', 'ST', 'OBC', 'EWS', 'Minority'],
      maxAnnualIncome: 250000,
      occupations: ['Student / Aspirant'],
      specialConditions: ['Studying in recognized Class 11, 12, ITI, Polytechnic, Degree, PG or Professional courses.'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Valid Caste Certificate issued by competent Revenue Authority (Tahsildar / SDO)',
      'Current Financial Year Income Certificate (< ₹2.5 Lakhs)',
      'Fee Receipt and Bonafide Certificate from College / University',
      'Previous year Marksheet',
      'Aadhaar-seeded Bank Passbook',
    ],
    applicationProcess: {
      onlineUrl: 'https://scholarships.gov.in',
      offlineOffice: 'College Scholarship Desk or District Social Welfare Office',
      steps: [
        'Register with Aadhaar on National Scholarship Portal (NSP) or State Portal (SSP / Mahadbt / E-Kalyan)',
        'Fill academic details and upload Bonafide & Fee receipts',
        'College nodal officer verifies online application',
        'Scholarship transferred through DBT into bank account',
      ],
    },
    officialSource: 'https://scholarships.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Popular',
  },
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Kaushal Samman Yojana',
    ministryOrState: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    level: 'Central',
    category: 'Financial Inclusion & Business',
    summary: 'Holistic support for 18 traditional artisan trades (carpenters, blacksmiths, potters, cobblers, tailors) with ₹15,000 toolkit grant and 5% concessional loans.',
    financialBenefit: '₹15,000 e-voucher toolkit grant + ₹1,00,000 (1st Tranche) & ₹2,00,000 (2nd Tranche) loan @ 5%',
    eligibility: {
      minAge: 18,
      occupations: ['Artisan / Handloom Worker', 'Daily Wage / Construction Worker', 'Small Business / Street Vendor'],
      specialConditions: [
        'Engaged in one of the 18 recognized traditional artisanal trades (Carpenter, Boat maker, Blacksmith, Hammer/Tool maker, Sculptor, Cobbler, Mason, Basket/Mat/Broom maker, Doll/Toy maker, Barber, Garland maker, Washerman, Tailor, Fishing net maker).',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card & linked mobile number',
      'Bank Account details',
      'Trade skill self-declaration',
      'Ration Card / Family details',
    ],
    applicationProcess: {
      onlineUrl: 'https://pmvishwakarma.gov.in',
      offlineOffice: 'CSC (Common Service Centre) with biometric verification',
      steps: [
        'Visit nearest CSC with Aadhaar and bank details',
        'Gram Panchayat / ULB verifies citizen artisan status in Stage 1',
        'District Implementation Committee conducts Stage 2 approval',
        'Receive free 5-7 days skill training with ₹500/day stipend, followed by ₹15,000 toolkit grant',
      ],
    },
    officialSource: 'https://pmvishwakarma.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Popular',
  },
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    ministryOrState: 'Ministry of New and Renewable Energy, Central Govt',
    level: 'Central',
    category: 'Housing & Sanitation',
    summary: 'Direct central capital subsidy of up to ₹78,000 for installing residential rooftop solar systems to give up to 300 units of free power each month.',
    financialBenefit: 'Up to ₹78,000 direct subsidy (₹30,000 for 1kW, ₹60,000 for 2kW, ₹78,000 for 3kW+)',
    eligibility: {
      specialConditions: [
        'Owns an independent residential house or apartment with suitable shadow-free roof rights and an active domestic electricity connection.',
      ],
    },
    requiredDocuments: [
      'Latest Domestic Electricity Bill with Consumer Number',
      'Aadhaar Card of Electricity Connection holder',
      'Bank Account Passbook or cancelled cheque (for direct subsidy DBT)',
      'House Tax Receipt / Property Proof',
    ],
    applicationProcess: {
      onlineUrl: 'https://pmsuryaghar.gov.in',
      offlineOffice: 'Nearest DISCOM (Electricity Board) Sub-division Office',
      steps: [
        'Register on pmsuryaghar.gov.in with Consumer CA number from electricity bill',
        'Select registered vendor for rooftop feasibility inspection',
        'DISCOM provides net-metering technical feasibility approval',
        'Post installation and net meter commissioning, subsidy directly credited to bank account within 30 days',
      ],
    },
    officialSource: 'https://pmsuryaghar.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'High Subsidy',
  },
  {
    id: 'atal-pension',
    title: 'Atal Pension Yojana (APY)',
    ministryOrState: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    level: 'Central',
    category: 'Social Security & Pension',
    summary: 'Guaranteed government lifelong monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month starting at age 60.',
    financialBenefit: 'Guaranteed ₹1,000 to ₹5,000 / month lifetime pension + spouse pension + corpus to nominee',
    eligibility: {
      minAge: 18,
      maxAge: 40,
      specialConditions: [
        'Must be an Indian citizen with savings bank account. Must not be an income tax payer under Income Tax Act.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Savings Bank Account or Post Office Account',
      'Active mobile number',
      'Nominee Aadhaar details',
    ],
    applicationProcess: {
      onlineUrl: 'https://enps.nsdl.com',
      offlineOffice: 'Any Public/Private Bank branch or India Post Office where you have a savings account',
      steps: [
        'Approach bank branch or use net banking / mobile app',
        'Fill APY registration form with chosen monthly pension tier (e.g. ₹5,000/mo)',
        'Set up auto-debit of nominal monthly contribution (e.g. ₹210/mo if joined at age 18)',
        'Receive Permanent Retirement Account Number (PRAN) card',
      ],
    },
    officialSource: 'https://npscra.nsdl.co.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Popular',
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana (SSY)',
    ministryOrState: 'Ministry of Finance & Ministry of WCD',
    level: 'Central',
    category: 'Women & Child Development',
    summary: 'High-interest (8.2% per annum) small savings scheme for girl child with complete Triple Tax Exemption (EEE) under Section 80C.',
    financialBenefit: '8.2% compounding interest + Tax-free maturity corpus for girl’s higher education and marriage',
    eligibility: {
      gender: 'Female',
      maxAge: 10,
      specialConditions: ['Can be opened by parent or legal guardian for a girl child from birth up to age 10.'],
    },
    requiredDocuments: [
      'Birth Certificate of girl child',
      'Aadhaar Card and PAN card of Parent / Guardian',
      'Proof of address (Aadhaar / Voter ID / Utility bill)',
      '2 Passport size photographs',
    ],
    applicationProcess: {
      onlineUrl: 'https://www.indiapost.gov.in',
      offlineOffice: 'Any India Post Office or authorized commercial bank branch',
      steps: [
        'Fill Form 1 (SSY Account Opening) at Post Office or Bank',
        'Deposit initial minimum of ₹250 (max ₹1.5 Lakh per financial year)',
        'Passbook is issued for tracking contributions and compounding interest',
        'Partial withdrawal allowed after girl attains 18 years for college admission',
      ],
    },
    officialSource: 'https://www.indiapost.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Popular',
  },
  {
    id: 'pm-ujjwala',
    title: 'Pradhan Mantri Ujjwala Yojana 2.0 (PMUY)',
    ministryOrState: 'Ministry of Petroleum and Natural Gas, Central Govt',
    level: 'Central',
    category: 'Women & Child Development',
    summary: 'Deposit-free LPG connection along with free first refill, hotplate gas stove, and targeted subsidy of ₹300 per refill.',
    financialBenefit: 'Free LPG connection + Free first cylinder + Free stove + ₹300 direct subsidy per refill',
    eligibility: {
      minAge: 18,
      gender: 'Female',
      maxAnnualIncome: 200000,
      specialConditions: [
        'Adult woman belonging to poor household (SC, ST, PMAY, Antyodaya, Most Backward Classes, or 14-point declaration).',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card of applicant and adult family members',
      'Ration Card issued by State Govt / Family composition proof',
      'Bank Account details (Aadhaar linked for DBT-L subsidy)',
      'Self-declaration of residential address',
    ],
    applicationProcess: {
      onlineUrl: 'https://www.pmuy.gov.in',
      offlineOffice: 'Nearest Indane, Bharatgas, or HP Gas distributorship',
      steps: [
        'Apply online at pmuy.gov.in or collect Ujjwala 2.0 form from nearest gas agency',
        'Submit 14-point declaration form with Aadhaar and Ration card copy',
        'Distributor conducts e-KYC and de-duplication check',
        'Free gas connection and stove delivered to household within 10 days',
      ],
    },
    officialSource: 'https://www.pmuy.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Direct Benefit',
  },
  // STATE SCHEMES
  {
    id: 'ka-gruha-lakshmi',
    title: 'Gruha Lakshmi Scheme (Karnataka)',
    ministryOrState: 'Department of Women & Child Development, Govt of Karnataka',
    level: 'State',
    applicableStates: ['Karnataka'],
    category: 'Women & Child Development',
    summary: 'Monthly unconditional financial assistance of ₹2,000 credited directly to the woman head of the family.',
    financialBenefit: '₹2,000 / month (₹24,000 / year) direct DBT into bank account',
    eligibility: {
      gender: 'Female',
      minAge: 18,
      specialConditions: [
        'Woman designated as head of the family in APL / BPL / Antyodaya ration cards. Neither woman nor husband should be an income tax payer or GST filer.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card of woman family head & husband',
      'Ration Card (RC Number where woman is listed as head)',
      'Aadhaar seeded bank account passbook',
      'Mobile number linked to Aadhaar',
    ],
    applicationProcess: {
      onlineUrl: 'https://sevasindhugs.karnataka.gov.in',
      offlineOffice: 'Grama One, Karnataka One, Bangalore One, or Bapuji Seva Kendra',
      steps: [
        'Visit Grama One / Karnataka One center or use Seva Sindhu portal',
        'Enter Ration Card number; family details auto-fetch',
        'Provide Aadhaar OTP verification and select Aadhaar-seeded bank account',
        'Sanction acknowledgment SMS is sent, and ₹2,000 credited every month',
      ],
    },
    officialSource: 'https://sevasindhugs.karnataka.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Direct Benefit',
  },
  {
    id: 'ka-yuva-nidhi',
    title: 'Yuva Nidhi Scheme (Karnataka)',
    ministryOrState: 'Department of Youth Empowerment and Sports, Govt of Karnataka',
    level: 'State',
    applicableStates: ['Karnataka'],
    category: 'Education & Scholarships',
    summary: 'Unemployment allowance of ₹3,000/month for degree holders and ₹1,500/month for diploma holders for up to 2 years.',
    financialBenefit: '₹3,000 / month (Degree) or ₹1,500 / month (Diploma) for up to 24 months',
    eligibility: {
      minAge: 21,
      maxAge: 35,
      occupations: ['Unemployed Youth', 'Student / Aspirant'],
      specialConditions: [
        'Karnataka domicile graduates / diploma holders who remain unemployed 6 months after graduation date.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Degree / Diploma Certificate and final year marks cards',
      'Karnataka Domicile / Study Certificate (minimum 6 years education in Karnataka)',
      'Unemployment self-declaration (not employed in govt/private or self-employed)',
      'Bank passbook linked to Aadhaar',
    ],
    applicationProcess: {
      onlineUrl: 'https://sevasindhugs.karnataka.gov.in/yuvamidhi',
      offlineOffice: 'Nearest Grama One / Karnataka One / Bangalore One center',
      steps: [
        'Register on Seva Sindhu Yuva Nidhi portal with Aadhaar',
        'Fetch Degree details via NAD / Digilocker or university register number',
        'Submit self-declaration regarding unemployment status',
        'Monthly allowance disbursed directly to Aadhaar-enabled bank account',
      ],
    },
    officialSource: 'https://sevasindhu.karnataka.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Popular',
  },
  {
    id: 'ts-rythu-bharosa',
    title: 'Rythu Bharosa / Rythu Bandhu (Telangana)',
    ministryOrState: 'Agriculture and Cooperation Department, Govt of Telangana',
    level: 'State',
    applicableStates: ['Telangana'],
    category: 'Agriculture & Farming',
    summary: 'Investment support of ₹15,000 per acre per year directly into bank accounts of farmers and tenant farmers to purchase seeds and fertilizers.',
    financialBenefit: '₹15,000 / acre / year (₹7,500 per Kharif and Rabi season)',
    eligibility: {
      occupations: ['Farmer / Agriculture'],
      landRequirement: 'Must own land',
      specialConditions: ['Pattadar passbook holders and verified tenant agriculturalists in Telangana.'],
    },
    requiredDocuments: [
      'Pattadar Dharani Passbook / Land title',
      'Aadhaar Card',
      'Bank Account Passbook (IFSC & Account number)',
    ],
    applicationProcess: {
      onlineUrl: 'https://dharani.telangana.gov.in',
      offlineOffice: 'Mandal Agricultural Officer (MAO) / Tahsildar Office',
      steps: [
        'Land details auto-verified through Dharani portal records',
        'Submit Aadhaar and bank details to Village Agriculture Extension Officer (AEO)',
        'DBT fund transfer initiated directly during crop sowing season',
      ],
    },
    officialSource: 'https://dharani.telangana.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'High Subsidy',
  },
  {
    id: 'tn-magalir-urimai',
    title: 'Kalaignar Magalir Urimai Thittam (Tamil Nadu)',
    ministryOrState: 'Special Programme Implementation Department, Govt of Tamil Nadu',
    level: 'State',
    applicableStates: ['Tamil Nadu'],
    category: 'Women & Child Development',
    summary: 'Basic income entitlement of ₹1,000 per month directly to women family heads recognizing their unpriced household labor.',
    financialBenefit: '₹1,000 / month (₹12,000 / year) direct monthly bank transfer',
    eligibility: {
      gender: 'Female',
      minAge: 21,
      maxAnnualIncome: 250000,
      specialConditions: [
        'Family electricity consumption under 3,600 units/year, and wetland holding under 5 acres or dryland under 10 acres.',
      ],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'Smart Family Ration Card',
      'Electricity Bill / Consumer number',
      'Bank passbook linked to Aadhaar',
    ],
    applicationProcess: {
      onlineUrl: 'https://kmut.tn.gov.in',
      offlineOffice: 'Special e-Sevai camp at Ration Shop or Revenue Divisional Office',
      steps: [
        'Collect token and application form at local Fair Price Shop (Ration shop)',
        'Attend biometric e-Sevai camp with Aadhaar and Smart Ration Card',
        'Field verification conducted if needed by Village Administrative Officer (VAO)',
        'Monthly ₹1,000 credited on the 15th of every month',
      ],
    },
    officialSource: 'https://kmut.tn.gov.in',
    lastVerifiedDate: 'November 2026',
    tag: 'Direct Benefit',
  },
  {
    id: 'mh-namo-shetkari',
    title: 'Namo Shetkari Mahasanman Nidhi Yojana (Maharashtra)',
    ministryOrState: 'Agriculture Department, Govt of Maharashtra',
    level: 'State',
    applicableStates: ['Maharashtra'],
    category: 'Agriculture & Farming',
    summary: 'Additional ₹6,000 per year from Maharashtra Govt given to all PM-KISAN registered farmers, totaling ₹12,000 per year.',
    financialBenefit: '₹6,000 / year state addition (Combined with PM-KISAN: ₹12,000 / year)',
    eligibility: {
      occupations: ['Farmer / Agriculture'],
      landRequirement: 'Must own land',
      specialConditions: ['Beneficiaries who are already registered and verified under PM-KISAN scheme in Maharashtra.'],
    },
    requiredDocuments: [
      'Aadhaar Card',
      'PM-KISAN Registration Number',
      '7/12 (Saat Baara) Land Extract',
      'Aadhaar-seeded bank account',
    ],
    applicationProcess: {
      onlineUrl: 'https://mahadbt.maharashtra.gov.in',
      offlineOffice: 'Talathi Office / District Agriculture Office or Aaple Sarkar Seva Kendra',
      steps: [
        'Farmers approved under PM-KISAN are automatically integrated',
        'Verify your mobile and bank linking on MahaDBT portal',
        'DBT installments released simultaneously with Central PM-KISAN releases',
      ],
    },
    officialSource: 'https://mahadbt.maharashtra.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Direct Benefit',
  },
  {
    id: 'up-kanya-sumangala',
    title: 'Mukhya Mantri Kanya Sumangala Yojana (Uttar Pradesh)',
    ministryOrState: 'Women and Child Development Department, Govt of Uttar Pradesh',
    level: 'State',
    applicableStates: ['Uttar Pradesh'],
    category: 'Women & Child Development',
    summary: 'Conditional financial assistance up to ₹25,000 provided across 6 stages from birth to graduation for girl children.',
    financialBenefit: '₹25,000 total monetary assistance in 6 stages (Birth, Vaccination, Class 1, 6, 9 & Graduation)',
    eligibility: {
      gender: 'Female',
      maxAnnualIncome: 300000,
      specialConditions: ['Resident of UP with maximum two girls per family.'],
    },
    requiredDocuments: [
      'Aadhaar Card of Parents & Girl child (if available)',
      'Birth Certificate of girl child',
      'Income Certificate (< ₹3,00,000/yr)',
      'UP Resident Proof (Domicile / Ration Card)',
      'School / College Admission Proof or Vaccination Card for earlier stages',
    ],
    applicationProcess: {
      onlineUrl: 'https://mksy.up.gov.in',
      offlineOffice: 'Block Development Officer (BDO) / District Probation Officer',
      steps: [
        'Register on mksy.up.gov.in citizen portal',
        'Select the appropriate stage (Stage 1 for newborn up to Stage 6 for college degree)',
        'Upload required certificate and bank details of parent/girl',
        'Block and district officers verify within 15 days; amount credited via PFMS',
      ],
    },
    officialSource: 'https://mksy.up.gov.in',
    lastVerifiedDate: 'October 2026',
    tag: 'Popular',
  },
];

export interface SchemeMatchResult {
  scheme: Scheme;
  isEligible: boolean;
  matchScore: number; // 0 to 100
  reasons: string[];
  missingCriteria: string[];
}

export function evaluateSchemeEligibility(
  scheme: Scheme,
  profile: CitizenProfile | null
): SchemeMatchResult {
  if (!profile) {
    return {
      scheme,
      isEligible: false,
      matchScore: 50,
      reasons: ['Complete your Citizen Profile to see automatic match calculation.'],
      missingCriteria: ['Profile not completed'],
    };
  }

  const reasons: string[] = [];
  const missing: string[] = [];
  let score = 100;

  // 1. State check
  if (scheme.applicableStates && scheme.applicableStates.length > 0) {
    if (scheme.applicableStates.includes(profile.state)) {
      reasons.push(`You reside in ${profile.state}, where this scheme is operational.`);
    } else {
      missing.push(`Scheme is exclusively for residents of: ${scheme.applicableStates.join(', ')}.`);
      score -= 50;
    }
  } else {
    reasons.push('Open to all Indian residents across all States & Union Territories.');
  }

  // 2. Age check
  if (scheme.eligibility.minAge !== undefined && profile.age < scheme.eligibility.minAge) {
    missing.push(`Minimum age is ${scheme.eligibility.minAge} years (your age: ${profile.age}).`);
    score -= 30;
  }
  if (scheme.eligibility.maxAge !== undefined && profile.age > scheme.eligibility.maxAge) {
    missing.push(`Maximum age is ${scheme.eligibility.maxAge} years (your age: ${profile.age}).`);
    score -= 30;
  }
  if (
    (scheme.eligibility.minAge === undefined || profile.age >= scheme.eligibility.minAge) &&
    (scheme.eligibility.maxAge === undefined || profile.age <= scheme.eligibility.maxAge)
  ) {
    reasons.push(`Your age (${profile.age} years) satisfies the age eligibility requirement.`);
  }

  // 3. Gender check
  if (scheme.eligibility.gender && scheme.eligibility.gender !== 'All') {
    if (profile.gender === scheme.eligibility.gender || (scheme.eligibility.gender === 'Female' && profile.isSingleWomanOrWidow)) {
      reasons.push(`Applicant gender matches requirement (${scheme.eligibility.gender}).`);
    } else {
      missing.push(`Scheme is specifically reserved for ${scheme.eligibility.gender} applicants.`);
      score -= 40;
    }
  }

  // 4. Caste / Social Category
  if (scheme.eligibility.allowedCastes && scheme.eligibility.allowedCastes.length > 0) {
    if (scheme.eligibility.allowedCastes.includes(profile.caste)) {
      reasons.push(`Your category (${profile.caste}) is covered under the scheme reservation guidelines.`);
    } else {
      missing.push(`Restricted to categories: ${scheme.eligibility.allowedCastes.join(', ')}.`);
      score -= 35;
    }
  }

  // 5. Income check
  if (scheme.eligibility.maxAnnualIncome !== undefined) {
    if (profile.annualIncome <= scheme.eligibility.maxAnnualIncome) {
      reasons.push(`Your annual family income (₹${profile.annualIncome.toLocaleString('en-IN')}) is within the cap of ₹${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')}.`);
    } else {
      missing.push(`Annual income must be below ₹${scheme.eligibility.maxAnnualIncome.toLocaleString('en-IN')}/year.`);
      score -= 35;
    }
  }

  // 6. Occupation check
  if (scheme.eligibility.occupations && scheme.eligibility.occupations.length > 0) {
    if (scheme.eligibility.occupations.includes(profile.occupation as any)) {
      reasons.push(`Your occupation as ${profile.occupation} meets the primary target beneficiary criteria.`);
    } else {
      // Check if student status matches
      if (scheme.id === 'post-matric-scholarship' && profile.isStudent) {
        reasons.push('You are enrolled as a student, satisfying target beneficiary criteria.');
      } else {
        missing.push(`Targeted towards: ${scheme.eligibility.occupations.join(', ')}.`);
        score -= 25;
      }
    }
  }

  // 7. Land requirement
  if (scheme.eligibility.landRequirement === 'Must own land') {
    if (profile.hasLand) {
      reasons.push(`You own agricultural land (${profile.landAreaAcres || 'registered'} acres), meeting ownership prerequisite.`);
    } else {
      missing.push('Requires ownership of agricultural land (record in RoR / Patta).');
      score -= 30;
    }
  }

  // 8. Area type
  if (scheme.eligibility.areaType && scheme.eligibility.areaType !== 'Any') {
    if (profile.areaType === scheme.eligibility.areaType) {
      reasons.push(`Your location in a ${profile.areaType} region qualifies for this regional priority.`);
    } else {
      missing.push(`Only available in ${scheme.eligibility.areaType} areas (your area: ${profile.areaType}).`);
      score -= 20;
    }
  }

  const finalScore = Math.max(0, score);
  const isEligible = missing.length === 0;

  return {
    scheme,
    isEligible,
    matchScore: isEligible ? 100 : finalScore,
    reasons,
    missingCriteria: missing,
  };
}
