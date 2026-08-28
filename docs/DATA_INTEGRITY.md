# Data Integrity and Provenance Policy

This document defines how Civil Rights Hub may collect, seed, verify, publish, update, and retire factual public data.

## Core rule

**No public factual claim without traceable evidence appropriate to that claim.**

The system should prefer a smaller, defensible dataset over a large dataset with uncertain truth.

## Data classes

### 1. Verified public reference data

Examples: attorneys, activists, laws, official resources, scanner directories, agencies, incidents/accountability records.

These records may be publicly represented as verified only when the required provenance gate passes.

### 2. User-generated content

Examples: a user's post, comment, report, message, profile bio, forum contribution, story, or RSVP.

These are statements/actions by the submitting user. They are not automatically factual findings endorsed by Civil Rights Hub.

### 3. Editorial/system content

First-party educational or editorial material published by Civil Rights Hub/We The People News.

It must be clearly identified as editorial/system content. It cannot pretend to be an independent user, fake a first-person experience, or carry fabricated engagement.

Factual claims in editorial/system content still require source review.

### 4. Product/configuration data

Examples: UI categories, achievement definitions, internal taxonomy, feature settings.

This may be seeded without external provenance when it is clearly product configuration rather than a claim about the outside world.

### 5. Legacy/unknown data

Any old row whose origin, author, source support, or generation method is unclear.

Default treatment: unverified/held/quarantined until re-established.

## Source preference

Use the strongest available source.

### Legal authority

Prefer:

1. official statute/regulation text;
2. official court opinions/dockets;
3. official government guidance;
4. authoritative legal organization material;
5. reputable secondary reporting for context only.

### Attorneys

Identity/licensure/status should anchor to the relevant official bar or government source. Organization/firm pages may support organization-controlled contact/practice facts. Do not infer pro-bono availability, case success, ratings, experience, specialties, or outcomes without a source that actually supports them.

### Activists/organizations

Prefer the person's/organization's official site or verified organization-controlled page for identity, public channel, bio, and focus information. Do not manufacture biographies or follower/reach statistics.

### Incidents/accountability

Prefer court records, official government records, prosecutor/DOJ/oversight records, public reports, or clearly attributed user submissions. Allegations must remain labeled as allegations/reports unless adjudicated or officially established.

### Events

Use an official organizer, venue, registration, government, or organization source. Dates, locations, contacts, registration URLs, and cancellation status are time-sensitive and should be rechecked.

### Scanner resources

Prefer the provider's official directory/endpoint. Do not display invented listener counts, frequencies, feed identities, or availability.

## Field-level support

Provenance is not just row-level.

A source that proves an attorney's name and bar status does not necessarily prove their phone, email, pro-bono availability, rating, or practice areas.

Where the schema supports `supported_fields`, every populated public factual field should be explicitly tied to evidence or omitted.

## Freshness

Changing facts require re-verification. Examples:

- attorney bar status/contact information;
- event time/location/cancellation state;
- statutes and legal guidance;
- scanner/provider URLs;
- organization contact details.

A previously valid source can become stale. Preserve the historical evidence but remove it from active publication support when it no longer meets freshness requirements.

## Verification states

Use explicit states rather than a vague boolean wherever practical, such as:

- `needs_review`
- `verified_primary`
- `verified_secondary`
- `stale`
- `rejected`

Old `verified=true` or similar flags are not evidence by themselves.

## Seeding policy

The approved seeding workflow is provenance-aware.

Dry run first:

```bash
npm run seed:verified:dry-run -- path/to/verified-seed.json
```

Then write only after review:

```bash
npm run seed:verified -- path/to/verified-seed.json
```

Before write mode:

- verify project ref `vrdnrbjnitptxrexdlao`;
- verify migration parity/provenance functions exist;
- review source URLs/titles/publishers/types;
- verify supported fields;
- verify primary anchors;
- make sure the payload contains no synthetic identities or statistics.

After write mode:

- verify row/publication state;
- verify provenance rows;
- verify RLS-visible behavior as the intended browser role;
- record/review any rejected records.

## Prohibited seeding

Never use random/generated values for real-world public data, including:

- names;
- law firms;
- agencies;
- incidents;
- phone numbers/emails;
- bar numbers;
- ratings/review counts;
- case outcomes/success rates;
- complaint/settlement totals;
- event details;
- social engagement.

Do not use an LLM to fill missing factual fields from plausibility.

## AI usage

AI may help:

- extract structured facts from supplied sources;
- summarize evidence;
- flag conflicts or missing fields;
- propose search queries;
- draft neutral descriptions tied to evidence.

AI may not:

- invent a citation;
- infer unsupported contact/professional facts;
- create synthetic people or events;
- mark its own generated statement verified without external evidence;
- turn a secondary claim into a primary-source fact.

## Corrections

When a published record is challenged:

1. preserve the existing provenance/audit trail;
2. inspect the claimed correction source;
3. update or retire the affected field/provenance;
4. avoid silently rewriting history;
5. re-run publication checks.

## Quarantine

Legacy or known synthetic records should be snapshotted before deletion when practical. Quarantine tables are audit evidence, not a source for republishing records.

## Enforcement philosophy

When a policy gate blocks publication, fix the evidence/data model rather than bypassing the gate. A truthful empty state is better than unsupported certainty.
