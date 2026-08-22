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

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputPath = args.find((arg) => !arg.startsWith('--'));
if (!inputPath) {
  console.error('Usage: node scripts/verified-seeder.js <verified-seed.json> [--dry-run]');
  process.exit(1);
}

const absoluteInput = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(absoluteInput)) {
  console.error(`Input file not found: ${absoluteInput}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(absoluteInput, 'utf8'));
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ALLOWED_SOURCE_TYPES = new Set([
  'official', 'court_record', 'government', 'bar_directory', 'organization', 'news', 'other',
]);
const ALLOWED_REVIEW_STATUSES = new Set(['verified_primary', 'verified_secondary']);

const CONFIG = {
  attorneys: {
    table: 'attorneys',
    entityType: 'attorney',
    required: ['name', 'state'],
    primaryTypes: new Set(['bar_directory', 'government', 'official']),
    reset: {
      firm: null,
      city: null,
      practice_areas: [],
      specialties: [],
      phone: null,
      email: null,
      website: null,
      bio: null,
      bar_number: null,
      years_experience: null,
      rating: null,
      review_count: null,
      accepts_pro_bono: false,
      languages: [],
      verified_date: null,
      bar_association_status: null,
      bar_status_date: null,
      case_success_rate: null,
      total_cases_handled: null,
      client_reviews: null,
      average_rating: null,
      total_reviews: null,
      years_with_organization: null,
      notable_cases: [],
      professional_bio: null,
      is_verified: false,
    },
    publish: () => ({
      is_verified: true,
      verified_date: new Date().toISOString().slice(0, 10),
    }),
  },
  violations: {
    table: 'violations',
    entityType: 'violation',
    required: ['title', 'description', 'location_state', 'incident_date'],
    primaryTypes: new Set(['court_record', 'government', 'official']),
    reset: {
      location_city: null,
      latitude: null,
      longitude: null,
      media_urls: [],
      officer_name: null,
      officer_badge: null,
      officer_rank: null,
      agency_name: null,
      status: 'pending',
    },
    publish: () => ({ status: 'verified' }),
  },
  activists: {
    table: 'activists',
    entityType: 'activist',
    required: ['name'],
    primaryTypes: new Set(['organization', 'government', 'official']),
    reset: {
      alias: null,
      primary_platform: null,
      channel_url: null,
      focus_areas: [],
      home_state: null,
      profile_image_url: null,
      bio: null,
      verified: false,
    },
    publish: () => ({ verified: true }),
  },
  state_laws: {
    table: 'state_laws',
    entityType: 'state_law',
    required: [
      'state',
      'state_code',
      'recording_consent_type',
      'recording_law_details',
      'can_record_police',
      'police_recording_details',
      'has_shield_law',
      'protest_permit_required',
    ],
    primaryTypes: new Set(['government', 'official', 'court_record']),
    reset: {
      recording_law_citation: null,
      police_recording_restrictions: null,
      shield_law_details: null,
      journalist_protections: null,
      assembly_rights_details: null,
      activist_protections: null,
      state_aclu_url: null,
      state_legal_aid_url: null,
      state_resources: null,
    },
    publish: null,
  },
  federal_laws: {
    table: 'federal_laws',
    entityType: 'federal_law',
    required: ['title', 'category', 'statute_citation', 'summary'],
    primaryTypes: new Set(['government', 'official', 'court_record']),
    reset: {
      short_name: null,
      year_enacted: null,
      full_text: null,
      key_provisions: null,
      protected_classes: null,
      enforcing_agency: null,
      enforcement_details: null,
      amendments: null,
      related_laws: null,
      external_links: null,
    },
    publish: null,
  },
  scanners: {
    table: 'scanner_links',
    entityType: 'scanner',
    required: ['state', 'state_code', 'scanner_name'],
    primaryTypes: new Set(['organization', 'official']),
    reset: {
      city: null,
      county: null,
      description: null,
      frequency: null,
      broadcastify_url: null,
      scanner_radio_url: null,
      other_url: null,
      link_type: null,
      listener_count: 0,
      is_active: false,
      notes: null,
    },
    publish: () => ({ is_active: true }),
  },
  resources: {
    table: 'resource_library',
    entityType: 'resource',
    required: ['title', 'resource_type', 'category'],
    primaryTypes: new Set(['organization', 'government', 'official', 'court_record']),
    reset: {
      description: null,
      file_url: null,
      file_size: null,
      external_url: null,
      author: null,
      source: null,
      language: 'en',
      tags: [],
      download_count: 0,
      view_count: 0,
      rating: null,
      rating_count: 0,
      is_approved: false,
      approved_by: null,
    },
    publish: () => ({ is_approved: true }),
  },
};

function assertPlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function isMeaningfulValue(value) {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function normalizeSource(kind, source, index) {
  assertPlainObject(source, `sources[${index}]`);
  if (typeof source.source_url !== 'string' || !source.source_url.startsWith('https://')) {
    throw new Error(`sources[${index}].source_url must be an HTTPS URL`);
  }

  if (Object.prototype.hasOwnProperty.call(source, 'verification_notes')) {
    throw new Error('verification_notes are private and must be recorded through a trusted SQL/admin review workflow, not this JSON API seeder');
  }

  const sourceType = source.source_type;
  if (!ALLOWED_SOURCE_TYPES.has(sourceType)) {
    throw new Error(`sources[${index}].source_type must be explicit and supported`);
  }

  const verificationStatus = source.verification_status;
  if (!ALLOWED_REVIEW_STATUSES.has(verificationStatus)) {
    throw new Error(`sources[${index}].verification_status must be verified_primary or verified_secondary`);
  }

  const isPrimary = source.is_primary_source === true;
  if (verificationStatus === 'verified_primary' && !isPrimary) {
    throw new Error(`sources[${index}] cannot be verified_primary unless is_primary_source=true`);
  }
  if (verificationStatus === 'verified_primary' && !CONFIG[kind].primaryTypes.has(sourceType)) {
    throw new Error(`sources[${index}] source_type ${sourceType} cannot verify ${kind}`);
  }
  if (verificationStatus === 'verified_secondary' && isPrimary) {
    throw new Error(`sources[${index}] marked primary must use verification_status=verified_primary`);
  }

  if (typeof source.source_title !== 'string' || !source.source_title.trim()) {
    throw new Error(`sources[${index}].source_title is required`);
  }
  if (typeof source.source_publisher !== 'string' || !source.source_publisher.trim()) {
    throw new Error(`sources[${index}].source_publisher is required`);
  }
  if (!Array.isArray(source.supports) || source.supports.length === 0) {
    throw new Error(`sources[${index}].supports must list the record fields this source proves`);
  }
  const supportedFields = [...new Set(source.supports.map((field) => String(field).trim()))];
  if (supportedFields.some((field) => !field)) {
    throw new Error(`sources[${index}].supports cannot contain blank field names`);
  }

  return {
    source_url: source.source_url,
    source_title: source.source_title.trim(),
    source_publisher: source.source_publisher.trim(),
    source_type: sourceType,
    is_primary_source: isPrimary,
    verification_status: verificationStatus,
    source_date: source.source_date ?? null,
    source_document_id: source.source_document_id ?? null,
    source_fingerprint: source.source_fingerprint ?? null,
    supported_fields: supportedFields,
  };
}

function validateEntry(kind, entry, index) {
  assertPlainObject(entry, `${kind}[${index}]`);
  assertPlainObject(entry.record, `${kind}[${index}].record`);

  if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
    throw new Error(`${kind}[${index}] must include at least one reviewed source`);
  }

  const config = CONFIG[kind];
  for (const field of config.required) {
    const value = entry.record[field];
    if (!isMeaningfulValue(value)) {
      throw new Error(`${kind}[${index}].record.${field} is required for verified publication`);
    }
  }

  const sources = entry.sources.map((source, sourceIndex) => normalizeSource(kind, source, sourceIndex));
  const primarySources = sources.filter((source) => source.verification_status === 'verified_primary');
  if (primarySources.length === 0) {
    throw new Error(`${kind}[${index}] requires at least one reviewed primary source`);
  }

  for (const field of config.required) {
    if (!primarySources.some((source) => source.supported_fields.includes(field))) {
      throw new Error(`${kind}[${index}].record.${field} lacks reviewed primary-source support`);
    }
  }

  // Every explicit factual value supplied by the seed must be traceable to at
  // least one reviewed source. This prevents a valid identity source from being
  // used to smuggle unrelated claims such as pro-bono availability or listener counts.
  for (const [field, value] of Object.entries(entry.record)) {
    if (!isMeaningfulValue(value)) continue;
    if (!sources.some((source) => source.supported_fields.includes(field))) {
      throw new Error(`${kind}[${index}].record.${field} is populated but no reviewed source lists it in supports`);
    }
  }

  if (kind === 'scanners') {
    const link = entry.record.broadcastify_url || entry.record.scanner_radio_url || entry.record.other_url;
    if (typeof link !== 'string' || !link.startsWith('https://')) {
      throw new Error(`${kind}[${index}] requires an HTTPS provider URL`);
    }
    if (!primarySources.some((source) => source.source_url === link)) {
      throw new Error(`${kind}[${index}] provider URL must exactly match a reviewed primary source_url`);
    }
  }

  const record = { ...config.reset, ...structuredClone(entry.record) };
  // Publication state is controlled by this script, never by input JSON.
  if (kind === 'attorneys') record.is_verified = false;
  if (kind === 'activists') record.verified = false;
  if (kind === 'violations') record.status = 'pending';
  if (kind === 'scanners') record.is_active = false;
  if (kind === 'resources') {
    record.is_approved = false;
    record.approved_by = null;
  }

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
  const reviewedAt = new Date().toISOString();
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
      verification_status: source.verification_status,
      source_date: source.source_date,
      retrieved_at: reviewedAt,
      last_verified_at: reviewedAt,
      source_document_id: source.source_document_id,
      source_fingerprint: source.source_fingerprint,
      supported_fields: source.supported_fields,
    };

    const { error } = await supabase
      .from('data_provenance')
      .upsert(publicSource, { onConflict: 'entity_type,entity_id,source_url' });
    if (error) throw error;
  }
}

async function publishEntity(kind, entityId) {
  const config = CONFIG[kind];
  if (!config.publish) return;
  const update = config.publish();
  const { error } = await supabase
    .from(config.table)
    .update(update)
    .eq('id', entityId);
  if (error) throw error;
}

async function processKind(kind) {
  const rows = Array.isArray(payload[kind]) ? payload[kind] : [];
  const validated = rows.map((entry, index) => validateEntry(kind, entry, index));
  console.log(`${kind}: ${validated.length} reviewed source-backed record(s)`);

  for (let index = 0; index < validated.length; index += 1) {
    const entry = validated[index];
    const label = `${kind}[${index}]`;

    if (dryRun) {
      console.log(`[DRY RUN] ${label}: ${entry.sources.length} reviewed source(s), ${entry.existingId ? `existing ${entry.existingId}` : 'new record'}`);
      continue;
    }

    // Safe failure order: scrub/write the entity in a non-publication state,
    // insert reviewed evidence, then flip the publication flag where applicable.
    // The database RLS/trigger layer independently enforces the same gate.
    const entityId = await upsertUnverifiedEntity(kind, entry);
    await insertSources(CONFIG[kind], entityId, entry.sources);
    await publishEntity(kind, entityId);
    console.log(`Published reviewed ${label} -> ${entityId}`);
  }
}

async function main() {
  console.log(dryRun ? 'Running reviewed seed validation only.' : 'Running reviewed source-provenance seeder.');
  for (const kind of Object.keys(CONFIG)) {
    await processKind(kind);
  }
  console.log(dryRun ? 'Dry run passed.' : 'Reviewed source-backed seed completed.');
}

main().catch((error) => {
  console.error('Verified seed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
