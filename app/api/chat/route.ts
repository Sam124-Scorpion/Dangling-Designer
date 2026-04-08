import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { STYLIST_SYSTEM_PROMPT } from '@/lib/prompt'
import { Message, Outfit } from '@/lib/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction: STYLIST_SYSTEM_PROMPT,
    })

    // Convert messages to Gemini history format
    // Gemini uses 'user' and 'model' roles (not 'assistant')
    const history = messages
      .slice(0, -1)
      .map(({ role, content }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      }))
      .reduce<Array<{ role: string; parts: Array<{ text: string }> }>>((acc, msg) => {
        // Skip if first message is 'model' or if consecutive messages have same role
        if ((acc.length === 0 && msg.role === 'model') || (acc.length > 0 && acc[acc.length - 1].role === msg.role)) {
          return acc
        }
        return [...acc, msg]
      }, [])

    const lastMessage = messages[messages.length - 1]

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessage.content)
    const rawText = result.response.text()

    // Parse JSON response
    let parsed
    try {
      const clean = rawText.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = { message: rawText, outfits: [], followup: '' }
    }

    // Enrich outfits with Unsplash image URLs
    if (parsed.outfits?.length) {
      const unsplashKey = process.env.UNSPLASH_ACCESS_KEY
      
      parsed.outfits = await Promise.all(
        parsed.outfits.map(async (outfit: Outfit) => {
          try {
            if (unsplashKey) {
              const searchRes = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(outfit.image_search)}&client_id=${unsplashKey}&per_page=1`
              )
              const data = await searchRes.json()
              return {
                ...outfit,
                image_url: data.results?.[0]?.urls?.small || `https://placehold.co/400x300?text=${encodeURIComponent(outfit.name || outfit.image_search)}`,
              }
            }
          } catch (err) {
            console.error(`Failed to fetch image for ${outfit.image_search}:`, err)
          }
          return {
            ...outfit,
            image_url: `https://placehold.co/400x300?text=${encodeURIComponent(outfit.name || outfit.image_search)}`,
          }
        })
      )
    }

    return NextResponse.json({ raw: rawText, parsed })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Chat API error:', errorMessage)
    console.error('Full error:', error)
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
