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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">AI Image Tagger</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Automatically generate relevant tags for any image using AI
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload Your Image</CardTitle>
            <CardDescription>
              Drag and drop an image or click to browse. Supports JPEG, PNG, WebP, and GIF (max 10MB).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-muted-foreground/50" />
                  <div>
                    <p className="font-medium text-foreground">Drag and drop your image here</p>
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
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-lg max-h-96 object-cover"
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
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Info */}
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">File:</span> {imageFile?.name}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span>{' '}
                    {(imageFile!.size / (1024 * 1024)).toFixed(2)}MB
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {imageFile?.type}
                  </p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleTagImage}
                disabled={isLoading || !imagePreview}
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
                    <ImageIcon className="mr-2 h-4 w-4" />
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
            {(tags.length > 0 || isLoading) && (
              <div className="pt-6 border-t">
                <TagsDisplay tags={tags} confidence={confidence} isLoading={isLoading} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by Google Gemini Vision • Max 10MB per image • Free to use
          </p>
        </div>
      </div>
    </div>
  )
}
