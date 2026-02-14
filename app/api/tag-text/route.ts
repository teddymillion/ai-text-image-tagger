import { generateText, Output } from 'ai'
import { z } from 'zod'

// Define the response schema for structured output
const TagsSchema = z.object({
  tags: z.array(z.string()).describe('Array of relevant topic tags'),
  confidence: z
    .number()
    .describe('Confidence score from 0-1 indicating how confident the tagging is'),
})

/**
 * POST /api/tag-text
 * 
 * Generates relevant topic tags for the provided text using Google Gemini.
 * 
 * Request body:
 *   - text: string (required, 1-5000 characters)
 * 
 * Response:
 *   - success: boolean
 *   - tags: string[] (3-7 tags)
 *   - confidence: number (0-1 scale)
 *   - textLength: number
 */
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

    // Call Google Gemini via AI SDK to generate tags
    // Using google/gemini-1.5-flash for free tier or google/gemini-1.5-pro for better quality
    const result = await generateText({
      model: 'google/gemini-1.5-flash',
      system: `You are an expert at analyzing text and generating relevant topic tags. 
Generate 3-7 concise, relevant tags that capture the main topics and themes in the provided text. 
Tags should be lowercase, single words or short phrases (max 2 words each).
Return tags that are specific and descriptive of the content.
Always provide a confidence score from 0 to 1 based on how well the tags represent the content.`,
      prompt: `Analyze the following text and provide relevant topic tags in JSON format with "tags" (array of strings) and "confidence" (number 0-1) fields:\n\n${text}`,
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
      model: 'google-gemini-1.5-flash',
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

    // Return generic error response with details
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while processing your request'

    // Check for common API errors
    if (errorMessage.includes('API key')) {
      return Response.json(
        {
          error: 'API configuration error. Please ensure GOOGLE_GENERATIVE_AI_API_KEY is set.',
        },
        { status: 500 }
      )
    }

    return Response.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
