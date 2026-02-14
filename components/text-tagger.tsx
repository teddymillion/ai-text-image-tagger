'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Text Tagger</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Automatically generate relevant tags for any text using AI
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Paste Your Text</CardTitle>
            <CardDescription>
              Enter any text and let our AI generate relevant topic tags automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Textarea Input */}
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium">
                Text Input
              </label>
              <textarea
                id="text-input"
                placeholder="Paste or type your text here... (max 5000 characters)"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 5000))}
                disabled={isLoading}
                className="w-full h-40 p-4 border border-input bg-background text-foreground rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                {text.length} / 5000 characters
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleTagText}
                disabled={isLoading || !text.trim()}
                size="lg"
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Tags
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="lg"
                disabled={isLoading}
              >
                Clear
              </Button>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="space-y-4 pt-6 border-t">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Generated Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-1.5 px-3 cursor-default hover:bg-secondary"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Confidence Score */}
                {confidence !== null && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Confidence Score</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {(confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Copy Tags Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tagsText = tags.join(', ')
                    navigator.clipboard.writeText(tagsText)
                    toast({
                      title: 'Copied',
                      description: 'Tags copied to clipboard',
                    })
                  }}
                  className="w-full"
                >
                  Copy Tags
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by OpenAI GPT-4 Mini • Max 5000 characters per request
          </p>
        </div>
      </div>
    </div>
  )
}
