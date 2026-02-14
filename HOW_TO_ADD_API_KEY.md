# How to Add Your Google Gemini API Key to v0.app

Your app is ready to use, but you need to add your API key through v0.app's environment variable settings. Follow these steps:

## Step-by-Step Guide

### Step 1: Open the Variables Panel
1. In the v0.app chat sidebar (left side), look for the **"Vars"** tab
2. Click on it to open the environment variables manager

### Step 2: Add the API Key
1. Click the **"Add"** or **"+"** button
2. In the "Key" field, enter exactly: `GOOGLE_GENERATIVE_AI_API_KEY`
3. In the "Value" field, paste your API key: `AIzaSyBuWSDy60igNVMit5KUyIZdYtK6HxLWkNs`
4. Click **"Save"** or **"Add"**

### Step 3: Refresh Preview
1. Refresh your browser or click the refresh button in the preview
2. The app should now work without errors

## Visual Guide

```
v0.app Interface:
┌─────────────────────────────────────────┐
│  Chat  │ Design │ Rules │ Vars │ Settgs │  <- Click "Vars"
│──────────────────────────────────────────│
│  Environment Variables                   │
│  ┌──────────────────────────────────────┐│
│  │ + Add Variable                        ││
│  ├──────────────────────────────────────┤│
│  │ Key: GOOGLE_GENERATIVE_AI_API_KEY    ││
│  │ Value: AIzaSyBuWSDy60igNVMit5K...    ││
│  │ [Save] [Delete]                       ││
│  └──────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

## Troubleshooting

### Issue: "API key not set" error
**Solution:** Make sure you added the variable with the exact name `GOOGLE_GENERATIVE_AI_API_KEY` (case-sensitive). Then refresh the preview.

### Issue: "Authentication error"
**Solution:** Double-check your API key is correct. It should start with `AIzaSy`. If it's wrong, update it in the Vars panel.

### Issue: Still seeing old error about OpenAI/credit card
**Solution:** Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) to clear the cache. This should load the new Gemini code.

## After Adding the API Key

Once you've added the environment variable, your app will:
- Generate tags using Google Gemini 1.5 Flash
- Process requests in 2-3 seconds
- Work completely for free (no credit card required)

## Testing

After adding the API key, test by:
1. Pasting some text in the app
2. Clicking "Generate Tags"
3. Wait 2-3 seconds for tags to appear

## Questions?

If something doesn't work:
1. Check the browser console (F12) for error messages
2. Make sure the API key is in the Vars panel (not just .env.local)
3. Try refreshing the page
4. Verify the API key matches exactly: `AIzaSyBuWSDy60igNVMit5KUyIZdYtK6HxLWkNs`
