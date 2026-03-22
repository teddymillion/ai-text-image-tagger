'use client'

import { Badge } from '@/components/ui/badge'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface TagsDisplayProps {
  tags: string[]
  confidence: number | null
  isLoading?: boolean
}

export function TagsDisplay({ tags, confidence, isLoading = false }: TagsDisplayProps) {
  const [copied, setCopied] = useState(false)

  // Copy tags to clipboard
  const handleCopyTags = async () => {
    const tagsText = tags.join(', ')
    await navigator.clipboard.writeText(tagsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Don't show anything if there are no tags and not loading
  if (tags.length === 0 && !isLoading) {
    return null
  }

  return (
    <div className="space-y-5">
      {confidence !== null && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs uppercase tracking-wide text-muted-foreground">
            <span>Confidence</span>
            <span className="font-semibold text-foreground">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/80">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,hsl(221_83%_53%),hsl(199_89%_48%))] transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Generated Tags
            </span>
            <button
              onClick={handleCopyTags}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Analyzing...
        </div>
      )}
    </div>
  )
}
