/**
 * Data Extraction Script
 * Extracts state laws and attorney data from StateSelector component
 * and generates SQL INSERT statements for database migration
 */

// State codes mapping
const stateCodes = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

const stateData = {
  "Alabama": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Alaska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Arizona": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Arkansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "California": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Police recording in public is protected by First Amendment." },
  "Colorado": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Connecticut": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Delaware": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Florida": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Georgia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Hawaii": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Idaho": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Illinois": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "Illinois requires all-party consent. Recording police officers in public is legal." },
  "Indiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Iowa": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Kansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Kentucky": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Louisiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Maine": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Maryland": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is constitutionally protected." },
  "Massachusetts": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Michigan": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "Minnesota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Mississippi": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Missouri": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Montana": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is legal." },
  "Nebraska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Nevada": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "New Hampshire": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "New Jersey": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "New Mexico": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "New York": { recording: "One-party consent", policeRecording: "Legal in public", notes: "Only one party needs to consent to recordings. Recording police is constitutionally protected." },
  "North Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "North Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Ohio": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Oklahoma": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Oregon": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Pennsylvania": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Rhode Island": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "South Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "South Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Tennessee": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Texas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Utah": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Vermont": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Washington": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "West Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Wisconsin": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Wyoming": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." }
};

// Shared national attorneys
const sharedAttorneys = [
  {
    name: "Reporters Committee Legal Defense Network",
    firm: "Reporters Committee for Freedom of the Press",
    focus: "Press shield defense, FOIA litigation, and subpoena responses.",
    contact: "https://www.rcfp.org/legal-defense-network/",
    practice_areas: ["Press Freedom", "FOIA", "First Amendment"]
  },
  {
    name: "National Lawyers Guild Civil Rights Defense Team",
    firm: "National Lawyers Guild",
    focus: "Protest defense, oversight of police, and activist legal training.",
    contact: "https://nationallawyersguild.org/our-programs/",
    practice_areas: ["Protest Rights", "Police Accountability", "Civil Rights"]
  },
  {
    name: "Lawyers' Committee for Civil Rights Under Law",
    firm: "Lawyers' Committee for Civil Rights Under Law",
    focus: "Citizen review boards, voting rights, and anti-retaliation litigation.",
    contact: "https://lawyerscommittee.org/",
    practice_areas: ["Voting Rights", "Police Accountability", "Civil Rights"]
  },
  {
    name: "Civil Rights Corps Legal Advocates",
    firm: "Civil Rights Corps",
    focus: "Class-action support for excessive policing and protest retaliation.",
    contact: "https://civilrightscorps.org/",
    practice_areas: ["Police Misconduct", "Protest Rights", "Class Action"]
  }
];

function escapeSQL(str) {
  if (!str) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function generateStateLawsSQL() {
  console.log("-- Insert state laws data");
  console.log("INSERT INTO public.state_laws (state, state_code, recording_consent_type, recording_law_details, police_recording_details, can_record_police, has_shield_law, shield_law_details, assembly_rights_details, activist_protections) VALUES");

  const rows = [];
  Object.entries(stateData).forEach(([state, data]) => {
    const consentType = data.recording.includes("Two-party") || data.recording.includes("All") ? "two-party" : "one-party";
    const stateCode = stateCodes[state];

    rows.push(`(
  ${escapeSQL(state)},
  ${escapeSQL(stateCode)},
  ${escapeSQL(consentType)},
  ${escapeSQL(data.notes)},
  ${escapeSQL(data.policeRecording)},
  true,
  false,
  ${escapeSQL(`Journalists in ${state} rely on state press freedom protections plus shield or reporter-privilege statutes.`)},
  ${escapeSQL(`Constitutional assembly rights in ${state} protect peaceful protest and public gathering.`)},
  ${escapeSQL(`Activists in ${state} can document police activity, organize protests, and access legal observer networks.`)}
)`);
  });

  console.log(rows.join(",\n"));
  console.log(";\n");
}

function generateAttorneysSQL() {
  console.log("-- Insert attorney data (national organizations)");
  console.log("INSERT INTO public.attorneys (name, firm, state, practice_areas, specialties, phone, email, website, bio) VALUES");

  const rows = [];

  // Add national attorneys (no specific state)
  sharedAttorneys.forEach(att => {
    rows.push(`(
  ${escapeSQL(att.name)},
  ${escapeSQL(att.firm)},
  'National',
  ARRAY[${att.practice_areas.map(p => escapeSQL(p)).join(", ")}],
  NULL,
  NULL,
  NULL,
  ${escapeSQL(att.contact)},
  ${escapeSQL(att.focus)}
)`);
  });

  // Add state-specific ACLU entries
  Object.keys(stateData).forEach(state => {
    const stateCode = stateCodes[state];
    rows.push(`(
  ${escapeSQL(`${state} Civil Liberties Response Team`)},
  'ACLU Civil Rights Litigation',
  ${escapeSQL(state)},
  ARRAY['Civil Rights', 'First Amendment', 'Police Accountability'],
  ARRAY['Protest Defense', 'Journalist Protection'],
  NULL,
  NULL,
  'https://www.aclu.org/legal',
  ${escapeSQL(`Supporting activists, journalists, and whistleblowers in ${state} facing retaliation or unlawful arrests.`)}
)`);
  });

  console.log(rows.join(",\n"));
  console.log(";\n");
}

// Generate SQL output
console.log("-- Generated from extract-state-data.js\n");
generateStateLawsSQL();
generateAttorneysSQL();
