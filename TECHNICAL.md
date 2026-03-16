# Technical Documentation

Detailed technical information about the AI Text Tagger architecture, API design, and implementation.

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Frontend (React/TypeScript)     │
│  - TextTagger Component                 │
│  - Error Handling & Toast Notifications │
│  - Copy to Clipboard                    │
└────────────────┬────────────────────────┘
                 │ HTTP POST /api/tag-text
                 ▼
┌─────────────────────────────────────────┐
│     Next.js API Route (TypeScript)      │
│  - Input Validation                     │
│  - OpenAI API Call (via AI SDK)         │
│  - Structured Output Generation         │
│  - Error Handling                       │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 ▼
        ┌────────────────────┐
        │  Vercel AI Gateway │
        │   (OpenAI Proxy)   │
        └────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │   OpenAI API       │
        │  (GPT-4o-mini)     │
        └────────────────────┘
```

## API Specification

### POST /api/tag-text

**Purpose**: Generate topic tags for input text

**Request**:
```typescript
interface TagTextRequest {
  text: string  // 1-5000 characters, required, must not be empty
}
```

**Response (Success - 200)**:
```typescript
interface TagTextResponse {
  success: true
  tags: string[]        // 3-7 tags
  confidence: number    // 0-1 confidence score
  textLength: number    // Length of input text
}
```

**Response (Error - 400)**:
```typescript
interface TagTextErrorResponse {
  error: string  // Error message
}
```

**Error Codes**:
- `400`: Invalid input (empty, too long, or not a string)
- `500`: Server error (OpenAI API error, etc.)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"JavaScript is a programming language used for web development"}'
```

**Example Response**:
```json
{
  "success": true,
  "tags": ["javascript", "programming", "web development"],
  "confidence": 0.95,
  "textLength": 59
}
```

## Implementation Details

### Frontend Component (`components/text-tagger.tsx`)

**Key Functions**:

1. **handleTagText()**: Main function to call the API
   - Validates input
   - Shows loading state
   - Handles errors
   - Updates UI with results

2. **handleClear()**: Resets all state

3. **Copy to Clipboard**: Uses Clipboard API

**State Management**:
```typescript
const [text, setText] = useState('')              // Input text
const [tags, setTags] = useState<string[]>([])    // Generated tags
const [confidence, setConfidence] = useState(null) // Confidence score
const [isLoading, setIsLoading] = useState(false)  // Loading state
const [error, setError] = useState(null)           // Error messages
```

**UI Libraries Used**:
- shadcn/ui: Button, Card, Badge components
- Lucide React: Icons (Zap, Loader2)
- Tailwind CSS: Styling
- Sonner: Toast notifications

### Backend Route (`app/api/tag-text/route.ts`)

**Key Steps**:

1. **Input Validation**:
   ```typescript
   if (!text || typeof text !== 'string' || text.trim().length === 0)
     return 400 error
   if (text.length > 5000)
     return 400 error
   ```

2. **AI Call using AI SDK**:
   ```typescript
   const result = await generateText({
     model: 'openai/gpt-4o-mini',
     system: 'You are an expert...',
     prompt: 'Analyze and tag: ...',
     output: Output.object({ schema: TagsSchema })
   })
   ```

3. **Schema Validation**:
   - Uses Zod for runtime validation
   - Ensures tags are strings
   - Validates confidence score (0-1)

4. **Response**:
   - Returns 200 with tags on success
   - Returns 400 for validation errors
   - Returns 500 for server errors

### Data Flow

```
User Input
    ↓
Frontend Validation
    ↓ (if valid)
Disable UI & Show Loading
    ↓
POST /api/tag-text
    ↓
Backend Validation
    ↓ (if valid)
Call AI SDK with generateText()
    ↓
AI SDK Calls OpenAI API
    ↓
Parse Structured Output
    ↓
Return JSON Response
    ↓
Frontend Parses Response
    ↓ (if success)
Display Tags & Confidence
    ↓ (if error)
Show Error Message
```

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key

### How They're Used

**Frontend**: Only `NEXT_PUBLIC_*` variables are accessible
- Currently: None (API key stays on backend)

**Backend**: All variables are accessible
- `OPENAI_API_KEY`: Used by AI SDK to authenticate with OpenAI

## Dependencies

### Production Dependencies
```json
{
  "ai": "^6.0.0",              // Vercel AI SDK
  "@ai-sdk/react": "^3.0.0",   // React hooks (not used, but good to have)
  "next": "16.1.6",            // Next.js
  "react": "19.2.3",           // React
  "zod": "^3.24.1",            // Schema validation
  // ... UI component libraries (shadcn/ui, Radix UI)
}
```

### Key Packages

| Package | Purpose | Notes |
|---------|---------|-------|
| `ai` | AI SDK from Vercel | Used for `generateText`, `Output` |
| `zod` | Runtime validation | Validates API schemas |
| `lucide-react` | Icons | UI icons (Zap, Loader2) |
| `tailwindcss` | Styling | CSS framework |
| `next` | Framework | Next.js 16 |

## Performance Considerations

### API Response Time
- Average: 2-3 seconds
- Depends on text length and OpenAI API load
- Timeout: 25 seconds (Vercel default)

### Token Usage
- Typical request: 100-200 tokens
- Cost: ~$0.0003 per request (gpt-4o-mini pricing)

### Optimization Strategies
1. **Caching** (Future): Cache results for identical inputs
2. **Batch Processing**: Process multiple texts at once
3. **Model Selection**: Switch to cheaper models if needed

## Security Analysis

### Vulnerabilities Mitigated
1. **API Key Exposure**: Key is server-only
2. **SQL Injection**: Not applicable (no database)
3. **XSS**: React's JSX escapes by default
4. **CSRF**: Next.js has built-in CSRF protection
5. **Input Overflow**: 5000 character limit enforced

### Security Best Practices Implemented
- ✅ Input validation on client and server
- ✅ Error messages don't leak sensitive info
- ✅ No sensitive data in frontend code
- ✅ All API calls proxied through Next.js
- ✅ HTTPS enforced on Vercel

## Error Handling Strategy

### Frontend Error Handling
1. **Validation Errors**: Caught before API call
2. **Network Errors**: Caught in try-catch
3. **API Errors**: Response checked for success
4. **Display**: Toast notifications + error text

### Backend Error Handling
1. **JSON Parse Errors**: 400 Bad Request
2. **Missing Input**: 400 Bad Request
3. **OpenAI API Errors**: 500 Server Error
4. **Unexpected Errors**: 500 Server Error

## Testing

### Manual Testing Checklist
- [ ] Generate tags for short text (< 100 chars)
- [ ] Generate tags for long text (> 1000 chars)
- [ ] Try at character limit (5000 chars)
- [ ] Try empty/whitespace input
- [ ] Test copy to clipboard
- [ ] Test error handling (disconnect network)
- [ ] Test on mobile device
- [ ] Test in incognito/private mode

### Example Test Cases
```typescript
// Valid input
{ text: "JavaScript is great" }
// Expected: 3-7 tags generated

// Minimal input
{ text: "AI" }
// Expected: Tags still generated

// Maximum length
{ text: "a".repeat(5000) }
// Expected: Error message about length

// Empty input
{ text: "" }
// Expected: Error "text is required"

// Invalid type
{ text: 123 }
// Expected: Error on backend
```

## Deployment Checklist

- [ ] `OPENAI_API_KEY` added to Vercel environment variables
- [ ] Build succeeds on Vercel
- [ ] API route is accessible at `/api/tag-text`
- [ ] OpenAI API key is valid and has credits
- [ ] Production URL is working
- [ ] Error handling is working
- [ ] Tags are generating correctly

## Monitoring & Logging



### Backend Logging
```typescript
console.error('Error in /api/tag-text:', error)
```

### Vercel Monitoring
- Check Vercel dashboard for errors
- Monitor API usage
- Track performance metrics

## Customization Guide

### Change the Model
Edit `/app/api/tag-text/route.ts`:
```typescript
model: 'openai/gpt-4o',  // Change this
```

Options:
- `openai/gpt-4o` (more expensive, best quality)
- `openai/gpt-4-turbo` (balanced)
- `openai/gpt-4o-mini` (cheapest, current)

### Change Tag Count
Edit `/app/api/tag-text/route.ts` system prompt:
```typescript
system: `Generate 5-10 tags...`  // Change 3-7 to 5-10
```

### Change Maximum Text Length
Edit `/app/api/tag-text/route.ts`:
```typescript
const maxLength = 10000  // Change from 5000
```

### Add Database Storage
Future enhancement: Store tagging history
- Add Supabase/PostgreSQL
- Store: text, tags, timestamp, confidence
- Add filtering/search

### Add Authentication
Future enhancement: User accounts
- Add Auth.js or Supabase Auth
- Track user's tagging history
- Implement rate limiting per user

## Performance Profiling

### Identify Bottlenecks
1. **Frontend**: Use browser DevTools Performance tab
2. **Backend**: Check OpenAI API response time
3. **Network**: Check Vercel deployment region

### Optimization Opportunities
1. **Add request caching** (Redis)
2. **Batch similar requests**
3. **Use cheaper model for simple text**
4. **Add CDN for static assets**

## API Rate Limiting (Future)

Recommended for production:
```typescript
// Add Upstash Redis rate limiting
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})

const { success } = await ratelimit.limit(req.ip)
if (!success) return new Response('Rate limit exceeded', { status: 429 })
```

## Troubleshooting Guide

### "OPENAI_API_KEY is not set"
**Cause**: Environment variable not set
**Fix**: Add to Vercel environment variables

### "Tags not generating"
**Cause**: OpenAI API error or invalid key
**Fix**: 
- Verify API key is valid
- Check account has credits
- See OpenAI status page

### "Text exceeds maximum length"
**Cause**: Input is too long
**Fix**: Reduce text to < 5000 characters

### "Timeout error"
**Cause**: OpenAI API slow or Down
**Fix**: 
- Wait and retry
- Check OpenAI status
- Reduce text length

---

For questions about specific implementations, check the source code comments.
