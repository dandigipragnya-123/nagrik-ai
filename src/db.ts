import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, 'nagrik_database.sqlite');
export const db = new Database(DB_PATH);

// Enable WAL mode for high concurrency and resilience
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. Users Table for Email / Password Authentication
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );
  `);

  // 2. Saved Schemes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_schemes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      scheme_id TEXT NOT NULL,
      scheme_title TEXT NOT NULL,
      category TEXT NOT NULL,
      benefit TEXT NOT NULL,
      status TEXT NOT NULL,
      saved_at TEXT NOT NULL
    );
  `);

  // 3. Citizens Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS citizens (
      id TEXT PRIMARY KEY,
      mobile TEXT UNIQUE,
      email TEXT UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT,
      aadhaar_masked TEXT,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      caste TEXT NOT NULL,
      annual_income REAL NOT NULL,
      income_bracket TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      area_type TEXT NOT NULL,
      pincode TEXT NOT NULL,
      occupation TEXT NOT NULL,
      education_level TEXT,
      has_land INTEGER NOT NULL,
      land_area_acres REAL DEFAULT 0,
      has_ration_card INTEGER NOT NULL,
      ration_card_type TEXT,
      is_differently_abled INTEGER NOT NULL,
      is_student INTEGER NOT NULL,
      is_single_woman_or_widow INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );
  `);

  // 4. OTP Verification Sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS otp_sessions (
      mobile TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `);

  // 3. Schemes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schemes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      ministry_or_state TEXT NOT NULL,
      level TEXT NOT NULL,
      applicable_states TEXT,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      financial_benefit TEXT NOT NULL,
      eligibility_json TEXT NOT NULL,
      required_documents_json TEXT NOT NULL,
      application_process_json TEXT NOT NULL,
      official_source TEXT NOT NULL,
      last_verified_date TEXT NOT NULL,
      tag TEXT
    );
  `);

  // 4. Applications / Tracked Documents Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      citizen_id TEXT NOT NULL,
      scheme_or_doc_name TEXT NOT NULL,
      tracking_number TEXT NOT NULL,
      submitted_date TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT NOT NULL,
      next_follow_up_date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 5. Analyzed Documents History Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analyzed_documents (
      id TEXT PRIMARY KEY,
      citizen_id TEXT,
      file_name TEXT NOT NULL,
      document_type TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      reference_number TEXT,
      validity_expiry_date TEXT,
      urgency_level TEXT NOT NULL,
      plain_summary TEXT NOT NULL,
      full_analysis_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Safely ensure migration columns exist in existing databases
  const citizenColumns = ['email', 'password_hash', 'education_level', 'residential_address'];
  for (const col of citizenColumns) {
    try {
      db.exec(`ALTER TABLE citizens ADD COLUMN ${col} TEXT;`);
    } catch (e) {
      // column already exists
    }
  }

  // Also link emails to existing citizens if empty
  try {
    db.exec(`UPDATE citizens SET email = 'ramesh@nagrik.in' WHERE id = 'cit-ramesh-01' AND (email IS NULL OR email = '');`);
    db.exec(`UPDATE citizens SET email = 'priya@nagrik.in' WHERE id = 'cit-priya-02' AND (email IS NULL OR email = '');`);
    db.exec(`UPDATE citizens SET email = 'lakshmi@nagrik.in' WHERE id = 'cit-lakshmi-03' AND (email IS NULL OR email = '');`);
  } catch (e) {
    // ignore
  }

  // Seed users if none exist
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    seedInitialUsers();
  }

  // Seed sample citizens if none exist
  const count = db.prepare('SELECT count(*) as count FROM citizens').get() as { count: number };
  if (count.count === 0) {
    seedInitialCitizens();
  }

  const appCount = db.prepare('SELECT count(*) as count FROM applications').get() as { count: number };
  if (appCount.count === 0) {
    seedInitialApplications();
  }
}

function seedInitialUsers() {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, created_at, last_login_at)
    VALUES (@id, @name, @email, @password_hash, @created_at, @last_login_at)
  `);

  const now = new Date().toISOString();

  insertUser.run({
    id: 'user-ramesh-01',
    name: 'Ramesh Gowda',
    email: 'ramesh@nagrik.in',
    password_hash: 'citizen@123',
    created_at: now,
    last_login_at: now,
  });

  insertUser.run({
    id: 'user-priya-02',
    name: 'Priya Kumari',
    email: 'priya@nagrik.in',
    password_hash: 'citizen@123',
    created_at: now,
    last_login_at: now,
  });

  insertUser.run({
    id: 'user-lakshmi-03',
    name: 'Lakshmi Ammal',
    email: 'lakshmi@nagrik.in',
    password_hash: 'citizen@123',
    created_at: now,
    last_login_at: now,
  });

  // Seed initial saved schemes
  const insertSavedScheme = db.prepare(`
    INSERT INTO saved_schemes (id, user_id, scheme_id, scheme_title, category, benefit, status, saved_at)
    VALUES (@id, @user_id, @scheme_id, @scheme_title, @category, @benefit, @status, @saved_at)
  `);

  insertSavedScheme.run({
    id: 'saved-1',
    user_id: 'user-ramesh-01',
    scheme_id: 'pm-kisan',
    scheme_title: 'PM Kisan Samman Nidhi (PM-KISAN)',
    category: 'Agriculture & Farming',
    benefit: '₹6,000 / year (Direct DBT)',
    status: 'Likely Eligible',
    saved_at: now,
  });

  insertSavedScheme.run({
    id: 'saved-2',
    user_id: 'user-ramesh-01',
    scheme_id: 'pm-jay',
    scheme_title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'Healthcare & Insurance',
    benefit: '₹5,00,000 / family / year cashless hospitalization',
    status: 'Likely Eligible',
    saved_at: now,
  });
}

function seedInitialApplications() {
  const insertApp = db.prepare(`
    INSERT INTO applications (
      id, citizen_id, scheme_or_doc_name, tracking_number, submitted_date, status, notes, next_follow_up_date, created_at
    ) VALUES (
      @id, @citizen_id, @scheme_or_doc_name, @tracking_number, @submitted_date, @status, @notes, @next_follow_up_date, @created_at
    )
  `);

  const now = new Date().toISOString();

  insertApp.run({
    id: 'app-init-1',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'Kisan Credit Card (KCC) Crop Loan Verification & Subsidy Order',
    tracking_number: 'SLBC/KCC/REV-2026/89412',
    submitted_date: '14 Oct 2026',
    status: 'Requires Clarification',
    notes: 'Submit updated Record of Rights (Pahani) and verify Aadhaar-NPCI account seeding at home branch.',
    next_follow_up_date: '15-12-2026',
    created_at: now,
  });

  insertApp.run({
    id: 'app-init-2',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'Ayushman Bharat PM-JAY Family Golden Card',
    tracking_number: 'NHA-KA-88491024',
    submitted_date: '22 Oct 2026',
    status: 'Approved / Sanctioned',
    notes: 'Biometric face auth completed at CSC. PVC Health Card downloaded.',
    next_follow_up_date: 'Annual Renewal 2027',
    created_at: now,
  });

  insertApp.run({
    id: 'app-init-3',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'National Food Security (NFSA) Mandatory Biometric e-KYC',
    tracking_number: 'RC-KYC-KA-7721',
    submitted_date: '28 Oct 2026',
    status: 'Under Verification',
    notes: 'Biometric e-KYC carried out at Fair Price Shop (Ration Dukan) on POS machine.',
    next_follow_up_date: '31-12-2026',
    created_at: now,
  });
}

function seedInitialCitizens() {
  const insertCitizen = db.prepare(`
    INSERT INTO citizens (
      id, mobile, name, password_hash, aadhaar_masked, age, gender, caste,
      annual_income, income_bracket, state, district, area_type, pincode,
      occupation, has_land, land_area_acres, has_ration_card, ration_card_type,
      is_differently_abled, is_student, is_single_woman_or_widow, created_at, last_login_at
    ) VALUES (
      @id, @mobile, @name, @password_hash, @aadhaar_masked, @age, @gender, @caste,
      @annual_income, @income_bracket, @state, @district, @area_type, @pincode,
      @occupation, @has_land, @land_area_acres, @has_ration_card, @ration_card_type,
      @is_differently_abled, @is_student, @is_single_woman_or_widow, @created_at, @last_login_at
    )
  `);

  const now = new Date().toISOString();

  const presets = [
    {
      id: 'cit-ramesh-01',
      mobile: '9876543210',
      name: 'Ramesh Gowda',
      password_hash: 'citizen@123',
      aadhaar_masked: 'XXXX-XXXX-8492',
      age: 46,
      gender: 'Male',
      caste: 'OBC',
      annual_income: 140000,
      income_bracket: '₹1 Lakh - ₹2.5 Lakh',
      state: 'Karnataka',
      district: 'Mandya',
      area_type: 'Rural',
      pincode: '571401',
      occupation: 'Farmer / Agriculture',
      has_land: 1,
      land_area_acres: 2.5,
      has_ration_card: 1,
      ration_card_type: 'BPL (Below Poverty Line)',
      is_differently_abled: 0,
      is_student: 0,
      is_single_woman_or_widow: 0,
      created_at: now,
      last_login_at: now,
    },
    {
      id: 'cit-priya-02',
      mobile: '9812345678',
      name: 'Priya Kumari',
      password_hash: 'citizen@123',
      aadhaar_masked: 'XXXX-XXXX-3914',
      age: 20,
      gender: 'Female',
      caste: 'SC',
      annual_income: 180000,
      income_bracket: '₹1 Lakh - ₹2.5 Lakh',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      area_type: 'Semi-Urban',
      pincode: '221002',
      occupation: 'Student / Aspirant',
      has_land: 0,
      land_area_acres: 0,
      has_ration_card: 1,
      ration_card_type: 'BPL (Below Poverty Line)',
      is_differently_abled: 0,
      is_student: 1,
      is_single_woman_or_widow: 0,
      created_at: now,
      last_login_at: now,
    },
    {
      id: 'cit-lakshmi-03',
      mobile: '9944556677',
      name: 'Lakshmi Ammal',
      password_hash: 'citizen@123',
      aadhaar_masked: 'XXXX-XXXX-7103',
      age: 52,
      gender: 'Female',
      caste: 'OBC',
      annual_income: 85000,
      income_bracket: '< ₹1 Lakh',
      state: 'Tamil Nadu',
      district: 'Madurai',
      area_type: 'Rural',
      pincode: '625001',
      occupation: 'Artisan / Handloom Worker',
      has_land: 0,
      land_area_acres: 0,
      has_ration_card: 1,
      ration_card_type: 'AAY (Antyodaya)',
      is_differently_abled: 0,
      is_student: 0,
      is_single_woman_or_widow: 1,
      created_at: now,
      last_login_at: now,
    },
    {
      id: 'cit-rizwan-04',
      mobile: '9700112233',
      name: 'Mohammad Rizwan',
      password_hash: 'citizen@123',
      aadhaar_masked: 'XXXX-XXXX-5529',
      age: 34,
      gender: 'Male',
      caste: 'Minority',
      annual_income: 160000,
      income_bracket: '₹1 Lakh - ₹2.5 Lakh',
      state: 'Telangana',
      district: 'Hyderabad',
      area_type: 'Urban',
      pincode: '500002',
      occupation: 'Small Business / Street Vendor',
      has_land: 0,
      land_area_acres: 0,
      has_ration_card: 1,
      ration_card_type: 'BPL (Below Poverty Line)',
      is_differently_abled: 0,
      is_student: 0,
      is_single_woman_or_widow: 0,
      created_at: now,
      last_login_at: now,
    },
  ];

  for (const p of presets) {
    insertCitizen.run(p);
  }

  // Seed default applications for citizen ramesh
  const insertApp = db.prepare(`
    INSERT INTO applications (
      id, citizen_id, scheme_or_doc_name, tracking_number, submitted_date, status, notes, next_follow_up_date, created_at
    ) VALUES (
      @id, @citizen_id, @scheme_or_doc_name, @tracking_number, @submitted_date, @status, @notes, @next_follow_up_date, @created_at
    )
  `);

  insertApp.run({
    id: 'app-init-1',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'Kisan Credit Card (KCC) Crop Loan Verification & Subsidy Order',
    tracking_number: 'SLBC/KCC/REV-2026/89412',
    submitted_date: '14 Oct 2026',
    status: 'Requires Clarification',
    notes: 'Submit updated Record of Rights (Pahani) and verify Aadhaar-NPCI account seeding at home branch.',
    nextFollowUpDate: '15-12-2026',
    created_at: now,
  });

  insertApp.run({
    id: 'app-init-2',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'Ayushman Bharat PM-JAY Family Golden Card',
    tracking_number: 'NHA-KA-88491024',
    submitted_date: '22 Oct 2026',
    status: 'Approved / Sanctioned',
    notes: 'Biometric face auth completed at CSC. PVC Health Card downloaded.',
    nextFollowUpDate: 'Annual Renewal 2027',
    created_at: now,
  });

  insertApp.run({
    id: 'app-init-3',
    citizen_id: 'cit-ramesh-01',
    scheme_or_doc_name: 'National Food Security (NFSA) Mandatory Biometric e-KYC',
    tracking_number: 'RC-KYC-KA-7721',
    submitted_date: '28 Oct 2026',
    status: 'Under Verification',
    notes: 'Biometric e-KYC carried out at Fair Price Shop (Ration Dukan) on POS machine.',
    nextFollowUpDate: '31-12-2026',
    created_at: now,
  });
}
