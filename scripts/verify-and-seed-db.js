#!/usr/bin/env node
/**
 * Database Verification and Seeding Script
 *
 * This script connects to Supabase and verifies that all tables are properly seeded.
 * It also provides counts of records in each table to ensure the database is fully populated.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^"|"$/g, '');
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`   URL: ${SUPABASE_URL}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Tables to verify
const TABLES = [
  'violations',
  'violation_comments',
  'attorneys',
  'state_laws',
  'federal_laws',
  'scanner_links',
  'court_calendars',
  'foia_templates',
  'foia_agencies',
  'forum_threads',
  'forum_posts',
  'activists',
  'agencies',
  'foia_requests',
  'legislation',
  'press_freedom_tracker',
  'scanner_frequencies'
];

async function verifyTable(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`   ❌ ${tableName}: Error - ${error.message}`);
      return { table: tableName, count: 0, status: 'error', error: error.message };
    }

    const status = count === 0 ? 'empty' : 'seeded';
    const icon = count === 0 ? '⚠️ ' : '✅';
    console.log(`   ${icon} ${tableName}: ${count} records`);
    return { table: tableName, count, status };
  } catch (err) {
    console.error(`   ❌ ${tableName}: ${err.message}`);
    return { table: tableName, count: 0, status: 'error', error: err.message };
  }
}

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('violations')
      .select('count')
      .limit(1);

    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('❌ Tables do not exist. Migrations need to be applied.');
      return false;
    }

    console.log('✅ Database connection successful\n');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    return false;
  }
}

async function main() {
  console.log('\n════════════════════════════════════════════════════════');
  console.log('   SUPABASE DATABASE VERIFICATION');
  console.log('════════════════════════════════════════════════════════\n');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    console.log('\n💡 To apply migrations, run:');
    console.log('   npx supabase db push\n');
    process.exit(1);
  }

  // Verify all tables
  console.log('📊 Checking table record counts...\n');
  const results = [];

  for (const table of TABLES) {
    const result = await verifyTable(table);
    results.push(result);
  }

  // Summary
  console.log('\n════════════════════════════════════════════════════════');
  console.log('   SUMMARY');
  console.log('════════════════════════════════════════════════════════\n');

  const seeded = results.filter(r => r.status === 'seeded');
  const empty = results.filter(r => r.status === 'empty');
  const errors = results.filter(r => r.status === 'error');

  console.log(`✅ Seeded tables: ${seeded.length}/${TABLES.length}`);
  console.log(`⚠️  Empty tables: ${empty.length}/${TABLES.length}`);
  console.log(`❌ Error tables: ${errors.length}/${TABLES.length}`);

  const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`\n📊 Total records across all tables: ${totalRecords.toLocaleString()}`);

  if (empty.length > 0) {
    console.log('\n⚠️  Empty tables:');
    empty.forEach(r => console.log(`   - ${r.table}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Tables with errors:');
    errors.forEach(r => console.log(`   - ${r.table}: ${r.error}`));
  }

  console.log('\n════════════════════════════════════════════════════════\n');

  if (empty.length > 0 || errors.length > 0) {
    console.log('💡 Some tables need seeding. Check migration files in supabase/migrations/\n');
    process.exit(1);
  } else {
    console.log('🎉 All tables are properly seeded!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
