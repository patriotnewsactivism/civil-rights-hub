import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG ---
const ENV_PATH = path.join(__dirname, '..', '.env');
console.log(`Reading .env from: ${ENV_PATH}`);

// Read .env manually since dotenv might not be installed
let envVars = {};
try {
  if (fs.existsSync(ENV_PATH)) {
    const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        envVars[key] = value;
      }
    });
    console.log("Found keys in .env:", Object.keys(envVars).join(", "));
  } else {
    console.warn(".env file not found at expected path.");
  }
} catch (e) {
  console.warn("Could not read .env file:", e.message);
}

const SUPABASE_URL = envVars.VITE_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_PUBLISHABLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL) {
  console.error("Missing Supabase URL in .env");
  process.exit(1);
}

// Prefer Service Key for seeding (bypasses RLS)
const activeKey = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
const isServiceKey = !!SUPABASE_SERVICE_KEY;

if (!activeKey) {
  console.error("Missing Supabase Key (Anon or Service) in .env");
  process.exit(1);
}

console.log(`Connecting to Supabase at ${SUPABASE_URL}`);
console.log(`Using ${isServiceKey ? 'SERVICE ROLE' : 'ANON'} key`);

const supabase = createClient(SUPABASE_URL, activeKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// --- DATA GENERATORS ---

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CITIES = {
  "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville"],
  "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
  "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
  "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"],
  // Add more as needed, fallback to "Unknown"
};

const FIRST_NAMES = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris"];
const PRACTICE_AREAS = ["Civil Rights", "Police Misconduct", "Constitutional Law", "First Amendment", "Employment Discrimination"];
const SPECIALTIES = ["Excessive Force", "False Arrest", "Illegal Search", "Malicious Prosecution", "Qualified Immunity"];
const ACTIVIST_PLATFORMS = ["YouTube", "TikTok", "Facebook", "Instagram", "Twitter/X", "Twitch"];
const ACTIVIST_FOCUS = ["First Amendment Audits", "Cop Watching", "Police Accountability", "Public Records", "Government Transparency"];

const VIOLATION_TITLES = [
  "Unlawful detention at traffic stop", "Denied right to record in public", "Excessive force during arrest", "Refusal to identify", "Illegal search of vehicle"
];
const VIOLATION_DESCRIPTIONS = [
  "Officer escalated a routine stop and detained me without articulating a crime.",
  "Was told I couldn't film from a public sidewalk. Officer threatened arrest.",
  "Officer used a taser on a compliant subject who was already handcuffed.",
  "Refused to provide name and badge number when asked multiple times.",
  "Searched my trunk without consent or probable cause."
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateAttorneys(count) {
  const attorneys = [];
  for (let i = 0; i < count; i++) {
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const state = getRandomItem(STATES);
    const city = getRandomItem(CITIES[state] || ["Unknown City"]);
    
    attorneys.push({
      name: `${fname} ${lname}`,
      firm: `Law Offices of ${fname} ${lname}`,
      state,
      city,
      practice_areas: getRandomItems(PRACTICE_AREAS, 2),
      specialties: getRandomItems(SPECIALTIES, 2),
      phone: `${Math.floor(Math.random() * 800) + 200}-${Math.floor(Math.random() * 800) + 200}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `info@${lname.toLowerCase()}law.com`,
      website: `https://www.${lname.toLowerCase()}${fname.toLowerCase()}law.com`,
      accepts_pro_bono: Math.random() > 0.5,
      bar_number: `${state.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`,
      years_experience: Math.floor(Math.random() * 35) + 5
    });
  }
  return attorneys;
}

function generateActivists(count) {
  const activists = [];
  for (let i = 0; i < count; i++) {
    const fname = getRandomItem(FIRST_NAMES);
    const lname = getRandomItem(LAST_NAMES);
    const platform = getRandomItem(ACTIVIST_PLATFORMS);
    
    activists.push({
      name: `${fname} ${lname}`,
      alias: Math.random() > 0.5 ? `${fname}Audits` : null,
      home_state: getRandomItem(STATES),
      primary_platform: platform,
      channel_url: `https://${platform.toLowerCase()}.com/${fname.toLowerCase()}${lname.toLowerCase()}`,
      focus_areas: getRandomItems(ACTIVIST_FOCUS, 2),
      verified: Math.random() > 0.7
    });
  }
  return activists;
}

function generateViolations(count) {
  const violations = [];
  for (let i = 0; i < count; i++) {
    const state = getRandomItem(STATES);
    const city = getRandomItem(CITIES[state] || ["Unknown City"]);
    
    violations.push({
      title: getRandomItem(VIOLATION_TITLES),
      description: getRandomItem(VIOLATION_DESCRIPTIONS),
      location_state: state,
      location_city: city,
      incident_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      latitude: (Math.random() * (48 - 25) + 25), // Rough US Lat
      longitude: (Math.random() * (-70 - -125) + -125), // Rough US Lon
      status: 'verified',
      // user_id is nullable in many schemas, leaving null for system seeds
    });
  }
  return violations;
}

// --- SEEDING FUNCTION ---

async function seedTable(tableName, data, conflictColumns) {
  console.log(`Seeding ${tableName} with ${data.length} records...`);
  
  // Split into chunks of 100 to avoid request size limits
  const chunkSize = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk, { onConflict: conflictColumns, ignoreDuplicates: true });

    if (error) {
      console.error(`Error seeding ${tableName} (chunk ${i}):`, error.message);
      errorCount += chunk.length;
    } else {
      successCount += chunk.length;
    }
  }
  console.log(`Finished ${tableName}: ${successCount} inserted, ${errorCount} failed.`);
}

async function main() {
  console.log("Starting universal seed...");

  // 1. Attorneys
  const attorneys = generateAttorneys(200);
  await seedTable('attorneys', attorneys, 'name, phone'); // Assuming composite unique constraint or primary key

  // 2. Activists
  const activists = generateActivists(100);
  await seedTable('activists', activists, 'channel_url'); // Assuming unique channel_url or name

  // 3. Violations
  const violations = generateViolations(50);
  await seedTable('violations', violations, 'id'); // No unique constraint usually, just insert

  console.log("Seeding complete!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
