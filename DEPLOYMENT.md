# Deployment Guide for AI Text Tagger

This guide walks you through deploying your AI Text Tagger application on Vercel.

## Prerequisites

- An OpenAI API key (sign up at https://platform.openai.com)
- A Vercel account (sign up at https://vercel.com)
- Git installed and a GitHub account (for GitHub integration)

## Step-by-Step Deployment

### Step 1: Prepare Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (it starts with `sk_`)
4. **Keep this key safe** - you'll need it for deployment

### Step 2: Set Up Version Control (Recommended)

1. Initialize Git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Text Tagger"
   ```

2. Create a GitHub repository:
   - Go to https://github.com/new
   - Create a new repository named `ai-text-tagger`
   - Follow GitHub's instructions to push your code

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Quickest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From your project directory, run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to an existing project or create a new one
   - Choose your preferred settings
   - When asked about environment variables, choose "Yes"
   - Add your OpenAI API key when prompted

4. Vercel will build and deploy your project

#### Option B: Using Vercel Web Dashboard

1. Go to https://vercel.com/new
2. Select "Continue with GitHub"
3. Find and select your `ai-text-tagger` repository
4. Configure your project:
   - Framework: `Next.js` (auto-detected)
   - Root directory: `./` (default)
   - Build command: (leave as default)
   - Output directory: (leave as default)

5. Add environment variables:
   - Click "Add Environment Variable"
   - Name: `OPENAI_API_KEY`
   - Value: (paste your OpenAI key from Step 1)
   - Add to: Production, Preview, Development

6. Click "Deploy"
7. Wait for the deployment to complete (usually 1-2 minutes)

#### Option C: GitHub Auto-Deploy

1. Connect your GitHub repo to Vercel:
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Authorize Vercel to access GitHub

2. Add environment variables in Vercel dashboard:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Click "Save"

3. Any push to your GitHub repository will auto-deploy to Vercel

## Verification

After deployment:

1. **Check Deployment Status**:
   - Go to https://vercel.com/dashboard
   - Click on your project
   - Look for a green checkmark next to the latest deployment

2. **Visit Your Application**:
   - Click the "Visit" button or open the deployment URL
   - You should see the AI Text Tagger interface

3. **Test the Application**:
   - Paste some text in the textarea
   - Click "Generate Tags"
   - Verify that tags are generated correctly

## Troubleshooting Deployment

### "Build failed" error

**Problem**: Deployment failed during build
**Solution**:
- Check the build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json`
- Verify that `OPENAI_API_KEY` is set in environment variables

### "API key not found" error

**Problem**: Application runs but gives an API error
**Solution**:
1. Go to Vercel dashboard
2. Select your project → Settings → Environment Variables
3. Verify `OPENAI_API_KEY` is set correctly
4. Redeploy: Click "Deployments" → Right-click latest → "Redeploy"

### "Function execution time exceeded" error

**Problem**: API calls are timing out
**Solution**:
- This shouldn't happen, but if it does:
- Check OpenAI API status: https://status.openai.com/
- Try redeploying with `vercel deploy --prod`
- Check your OpenAI account quota

### Tags are not generating on production

**Problem**: Works locally but not on Vercel
**Solution**:
1. Verify `OPENAI_API_KEY` is in "Production" environment variables
2. Make sure the API key hasn't been revoked
3. Check API usage at https://platform.openai.com/account/usage/overview
4. Redeploy after making changes:
   ```bash
   vercel deploy --prod
   ```

## Production Optimization

### 1. Add a Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Enable Performance Analytics

1. In Vercel dashboard, click "Analytics"
2. Enable Web Analytics
3. Monitor your application's performance

### 3. Set Up Error Tracking

1. Go to your project settings
2. Configure error handling integrations
3. Get alerted to production issues immediately

### 4. Monitor API Usage

Track your OpenAI usage to avoid unexpected costs:
1. Go to https://platform.openai.com/account/usage/overview
2. Set up usage alerts
3. Consider implementing caching to reduce API calls

## Security Best Practices

1. **Never commit your API key**
   - Use `.env.local` for local development
   - Use Vercel environment variables for production

2. **Rotate your API key periodically**
   - Generate a new key in OpenAI dashboard
   - Update it in Vercel environment variables

3. **Monitor API key usage**
   - Check for unusual activity
   - Set up billing alerts in OpenAI dashboard

4. **Use environment-specific keys** (Advanced)
   - Use different API keys for development and production
   - This prevents development usage from affecting production limits

## Updating Your Application

### After Making Changes

1. Update your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Updated tagging logic"
   git push origin main
   ```

3. Vercel automatically redeploys
4. Monitor the deployment in Vercel dashboard

### Rolling Back a Deployment

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find a previous successful deployment
4. Click the three dots → "Promote to Production"

## Maintenance

### Regular Tasks

- **Weekly**: Monitor error logs and performance metrics
- **Monthly**: Review API usage and costs
- **Quarterly**: Update dependencies for security patches

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Or update specific packages
pnpm update ai @ai-sdk/react

# Commit and push
git add package.json pnpm-lock.yaml
git commit -m "Updated dependencies"
git push origin main
```

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **AI SDK Documentation**: https://sdk.vercel.ai
- **OpenAI API Docs**: https://platform.openai.com/docs/api-reference

## Cost Estimation

With v0.app/Vercel deployment:
- **Hosting**: Free tier available, scales as needed
- **OpenAI API**: ~$0.0003 per request (gpt-4o-mini)
- **Custom Domain**: ~$10-15/year with domain registrar

For 1000 requests per month: ~$0.30 in API costs

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test the application
3. 📊 Monitor performance
4. 🚀 Share your application
5. 🔄 Iterate and improve

---

**Congratulations! Your AI Text Tagger is now live on the internet! 🎉**
