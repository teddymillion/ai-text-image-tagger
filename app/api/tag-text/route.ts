import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

/**
 * POST /api/tag-text
 *
 * Generates relevant topic tags for the provided text using Google Gemini.
 * Uses the Gemini 1.5 Flash model for fast, free processing (no credit card required).
 *
 * Request body:
 *   - text: string (required, 1-5000 characters)
 *
 * Response:
 *   - success: boolean
 *   - tags: string[] (3-7 tags)
 *   - confidence: number (0-1 scale)
 *   - textLength: number
 *   - model: string (model used)
 */
export async function POST(req: Request) {
  try {
    // Validate API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error: 'Server configuration error: GOOGLE_GENERATIVE_AI_API_KEY not set',
          hint: 'Please add your Google Gemini API key to environment variables',
        },
        { status: 500 }
      )
    }

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

    // Get the Gemini model (using free tier model)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the prompt for tag generation
    const prompt = `You are an expert at analyzing text and generating relevant topic tags.

Your task: Analyze the following text and generate 3-7 concise, relevant tags.

Rules:
- Tags should be lowercase
- Tags can be single words or short phrases (max 2 words each)
- Tags should be specific and descriptive of the content
- Return ONLY valid JSON with no markdown formatting

Text to analyze:
"${text}"

Return a JSON object with exactly this format (no markdown code blocks):
{
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.9
}`

    // Call the Gemini API
    const result = await model.generateContent(prompt)
    const response = result.response
    const responseText = response.text()

    // Parse the JSON response
    let parsedResponse
    try {
      // Extract JSON from response (handle potential markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText)
      return Response.json(
        {
          error: 'Failed to parse AI response',
          details: 'The AI model did not return valid JSON',
        },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!Array.isArray(parsedResponse.tags) || typeof parsedResponse.confidence !== 'number') {
      return Response.json(
        {
          error: 'Invalid response structure from AI model',
          details: 'Response missing tags array or confidence number',
        },
        { status: 500 }
      )
    }

    // Ensure confidence is between 0 and 1
    const confidence = Math.min(Math.max(parsedResponse.confidence, 0), 1)

    // Return the tags and metadata
    return Response.json({
      success: true,
      tags: parsedResponse.tags,
      confidence: confidence,
      textLength: text.length,
      model: 'gemini-1.5-flash',
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
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while processing your request'
    console.error('Error in /api/tag-text:', errorMessage)

    // Check for common API errors
    if (errorMessage.includes('API key') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
      return Response.json(
        {
          error: 'Authentication error',
          hint: 'Invalid or missing Google Gemini API key',
        },
        { status: 401 }
      )
    }

    if (errorMessage.includes('rate')) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          hint: 'Please wait a moment and try again',
        },
        { status: 429 }
      )
    }

    return Response.json(
      {
        error: errorMessage,
        type: 'internal_error',
      },
      { status: 500 }
    )
  }
}
