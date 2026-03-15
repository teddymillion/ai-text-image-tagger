import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

/**
 * POST /api/tag-image
 *
 * Generates relevant topic tags for the provided image using Google Gemini Vision.
 * Uses the Gemini 2.5 Flash model with vision capabilities.
 *
 * Request body:
 *   - image: string (required, base64-encoded image data)
 *   - mimeType: string (required, 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif')
 *
 * Response:
 *   - success: boolean
 *   - tags: string[] (3-7 tags)
 *   - confidence: number (0-1 scale)
 *   - imageSize: number (bytes)
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
    const { image, mimeType } = body

    // Validate that image and mimeType are provided
    if (!image || typeof image !== 'string') {
      return Response.json(
        { error: 'Invalid input: image (base64) field is required' },
        { status: 400 }
      )
    }

    if (!mimeType || typeof mimeType !== 'string') {
      return Response.json(
        { error: 'Invalid input: mimeType field is required' },
        { status: 400 }
      )
    }

    // Validate MIME type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validMimeTypes.includes(mimeType)) {
      return Response.json(
        {
          error: `Invalid image type. Supported formats: ${validMimeTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate base64 image size (max ~13MB base64 = ~10MB original)
    // Base64 increases size by ~33%, so 13MB base64 ≈ 10MB original
    const maxBase64Size = 13 * 1024 * 1024 // 13MB
    if (image.length > maxBase64Size) {
      return Response.json(
        {
          error: `Image too large. Maximum size is 10MB. Your image is approximately ${Math.round(image.length / (1024 * 1024))}MB.`,
        },
        { status: 400 }
      )
    }

    // Validate base64 format
    try {
      // Remove data URI prefix if present
      const base64Data = image.includes(',') ? image.split(',')[1] : image
      // Check if it's valid base64
      atob(base64Data)
    } catch (e) {
      return Response.json(
        { error: 'Invalid base64 image data' },
        { status: 400 }
      )
    }

    // Get the Gemini model with vision capabilities
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Remove data URI prefix if present
    const base64Image = image.includes(',') ? image.split(',')[1] : image

    // Create the prompt for image analysis
    const prompt = `You are an expert at analyzing images and generating relevant topic tags.

Your task: Analyze the provided image and generate 3-7 concise, relevant tags.

Rules:
- Tags should be lowercase
- Tags can be single words or short phrases (max 2 words each)
- Tags should be specific and descriptive of what's in the image
- Consider: objects, people, activities, setting, mood, style, colors, and themes
- Return ONLY valid JSON with no markdown formatting

Return a JSON object with exactly this format (no markdown code blocks):
{
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.9
}`

    // Call the Gemini Vision API
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    })

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
      imageSize: image.length,
      model: 'gemini-2.5-flash',
    })
  } catch (error) {
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Log error for debugging (don't log image data)
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while processing your request'
    console.error('Error in /api/tag-image:', errorMessage)

    // Check for common API errors
    if (
      errorMessage.includes('API key') ||
      errorMessage.includes('401') ||
      errorMessage.includes('Authentication')
    ) {
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

    if (errorMessage.includes('unsupported') || errorMessage.includes('mime')) {
      return Response.json(
        {
          error: 'Image format not supported',
          hint: 'Please use JPEG, PNG, WebP, or GIF',
        },
        { status: 400 }
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
