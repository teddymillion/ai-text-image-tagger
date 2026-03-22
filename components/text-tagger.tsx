'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TagsDisplay } from './tags-display'

interface TagResponse {
  success: boolean
  tags?: string[]
  confidence?: number
  textLength?: number
  error?: string
}

export function TextTagger() {
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [confidence, setConfidence] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Handle the tag generation
  const handleTagText = async () => {
    // Clear previous state
    setError(null)
    setTags([])
    setConfidence(null)

    // Validate input
    if (!text.trim()) {
      setError('Please enter some text to tag')
      toast({
        title: 'Input Error',
        description: 'Please enter some text to tag',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the API endpoint
      const response = await fetch('/api/tag-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data: TagResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tags')
      }

      if (data.success && data.tags) {
        setTags(data.tags)
        setConfidence(data.confidence ?? null)
        toast({
          title: 'Success',
          description: `Generated ${data.tags.length} tags for your text`,
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle clearing the form
  const handleClear = () => {
    setText('')
    setTags([])
    setConfidence(null)
    setError(null)
  }

  return (
    <div className="relative py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col justify-center gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI tagging suite
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                AI Text Tagger
              </h2>
            </div>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Generate crisp, relevant tags from any document, product copy, or briefing in seconds.
              Built for clarity, speed, and consistent topic coverage.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <p className="text-sm font-semibold">Precision tagging</p>
              <p className="text-sm text-muted-foreground">
                Calibrated confidence scores for better downstream filtering.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <p className="text-sm font-semibold">Fast iteration</p>
              <p className="text-sm text-muted-foreground">
                Paste, tag, refine, and export in under a minute.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Built for social publishing
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm10 1a1 1 0 1 1 0 2a1 1 0 0 1 0-2ZM12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"
                    />
                  </svg>
                </span>
                Instagram tagging
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/10 text-slate-900">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M14 3v9.2a3.8 3.8 0 1 1-2-3.4V6.1l8 2V5l-6-2Z"
                    />
                  </svg>
                </span>
                TikTok metadata
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M13 9.3V7h3V4h-3c-2.2 0-4 1.8-4 4v2H7v3h2v7h3v-7h2.7l.3-3H12V8c0-.4.3-.7.7-.7H13Z"
                    />
                  </svg>
                </span>
                Facebook topics
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border/60 bg-background/80 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)] backdrop-blur">
          <CardHeader>
            <CardTitle>Paste Your Text</CardTitle>
            <CardDescription>
              Enter any text and let the model generate relevant topic tags automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium">
                Text Input
              </label>
              <div className="rounded-xl border border-input/80 bg-background/70 p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
                <textarea
                  id="text-input"
                  placeholder="Paste or type your text here... (max 5000 characters)"
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 5000))}
                  disabled={isLoading}
                  className="min-h-[180px] w-full resize-none bg-transparent p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {text.length} / 5000 characters
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleTagText}
                disabled={isLoading || !text.trim()}
                size="lg"
                className="flex-1 gap-2 shadow-sm transition-all hover:translate-y-[-1px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Tags
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="lg"
                disabled={isLoading}
                className="border-border/70 bg-background/60"
              >
                Clear
              </Button>
            </div>

            {(tags.length > 0 || isLoading) && (
              <div className="rounded-2xl border border-border/60 bg-background/60 p-5">
                <TagsDisplay tags={tags} confidence={confidence} isLoading={isLoading} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
        <p>Built by T:BoB | Max 5000 characters per request | Free to use</p>
      </div>
    </div>
  )
}
