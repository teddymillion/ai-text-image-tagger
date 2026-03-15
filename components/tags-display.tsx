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
    <div className="space-y-4">
      {/* Confidence Score */}
      {confidence !== null && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Generated Tags</span>
            <button
              onClick={handleCopyTags}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Analyzing...
        </div>
      )}
    </div>
  )
}
