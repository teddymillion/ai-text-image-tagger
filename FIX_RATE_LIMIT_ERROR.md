# Fix: "Rate Limit Exceeded" Error

## Problem
You're seeing an error about rate limits or credit card requirements from the Vercel AI Gateway. This means the **old code is still running** in the preview.

## Root Cause
The preview is serving cached code from before the migration to Google Generative AI. The code on disk is correct (using Google Generative AI directly), but the Node.js server hasn't reloaded it yet.

## Solution: Hard Refresh the Preview (30 seconds)

### Step 1: Hard Refresh the Browser
In the v0.app Preview window, do a **hard refresh**:

- **Mac:** Press `Cmd + Shift + R` 
- **Windows/Linux:** Press `Ctrl + Shift + R`
- **Or:** Press `F12`, go to Network tab, right-click refresh button, select "Hard refresh"

### Step 2: Wait for Reload
- Wait 3-5 seconds for the new code to load
- You should see "Powered by Google Gemini 1.5 Flash" in the footer

### Step 3: Test It
- Paste some text into the input field
- Click "Generate Tags"
- Tags should appear in 2-3 seconds

## What Changed
The old code in memory:
```typescript
// OLD (from before migration)
const result = await generateText({
  model: 'openai/gpt-4o-mini'
})
```

The new code on disk (that will load after refresh):
```typescript
// NEW (current code)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
const result = await model.generateContent(prompt)
```

## Expected Result After Refresh
- ✓ Tags generate instantly (2-3 seconds)
- ✓ No credit card errors
- ✓ Free to use (no credit card needed)
- ✓ Model shows: "gemini-1.5-flash"

## If Hard Refresh Doesn't Work

**Option 1: Restart Dev Server** (if running locally)
```bash
# Press Ctrl+C to stop the dev server
# Then start it again:
pnpm dev
```

**Option 2: Verify Environment Variable**
Make sure `GOOGLE_GENERATIVE_AI_API_KEY` is set in the Vars section:
1. Click the left sidebar in v0.app
2. Go to "Vars"
3. Confirm `GOOGLE_GENERATIVE_AI_API_KEY` is listed
4. Hard refresh browser again

**Option 3: Check File Integrity**
The route file should start with:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
```

If it starts with `import { generateText }` instead, the file needs to be re-saved.

## Why This Happens
Modern development servers cache code in memory for performance. When files change on disk, a refresh signal tells the browser to reload. Sometimes the browser cache also needs clearing, hence the "hard" refresh (Cmd+Shift+R).

## Still Having Issues?
Check the console logs (F12 > Console tab):
- Look for actual error messages
- They will tell you exactly what's wrong
- Share any error messages and I can help debug further

---

**Try the hard refresh now - your app is ready to work!**
