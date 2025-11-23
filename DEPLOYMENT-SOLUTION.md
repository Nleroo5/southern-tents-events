# ✅ VERCEL DEPLOYMENT SOLUTION - CRITICAL DOCUMENTATION

## 🎯 THE PROBLEM WE SOLVED

**Error:** `No entrypoint found. Searched for: app.js, index.js, server.js...`

**Root Cause:**
When Vercel detected `package.json` in the repository, it assumed this was a **Node.js application** and tried to find an entry point file (server.js, index.js, etc.) to run the backend.

However, this is actually a **static HTML site** with a serverless API function.

---

## ✅ THE SOLUTION THAT WORKS

### 1. **vercel.json Configuration**

Create this file in the project root:

```json
{
  "buildCommand": null,
  "installCommand": "npm install --only=production",
  "framework": null
}
```

**What each setting does:**
- `"buildCommand": null` → Tells Vercel "Don't build anything, just deploy the files as-is"
- `"installCommand": "npm install --only=production"` → Installs only production dependencies (nodemailer for the API)
- `"framework": null` → Explicitly tells Vercel "This is NOT a framework project, it's a static HTML site"

### 2. **package.json Configuration**

```json
{
  "name": "southern-tents-events",
  "version": "1.0.0",
  "description": "Southern Tents & Events - Static site with serverless API",
  "private": true,
  "scripts": {
    "dev": "node server.js"
  },
  "dependencies": {
    "nodemailer": "^6.9.7"
  }
}
```

**Critical Points:**
- ❌ **NO** `"main"` field (this triggers Node.js app detection)
- ❌ **NO** `"start"` script (also triggers Node.js app detection)
- ❌ **NO** `"engines"` field (let Vercel auto-detect)
- ✅ Only `nodemailer` in dependencies (needed for `/api/quote.js`)
- ✅ `"private": true` to prevent accidental npm publish

### 3. **.gitignore Configuration**

```
# Backend server (not needed for Vercel serverless)
server.js

# Environment files
.env
.env.local

# DO NOT IGNORE:
# - package.json (needed for dependencies)
# - package-lock.json (needed for dependencies)
# - api/ folder (contains serverless functions)
```

### 4. **Project Structure**

```
project-root/
├── vercel.json          ← Forces static deployment
├── package.json         ← Defines nodemailer dependency
├── package-lock.json    ← Lock file for dependencies
├── api/
│   └── quote.js         ← Serverless function
├── index.html           ← Static homepage
├── contact.html         ← Contact form page
├── css/
├── js/
├── images/
└── server.js            ← In .gitignore (local dev only)
```

---

## 🚀 HOW VERCEL DEPLOYS THIS

1. **Clones Repository**
   - Gets vercel.json
   - Gets package.json
   - Gets api/quote.js
   - Gets all HTML/CSS/JS files

2. **Reads vercel.json**
   - Sees `"framework": null` → Treats as static site
   - Sees `"buildCommand": null` → Skips build process

3. **Installs Dependencies**
   - Runs: `npm install --only=production`
   - Installs: nodemailer only

4. **Deploys Static Files**
   - Serves all HTML, CSS, JS directly from root

5. **Creates Serverless Functions**
   - Detects `/api` folder
   - Creates endpoint: `/api/quote`
   - Function has access to:
     - nodemailer package
     - Environment variables (EMAIL_USER, EMAIL_APP_PASSWORD)

---

## ⚠️ COMMON MISTAKES TO AVOID

### ❌ DON'T DO THIS:

1. **Adding `"main": "server.js"` to package.json**
   - This makes Vercel think it's a Node.js app
   - Triggers "No entrypoint found" error

2. **Removing vercel.json**
   - Without it, Vercel auto-detects project type
   - May incorrectly identify as Node.js app

3. **Adding complex build configurations**
   - Static sites don't need build steps
   - Keep it simple: `"buildCommand": null`

4. **Ignoring package.json in .gitignore**
   - API function needs nodemailer
   - package.json must be committed

---

## 🔐 ENVIRONMENT VARIABLES

Required in Vercel Dashboard (Settings → Environment Variables):

| Variable | Value | Scope |
|----------|-------|-------|
| `EMAIL_USER` | `Southerntentsevents@gmail.com` | All Environments |
| `EMAIL_APP_PASSWORD` | `hrpigfzmykusjigt` | All Environments |

---

## 🧪 TESTING CHECKLIST

After deployment, verify:

- [ ] Site loads: `https://southerntentsandevents.com`
- [ ] All pages accessible (index, contact, gallery, etc.)
- [ ] Contact form displays properly
- [ ] Form submission works (test with real data)
- [ ] Email received at Southerntentsevents@gmail.com
- [ ] Email contains all form data and item calculations
- [ ] No console errors in browser

---

## 📊 DEPLOYMENT LOGS (SUCCESS)

Expected successful deployment log:

```
✅ Cloning completed
✅ Running "vercel build"
✅ Installing dependencies...
✅ added 1 package (nodemailer)
✅ Build Completed
✅ Deploying outputs...
✅ Deployment completed
```

---

## 🆘 IF DEPLOYMENT FAILS AGAIN

Check these in order:

1. **Verify vercel.json exists and is committed**
   ```bash
   git ls-files | grep vercel.json
   ```

2. **Verify package.json has NO "main" field**
   ```bash
   grep "main" package.json
   # Should return nothing
   ```

3. **Verify api/quote.js is committed**
   ```bash
   git ls-files | grep api/quote.js
   ```

4. **Check Vercel environment variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Confirm EMAIL_USER and EMAIL_APP_PASSWORD exist

5. **Check Vercel build logs**
   - Look for specific error messages
   - Compare to successful log above

---

## 📝 NOTES

- This configuration works specifically for: **Static HTML site + Vercel Serverless Functions**
- If you need to add more API endpoints, create new files in `/api` folder
- All files in `/api` automatically become serverless endpoints
- Example: `/api/contact.js` becomes accessible at `/api/contact`

---

**Last Updated:** November 23, 2025
**Status:** ✅ WORKING - Deployment Successful
**Vercel URL:** https://southerntentsandevents.com
