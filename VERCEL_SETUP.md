# Vercel Deployment Setup

This document provides instructions for deploying the Civil Rights Hub to Vercel.

## Required Environment Variables

To deploy this application successfully, you **must** configure the following environment variables in your Vercel project settings:

### Supabase Configuration

```
VITE_SUPABASE_URL=https://tgkxehkgwxlqausmrqxh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRna3hlaGtnd3hscWF1c21ycXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTEzMzgsImV4cCI6MjA3NTg4NzMzOH0.fD2LGiD9OsNt5EWWm2v9ONWFIGvZNXft1Om_yLUhmSM
```

## How to Configure Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (e.g., `civil-rights-hub`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://tgkxehkgwxlqausmrqxh.supabase.co`
   - Environments: Select all (Production, Preview, Development)
   - Click **Save**

5. Repeat for `VITE_SUPABASE_PUBLISHABLE_KEY`

## Redeploying After Configuration

After adding the environment variables:

1. Go to **Deployments** tab
2. Find the most recent deployment
3. Click the three dots menu (⋯) and select **Redeploy**
4. Check "Use existing Build Cache" if you want faster deployment
5. Click **Redeploy**

## Troubleshooting

### Blank Screen After Deployment

If you see a blank screen:

1. **Check browser console** (F12 → Console tab)
   - Look for error messages about missing environment variables
   - The app will now log clear error messages if Supabase isn't configured

2. **Verify environment variables are set**
   - Go to Vercel Settings → Environment Variables
   - Confirm both `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are present
   - Make sure they're enabled for the correct environment (Production)

3. **Check build logs**
   - Go to Deployments → Click on your deployment
   - Review the build logs for any errors

4. **Redeploy with a fresh build**
   - Sometimes cached builds can cause issues
   - Redeploy without using the build cache

### Error Boundary Shows

If you see an error message instead of a blank screen, that's progress! The error boundary is now catching errors and providing helpful information.

1. Check the technical details in the error message
2. Review the browser console for more details
3. Common causes:
   - Missing environment variables
   - Network connectivity issues
   - Supabase service temporary downtime

## Build Configuration

The project uses Vite for building. The default Vercel configuration should work:

- **Build Command**: `npm run build` or `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Domain Configuration

The app is deployed at: https://civilrights.wtpnews.org

To configure a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain: `civilrights.wtpnews.org`
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Testing Locally Before Deployment

To test the production build locally:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The preview server will run at http://localhost:4173

## Recent Fixes

### Blank Screen Fix (2025-11-11)

- Added environment variable validation in Supabase client
- Created fallback "dummy client" that prevents crashes when env vars are missing
- Added ErrorBoundary component to catch and display runtime errors gracefully
- App now shows helpful error messages instead of blank screens

## Support

If you continue to experience issues:

1. Check the browser console (F12) for error messages
2. Review Vercel deployment logs
3. Verify all environment variables are correctly set
4. Try a fresh deployment without cache
5. Check Supabase service status: https://status.supabase.com/
