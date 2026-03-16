# Verification Checklist for Gemini Migration

Use this checklist to verify everything is working correctly after migration.

## Pre-Testing (Do This First)

- [ ] You have a Google Gemini API key
- [ ] You've added it to `.env.local` or Vercel environment
- [ ] Dependencies are installed: `pnpm install`

## Local Testing

### 1. Start Development Server

```bash
pnpm dev
```

Expected output:
```
  ▲ Next.js 16.x
  - Local:        http://localhost:3000
```

- [ ] Server starts without errors
- [ ] No "GOOGLE_GENERATIVE_AI_API_KEY is undefined" error

### 2. Visit the App

Go to http://localhost:3000

- [ ] Page loads without errors
- [ ] "AI Text Tagger" header visible
- [ ] Textarea for input visible
- [ ] "Generate Tags" button visible
- [ ] Footer says "Powered by Google Gemini 1.5 Flash"

### 3. Test Tag Generation

Paste this sample text:

```
Artificial intelligence and machine learning have revolutionized how we approach 
problem-solving. These technologies enable computers to learn from data without 
explicit programming, leading to breakthroughs in healthcare, finance, and scientific research.
```

Click "Generate Tags"

- [ ] Response arrives within 2-4 seconds
- [ ] Tags appear (should be 3-7 tags)
- [ ] Example: ["artificial intelligence", "machine learning", "technology", "healthcare"]
- [ ] Confidence score appears (0-1 scale, e.g., 0.92)
- [ ] No error messages shown

### 4. Test Copy Functionality

Click "Copy Tags" button

- [ ] Toast notification appears
- [ ] Text is copied to clipboard
- [ ] Can paste the tags elsewhere

### 5. Test Input Validation

Leave textarea empty, click "Generate Tags"

- [ ] Error message: "Please enter some text to tag"
- [ ] No API call made (check network tab)

### 6. Test Length Limit

Try to paste 5001+ characters

- [ ] Textarea limits input to 5000 characters
- [ ] Character counter shows "5000 / 5000"

### 7. Test Clear Button

Click "Clear" button

- [ ] Textarea clears
- [ ] Tags disappear
- [ ] Error messages clear
- [ ] Ready for new input

## Browser Console Check

Open browser DevTools (F12 or Cmd+Option+I)

Go to **Console** tab

- [ ] No errors in red
- [ ] No "API key" warnings
- [ ] No TypeScript errors

Go to **Network** tab, generate tags again

- [ ] `POST /api/tag-text` request visible
- [ ] Status: 200 OK
- [ ] Response includes: `success`, `tags`, `confidence`
- [ ] Response time: 2-4 seconds

## Production Deployment Checks

### If deploying to Vercel:

1. In Vercel dashboard, check **Environment Variables**:
   - [ ] `GOOGLE_GENERATIVE_AI_API_KEY` is set
   - [ ] Value starts with "AIzaSy"
   - [ ] Applied to Production, Preview, Development

2. Deploy your code:
   ```bash
   git add .
   git commit -m "Migrate to Google Gemini"
   git push
   ```
   - [ ] Deployment completes successfully
   - [ ] Vercel shows "Ready"

3. Test deployed version:
   - [ ] Click "Visit" in Vercel dashboard
   - [ ] App loads at your Vercel URL
   - [ ] Generate tags works
   - [ ] Response time similar to local (~2-3 seconds)

4. Test deployed version
   - [ ] Visit provided URL
   - [ ] App loads correctly
   - [ ] Generate tags works

## API Endpoint Direct Testing

### Using cURL (in terminal):

```bash
curl -X POST http://localhost:3000/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Machine learning is transforming technology"}'
```

Expected response:
```json
{
  "success": true,
  "tags": ["machine learning", "technology", "artificial intelligence"],
  "confidence": 0.89,
  "textLength": 46,
  "model": "google-gemini-1.5-flash"
}
```

- [ ] Status code: 200
- [ ] `success: true`
- [ ] `tags` is array of strings
- [ ] `confidence` is number between 0-1
- [ ] `model` contains "gemini"

### Test Error Handling:

```bash
# Missing text
curl -X POST http://localhost:3000/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{}'
```

- [ ] Status code: 400
- [ ] Response includes: `error: "Invalid input..."`

### Test Text Length Limit:

```bash
# Text exceeding 5000 characters
curl -X POST http://localhost:3000/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"'$(printf 'x%.0s' {1..5001})'\"}'
```

- [ ] Status code: 400
- [ ] Response includes: `error: "Text exceeds maximum length"`

## Performance Verification

Generate tags 5 times and check average response time:

| Attempt | Time |
|---------|------|
| 1 | __ seconds |
| 2 | __ seconds |
| 3 | __ seconds |
| 4 | __ seconds |
| 5 | __ seconds |

- [ ] Average time: 2-4 seconds
- [ ] No timeout errors
- [ ] Consistent performance

## Quality Verification

Test with different text types:

### Scientific Text
```
Quantum computing leverages quantum mechanics principles to solve 
computational problems exponentially faster than classical computers.
```

Expected tags: quantum computing, quantum mechanics, computation

- [ ] ✅ Tags are relevant

### News Article (sample)
```
The stock market reached record highs today as tech stocks led the surge. 
Investors showed renewed confidence in growth companies.
```

Expected tags: stock market, finance, technology, investment

- [ ] ✅ Tags are relevant

### Product Review
```
This coffee maker brews excellent espresso with a sleek stainless steel design. 
It heats up quickly and is very easy to clean.
```

Expected tags: coffee, kitchen appliance, espresso, design

- [ ] ✅ Tags are relevant

## Security Verification

### API Key Security

- [ ] API key NOT visible in browser Network tab payload (server-side only)
- [ ] API key NOT logged in console
- [ ] API key NOT in version control (.gitignore includes .env.local)
- [ ] API key NOT hardcoded in any source file

### HTTPS (if deployed)

- [ ] URL uses HTTPS (not HTTP)
- [ ] Green lock icon in browser
- [ ] No mixed content warnings

## Common Issues Checklist

If you encounter issues, verify:

### Issue: "Cannot find module 'ai'"

- [ ] Run `pnpm install`
- [ ] Check `node_modules/ai` exists
- [ ] Restart dev server

### Issue: "GOOGLE_GENERATIVE_AI_API_KEY is undefined"

- [ ] Check `.env.local` exists
- [ ] Key is correctly spelled
- [ ] Key value is not empty
- [ ] Restart dev server after adding key

### Issue: "Invalid API key"

- [ ] Key starts with "AIzaSy"
- [ ] Key is complete (not truncated)
- [ ] Generate new key at https://aistudio.google.com/apikey
- [ ] Paste full new key

### Issue: "Quota exceeded"

- [ ] Check you're within 60 req/min limit
- [ ] If needed, upgrade to paid tier
- [ ] Or wait 60 seconds before retrying

### Issue: 500 Error

- [ ] Check server logs: `pnpm dev` output
- [ ] Check browser console for errors
- [ ] Verify API key is valid
- [ ] Try restarting dev server

### Issue: Tags are empty or low quality

- [ ] Input text is at least 50 words
- [ ] Text is clear and not ambiguous
- [ ] Try different text to compare

## Final Verification Summary

All of these should be checked:

### Functionality
- [ ] App loads at http://localhost:3000
- [ ] Generate tags works (2-3 sec response)
- [ ] Tags are relevant and accurate
- [ ] Confidence score displays (0-1)
- [ ] Copy button works
- [ ] Clear button works
- [ ] Input validation works (empty text, length limit)
- [ ] Error messages display correctly

### Technical
- [ ] No console errors
- [ ] No network errors
- [ ] API endpoint responds correctly
- [ ] Environment variable is set
- [ ] Footer shows "Google Gemini 1.5 Flash"

### Deployment (if applicable)
- [ ] Environment variable set in Vercel
- [ ] Deployed app accessible
- [ ] Deployed app works like local version
- [ ] Response time similar to local

### Security
- [ ] API key not exposed
- [ ] API key not in version control
- [ ] HTTPS enabled (deployed)
- [ ] No mixed content

## Sign-Off

When all checks pass, you can confidently say:

✅ **AI Text Tagger with Google Gemini is ready for production!**

Date verified: ___________
Verified by: ___________

## Next Steps After Verification

1. **Share your app:** Send the URL to others
2. **Monitor usage:** Check Gemini quota in Google Cloud Console
3. **Collect feedback:** See if users like the app
4. **Scale if needed:** Upgrade to paid tier if you exceed limits

Congratulations! Your migration is complete! 🎉
