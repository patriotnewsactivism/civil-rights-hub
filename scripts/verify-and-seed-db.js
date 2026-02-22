#!/usr/bin/env node
/**
 * Database Verification and Seeding Script
 *
 * This script connects to Supabase and verifies that all tables are properly seeded.
 * It provides comprehensive reporting on database health and seeding status.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  console.error('Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

console.log('Connecting to Supabase...');
console.log(`   URL: ${SUPABASE_URL}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ALL_TABLES = [
  { name: 'violations', critical: true, category: 'Core' },
  { name: 'violation_comments', critical: false, category: 'Core' },
  { name: 'attorneys', critical: true, category: 'Legal Resources' },
  { name: 'state_laws', critical: true, category: 'Legal Resources' },
  { name: 'federal_laws', critical: true, category: 'Legal Resources' },
  { name: 'scanner_links', critical: false, category: 'Resources' },
  { name: 'scanner_frequencies', critical: false, category: 'Resources' },
  { name: 'court_calendars', critical: false, category: 'Legal Resources' },
  { name: 'foia_templates', critical: true, category: 'FOIA' },
  { name: 'foia_agencies', critical: true, category: 'FOIA' },
  { name: 'foia_requests', critical: false, category: 'FOIA' },
  { name: 'foia_documents', critical: false, category: 'FOIA' },
  { name: 'foia_request_updates', critical: false, category: 'FOIA' },
  { name: 'forum_threads', critical: false, category: 'Community' },
  { name: 'forum_posts', critical: false, category: 'Community' },
  { name: 'activists', critical: false, category: 'Community' },
  { name: 'agencies', critical: true, category: 'Accountability' },
  { name: 'officers', critical: false, category: 'Accountability' },
  { name: 'violation_officers', critical: false, category: 'Accountability' },
  { name: 'violation_agencies', critical: false, category: 'Accountability' },
  { name: 'legislation', critical: false, category: 'Legal Resources' },
  { name: 'press_freedom_incidents', critical: false, category: 'Accountability' },
  { name: 'press_freedom_tracker', critical: false, category: 'Accountability' },
  { name: 'thread_bookmarks', critical: false, category: 'Engagement' },
  { name: 'thread_upvotes', critical: false, category: 'Engagement' },
  { name: 'post_upvotes', critical: false, category: 'Engagement' },
  { name: 'comment_upvotes', critical: false, category: 'Engagement' },
  { name: 'thread_tags', critical: false, category: 'Engagement' },
  { name: 'popular_tags', critical: false, category: 'Engagement' },
  { name: 'content_reports', critical: false, category: 'Moderation' },
  { name: 'user_profiles', critical: false, category: 'User System' },
  { name: 'user_badges', critical: false, category: 'Gamification' },
  { name: 'user_follows', critical: false, category: 'Social' },
  { name: 'thread_subscriptions', critical: false, category: 'Engagement' },
  { name: 'community_events', critical: false, category: 'Community' },
  { name: 'event_rsvps', critical: false, category: 'Community' },
  { name: 'resource_library', critical: false, category: 'Resources' },
  { name: 'resource_ratings', critical: false, category: 'Resources' },
  { name: 'success_stories', critical: false, category: 'Community' },
  { name: 'direct_messages', critical: false, category: 'Messaging' },
  { name: 'emergency_contacts', critical: false, category: 'Safety' },
  { name: 'panic_alerts', critical: false, category: 'Safety' },
  { name: 'posts', critical: false, category: 'Social Feed' },
  { name: 'post_likes', critical: false, category: 'Social Feed' },
  { name: 'post_shares', critical: false, category: 'Social Feed' },
  { name: 'user_connections', critical: false, category: 'Social' },
  { name: 'notifications', critical: false, category: 'User System' },
  { name: 'user_activity', critical: false, category: 'User System' },
  { name: 'comments', critical: false, category: 'Social Feed' },
  { name: 'post_reactions', critical: false, category: 'Social Feed' },
  { name: 'mentions', critical: false, category: 'Social Feed' },
  { name: 'post_polls', critical: false, category: 'Social Feed' },
  { name: 'poll_votes', critical: false, category: 'Social Feed' },
  { name: 'post_links', critical: false, category: 'Social Feed' },
  { name: 'user_verification', critical: false, category: 'Gamification' },
  { name: 'achievement_definitions', critical: false, category: 'Gamification' },
  { name: 'user_achievements', critical: false, category: 'Gamification' },
  { name: 'user_reputation', critical: false, category: 'Gamification' },
  { name: 'reputation_events', critical: false, category: 'Gamification' },
  { name: 'groups', critical: false, category: 'Community' },
  { name: 'group_members', critical: false, category: 'Community' },
  { name: 'group_posts', critical: false, category: 'Community' },
  { name: 'event_invites', critical: false, category: 'Community' },
  { name: 'video_posts', critical: false, category: 'Watch Parties' },
  { name: 'watch_parties', critical: false, category: 'Watch Parties' },
  { name: 'watch_party_attendees', critical: false, category: 'Watch Parties' },
  { name: 'watch_party_chat', critical: false, category: 'Watch Parties' },
  { name: 'watch_party_invites', critical: false, category: 'Watch Parties' },
];

async function verifyTable(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { table: tableName, count: 0, status: 'error', error: error.message };
    }

    const status = count === 0 ? 'empty' : 'seeded';
    return { table: tableName, count, status };
  } catch (err) {
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
      console.error('Tables do not exist. Migrations need to be applied.');
      return false;
    }

    console.log('Database connection successful\n');
    return true;
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    return false;
  }
}

function printHeader(title) {
  const line = '═'.repeat(70);
  console.log(`\n${line}`);
  console.log(`   ${title}`);
  console.log(`${line}\n`);
}

function printSection(title) {
  console.log(`\n── ${title} ──────────────────────────────────────────────\n`);
}

async function main() {
  printHeader('SUPABASE DATABASE VERIFICATION');

  const connected = await testConnection();
  if (!connected) {
    console.log('\nTo apply migrations, run:');
    console.log('   npx supabase db push\n');
    process.exit(1);
  }

  console.log('Checking all tables in database...\n');

  const results = [];
  const batchSize = 10;
  
  for (let i = 0; i < ALL_TABLES.length; i += batchSize) {
    const batch = ALL_TABLES.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(t => verifyTable(t.name)));
    results.push(...batchResults.map((r, idx) => ({
      ...r,
      critical: batch[idx].critical,
      category: batch[idx].category
    })));
  }

  printHeader('TABLE STATUS BY CATEGORY');

  const categories = [...new Set(ALL_TABLES.map(t => t.category))];
  
  for (const category of categories) {
    const categoryTables = results.filter(r => r.category === category);
    const seeded = categoryTables.filter(r => r.status === 'seeded');
    const empty = categoryTables.filter(r => r.status === 'empty');
    const errors = categoryTables.filter(r => r.status === 'error');

    console.log(`\n[${category}] (${categoryTables.length} tables)`);
    
    if (seeded.length > 0) {
      seeded.forEach(r => console.log(`   OK ${r.table}: ${r.count.toLocaleString()} records`));
    }
    
    if (empty.length > 0) {
      empty.forEach(r => console.log(`   -- ${r.table}: empty`));
    }
    
    if (errors.length > 0) {
      errors.forEach(r => console.log(`   XX ${r.table}: ${r.error}`));
    }
  }

  printHeader('COMPREHENSIVE SUMMARY');

  const seeded = results.filter(r => r.status === 'seeded');
  const empty = results.filter(r => r.status === 'empty');
  const errors = results.filter(r => r.status === 'error');
  const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
  const seededPercentage = ((seeded.length / ALL_TABLES.length) * 100).toFixed(1);

  console.log(`Total tables checked:     ${ALL_TABLES.length}`);
  console.log(`Tables with data:         ${seeded.length}`);
  console.log(`Empty tables:             ${empty.length}`);
  console.log(`Tables with errors:       ${errors.length}`);
  console.log(`\nTotal records:            ${totalRecords.toLocaleString()}`);
  console.log(`Seeding completion:       ${seededPercentage}%`);

  printSection('Database Health Status');

  let healthStatus = 'HEALTHY';
  let healthIcon = 'OK';
  
  if (errors.length > 0) {
    healthStatus = 'CRITICAL';
    healthIcon = 'XX';
  } else if (seededPercentage < 50) {
    healthStatus = 'NEEDS ATTENTION';
    healthIcon = '!!';
  } else if (seededPercentage < 80) {
    healthStatus = 'PARTIALLY SEEDED';
    healthIcon = '--';
  }

  console.log(`Overall Status: [${healthIcon}] ${healthStatus}`);

  printSection('Critical Tables Analysis');

  const criticalTables = results.filter(r => r.critical);
  const criticalSeeded = criticalTables.filter(r => r.status === 'seeded');
  const criticalEmpty = criticalTables.filter(r => r.status === 'empty');
  const criticalErrors = criticalTables.filter(r => r.status === 'error');

  console.log(`Critical tables status: ${criticalSeeded.length}/${criticalTables.length} seeded`);

  if (criticalErrors.length > 0) {
    console.log('\nCritical tables with ERRORS:');
    criticalErrors.forEach(r => console.log(`   XX ${r.table}: ${r.error}`));
  }

  if (criticalEmpty.length > 0) {
    console.log('\nCritical tables that are EMPTY (need seeding):');
    criticalEmpty.forEach(r => console.log(`   -- ${r.table}`));
  }

  if (criticalSeeded.length === criticalTables.length && criticalTables.length > 0) {
    console.log('\nAll critical tables are properly seeded.');
  }

  if (empty.length > 0) {
    printSection('All Empty Tables');
    empty.forEach(r => console.log(`   -- ${r.table} [${r.category}]`));
  }

  if (errors.length > 0) {
    printSection('All Tables with Errors');
    errors.forEach(r => console.log(`   XX ${r.table}: ${r.error}`));
  }

  printSection('Recommendations');

  if (errors.length > 0) {
    console.log('1. Fix table errors before proceeding:');
    console.log('   - Check if migrations have been applied correctly');
    console.log('   - Verify table permissions and RLS policies');
    console.log('   - Run: npx supabase db push');
  }

  if (criticalEmpty.length > 0) {
    console.log('2. Seed critical tables immediately:');
    console.log('   - These tables are essential for core functionality');
    criticalEmpty.forEach(r => console.log(`   - ${r.table}`));
  }

  if (empty.length > criticalEmpty.length && errors.length === 0) {
    console.log('3. Consider seeding non-critical tables:');
    console.log('   - Check migration files in supabase/migrations/');
    console.log('   - Run seed migrations if available');
  }

  if (errors.length === 0 && empty.length === 0) {
    console.log('Database is fully seeded and healthy.');
  }

  printHeader('END OF REPORT');

  const exitCode = criticalErrors.length > 0 ? 1 : (criticalEmpty.length > 0 ? 1 : (errors.length > 0 ? 1 : 0));
  
  if (exitCode === 0) {
    console.log('All critical tables are properly configured.\n');
  } else {
    console.log('Database needs attention. See recommendations above.\n');
  }

  process.exit(exitCode);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
