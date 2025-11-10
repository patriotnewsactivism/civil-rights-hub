# Build Plan: All Features Implementation

## 🎯 **Current Status: Database Complete, Components Needed**

We now have **28 database tables** ready for a complete civil rights platform. All migrations are created and ready to apply.

---

## 📦 **Phase 1: Apply New Migrations** (15 minutes)

### Apply These 3 New Migrations:

```bash
# Via Supabase CLI
supabase db push

# Or manually via Dashboard SQL Editor:
```

1. **`20251110110000_create_engagement_tables.sql`**
   - Thread bookmarks, upvotes, tags, reports
   - Popular tags tracking
   - Auto-update upvote counts

2. **`20251110110001_create_user_profiles_and_reputation.sql`**
   - User profiles with bios
   - Badge system (auto-awarded)
   - Following system
   - Thread subscriptions
   - Auto-create profile on signup

3. **`20251110110002_create_community_features.sql`**
   - Events calendar with RSVPs
   - Resource library with ratings
   - Success stories
   - Direct messaging
   - Emergency contacts
   - Panic button alerts

---

## 🎨 **Phase 2: Build React Components** (Priority Order)

### **Tier 1: Quick Wins** (2-4 hours total)

#### 1. Enhanced Discussion Board
**File**: Update `src/components/DiscussionBoard.tsx`

Add:
- ⭐ Upvote button (toggle upvote, show count)
- 🔖 Bookmark button (save thread)
- 🏷️ Tag input (add hashtags)
- 🚩 Report button (flag content)
- 📧 Subscribe button (email notifications)

**Complexity**: Low - just add buttons and API calls

#### 2. Emergency Contacts Widget
**File**: `src/components/EmergencyContacts.tsx`

Features:
- Quick dial buttons
- Add/edit/delete contacts
- Priority ordering
- Sticky on mobile
- Integrate with panic button

**Complexity**: Low - simple CRUD

#### 3. Panic Button
**File**: `src/components/PanicButton.tsx`

Features:
- Big red button
- GPS capture
- Send to emergency contacts
- Optional: Send to ACLU/NLG
- Test mode

**Complexity**: Medium - geolocation + notifications

### **Tier 2: Community Features** (4-6 hours)

#### 4. Events Calendar
**File**: `src/components/EventsCalendar.tsx`

Features:
- List/calendar view
- RSVP button
- Filter by type/location
- Create event form
- Add to Google Calendar

**Libraries**:
```bash
npm install react-big-calendar date-fns-tz
```

**Complexity**: Medium

#### 5. Resource Library
**File**: `src/components/ResourceLibrary.tsx`

Features:
- Grid/list view
- Filter by category/type
- Rating stars
- Download tracking
- Upload form (admins)

**Libraries**:
```bash
npm install react-dropzone  # For file uploads
```

**Complexity**: Medium

#### 6. Success Stories
**File**: `src/components/SuccessStories.tsx`

Features:
- Card grid view
- Filter by state/outcome
- Submit story form
- Like button
- Featured stories

**Complexity**: Low-Medium

#### 7. User Profile Page
**File**: `src/components/UserProfile.tsx`

Features:
- View profile info
- Edit bio/avatar
- Badge display
- Post history
- Follow button
- Stats (reputation, posts, threads)

**Complexity**: Medium

### **Tier 3: Advanced** (6-8 hours)

#### 8. Direct Messaging
**File**: `src/components/DirectMessages.tsx`

Features:
- Inbox view
- Conversation thread
- Send message
- Read receipts
- Delete messages

**Complexity**: High

#### 9. Rich Text Editor
**Files**: Update all text inputs in forums

**Libraries**:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
```

Features:
- Bold, italic, links
- Bullet lists
- Quotes
- @ mentions

**Complexity**: Medium

#### 10. Violation Heatmap
**File**: `src/components/ViolationHeatmap.tsx`

**Libraries**:
```bash
npm install react-leaflet leaflet
npm install react-leaflet-cluster  # For clustering markers
```

Features:
- Map with violation markers
- Cluster nearby violations
- Click for details
- Filter by type/date
- Heatmap layer

**Complexity**: High

---

## 🔧 **Phase 3: External Integrations** (Optional)

### Email Notifications
**Service**: Resend.com (free 3k/month)

```bash
npm install resend
```

**Create**: `supabase/functions/send-email/index.ts`

Features:
- Thread subscription emails
- Event reminders
- Weekly digest
- Panic alert emails

### SMS Alerts
**Service**: Twilio

```bash
npm install twilio
```

**Create**: `supabase/functions/send-sms/index.ts`

Features:
- Panic button SMS
- Court reminders
- Event alerts

### Push Notifications
**Service**: OneSignal (free)

```bash
npm install @onesignal/node-onesignal
```

Features:
- Thread replies
- Event updates
- DMs

---

## 🎨 **Phase 4: Polish & UX** (Optional)

### PWA (Progressive Web App)
```bash
npm install workbox-webpack-plugin
```

**Add**: `public/manifest.json`, `public/sw.js`

Features:
- Install to home screen
- Offline mode
- Background sync

### Multi-Language
```bash
npm install next-i18next
```

Languages to support:
- Spanish (es)
- Chinese (zh)
- Vietnamese (vi)
- Arabic (ar)

### Dark Mode
Already using `next-themes`! Just need to:
- Add toggle button
- Test all components

---

## 📱 **Component File Structure**

```
src/components/
├── EmergencyContacts.tsx      # NEW - Tier 1
├── PanicButton.tsx             # NEW - Tier 1
├── EventsCalendar.tsx          # NEW - Tier 2
├── ResourceLibrary.tsx         # NEW - Tier 2
├── SuccessStories.tsx          # NEW - Tier 2
├── UserProfile.tsx             # NEW - Tier 2
├── DirectMessages.tsx          # NEW - Tier 3
├── ViolationHeatmap.tsx        # NEW - Tier 3
├── DiscussionBoard.tsx         # UPDATE - Add engagement features
├── ViolationFeed.tsx           # UPDATE - Add upvoting
├── ViolationComments.tsx       # UPDATE - Add upvoting
└── ui/
    ├── rich-text-editor.tsx    # NEW - Tiptap wrapper
    └── badge-display.tsx       # NEW - User badges

src/pages/
├── Profile.tsx                 # NEW - User profile page
├── Messages.tsx                # NEW - DM inbox
└── Events.tsx                  # NEW - Events page (optional)
```

---

## 🚀 **Quick Start Guide**

### Day 1: Database + Quick Wins
1. Apply 3 new migrations (15 min)
2. Build EmergencyContacts widget (1 hour)
3. Build PanicButton (2 hours)
4. Enhance DiscussionBoard (2 hours)

**Result**: Core safety features + better forums

### Day 2: Community Features
1. Build EventsCalendar (3 hours)
2. Build ResourceLibrary (2 hours)
3. Build SuccessStories (2 hours)

**Result**: Full community platform

### Day 3: User System
1. Build UserProfile (3 hours)
2. Build DirectMessages (4 hours)
3. Add rich text editor (2 hours)

**Result**: Social network complete

### Day 4: Polish
1. Add heatmap (4 hours)
2. Integrate email (2 hours)
3. PWA setup (2 hours)

**Result**: Production-ready platform

---

## 💡 **Tips for Building**

### Copy Existing Patterns
- LawyerFinder → ResourceLibrary (similar structure)
- CourtWatch → EventsCalendar (similar UI)
- ViolationFeed → SuccessStories (similar feed)
- ViolationComments → DirectMessages (similar messaging)

### Use Existing Hooks
- `useGeolocation` - Auto-populate location
- `useAuth` - Check if user logged in
- `useToast` - Show notifications

### Supabase Patterns
```typescript
// Fetch with filters
const { data } = await supabase
  .from('community_events')
  .select('*')
  .eq('state', state)
  .gte('start_date', new Date().toISOString())
  .order('start_date');

// Insert
await supabase
  .from('emergency_contacts')
  .insert({ user_id, name, phone });

// Toggle upvote
const { data: existing } = await supabase
  .from('thread_upvotes')
  .select()
  .match({ user_id, thread_id })
  .single();

if (existing) {
  await supabase.from('thread_upvotes').delete().eq('id', existing.id);
} else {
  await supabase.from('thread_upvotes').insert({ user_id, thread_id });
}
```

### Component Template
```tsx
export const NewFeature = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Supabase query
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Your UI */}
      </div>
    </section>
  );
};
```

---

## 📊 **Progress Tracking**

### Database
- ✅ 28 tables created
- ✅ RLS policies
- ✅ Indexes & triggers
- ✅ Auto-functions
- ❌ Migrations not applied yet

### Components
- ✅ 10 existing features
- ⏳ 10 new features to build
- 📊 Progress: 50%

### Integrations
- ❌ Email service
- ❌ SMS service
- ❌ Push notifications
- ❌ PWA
- ❌ i18n

---

## 🎯 **Minimum Viable Features** (If Time Limited)

Must-have to launch:
1. ✅ Violation reporting (done)
2. ✅ Discussion board (done)
3. 🆕 Emergency contacts
4. 🆕 Panic button
5. 🆕 Events calendar
6. 🆕 User profiles

Nice-to-have:
- Resource library
- Success stories
- Direct messages
- Heatmap
- External integrations

You can launch with just Tier 1 + Tier 2 components and add the rest based on user feedback!

---

**Ready to build? Start with `EmergencyContacts.tsx` and `PanicButton.tsx` - they're the most impactful safety features!** 🚀
