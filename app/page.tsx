'use client'

import { useState } from 'react'
import { TextTagger } from '@/components/text-tagger'
import { ImageTagger } from '@/components/image-tagger'
import { Button } from '@/components/ui/button'
import { FileText, Image as ImageIcon } from 'lucide-react'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')

  return (
    <div className="relative min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,hsl(var(--primary)/0.12),transparent),radial-gradient(900px_500px_at_90%_0%,hsl(var(--primary)/0.08),transparent)]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,hsl(var(--background))_0%,hsl(var(--background)/0.96)_40%,hsl(var(--background))_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animated-orb absolute -top-24 left-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="animated-orb delay-200 absolute right-10 top-32 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="animated-orb delay-500 absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="animated-grid absolute inset-0 opacity-40" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              {activeTab === 'text' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Text + Image Tagger</p>
              <h1 className="text-lg font-semibold tracking-tight">Premium Tagging Studio</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 p-1 shadow-sm">
            <Button
              onClick={() => setActiveTab('text')}
              variant={activeTab === 'text' ? 'default' : 'ghost'}
              className="gap-2 rounded-full px-4"
            >
              <FileText className="h-4 w-4" />
              Text
            </Button>
            <Button
              onClick={() => setActiveTab('image')}
              variant={activeTab === 'image' ? 'default' : 'ghost'}
              className="gap-2 rounded-full px-4"
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative">
        {activeTab === 'text' && <TextTagger />}
        {activeTab === 'image' && <ImageTagger />}
      </main>
    </div>
  )
}
