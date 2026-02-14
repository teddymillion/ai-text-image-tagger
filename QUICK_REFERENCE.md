# 🚀 Quick Reference Card

Print this or save it as a bookmark!

---

## ⚡ 5-Minute Setup

```bash
# 1. Copy env file
cp .env.local.example .env.local

# 2. Add your OpenAI API key to .env.local
# OPENAI_API_KEY=sk_your_key_here

# 3. Install
pnpm install

# 4. Run
pnpm dev

# 5. Open browser
http://localhost:3000
```

---

## 📝 API Reference

**Endpoint**: `POST /api/tag-text`

**Request**:
```json
{ "text": "your text here" }
```

**Response**:
```json
{
  "success": true,
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.92,
  "textLength": 50
}
```

**Limits**:
- Min: 1 character
- Max: 5000 characters

---

## 🌐 Deploy to Vercel

### Option A: CLI
```bash
vercel
# Follow prompts
```

### Option B: Web
1. Push to GitHub
2. https://vercel.com/new
3. Select repo
4. Add `OPENAI_API_KEY` env var
5. Deploy

---

## 📚 Documentation Quick Links

| Need | File | Time |
|------|------|------|
| **Quick Start** | `QUICKSTART.md` | 5 min |
| **Setup Locally** | `START_HERE.md` | 3 min |
| **Deploy** | `DEPLOYMENT.md` | 15 min |
| **Code Examples** | `API_EXAMPLES.md` | 20 min |
| **Technical** | `TECHNICAL.md` | 30 min |
| **Full Docs** | `README.md` | 20 min |
| **Testing** | `VERIFICATION.md` | 10 min |

---

## 🔧 Common Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Check TypeScript
npx tsc --noEmit
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key not set" | Check `.env.local` file |
| "Tags not generating" | Verify API key is valid |
| "Text too long" | Reduce to < 5000 chars |
| "Build failed" | Run `pnpm install` again |
| "Port 3000 in use" | `pnpm dev -p 3001` |

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `app/api/tag-text/route.ts` | API endpoint |
| `components/text-tagger.tsx` | UI component |
| `app/page.tsx` | Home page |
| `.env.local` | Environment variables |

---

## 🔐 Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] API key never in code
- [ ] API key only on server
- [ ] Production env var set on Vercel

---

## 💰 Cost Per Request

**Model**: GPT-4 Mini  
**Cost**: ~$0.0003  
**Response Time**: 2-3 seconds

---

## 🎯 Feature Overview

✅ AI tag generation  
✅ Confidence scoring  
✅ Copy to clipboard  
✅ Error handling  
✅ Responsive design  
✅ Real-time processing  

---

## 📊 Project Stats

- **Code**: 334 lines
- **Docs**: 2,771 lines
- **Languages**: TypeScript, React, Next.js
- **Deployment**: Vercel (serverless)
- **Status**: Production-ready ✅

---

## 🚀 Deployment Steps

1. **Prepare**
   - Get OpenAI API key
   - Create GitHub repo
   - Push code

2. **Deploy**
   - Go to vercel.com/new
   - Select repo
   - Add env variables
   - Click Deploy

3. **Verify**
   - Wait for green checkmark
   - Visit deployment URL
   - Test tagging

---

## 🔗 Important Links

- **OpenAI Keys**: https://platform.openai.com/api-keys
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **AI SDK Docs**: https://sdk.vercel.ai

---

## 📱 UI Components Used

- **Button**: shadcn/ui
- **Card**: shadcn/ui
- **Badge**: shadcn/ui
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

---

## 🎨 Customization

### Change Model
Edit `app/api/tag-text/route.ts`:
```typescript
model: 'openai/gpt-4o'  // Change from gpt-4o-mini
```

### Change Tag Count
Edit system prompt in same file:
```typescript
"Generate 5-10 tags..."  // Change from 3-7
```

### Increase Text Limit
```typescript
const maxLength = 10000  // Change from 5000
```

---

## 📞 Support

1. Check relevant `.md` file
2. See TECHNICAL.md troubleshooting
3. Check browser console (F12)
4. Visit https://status.openai.com/

---

## ✅ Pre-Launch Checklist

- [ ] `.env.local` created
- [ ] `OPENAI_API_KEY` added
- [ ] `pnpm install` ran
- [ ] `pnpm dev` working
- [ ] Tags generating locally
- [ ] Pushed to GitHub
- [ ] Vercel env vars set
- [ ] Deployment successful
- [ ] Production URL working

---

## 🎉 Done!

Your AI Text Tagger is ready to deploy. Start with `QUICKSTART.md` for 5-minute setup!

**Need help?** Check the relevant documentation file above.

**Ready to launch?** Run `vercel` to deploy!

---

**Status**: ✅ Ready for Production  
**Next**: Read `QUICKSTART.md` or `DEPLOYMENT.md`  
**Questions?**: See `README.md` or `TECHNICAL.md`  

🚀 **Let's go!**
