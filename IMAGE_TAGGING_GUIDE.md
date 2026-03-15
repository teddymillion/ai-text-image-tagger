# Image Tagging Feature - Complete Guide

## Overview

The AI Text Tagger now supports both **text tagging** and **image tagging** using Google Gemini's Vision API. Both features are completely free and require no credit card.

## New Features

### Image Tagger Component
- **Drag-and-drop upload** or click to browse
- **Preview thumbnail** with file info (name, size, type)
- **Automatic validation** (format, size)
- **Real-time processing** (2-3 seconds)
- **Confidence scoring** (0-1 scale)
- **Copy tags to clipboard**
- **Error handling** for all edge cases

### Supported Image Formats
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- GIF (`.gif`)

### Size Limits
- **Maximum file size**: 10MB
- **Validation on client** (immediate feedback)
- **Validation on server** (security)

## Architecture

### Frontend Components

#### `components/tags-display.tsx` (NEW - Reusable)
Displays generated tags with confidence score, used by both text and image taggers.

**Props:**
```typescript
interface TagsDisplayProps {
  tags: string[]
  confidence: number | null
  isLoading?: boolean
}
```

**Features:**
- Animated confidence progress bar
- Copy tags to clipboard button
- Loading state with pulse animation
- Responsive badge layout

#### `components/text-tagger.tsx` (UPDATED)
Refactored to use `TagsDisplay` component. No logic changes to API calls.

**Changes:**
- Removed duplicate tag display code
- Now uses shared `TagsDisplay` component
- Cleaner, more maintainable code

#### `components/image-tagger.tsx` (NEW)
Complete image upload and tagging interface.

**Features:**
- File input with drag-and-drop
- Image preview with removal button
- File metadata display (name, size, type)
- Real-time file validation
- Loading states
- Error messages
- Uses `TagsDisplay` for results

**Props:**
None (standalone component with internal state)

### Backend API Endpoints

#### `/api/tag-text` (EXISTING - FIXED)
Text tagging endpoint using Google Gemini.

**Model**: `gemini-2.5-flash` (updated from deprecated 1.5)

**Request:**
```json
{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "success": true,
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.92,
  "textLength": 150,
  "model": "gemini-2.5-flash"
}
```

#### `/api/tag-image` (NEW)
Image tagging endpoint using Google Gemini Vision API.

**Model**: `gemini-2.5-flash`

**Request:**
```json
{
  "image": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "success": true,
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.89,
  "imageSize": 1048576,
  "model": "gemini-2.5-flash"
}
```

### Main Page Structure

#### `app/page.tsx` (UPDATED)
Now includes tab navigation to switch between text and image taggers.

**Features:**
- Sticky tab bar at top
- Visual indication of active tab
- Smooth transitions between views
- Both taggers fully functional

## Implementation Details

### Image Upload Flow

1. **User selects image**
   - Click upload area or drag-drop
   - File validation (type, size)
   - Show preview + metadata

2. **User clicks "Generate Tags"**
   - Convert image to base64
   - Send POST to `/api/tag-image`
   - Show loading state

3. **Backend processes image**
   - Validate base64 and MIME type
   - Call Gemini Vision API
   - Parse JSON response
   - Return tags + confidence

4. **Display results**
   - Show tags as badges
   - Display confidence bar
   - Enable copy-to-clipboard
   - Option to upload new image

### Error Handling

| Error | Scenario | Status | User Message |
|-------|----------|--------|--------------|
| No image | User clicks generate without uploading | 400 | "Please select an image first" |
| Invalid format | `.txt`, `.pdf`, `.exe`, etc. | 400 | "Only JPEG, PNG, WebP, and GIF images are supported" |
| File too large | > 10MB | 400 | "Image too large. Maximum size is 10MB. Your image is XXMb" |
| Invalid base64 | Corrupted data | 400 | "Invalid base64 image data" |
| Bad MIME type | Mismatched extension | 400 | "Image format not supported" |
| API rate limit | Too many requests | 429 | "Rate limit exceeded. Please wait a moment and try again" |
| API error | Service unavailable | 500 | "AI service error, try again" |
| No API key | Missing env var | 500 | "Server configuration error" |

### File Type Validation

**Client-side** (instant UX feedback):
- Check `file.type` against allowed MIME types
- Show error toast immediately

**Server-side** (security):
- Validate MIME type from request body
- Extract and validate base64 data
- Extra protection against malicious uploads

### Security Measures

1. **API Key Protection**
   - Never exposed in frontend code
   - Only used server-side in API routes
   - Accessed via environment variable

2. **Input Validation**
   - Client: File type and size checks
   - Server: Base64 format validation
   - Server: MIME type whitelisting

3. **Data Privacy**
   - Images processed immediately
   - No storage or logging of images
   - No base64 logged to console

4. **Rate Limiting**
   - Respects Google's API quotas
   - Free tier: 60 requests/minute
   - Error handling for quota exceeded

## Usage Examples

### Basic Text Tagging
```typescript
const response = await fetch('/api/tag-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Your text here' })
})
const data = await response.json()
// data.tags = ['tag1', 'tag2', 'tag3']
// data.confidence = 0.92
```

### Basic Image Tagging
```typescript
// 1. Read file
const file = inputElement.files[0]
const reader = new FileReader()

// 2. Convert to base64
reader.onload = async (e) => {
  const base64 = e.target.result.split(',')[1]
  
  // 3. Send to API
  const response = await fetch('/api/tag-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64,
      mimeType: file.type
    })
  })
  
  const data = await response.json()
  // data.tags = ['tag1', 'tag2', 'tag3']
  // data.confidence = 0.89
}

reader.readAsDataURL(file)
```

## Performance Considerations

### Text Tagging
- **Speed**: 2-3 seconds average
- **Model**: Gemini 2.5 Flash (optimized for speed)
- **Cost**: ~0.075 tokens per request

### Image Tagging
- **Speed**: 2-4 seconds average
- **Model**: Gemini 2.5 Flash (with vision)
- **Cost**: ~150 tokens per request
- **Bottleneck**: Base64 encoding (client-side)

### Optimization Tips
1. **Resize large images** before upload (client-side)
2. **Compress images** for faster upload
3. **Use WebP** format (better compression)
4. **Batch requests** cautiously (respect rate limits)

## Deployment Checklist

- [ ] Environment variable set: `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] Both API endpoints functional: `/api/tag-text`, `/api/tag-image`
- [ ] Text tagger works with new component structure
- [ ] Image tagger uploads and tags correctly
- [ ] Tab navigation smooth and responsive
- [ ] Error messages display correctly
- [ ] Loading states visible
- [ ] Copy button functional
- [ ] Drag-drop works on supported browsers
- [ ] All file format validations working

## Testing Checklist

### Text Tagging
- [ ] Generate tags for normal text
- [ ] Generate tags for empty text (error)
- [ ] Generate tags for very long text (5000+ chars)
- [ ] Confidence score displays correctly
- [ ] Copy button works

### Image Tagging
- [ ] Upload JPEG image
- [ ] Upload PNG image
- [ ] Upload WebP image
- [ ] Upload GIF image
- [ ] Reject unsupported format (error)
- [ ] Reject file > 10MB (error)
- [ ] Drag-drop works
- [ ] Preview displays correctly
- [ ] Remove image works
- [ ] Generate tags for valid image
- [ ] Confidence score displays correctly
- [ ] Copy button works

### UI/UX
- [ ] Tab navigation works
- [ ] Active tab highlighted
- [ ] Smooth transitions between tabs
- [ ] Loading spinners show
- [ ] Success toasts show
- [ ] Error toasts show
- [ ] Buttons disabled during loading
- [ ] Mobile responsive

## Troubleshooting

### "Image too large" error
**Solution**: Resize image before uploading. Most JPEGs should be < 5MB.

### "Invalid image format" error
**Solution**: Use JPEG, PNG, WebP, or GIF. Other formats not supported.

### "Rate limit exceeded"
**Solution**: Wait 1 minute before next request. Free tier: 60 requests/minute.

### "Server configuration error"
**Solution**: API key not set. Add `GOOGLE_GENERATIVE_AI_API_KEY` to environment variables.

### Tags seem inaccurate
**Solution**: 
- Use clearer, well-lit images
- High-quality images work better
- Descriptive images get better tags

## Future Enhancements

1. **Batch tagging**
   - Upload multiple images
   - Generate tags for all at once

2. **Custom prompts**
   - Let users specify tag categories
   - Domain-specific tagging (medical, product, art)

3. **Advanced filters**
   - Minimum confidence threshold
   - Tag length limits
   - Exclude common words

4. **Export options**
   - CSV export
   - JSON export
   - Bulk operations

5. **History**
   - Save previous tags
   - Compare results over time

## API Quotas

### Free Tier Limits
- **Text**: 60 requests/minute
- **Vision**: 60 requests/minute
- **Monthly**: Unlimited (no billing)

### Pro Tier (Optional)
- Higher limits with billing
- Priority support
- Better latency

## File Structure

```
components/
├── text-tagger.tsx       (UPDATED - uses TagsDisplay)
├── image-tagger.tsx      (NEW)
└── tags-display.tsx      (NEW - extracted common UI)

app/api/
├── tag-text/route.ts     (EXISTING - model fixed)
└── tag-image/route.ts    (NEW)

app/
└── page.tsx              (UPDATED - tabs)
```

## Dependencies

No new packages required! Uses existing:
- `@google/generative-ai` (already installed)
- `React` 19+
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages carefully
3. Check browser console for details
4. Verify API key is set correctly
