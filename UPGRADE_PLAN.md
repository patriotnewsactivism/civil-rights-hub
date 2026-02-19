# Civil Rights Hub - Comprehensive Upgrade Plan

## Overview

This plan addresses all major areas of the Civil Rights Hub with a focus on:
1. **Fixing critical bugs first** (broken hooks, missing tables, schema mismatches)
2. **Enriching data** (attorneys, police scanners, FOIA agencies, state laws)
3. **Completing incomplete features** (social platform, emergency contacts, notifications)
4. **Adding comprehensive legal resources** for journalists and activists

---

## Phase 1: Critical Bug Fixes & Foundation (Priority: HIGH)

### 1.1 Fix Emergency Contacts Hook
**File:** `src/hooks/useEmergencyContacts.ts`
- **Current State:** Placeholder returning empty arrays with console warnings
- **Fix Required:** Implement actual Supabase CRUD operations for:
  - `fetchContacts()` - Query `emergency_contacts` table
  - `addContact()` - Insert with user_id from auth
  - `updateContact()` - Update by ID
  - `deleteContact()` - Delete by ID
  - `reorderContacts()` - Update priority_order
  - `setPrimaryContact()` - Toggle is_primary

### 1.2 Fix Schema Mismatches

| Table | Issue | Fix |
|-------|-------|-----|
| `attorneys` | `firm` vs `firm_name` column mismatch | Standardize on `firm_name`, update TypeScript types |
| `attorneys` | TypeScript missing `rating`, `review_count`, `languages`, `practice_areas` | Add to `AttorneyRecord` interface |
| `foia_agencies` | TypeScript missing 15+ columns from migration | Regenerate types or manually add |
| `foia_requests` | Column names differ (`subject` vs `request_subject`) | Align TypeScript with migration |
| `scanner_links` | TypeScript missing `feed_type`, `agency_name` columns | Add to `ScannerLinkRecord` |

### 1.3 Create Missing Database Tables

| Table | Purpose | Referenced In |
|-------|---------|---------------|
| `agencies` | Law enforcement agency directory | ViolationReport.tsx |
| `officers` | Officer tracking (badge, name, rank) | ViolationReport.tsx |
| `violation_agencies` | Link violations to agencies | ViolationReport.tsx |
| `violation_officers` | Link violations to officers | ViolationReport.tsx |

### 1.4 Fix Social Platform Incomplete Features

- **Post Shares:** Implement sharing functionality in `SocialFeed.tsx`
- **Post Bookmarks:** Add bookmarks table and UI
- **@Mentions:** Implement mention parsing and notification
- **Notification UI:** Create `NotificationsCenter.tsx` display component
- **Moderator Dashboard:** Create UI for reviewing `content_reports`

---

## Phase 2: Attorney Database Enhancement

### 2.1 Data Quality Fixes
- Standardize all `firm` → `firm_name` in existing migrations
- Remove duplicate entries across multiple seed migrations
- Validate and correct state codes, cities, phone numbers
- Add missing practice areas to attorneys with only `specialties`

### 2.2 Expand Coverage - Target: 1000+ Verified Attorneys

**States Needing Expansion (currently <10 attorneys):**
| State | Current | Target | Focus Areas |
|-------|---------|--------|-------------|
| Alaska | ~2 | 15 | Native rights, environmental |
| Wyoming | ~2 | 10 | Civil rights, ACLU affiliate |
| Montana | ~2 | 12 | Indigenous rights, land rights |
| North Dakota | ~2 | 12 | Protest rights, indigenous |
| South Dakota | ~3 | 12 | Native American rights |
| Vermont | ~2 | 10 | Civil liberties |
| New Hampshire | ~3 | 15 | First Amendment |
| Delaware | ~2 | 12 | Corporate accountability |
| West Virginia | ~2 | 12 | Labor rights, environmental |
| Mississippi | ~5 | 20 | Civil rights history, voting rights |

**Specialty Areas to Add:**
- First Amendment (speech, press, religion)
- Fourth Amendment (search/seizure, privacy)
- Voting rights attorneys
- Immigration rights attorneys
- LGBTQ+ rights attorneys
- Environmental justice attorneys
- Police misconduct specialists
- Wrongful conviction attorneys
- Prisoners' rights attorneys

### 2.3 Add Attorney Verification System
- Bar association verification status
- Years verified
- Case success metrics
- Client review system

---

## Phase 3: Police Scanner Database Enhancement

### 3.1 Fix Data Quality
- Remove generated/fake Broadcastify URLs (random IDs)
- Verify real feeds against Broadcastify directory
- Standardize URL patterns to `/listen/feed/[id]`
- Correct county names (e.g., "Birmingham County" → "Jefferson County, AL")

### 3.2 Expand Coverage - Target: 500+ Verified Feeds

**Rural/Underserved Areas:**
- Add county sheriff feeds for all 3,143 US counties
- Border region feeds (immigration monitoring)
- State patrol feeds for all 50 states
- Major university police departments
- Federal law enforcement (where publicly broadcast)

**New Platforms to Integrate:**
- OpenMHZ (currently DC only - expand to other cities)
- Broadcastify Calls (archives/transcripts)
- RadioReference API integration
- Local government streaming servers

### 3.3 Enhanced Scanner Features
- Encryption status tracking
- Feed reliability/uptime monitoring
- Archive/transcript links where available
- Incident alert system (keyword monitoring)

---

## Phase 4: FOIA & Public Records Enhancement

### 4.1 Complete Agency Database - Target: 5000+ Agencies

**Federal Expansion:**
- All Cabinet departments (complete sub-agencies)
- All 94 US Attorney Offices
- All 93 Federal Judicial Districts
- All federal prisons (BOP)
- Military branches and bases (public affairs)

**State Expansion (All 50 States):**
- Governor's offices
- Attorney General offices
- State Police/Highway Patrol
- State-level departments (Corrections, Education, Health, etc.)
- State universities (public records officers)

**County/Municipal (Target: 500 major jurisdictions):**
- Sheriff's offices
- Police departments
- District Attorney offices
- County commissions
- City councils
- School boards
- Public defender offices

### 4.2 FOIA Template Expansion

**New Templates for Journalists:**
- Press credential verification request
- Police misconduct complaint data
- Body camera footage policy request
- Arrest/booking record request
- Court docket/case file request
- Government contracts/procurement request
- Public meeting minutes request
- Environmental impact statement request

**New Templates for Activists:**
- Protest permit denial appeal
- Police use of force statistics
- Civilian complaint review board records
- Stop-and-frisk data request
- License plate reader data request
- Facial recognition usage request
- Social media monitoring records
- Surveillance technology purchase records

### 4.3 FOIA Features to Add
- Deadline calendar integration
- Auto-follow-up reminders
- Appeal letter generator
- Fee waiver request templates
- Request sharing/archiving
- Success rate tracking by agency

---

## Phase 5: State Laws & Legal Resources (Journalists & Activists)

### 5.1 New Legal Topics to Add for All 50 States

**For Journalists:**
| Topic | Data Points |
|-------|-------------|
| Wiretap Laws | Statute citation, consent type, penalties, exceptions |
| Anti-SLAPP Laws | Statute citation, protections, procedural benefits |
| Journalist Shield Laws | Detailed protections, qualified vs absolute, case law |
| Journalist Credential Laws | Access rights, press pass laws, restrictions |
| Prior Restraint | Case law, injunction standards, emergency exceptions |
| Defamation/Libel | Standards, defenses, retraction requirements |
| Drone/Surveillance Laws | Restrictions on aerial recording, journalist exceptions |
| Open Meetings Laws | Sunshine laws, access rights, enforcement |

**For Activists:**
| Topic | Data Points |
|-------|-------------|
| Critical Infrastructure Laws | Pipeline protest laws, penalties, states enacted |
| Anti-Riot Statutes | Definitions, thresholds, penalties |
| Curfew Laws | Minor curfews, emergency curfews, enforcement |
| Public Assembly Laws | Permit requirements, spontaneous assembly rights |
| Permit Requirements | By major city, costs, timelines, appeal process |
| Body Camera Policies | Activation requirements, public access, retention |
| Citizen Review Boards | Existence, powers, contact info by city |
| Voter ID Laws | Requirements, accepted IDs, provisional ballot rules |
| Marijuana Laws | Employment protections, expungement, housing rights |

### 5.2 City-Specific Protest Information (Top 100 Cities)

For each major city:
- Protest permit office contact
- Permit requirements and fees
- Designated protest areas
- Historic protest locations
- Local ACLU chapter
- Legal observer programs
- Bail fund contacts
- Know Your Rights hotline

### 5.3 Resource Library Expansion

**New Categories:**
- State-specific KYR guides (50 guides)
- Multi-language resources (Spanish, Chinese, Arabic, etc.)
- Interactive training modules
- Legal document templates
- Expert witness directory
- Bail fund directory by state
- Press freedom organization directory
- Digital security guides for journalists

---

## Phase 6: Social & Reporting Platform Completion

### 6.1 Social Features to Complete

| Feature | Current | Required |
|---------|---------|----------|
| Post Sharing | Button exists, no action | Full share/repost with attribution |
| Post Bookmarks | Button exists, no action | Save posts, bookmarks list |
| @Mentions | DB column exists | Parse @username, notify users |
| Hashtags | Working | Add trending algorithm server-side |
| Content Reporting | DB exists | Moderator dashboard UI |
| User Blocking | Not implemented | Block table, filter content |
| Private Profiles | Column exists | Enforce visibility rules |
| Post Editing | Not implemented | Edit history tracking |

### 6.2 Violation Reporting Enhancement

| Feature | Current | Required |
|---------|---------|----------|
| Agency Linking | Referenced, no table | Add agencies table, link to violations |
| Officer Tracking | Referenced, no table | Add officers table, link to violations |
| Media Uploads | URLs only | Supabase Storage integration |
| Evidence Chain | Not implemented | Timestamp, hash verification |
| Witness Statements | Not implemented | Witness table, statements |
| Case Timeline | Not implemented | Status history, updates |
| Related Violations | Not implemented | Link related incidents |
| Geolocation Map | Not implemented | Interactive violation heatmap |

### 6.3 Notification System

- Real-time notification delivery (Supabase Realtime)
- Email digest (daily/weekly options)
- Push notifications (PWA integration)
- Notification preferences per type

---

## Phase 7: Special Features & Integrations

### 7.1 Emergency Features Fix
- Complete `useEmergencyContacts` hook implementation
- Add SMS notification integration (Twilio)
- Add email notification integration
- Test panic button end-to-end

### 7.2 AI Tools Enhancement
- Improve case search with better prompts
- Add legal document analysis
- Add case outcome prediction
- Add jurisdiction-specific guidance

### 7.3 Events Calendar Enhancement
- Add event discovery by topic
- Add event import from external calendars
- Add virtual event integration (Zoom, etc.)
- Add event reminder system

---

## Implementation Order

### Week 1: Critical Fixes
1. Fix `useEmergencyContacts` hook
2. Fix schema mismatches in TypeScript types
3. Create missing database tables
4. Fix social share/bookmark functionality

### Week 2: Data Enrichment
1. Attorney database expansion and quality fixes
2. Scanner feed verification and expansion
3. FOIA agency database completion
4. State laws database expansion

### Week 3: Feature Completion
1. Social platform missing features
2. Violation reporting enhancements
3. Notification system implementation
4. Moderator tools

### Week 4: Legal Resources & Polish
1. State-specific legal guides
2. City-specific protest information
3. Resource library expansion
4. AI tools improvements
5. Testing and documentation

---

## Success Metrics

| Area | Current | Target |
|------|---------|--------|
| Verified Attorneys | 500+ | 1000+ |
| Police Scanner Feeds | 200+ (some fake) | 500+ verified |
| FOIA Agencies | 150+ | 5000+ |
| State Law Topics | 6 topics | 18+ topics |
| City Coverage (protest info) | 0 | 100 major cities |
| Working Social Features | 60% | 100% |
| Emergency System | Broken | Fully functional |
| Notification Delivery | DB only | Real-time + email |
