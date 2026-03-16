# Deploy AI Text Tagger with Google Gemini

Complete step-by-step guide to deploy your app with Gemini to Vercel.

## Pre-Deployment Checklist (5 minutes)

- [ ] Have Google Gemini API key ready
- [ ] Node.js 18+ installed
- [ ] GitHub account (for Vercel deployment)
- [ ] Vercel account (optional)

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Get Google Gemini API Key (2 minutes)

1. Go to **https://aistudio.google.com/apikey**
2. Click **"Create API Key"** (or "Create API key in new project")
3. Wait for key generation
4. **Copy the key** (looks like: `AIzaSyD...`)
5. Keep it safe (don't share publicly)

### Step 2: Prepare Your Code

```bash
# Clone or navigate to your project directory
cd ai-text-tagger

# Install dependencies
pnpm install
# or: npm install

# Test locally first
pnpm dev
```

Visit http://localhost:3000 and verify it works with your Gemini key in `.env.local`

### Step 3: Push to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Update to Google Gemini"
git remote add origin https://github.com/YOUR_USERNAME/ai-text-tagger
git push -u origin main
```

### Step 4: Deploy to Vercel

**Method A: Using Vercel CLI (Fastest)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? → No (create new)
# - What's your project name? → ai-text-tagger
# - In which directory? → ./
# - Want to modify settings? → Yes
# - Add environment variables? → Yes

# When asked for environment variables:
# Name: GOOGLE_GENERATIVE_AI_API_KEY
# Value: AIzaSy...your_key...

# Confirm deployment
```

**Method B: Using Vercel Dashboard**

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**
5. In **Environment Variables** section:
   - Name: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Value: (paste your Gemini API key)
6. Click **"Deploy"**

### Step 5: Verify Deployment

Once deployed:

1. Go to the provided URL (e.g., `https://ai-text-tagger-xyz.vercel.app`)
2. Paste some text
3. Click "Generate Tags"
4. Should work within 2-3 seconds

If it fails:
- Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
- Verify environment variable is set
- Make sure API key is valid

Your app will be live on Vercel automatically!

## Option 3: Deploy to Other Platforms

### AWS Amplify

```bash
amplify init
amplify add hosting
amplify publish

# When prompted, add environment variable:
# GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

### Netlify

```bash
netlify deploy --prod

# Or via Netlify dashboard:
# 1. Connect GitHub repo
# 2. Add build command: pnpm build
# 3. Add environment variable
# 4. Deploy
```

### Docker (Self-hosted)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV GOOGLE_GENERATIVE_AI_API_KEY=$GOOGLE_GENERATIVE_AI_API_KEY
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Deploy:
```bash
docker build -t ai-text-tagger .
docker run -e GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy... -p 3000:3000 ai-text-tagger
```

## Post-Deployment Verification

### Test Your Deployment

```bash
curl -X POST https://your-deployed-url.com/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Artificial intelligence is transforming technology"}'
```

Expected response:
```json
{
  "success": true,
  "tags": ["artificial intelligence", "technology", "AI"],
  "confidence": 0.92,
  "textLength": 42,
  "model": "google-gemini-1.5-flash"
}
```

### Monitor Performance

**Vercel Dashboard:**
- Go to your project
- View "Analytics"
- Check response times (should be 2-4 seconds)

**Google Cloud Console:**
- Visit https://console.cloud.google.com/
- Check API usage
- Monitor quota consumption

## Common Deployment Issues

### Issue: "GOOGLE_GENERATIVE_AI_API_KEY is undefined"

**Cause:** Environment variable not set in deployment

**Solution:**
```bash
# For Vercel:
vercel env add GOOGLE_GENERATIVE_AI_API_KEY
# Then enter your key

# Or via dashboard:
# Settings → Environment Variables → Add
```

### Issue: "Invalid API key"

**Cause:** Wrong key or expired key

**Solution:**
1. Generate new key: https://aistudio.google.com/apikey
2. Update environment variable
3. Redeploy

### Issue: "500 Error on /api/tag-text"

**Cause:** Multiple possible reasons

**Debug:**
```bash
# Check logs
vercel logs

# Check if API key is valid by testing locally:
pnpm dev
```

### Issue: "Timeout after 30 seconds"

**Cause:** API took too long (rare with Gemini)

**Solution:**
- Likely transient issue
- Retry request
- Check Google API status page

### Issue: "Quota exceeded"

**Cause:** Hit free tier limit (60 req/min)

**Solution:**
- Wait 60 seconds between requests
- Or upgrade to paid tier

## Optimize for Production

### Environment Variables Setup

```bash
# .env.production (Vercel auto-uses this)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# Optional: Enable caching
NEXT_PUBLIC_CACHE_ENABLED=true
```

### Performance Tuning

In `next.config.mjs`:
```javascript
export default {
  // Enable compression
  compress: true,
  
  // Enable image optimization
  images: {
    unoptimized: false,
  },
  
  // Enable Turbopack (faster builds)
  experimental: {
    turbopack: {},
  },
}
```

### Security Checklist

- [ ] Environment variable not exposed in code
- [ ] `.env.local` in `.gitignore`
- [ ] API key only in environment, not in version control
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS properly configured (already done)

## Cost Estimation

### Free Tier (Vercel + Gemini)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free (up to 12GB memory) | Includes 1000 builds/month |
| Gemini | Free (60 req/min) | No credit card required |
| **Total** | **$0/month** | ✅ Completely free |

### If You Need More

| Tier | Cost | Requests/min | Best For |
|------|------|--------------|----------|
| Gemini Free | $0 | 60 | Testing, low traffic |
| Gemini Pro | $0.075/1M tokens | 1,000 | Production apps |
| Vercel Pro | $20/month | Unlimited | Advanced analytics |

For text tagging at scale: ~$0.15 per 1000 requests

## Next Steps

1. ✅ Get Gemini API key from https://aistudio.google.com/apikey
2. ✅ Run `pnpm dev` locally to test
3. ✅ Deploy using Method A, B, or C above
4. ✅ Verify deployment works
5. ✅ Share your deployed URL!

## Support & Documentation

- **Google Gemini Docs:** https://ai.google.dev/
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## Success Checklist

After deployment, verify:

- [ ] URL is accessible
- [ ] API responds to text input
- [ ] Tags are generated correctly
- [ ] No console errors in browser
- [ ] Confidence score displays
- [ ] Copy button works
- [ ] Mobile responsive layout works

Congratulations! Your AI Text Tagger is live! 🚀
