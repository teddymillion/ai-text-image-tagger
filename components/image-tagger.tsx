'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TagsDisplay } from './tags-display'

interface ImageTagResponse {
  success: boolean
  tags?: string[]
  confidence?: number
  imageSize?: number
  error?: string
}

export function ImageTagger() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [confidence, setConfidence] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Reset previous state
    setError(null)
    setTags([])
    setConfidence(null)

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      const error = 'Only JPEG, PNG, WebP, and GIF images are supported'
      setError(error)
      toast({
        title: 'Invalid Format',
        description: error,
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      const error = `Image too large. Maximum size is 10MB. Your image is ${(file.size / (1024 * 1024)).toFixed(1)}MB`
      setError(error)
      toast({
        title: 'File Too Large',
        description: error,
        variant: 'destructive',
      })
      return
    }

    // Set the file and create preview
    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle the tag generation
  const handleTagImage = async () => {
    if (!imageFile || !imagePreview) {
      setError('Please select an image first')
      toast({
        title: 'No Image',
        description: 'Please select an image to tag',
        variant: 'destructive',
      })
      return
    }

    setError(null)
    setTags([])
    setConfidence(null)
    setIsLoading(true)

    try {
      // Convert image to base64
      const base64Image = imagePreview.split(',')[1]

      // Call the API endpoint
      const response = await fetch('/api/tag-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: imageFile.type,
        }),
      })

      const data: ImageTagResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tags')
      }

      if (data.success && data.tags) {
        setTags(data.tags)
        setConfidence(data.confidence ?? null)
        toast({
          title: 'Success',
          description: `Generated ${data.tags.length} tags for your image`,
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
    setImageFile(null)
    setImagePreview(null)
    setTags([])
    setConfidence(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="flex flex-col justify-center gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            Image intelligence ready
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                AI Image Tagger
              </h2>
            </div>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Upload a single image and get clean, descriptive tags for search, cataloging,
              and content workflows.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <p className="text-sm font-semibold">Smart classification</p>
              <p className="text-sm text-muted-foreground">
                Model-aware tags that match product and content vocabularies.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
              <p className="text-sm font-semibold">Secure processing</p>
              <p className="text-sm text-muted-foreground">
                Single image uploads with clear size and format checks.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Social-ready outputs
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
                Instagram tags
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
                TikTok categories
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
                Facebook reach
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border/60 bg-background/80 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.4)] backdrop-blur">
          <CardHeader>
            <CardTitle>Upload Your Image</CardTitle>
            <CardDescription>
              Drag and drop an image or click to browse. Supports JPEG, PNG, WebP, and GIF (max 10MB).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-dashed border-border/70 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_70%)] p-10 text-center transition-all hover:border-primary/60 hover:bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.15),transparent_70%)]"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm transition-transform group-hover:scale-105">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Drag and drop your image</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-border/60">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-72 w-full object-cover sm:h-80"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setTags([])
                      setConfidence(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    disabled={isLoading}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">File name</span>
                    <span className="truncate">{imageFile?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">File size</span>
                    <span>{(imageFile!.size / (1024 * 1024)).toFixed(2)}MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Format</span>
                    <span>{imageFile?.type}</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleTagImage}
                disabled={isLoading || !imagePreview}
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
                    <ImageIcon className="h-4 w-4" />
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
        <p>Built by T:BoB | Max 10MB per image | Free to use</p>
      </div>
    </div>
  )
}
