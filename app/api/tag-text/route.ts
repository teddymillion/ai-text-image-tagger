import { generateText, Output } from 'ai'
import { z } from 'zod'

// Define the response schema for structured output
const TagsSchema = z.object({
  tags: z.array(z.string()).describe('Array of relevant topic tags'),
  confidence: z
    .number()
    .describe('Confidence score from 0-1 indicating how confident the tagging is'),
})

export async function POST(req: Request) {
  try {
    // Parse the incoming request
    const body = await req.json()
    const { text } = body

    // Validate that text is provided and is not empty
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json(
        { error: 'Invalid input: text field is required and must not be empty' },
        { status: 400 }
      )
    }

    // Limit text length to prevent excessive API usage
    const maxLength = 5000
    if (text.length > maxLength) {
      return Response.json(
        {
          error: `Text exceeds maximum length of ${maxLength} characters. Provided: ${text.length} characters.`,
        },
        { status: 400 }
      )
    }

    // Call OpenAI via AI SDK to generate tags
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are an expert at analyzing text and generating relevant topic tags. 
Generate 3-7 concise, relevant tags that capture the main topics and themes in the provided text. 
Tags should be lowercase, single words or short phrases (max 2 words each).
Return tags that are specific and descriptive of the content.`,
      prompt: `Analyze the following text and provide relevant topic tags:\n\n${text}`,
      output: Output.object({ schema: TagsSchema }),
    })

    // Extract the structured output
    const taggedData = result.object as z.infer<typeof TagsSchema>

    // Return the tags and metadata
    return Response.json({
      success: true,
      tags: taggedData.tags,
      confidence: taggedData.confidence,
      textLength: text.length,
    })
  } catch (error) {
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Log error for debugging
    console.error('Error in /api/tag-text:', error)

    // Return generic error response
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while processing your request',
      },
      { status: 500 }
    )
  }
}
