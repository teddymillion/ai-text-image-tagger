# Quick Start Guide

Get your AI Text Tagger running in 5 minutes!

## 1. Get an OpenAI API Key (2 minutes)

1. Visit https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk_`)
4. Save it somewhere safe

## 2. Local Setup (2 minutes)

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and paste your OpenAI API key
# OPENAI_API_KEY=sk_your_key_here

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open http://localhost:3000 in your browser. Done! 🎉

## 3. Deploy to Vercel (1 minute)

### Using Vercel CLI (Easiest):

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add your OpenAI API key when asked.

### Using GitHub + Vercel Web:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "AI Text Tagger"
   git push origin main
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Add environment variable: `OPENAI_API_KEY=sk_...`
5. Click "Deploy"

## That's it! 🚀

Your application is now live. Share the Vercel URL with anyone to let them use it.

---

For more details, see:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Detailed deployment guide
- `/app/api/tag-text/route.ts` - API implementation
