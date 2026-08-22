// DISABLED: legacy attorney seeding did not enforce per-record provenance and
// used a Supabase service-role key, bypassing RLS. It must not be used for live
// Civil Rights Hub data.
//
// Use scripts/verified-seeder.js. Every attorney record must include at least
// one durable HTTPS source, and licensing/contact claims should be independently
// checked against authoritative sources before verification.

console.error(`
REFUSING TO RUN: scripts/seed-attorneys.js is a legacy unsourced seeder.
Use scripts/verified-seeder.js with source-backed input instead.
`);

process.exit(1);
