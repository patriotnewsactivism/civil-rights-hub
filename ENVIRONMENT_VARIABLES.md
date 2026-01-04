# Environment Variables Guide

This guide explains all environment variables needed for the Civil Rights Hub and where to configure them.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials** from https://supabase.com/dashboard
3. **Fill in your values** in `.env`
4. **Restart your dev server:** `npm run dev`

---

## Required Variables (Frontend)

These variables are needed for the app to connect to Supabase and must be prefixed with `VITE_` to be accessible in the frontend.

### `VITE_SUPABASE_URL`

**What it is:** Your Supabase project's API URL

**Where to find it:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Project Settings** (gear icon in sidebar)
4. Click **API** in the left menu
5. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)

**Example:**
```env
VITE_SUPABASE_URL=https://tgkxehkgwxlqausmrqxh.supabase.co
```

---

### `VITE_SUPABASE_PUBLISHABLE_KEY`

**What it is:** Your Supabase anonymous/public API key (safe to expose in browser)

**Where to find it:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Project Settings** → **API**
4. Copy the **anon** **public** key under "Project API keys"
5. This is a JWT token (very long string)

**Example:**
```env
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Important:** The `anon` key is safe to use in frontend code. Do NOT use the `service_role` key in your `.env` file - that's only for server-side/backend use.

---

### `VITE_SUPABASE_PROJECT_ID` (Optional)

**What it is:** Your Supabase project reference ID

**Where to find it:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Project Settings** → **General**
4. Copy the **Reference ID**

**Example:**
```env
VITE_SUPABASE_PROJECT_ID=tgkxehkgwxlqausmrqxh
```

This is optional and mainly used for reference. The app will work without it.

---

## Optional Variables (Edge Functions)

These variables are needed ONLY if you want to enable AI-powered features:
- Legal Assistant chatbot (`AITools.tsx`)
- Case Search (`CaseSearch.tsx`)

### `LOVABLE_API_KEY` (Supabase Secret)

**What it is:** API key for AI Gateway (powers the AI features)

**Where to set it:**

⚠️ **Important:** This is NOT set in your `.env` file. It's configured as a Supabase Secret:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Edge Functions** in the left sidebar
4. Click **Manage secrets**
5. Add a new secret:
   - Name: `LOVABLE_API_KEY`
   - Value: Your AI Gateway API key

**How to get the API key:**
- If this project was created on Lovable.dev, you may already have this key
- Contact the project owner or check your Lovable project settings
- Alternatively, you can use other AI providers (OpenAI, Anthropic) by modifying the Edge Functions

**What happens if not set:**
- The app will work fine
- AI features (Legal Assistant, Case Search) will show error messages
- All other features (violation reporting, attorney directory, FOIA builder, etc.) work normally

---

## Where to Configure Variables

### 1. Local Development (Your Computer)

**File:** `.env` in the project root

```bash
# Create the file
cp .env.example .env

# Edit the file
nano .env
# or
code .env
```

**Then restart your dev server:**
```bash
npm run dev
```

---

### 2. Supabase Edge Functions (Backend)

**For:** `LOVABLE_API_KEY` and any other secrets needed by Edge Functions

**How to set:**

Via Supabase Dashboard:
1. https://supabase.com/dashboard → Your Project
2. **Edge Functions** → **Manage secrets**
3. Add secrets one by one

Via Supabase CLI:
```bash
# Set a single secret
supabase secrets set LOVABLE_API_KEY=your-key-here

# Set multiple secrets from a file
supabase secrets set --env-file ./supabase/.env.local
```

**Important:** Edge Function secrets are separate from your frontend `.env` file.

---

### 3. Production Deployment (Vercel, Netlify, etc.)

Your deployment platform needs the same `VITE_*` variables as your local `.env`.

#### **Vercel:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID` (optional)
4. Click **Save**
5. Redeploy your site

#### **Netlify:**
1. Go to your Netlify site dashboard
2. Click **Site settings** → **Environment variables**
3. Add each variable
4. Redeploy

#### **Other platforms:**
- Look for "Environment Variables" or "Secrets" in your platform's settings
- Add the same `VITE_*` variables from your `.env` file

---

## Verifying Configuration

### Check if variables are loaded (during development):

Open your browser console at http://localhost:8080 and check for messages:

✅ **Correct:** No errors about missing Supabase variables

❌ **Error:**
```
❌ Missing Supabase environment variables!
VITE_SUPABASE_URL: Missing
VITE_SUPABASE_PUBLISHABLE_KEY: Missing
```

If you see the error:
1. Check your `.env` file exists
2. Check variables are spelled correctly (including `VITE_` prefix)
3. Restart your dev server (`npm run dev`)

### Test Supabase connection:

1. Open the app: http://localhost:8080
2. Try using any feature that reads from database:
   - Federal Laws section
   - State Selector
   - Attorney Finder
   - Violation Feed

If you see data, your Supabase connection works! ✅

---

## Troubleshooting

### "Supabase not configured" errors

**Problem:** Frontend can't connect to Supabase

**Solution:**
1. Verify `.env` file exists in project root
2. Verify variables are correct (copy-paste from Supabase dashboard)
3. Verify variable names have `VITE_` prefix
4. Restart dev server: `Ctrl+C` then `npm run dev`

---

### "LOVABLE_API_KEY is not configured" in AI features

**Problem:** Edge Functions can't access AI Gateway

**Solution:**
1. This is normal if you haven't configured the AI key
2. AI features are optional - rest of app works fine
3. To enable AI: Set `LOVABLE_API_KEY` in Supabase Secrets (see above)

---

### Variables not updating

**Problem:** Changed `.env` but app still uses old values

**Solution:**
1. Fully stop the dev server (`Ctrl+C`)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart: `npm run dev`

---

### Different values for development vs. production

**Problem:** Want to use different Supabase projects for dev/prod

**Solution:**

**Local development:**
```env
# .env (local)
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=dev-anon-key...
```

**Production (Vercel/Netlify):**
Set environment variables to production Supabase project:
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=prod-anon-key...
```

---

## Security Notes

### ✅ Safe to commit:
- `.env.example` (template with no real values)
- `ENVIRONMENT_VARIABLES.md` (this documentation)

### ❌ Never commit:
- `.env` (contains your actual keys)
- `.env.local`
- `.env.production`

The `.gitignore` file already excludes `.env` files from git.

### ✅ Safe to expose in frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (the `anon` key)
- `VITE_SUPABASE_PROJECT_ID`

These are designed to be public and are protected by Row Level Security (RLS) in Supabase.

### ❌ Never expose in frontend:
- `service_role` key from Supabase (bypasses RLS)
- `LOVABLE_API_KEY` (keep in Supabase Secrets only)
- Database passwords
- JWT secrets

---

## Complete Example

Your `.env` file should look like this:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tgkxehkgwxlqausmrqxh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna3hlaGtnd3hscWF1c21ycXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTEzMzgsImV4cCI6MjA3NTg4NzMzOH0.fD2LGiD9OsNt5EWWm2v9ONWFIGvZNXft1Om_yLUhmSM
VITE_SUPABASE_PROJECT_ID=tgkxehkgwxlqausmrqxh
```

That's it! The app is now configured. 🎉

---

## Need Help?

1. **Check the Supabase dashboard** to verify your project is active
2. **Check browser console** for specific error messages
3. **Verify `.env` file** has no typos or extra spaces
4. **Restart dev server** after any `.env` changes

For more information:
- Supabase Documentation: https://supabase.com/docs
- Vite Environment Variables: https://vitejs.dev/guide/env-and-mode.html
- Project README: See `CLAUDE.md` for development commands
