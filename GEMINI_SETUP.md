# Google Gemini Setup Guide

This project now uses **Google Gemini 1.5 Flash** instead of OpenAI. Gemini is completely free with no credit card required for the free tier.

## Why Gemini?

✅ **Completely Free** - No credit card required  
✅ **Generous Free Tier** - 60 requests per minute  
✅ **High Quality** - Gemini 1.5 Flash provides excellent results  
✅ **Fast** - Average response time 2-3 seconds  
✅ **No Cold Starts** - Reliable performance  

## Step 1: Get Your Gemini API Key (2 minutes)

1. Go to **[Google AI Studio](https://aistudio.google.com/apikey)**
2. Click **"Create API Key"** button
3. Select **"Create API key in new project"** (or existing project)
4. Copy the generated API key
5. **Do NOT share** this key publicly

### What You'll See

```
AIzaSyD.................................... (your actual key)
```

That's your `GOOGLE_GENERATIVE_AI_API_KEY` - save it somewhere safe!

## Step 2: Set Up Environment Variables

### For Local Development

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD...your_actual_key...
   ```

3. Save the file

### For Vercel Deployment

1. Go to your **[Vercel Project Settings](https://vercel.com/dashboard)**
2. Click on **Environment Variables**
3. Click **Add New**
4. Set:
   - **Name:** `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value:** (paste your API key)
   - **Environments:** Production, Preview, Development
5. Click **Save**

## Step 3: Install Dependencies

```bash
pnpm install
# or
npm install
```

The project automatically includes the required packages:
- `ai@^6.0.0` (AI SDK)
- `@ai-sdk/google` (Google provider - will be auto-installed)
- `zod` (for validation)

## Step 4: Test Locally

```bash
pnpm dev
# or
npm run dev
```

1. Open http://localhost:3000
2. Paste some text
3. Click "Generate Tags"
4. You should get tags in 2-3 seconds

### Troubleshooting Local

**Error: "API key is not configured"**
- Check `.env.local` exists
- Verify the key starts with `AIzaSy`
- Restart the dev server: `Ctrl+C` then `pnpm dev`

**Error: "API key not valid"**
- The key might be expired or revoked
- Generate a new one at [Google AI Studio](https://aistudio.google.com/apikey)

**Error: "Quota exceeded"**
- Free tier allows 60 requests/minute
- Wait a minute and try again

## Step 5: Deploy to Vercel

### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Deploy
vercel

# Follow the prompts and it will auto-detect your env vars
```

### Option B: Using GitHub + Vercel Web Interface

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Update to Google Gemini"
   git push
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** → **Project**
4. Select your GitHub repository
5. Click **Import**
6. In **Environment Variables**, add:
   - `GOOGLE_GENERATIVE_AI_API_KEY` = your API key
7. Click **Deploy**

### Option C: Using v0.app Deploy

1. Click the **Publish** button in v0.app
2. Follow the authentication flow
3. Add environment variables when prompted
4. Your app will be live!

## Gemini Free Tier Limits

| Feature | Limit |
|---------|-------|
| Requests per minute | 60 |
| Requests per day | 1,500 |
| Context window | 32,000 tokens (~24,000 words) |
| Max input text | 5,000 characters |
| Cost | ✅ FREE |

For this text tagger app:
- 5,000 character text = ~1,250 tokens input
- Generated response = ~200 tokens
- **Total per request: ~1,450 tokens**

**Your free quota covers:** 1,500 requests/day ÷ 60 requests/min = **25 minutes of continuous use per day**

## API Models Available

### Recommended: Gemini 1.5 Flash (Current - Free)

```
model: 'google/gemini-1.5-flash'
```

- Fast (2-3 seconds)
- Best for text tagging
- Free tier: 60 req/min
- **Recommended** ✅

### Alternative: Gemini 1.5 Pro (Paid/Slower)

```
model: 'google/gemini-1.5-pro'
```

- More accurate (but slower)
- Paid tier required
- Not recommended for this app

### Legacy: Gemini 1.0 Pro (Deprecated)

```
model: 'google/gemini-pro'
```

- Older model
- Don't use - use 1.5 Flash instead

## Common Issues & Solutions

### Issue: "GOOGLE_GENERATIVE_AI_API_KEY is not defined"

**Solution:**
```bash
# Make sure .env.local exists with the correct key
cat .env.local

# If missing, create it:
cp .env.local.example .env.local
# Then edit and add your key
```

### Issue: "TypeError: fetch failed"

**Solution:**
- Check internet connection
- Verify API key is valid
- Check Google API console isn't blocking requests

### Issue: "Rate limit exceeded"

**Solution:**
- Wait 60 seconds
- Consider spreading requests over time
- Free tier: 60 requests/minute max

### Issue: Tags are low quality

**Solution:**
- Input text is too short (try 50+ words)
- Text is too ambiguous
- Try updating the system prompt in `/app/api/tag-text/route.ts`

## Monitoring Your API Usage

Visit your [Google Cloud Console](https://console.cloud.google.com/) to:
- View real-time API usage
- Set up alerts
- Monitor quota consumption

## Upgrading to Paid (Optional)

If you need more than 60 requests/minute:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on **Gemini API**
3. Click **Enable Billing**
4. Add a payment method
5. Your quota automatically increases to 1,000 requests/minute

Paid pricing:
- **Input:** $0.075 per 1M tokens (~$0.09 per 1000 requests)
- **Output:** $0.30 per 1M tokens (~$0.06 per 1000 requests)

For text tagging: **~$0.15 per 1000 requests**

## API Request Example

```bash
curl -X POST http://localhost:3000/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Machine learning is transforming how we analyze data..."
  }'
```

Response:
```json
{
  "success": true,
  "tags": ["machine learning", "data analysis", "AI"],
  "confidence": 0.92,
  "textLength": 42,
  "model": "google-gemini-1.5-flash"
}
```

## Next Steps

1. ✅ Get API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. ✅ Add to `.env.local` for local testing
3. ✅ Test with `pnpm dev`
4. ✅ Deploy to Vercel with the same env var
5. ✅ Monitor usage in Google Cloud Console

## Support

- **Google Gemini Docs:** https://ai.google.dev/
- **v0.app Help:** https://vercel.com/help
- **Common Issues:** See troubleshooting section above

---

**You're all set!** Your app is now powered by Google Gemini. Enjoy free, unlimited text tagging! 🚀
