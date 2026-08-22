import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const idx = line.indexOf('=');
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        return [key, value];
      }),
  );
}

const env = {
  ...loadEnvFile(path.join(__dirname, '..', '.env')),
  ...loadEnvFile(path.join(__dirname, '..', '.env.local')),
  ...process.env,
};

const SUPABASE_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase URL or service-role key. Refusing to seed.');
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/verified-seeder.js <verified-seed.json> [--dry-run]');
  process.exit(1);
}

const dryRun = process.argv.includes('--dry-run');
const absoluteInput = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(absoluteInput)) {
  console.error(`Input file not found: ${absoluteInput}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(absoluteInput, 'utf8'));
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CONFIG = {
  attorneys: { table: 'attorneys', entityType: 'attorney', verifiedColumn: 'is_verified', verifiedValue: true },
  violations: { table: 'violations', entityType: 'violation', verifiedColumn: 'status', verifiedValue: 'verified' },
  activists: { table: 'activists', entityType: 'activist', verifiedColumn: 'verified', verifiedValue: true },
};

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function normalizeSource(source, index) {
  assertPlainObject(source, `sources[${index}]`);
  if (typeof source.source_url !== 'string' || !source.source_url.startsWith('https://')) {
    throw new Error(`sources[${index}].source_url must be an HTTPS URL`);
  }

  // The private review-notes table is intentionally outside the Data API.
  // Do not silently discard or try to expose those notes through PostgREST.
  if (Object.prototype.hasOwnProperty.call(source, 'verification_notes')) {
    throw new Error('verification_notes are private and must be recorded through a trusted SQL/admin review workflow, not this JSON API seeder');
  }

  const allowedTypes = new Set([
    'official', 'court_record', 'government', 'bar_directory', 'organization', 'news', 'other',
  ]);
  const sourceType = source.source_type || 'official';
  if (!allowedTypes.has(sourceType)) {
    throw new Error(`Unsupported source_type: ${sourceType}`);
  }

  return {
    source_url: source.source_url,
    source_title: source.source_title ?? null,
    source_publisher: source.source_publisher ?? null,
    source_type: sourceType,
    is_primary_source: Boolean(source.is_primary_source),
  };
}

function validateEntry(kind, entry, index) {
  assertPlainObject(entry, `${kind}[${index}]`);
  assertPlainObject(entry.record, `${kind}[${index}].record`);

  if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
    throw new Error(`${kind}[${index}] must include at least one source`);
  }

  const sources = entry.sources.map(normalizeSource);
  const record = structuredClone(entry.record);

  // Caller cannot smuggle verification through the entity insert. The script
  // always inserts/updates evidence first, then performs the verification step.
  const config = CONFIG[kind];
  if (kind === 'violations') {
    record.status = record.status === 'resolved' ? 'resolved' : 'pending';
  } else {
    record[config.verifiedColumn] = false;
    if (kind === 'attorneys') record.verified_date = null;
  }

  // Existing records must be addressed explicitly by UUID. We do not fuzzy-match
  // people or organizations because that can merge two real people incorrectly.
  const existingId = typeof entry.entity_id === 'string' ? entry.entity_id : null;

  return { record, sources, existingId };
}

async function upsertUnverifiedEntity(kind, entry) {
  const config = CONFIG[kind];
  if (entry.existingId) {
    const { data, error } = await supabase
      .from(config.table)
      .update(entry.record)
      .eq('id', entry.existingId)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  const { data, error } = await supabase
    .from(config.table)
    .insert(entry.record)
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

async function insertSources(config, entityId, sources) {
  for (const source of sources) {
    const publicSource = {
      entity_type: config.entityType,
      entity_id: entityId,
      source_url: source.source_url,
      source_title: source.source_title,
      source_publisher: source.source_publisher,
      source_type: source.source_type,
      is_primary_source: source.is_primary_source,
      is_active: true,
    };

    const { error } = await supabase
      .from('data_provenance')
      .upsert(publicSource, { onConflict: 'entity_type,entity_id,source_url' });
    if (error) throw error;
  }
}

async function markVerified(kind, entityId) {
  const config = CONFIG[kind];
  const update = { [config.verifiedColumn]: config.verifiedValue };
  if (kind === 'attorneys') update.verified_date = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from(config.table)
    .update(update)
    .eq('id', entityId);
  if (error) throw error;
}

async function processKind(kind) {
  const rows = Array.isArray(payload[kind]) ? payload[kind] : [];
  const validated = rows.map((entry, index) => validateEntry(kind, entry, index));
  console.log(`${kind}: ${validated.length} source-backed record(s)`);

  for (let index = 0; index < validated.length; index += 1) {
    const entry = validated[index];
    const label = `${kind}[${index}]`;

    if (dryRun) {
      console.log(`[DRY RUN] ${label}: ${entry.sources.length} source(s), ${entry.existingId ? `existing ${entry.existingId}` : 'new record'}`);
      continue;
    }

    // Failure mode is intentionally safe: the entity is written unverified first.
    // It can only become verified after source rows exist, and the DB trigger
    // independently enforces the same rule.
    const entityId = await upsertUnverifiedEntity(kind, entry);
    await insertSources(CONFIG[kind], entityId, entry.sources);
    await markVerified(kind, entityId);
    console.log(`Verified ${label} -> ${entityId}`);
  }
}

async function main() {
  console.log(dryRun ? 'Running verification seed validation only.' : 'Running source-provenance seeder.');
  for (const kind of Object.keys(CONFIG)) {
    await processKind(kind);
  }
  console.log(dryRun ? 'Dry run passed.' : 'Source-backed seed completed.');
}

main().catch((error) => {
  console.error('Verified seed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
