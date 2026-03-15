'use client'

import { useState } from 'react'
import { TextTagger } from '@/components/text-tagger'
import { ImageTagger } from '@/components/image-tagger'
import { Button } from '@/components/ui/button'
import { FileText, Image as ImageIcon } from 'lucide-react'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')

  return (
    <>
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex gap-2">
          <Button
            onClick={() => setActiveTab('text')}
            variant={activeTab === 'text' ? 'default' : 'ghost'}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Text Tagger
          </Button>
          <Button
            onClick={() => setActiveTab('image')}
            variant={activeTab === 'image' ? 'default' : 'ghost'}
            className="gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Image Tagger
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-background to-background/80">
        {activeTab === 'text' && <TextTagger />}
        {activeTab === 'image' && <ImageTagger />}
      </div>
    </>
  )
}
