const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role to bypass RLS for inserts
);

const attorneys = [
  // This array should be populated by your scraper output
  {
    name: "ACLU of South Carolina",
    state: "South Carolina",
    city: "Charleston",
    specialty: ["Police Practices", "Voting Access"],
    email: "info@aclusc.org",
    phone: "843-720-1423",
    status: "verified"
  },
  // ... thousands more entries
];

async function seed() {
  console.log(`Seeding ${attorneys.length} attorneys...`);
  
  const { data, error } = await supabase
  .from('attorneys')
  .upsert(attorneys, { 
    onConflict: 'name, phone',  // Uses the composite index we just created
    ignoreDuplicates: false     // set to false to update existing entries
  });


  if (error) console.error('Error:', error);
  else console.log('Success:', data);
}

seed();
