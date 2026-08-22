// DISABLED: this project must never generate synthetic people, organizations,
// contact details, incidents, or verification states for production data.
//
// Historical versions of this script generated random attorney names, firms,
// phone numbers, emails, websites, bar numbers, activists, and incidents and
// could write them with a Supabase service-role key. That behavior violates the
// Civil Rights Hub source-provenance standard and is intentionally blocked.
//
// Use scripts/verified-seeder.js with source-backed input instead.

console.error(`
REFUSING TO RUN: scripts/universal_seeder.js is permanently disabled.

Civil Rights Hub only publishes records with durable source provenance.
Use scripts/verified-seeder.js and provide authoritative HTTPS sources for every
record. Synthetic/filler data belongs in isolated test fixtures, never the live
civil-rights database.
`);

process.exit(1);
