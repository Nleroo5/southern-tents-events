# Manual Testing Instructions for Anchor Fix

## Test the Anchor Links

1. **Open your browser** to: `http://localhost:3000`

2. **Test each service button:**
   - Click "View Tent Options"
   - Click "View Tables & Chairs"
   - Click "View Lighting & More"

3. **What should happen:**
   - The page should scroll to services.html
   - The H2 title should be perfectly aligned just below the header
   - **NOT** buried under the header
   - **NOT** with a large gap below the header

4. **Test at different screen sizes:**
   - Desktop (full width)
   - Tablet (resize to ~600px width)
   - Mobile (resize to ~375px width)

## What to Look For

### ✅ CORRECT:
- H2 title visible immediately below header
- No gap between header bottom and title
- No overlap (title not hidden behind header)

### ❌ INCORRECT:
- Large gap below header before seeing title
- Title hidden behind/under the header
- Title way too high or too low

## If Still Broken

Please describe what you see:
- Which anchor(s) are broken? (tents, furniture, lighting)
- What's wrong? (gap size, overlap, etc.)
- At which screen size? (mobile, tablet, desktop)

## Debug Info

Open browser DevTools (F12) and check Console for any errors.
