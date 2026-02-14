# API Usage Examples

Complete examples showing how to use the `/api/tag-text` endpoint programmatically.

## Basic Usage

### JavaScript/Node.js

```javascript
// Using fetch (Node.js 18+)
async function tagText(text) {
  const response = await fetch('https://your-domain.vercel.app/api/tag-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data
}

// Usage
const result = await tagText('JavaScript is a versatile programming language')
console.log(result)
// Output:
// {
//   success: true,
//   tags: ['javascript', 'programming', 'language'],
//   confidence: 0.92,
//   textLength: 57
// }
```

### Python

```python
import requests
import json

def tag_text(text, api_url="https://your-domain.vercel.app"):
    """Tag text using the AI Text Tagger API"""
    endpoint = f"{api_url}/api/tag-text"
    
    response = requests.post(
        endpoint,
        headers={"Content-Type": "application/json"},
        json={"text": text}
    )
    
    if response.status_code != 200:
        raise Exception(f"API error: {response.status_code}")
    
    return response.json()

# Usage
result = tag_text("Python is perfect for data science and machine learning")
print(result)
```

### cURL

```bash
# Basic request
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Artificial intelligence is transforming industries"}'

# With pretty output
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Machine learning models need quality training data"}' | jq .

# Save response to file
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"Natural language processing enables computers to understand text"}' \
  > response.json
```

## Advanced Examples

### Batch Processing

```javascript
// Process multiple texts at once
async function batchTagText(texts) {
  const promises = texts.map(text => 
    fetch('/api/tag-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).then(r => r.json())
  )

  return Promise.all(promises)
}

// Usage
const results = await batchTagText([
  'React is a JavaScript library for building UIs',
  'Vue.js provides a progressive JavaScript framework',
  'Angular is a TypeScript-based web framework',
])

results.forEach((result, i) => {
  console.log(`Text ${i + 1} tags:`, result.tags)
})
```

### Error Handling

```javascript
async function tagTextWithErrorHandling(text) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty')
    }

    const response = await fetch('/api/tag-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Unknown error occurred')
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Tagging failed')
    }

    return data
  } catch (error) {
    console.error('Tagging error:', error.message)
    return null
  }
}
```

### With Retry Logic

```javascript
async function tagTextWithRetry(text, maxRetries = 3) {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/tag-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        return await response.json()
      }

      if (response.status === 429) {
        // Rate limited, wait before retrying
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`Rate limited. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
      console.log(`Attempt ${attempt} failed:`, error.message)

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`)
}
```

### React Hook

```typescript
import { useState } from 'react'

function useTextTagger() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tagText = async (text: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/tag-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to tag text')
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { tagText, loading, error }
}

// Usage in component
function MyComponent() {
  const { tagText, loading } = useTextTagger()

  const handleTag = async () => {
    const result = await tagText('Your text here')
    console.log(result.tags)
  }

  return (
    <button onClick={handleTag} disabled={loading}>
      {loading ? 'Tagging...' : 'Tag Text'}
    </button>
  )
}
```

### With Caching

```javascript
// Simple in-memory cache
const tagCache = new Map()

async function tagTextWithCache(text) {
  // Check cache
  if (tagCache.has(text)) {
    console.log('Returning cached result')
    return tagCache.get(text)
  }

  // Fetch from API
  const response = await fetch('/api/tag-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  const data = await response.json()

  // Store in cache
  tagCache.set(text, data)

  return data
}

// Usage
const result1 = await tagTextWithCache('React tutorial')
const result2 = await tagTextWithCache('React tutorial') // Returns cached
```

### TypeScript

```typescript
interface TagResponse {
  success: boolean
  tags: string[]
  confidence: number
  textLength: number
}

interface ErrorResponse {
  error: string
}

async function tagText(text: string): Promise<TagResponse> {
  const response = await fetch('/api/tag-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const error: ErrorResponse = await response.json()
    throw new Error(error.error)
  }

  const data: TagResponse = await response.json()
  return data
}

// Usage with type safety
const result = await tagText('TypeScript provides static typing for JavaScript')
console.log(result.tags) // tags is typed as string[]
```

## Integration Examples

### Express.js Backend

```javascript
const express = require('express')
const app = express()

const TAGGER_API = 'http://localhost:3000'

app.post('/articles/tag', async (req, res) => {
  try {
    const { content } = req.body

    const response = await fetch(`${TAGGER_API}/api/tag-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    })

    const tags = await response.json()
    res.json({ success: true, tags })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3001)
```

### Discord Bot

```javascript
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.MessageContent] })

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!tag ')) {
    const text = message.content.slice(5)

    try {
      const response = await fetch('https://your-domain.vercel.app/api/tag-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      message.reply(`Tags: ${data.tags.join(', ')}`)
    } catch (error) {
      message.reply('Error tagging text')
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
```

### WordPress Plugin

```php
<?php
// wp-content/plugins/ai-tagger/ai-tagger.php

add_shortcode('ai_tagger', function() {
  ?>
  <form id="ai-tagger-form">
    <textarea id="ai-text" placeholder="Paste text here..."></textarea>
    <button type="submit">Generate Tags</button>
    <div id="ai-tags"></div>
  </form>

  <script>
  document.getElementById('ai-tagger-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const text = document.getElementById('ai-text').value

    const response = await fetch('https://your-domain.vercel.app/api/tag-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    const data = await response.json()
    document.getElementById('ai-tags').innerHTML = 
      data.tags.map(t => `<span class="tag">${t}</span>`).join('')
  })
  </script>
  <?php
})
?>
```

### Google Sheets Integration

```javascript
// In Apps Script editor

function tagTextGoogleSheets(text) {
  const url = 'https://your-domain.vercel.app/api/tag-text'
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text }),
  }

  const response = UrlFetchApp.fetch(url, options)
  const data = JSON.parse(response.getContentText())

  return data.tags.join(', ')
}

// Usage in sheet: =tagTextGoogleSheets(A1)
```

## Error Response Examples

### Empty Input

```bash
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":""}'

# Response (400):
# {
#   "error": "Invalid input: text field is required and must not be empty"
# }
```

### Text Too Long

```bash
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"'$(printf 'a%.0s' {1..6000})'"}' 

# Response (400):
# {
#   "error": "Text exceeds maximum length of 5000 characters. Provided: 6000 characters."
# }
```

### Invalid JSON

```bash
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{invalid json}'

# Response (400):
# {
#   "error": "Invalid JSON in request body"
# }
```

### Server Error

```bash
# When OpenAI API is down
curl -X POST https://your-domain.vercel.app/api/tag-text \
  -H "Content-Type: application/json" \
  -d '{"text":"some text"}'

# Response (500):
# {
#   "error": "OpenAI API error message"
# }
```

## Performance Tips

1. **Minimize Text Length**: Shorter text = faster response
2. **Batch Requests**: Process multiple texts together for efficiency
3. **Cache Results**: Don't call API for identical text twice
4. **Use Concurrency**: Process texts in parallel when possible
5. **Handle Timeouts**: Set reasonable timeout for API calls

## Rate Limiting

Currently no rate limiting. For production, implement:
- Per-user rate limits
- IP-based rate limits
- Exponential backoff for retries

---

For more information, see `TECHNICAL.md` for implementation details.
