# AI Text Tagger

A modern, production-ready web application that uses OpenAI's GPT-4 Mini to automatically generate relevant topic tags from any text. Built with Next.js, React, and Tailwind CSS.

## Features

- 🤖 **AI-Powered Tagging**: Uses OpenAI GPT-4 Mini to generate accurate, relevant tags
- 🎨 **Modern UI**: Clean, responsive interface built with shadcn/ui and Tailwind CSS
- ⚡ **Real-time Processing**: Instant tag generation with streaming support
- 📊 **Confidence Scoring**: See how confident the AI is in its tagging
- 📋 **Copy to Clipboard**: Easily copy generated tags for use elsewhere
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔒 **Secure**: All API calls go through Next.js API routes (no frontend API exposure)

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js 16 with App Router
- **AI**: Vercel AI SDK v6, OpenAI GPT-4 Mini
- **Hosting**: Vercel

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── tag-text/
│   │       └── route.ts          # API endpoint for tag generation
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── text-tagger.tsx           # Main UI component
│   └── ui/                       # shadcn/ui components
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/pnpm
- An OpenAI API key (get one from https://platform.openai.com/api-keys)
- A Vercel account (for deployment)

### Local Development

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env.local` file in the project root
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=sk_your_key_here
     ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - You should see the AI Text Tagger interface

## How It Works

1. User enters text in the textarea (up to 5000 characters)
2. Click "Generate Tags" button
3. The frontend sends a POST request to `/api/tag-text`
4. The API route:
   - Validates the input
   - Sends the text to OpenAI's GPT-4 Mini model
   - Generates 3-7 relevant tags using structured output
   - Returns tags with confidence score
5. Frontend displays the tags and allows copying them

## API Documentation

### POST `/api/tag-text`

Generates relevant tags for the provided text.

**Request**:
```json
{
  "text": "Your text here..."
}
```

**Response (Success)**:
```json
{
  "success": true,
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.92,
  "textLength": 150
}
```

**Response (Error)**:
```json
{
  "error": "Text exceeds maximum length of 5000 characters"
}
```

**Error Codes**:
- `400 Bad Request`: Invalid or missing text input
- `500 Internal Server Error`: Server-side error during processing

## Deployment on Vercel

### Option 1: Deploy with CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to connect your GitHub and project

### Option 2: Deploy via Vercel Website

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import this repository from GitHub
4. Set environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
5. Click "Deploy"

### Option 3: Deploy via GitHub Integration

1. Push this code to a GitHub repository
2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variable `OPENAI_API_KEY`
6. Click "Deploy"

## Environment Variables

Required for production:
- `OPENAI_API_KEY`: Your OpenAI API key (starts with `sk_`)

Optional:
- `NEXT_PUBLIC_APP_NAME`: Application name (default: "AI Text Tagger")

## Configuration

### API Rate Limiting

The API has built-in safeguards:
- Maximum text length: 5000 characters
- Text is required and cannot be empty
- Invalid JSON returns a 400 error

### OpenAI Model

Currently uses `gpt-4o-mini` for fast, cost-effective tagging. To change:

Edit `/app/api/tag-text/route.ts` and update:
```typescript
model: 'openai/gpt-4o-mini', // Change this line
```

Available models through Vercel AI Gateway:
- `openai/gpt-4o` (more expensive, higher quality)
- `openai/gpt-4-turbo` (fast, balanced)
- `openai/gpt-4o-mini` (fastest, cheapest)

## Features & Customization

### Adjusting Tag Generation

Edit the system prompt in `/app/api/tag-text/route.ts`:

```typescript
system: `You are an expert at analyzing text and generating relevant topic tags. 
Generate 3-7 concise, relevant tags...`
```

Change the range (3-7) or modify the prompt for different tagging behavior.

### Styling

All styles use Tailwind CSS. Customize:
- Colors: Edit `tailwind.config.ts`
- Fonts: Edit `app/layout.tsx`
- Component styles: Edit `components/text-tagger.tsx`

## Error Handling

The application handles:
- ✅ Missing or empty input
- ✅ Text exceeding character limit
- ✅ Invalid JSON requests
- ✅ OpenAI API errors
- ✅ Network errors
- ✅ Server-side errors

All errors show user-friendly messages via toast notifications.

## Performance

- **Response Time**: ~2-3 seconds for typical text
- **Token Usage**: ~100-200 tokens per request (gpt-4o-mini)
- **Cost**: ~$0.0003 per request at current pricing

Optimize costs by:
- Using a smaller model (gpt-3.5-turbo)
- Batch processing requests
- Caching results for identical inputs

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Ensure you've created `.env.local` in the project root
- Add your API key: `OPENAI_API_KEY=sk_...`
- Restart the development server

### Tags not generating
- Check browser console for errors (F12)
- Verify your OpenAI API key is valid
- Check that your OpenAI account has available credits

### "Text exceeds maximum length"
- Reduce input text to under 5000 characters
- Chunk longer texts and tag separately

### Deployment fails on Vercel
- Ensure environment variable is set in Vercel dashboard
- Check that the repository is properly connected
- Verify Node.js version 18+ is selected

## Security

- ✅ API key is server-side only (never exposed to frontend)
- ✅ Input validation on both client and server
- ✅ No sensitive data stored in frontend
- ✅ All external API calls proxied through Next.js
- ✅ CORS headers properly configured

## Limitations

- Text input limited to 5000 characters
- Tag generation takes 2-3 seconds
- API rate limits depend on your OpenAI account tier
- Requires internet connection and OpenAI API key

## License

MIT - Feel free to use and modify this project

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console
3. Verify environment variables are set correctly
4. Check OpenAI API status: https://status.openai.com/

## Contributing

Feel free to fork, modify, and improve this project!

---

**Built with ❤️ using Next.js, React, and AI SDK**
