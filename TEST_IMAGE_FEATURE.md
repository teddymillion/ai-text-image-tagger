# Testing the Image Tagging Feature

## Quick Start (5 minutes)

### 1. Refresh the Preview
- Hard refresh your browser: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
- Wait for the dev server to reload
- You should see two tabs: "Text Tagger" and "Image Tagger"

### 2. Test Text Tagger (Still Works)
1. Click "Text Tagger" tab
2. Paste some text: "Artificial intelligence is transforming healthcare"
3. Click "Generate Tags"
4. Verify: tags appear in 2-3 seconds with confidence score
5. Click "Copy" to copy tags to clipboard

### 3. Test Image Tagger (New)
1. Click "Image Tagger" tab
2. Upload an image:
   - **Option A**: Click the upload area to browse
   - **Option B**: Drag and drop an image
3. Verify: Preview shows with file info (name, size, type)
4. Click "Generate Tags"
5. Verify: Tags appear in 2-4 seconds with confidence score
6. Click "Copy" to copy tags

## Test Cases

### Image Upload Tests

#### ✅ Valid Images
```
Test: Upload JPEG
- File: any .jpg or .jpeg file
- Expected: Preview shows, generate button works
- Result: PASS / FAIL

Test: Upload PNG
- File: any .png file
- Expected: Preview shows, generate button works
- Result: PASS / FAIL

Test: Upload WebP
- File: any .webp file
- Expected: Preview shows, generate button works
- Result: PASS / FAIL

Test: Upload GIF
- File: any .gif file
- Expected: Preview shows, generate button works
- Result: PASS / FAIL
```

#### ❌ Invalid Images
```
Test: Upload Text File
- File: .txt file
- Expected: Error toast: "Only JPEG, PNG, WebP, and GIF"
- Result: PASS / FAIL

Test: Upload PDF
- File: .pdf file
- Expected: Error toast: "Only JPEG, PNG, WebP, and GIF"
- Result: PASS / FAIL

Test: Upload 50MB File
- File: Any image > 10MB
- Expected: Error: "Image too large. Maximum size is 10MB"
- Result: PASS / FAIL
```

### Tag Generation Tests

```
Test: Tag Natural Photo
- Image: Any landscape/nature photo
- Expected: Tags like "landscape", "mountain", "sunset" (3-7 tags)
- Confidence: > 0.8
- Result: PASS / FAIL

Test: Tag Object
- Image: Photo of single object (phone, book, etc.)
- Expected: Tags like "phone", "technology", "device" (3-7 tags)
- Confidence: > 0.7
- Result: PASS / FAIL

Test: Tag People
- Image: Photo with people
- Expected: Tags like "people", "group", "outdoors" (3-7 tags)
- Confidence: > 0.7
- Result: PASS / FAIL

Test: Tag Abstract
- Image: Abstract art or diagram
- Expected: Tags like "abstract", "colorful", "geometric" (3-7 tags)
- Confidence: 0.5-0.8
- Result: PASS / FAIL
```

### UI/UX Tests

```
Test: Tab Navigation
- Click "Text Tagger"
- Expected: Text tagger shows, tab highlighted
- Click "Image Tagger"
- Expected: Image tagger shows, tab highlighted
- Result: PASS / FAIL

Test: Tab Bar Sticks
- Scroll down on page
- Expected: Tab bar stays at top (sticky position)
- Result: PASS / FAIL

Test: Loading State
- Upload image, click "Generate Tags"
- Expected: Button shows spinner, text says "Generating Tags..."
- Result: PASS / FAIL

Test: Success Toast
- Generate tags successfully
- Expected: Toast appears: "Success - Generated X tags for your image"
- Result: PASS / FAIL

Test: Error Toast
- Try uploading invalid file
- Expected: Error toast with message
- Result: PASS / FAIL

Test: Copy Button
- Generate tags
- Click "Copy" button
- Expected: Button shows "Copied!" (then reverts to "Copy")
- Check clipboard: Tags should be there
- Result: PASS / FAIL

Test: Remove Image
- Upload image
- Click X button on preview
- Expected: Preview removed, upload area shows again
- Result: PASS / FAIL

Test: Mobile Responsive
- Test on phone/tablet
- Expected: All elements visible, buttons clickable
- Result: PASS / FAIL
```

### Error Handling Tests

```
Test: No Image Selected
- Click "Generate Tags" without uploading
- Expected: Error: "Please select an image first"
- Result: PASS / FAIL

Test: API Error (Simulate)
- Temporarily remove/invalidate API key
- Try to generate tags
- Expected: Error toast with message
- Result: PASS / FAIL

Test: Network Error (Simulate)
- Test offline mode (DevTools > Network tab)
- Try to generate tags
- Expected: Network error shown
- Result: PASS / FAIL

Test: Malformed Response
- (Manual: Modify API to return bad JSON)
- Expected: Error: "Failed to parse AI response"
- Result: PASS / FAIL
```

## Expected Behavior

### Successful Text Tagging
```
Input: "Machine learning is revolutionizing AI"
Expected Output: {
  "tags": ["machine learning", "artificial intelligence", "technology"],
  "confidence": 0.92
}
Time: 2-3 seconds
```

### Successful Image Tagging
```
Input: Photo of a cat
Expected Output: {
  "tags": ["cat", "animal", "pet", "feline", "whiskers"],
  "confidence": 0.89
}
Time: 2-4 seconds
```

## Common Issues & Solutions

### Issue: "No image uploaded" error after selecting
**Solution**: Try again. If persists, check browser console for errors.

### Issue: Tab navigation doesn't work
**Solution**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Tags don't appear after "Generate Tags"
**Solution**: Check browser console for errors. Verify API key is set.

### Issue: Image preview not showing
**Solution**: Supported formats: JPEG, PNG, WebP, GIF. Try another image.

### Issue: "Rate limit exceeded"
**Solution**: Wait 1 minute. Free tier: 60 requests/minute.

## Browser Developer Tools

### Console Checks
```javascript
// Check if API calls work
fetch('/api/tag-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: 'base64data',
    mimeType: 'image/jpeg'
  })
}).then(r => r.json()).then(console.log)
```

### Network Tab
- Check `/api/tag-image` requests
- Verify response contains `tags` and `confidence`
- Look for HTTP 200 status on success

### Application Tab
- Check no sensitive data in storage
- Verify no API keys exposed

## Performance Baseline

| Operation | Expected Time |
|-----------|---|
| Page load | < 2s |
| Tab switch | < 200ms |
| File select | < 100ms |
| Base64 encode | 100-500ms |
| API call | 2-3s |
| Total text tagging | 2-4s |
| Total image tagging | 2-5s |

## Regression Tests

### Text Tagger Still Works
- [ ] Generate tags from text
- [ ] Confidence score displays
- [ ] Copy button works
- [ ] Error handling works
- [ ] Clear button works

### UI Components
- [ ] Tags display correctly
- [ ] Badges render properly
- [ ] Confidence bar animates
- [ ] Loading spinner shows
- [ ] Toasts appear

### API Endpoints
- [ ] `/api/tag-text` responds
- [ ] `/api/tag-image` responds
- [ ] Both return correct format
- [ ] Error handling works

## Sign-Off Checklist

- [ ] Text tagger works as before
- [ ] Image tagger uploads images
- [ ] Image preview shows
- [ ] Tags generate in 2-4 seconds
- [ ] Confidence score displays
- [ ] Copy button works
- [ ] All errors handled gracefully
- [ ] Toasts notify user
- [ ] Tab navigation works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API key not exposed

## Next Steps After Testing

1. If all tests pass: **Deploy to production**
2. If issues found: Check console logs and debug
3. Share results and feedback

## Support

If you encounter issues:
1. Check browser console (F12)
2. Verify API key is set
3. Hard refresh page
4. Check `IMAGE_TAGGING_GUIDE.md` for troubleshooting
5. Review `CODE_REFERENCE.md` for implementation details
