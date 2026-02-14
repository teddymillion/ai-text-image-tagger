import { TextTagger } from '@/components/text-tagger'

export const metadata = {
  title: 'AI Text Tagger | Generate Tags Instantly',
  description:
    'Use AI to automatically generate relevant topic tags for any text. Fast, accurate, and easy to use.',
  keywords: 'AI, tagging, text analysis, topic extraction, GPT-4',
  openGraph: {
    title: 'AI Text Tagger',
    description: 'Generate relevant tags for any text using AI',
    type: 'website',
  },
}

export default function Page() {
  return <TextTagger />
}
