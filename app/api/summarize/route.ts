import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Testo mancante' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Riassumi il testo in tedesco in modo chiaro e breve.'
        },
        {
          role: 'user',
          content: text
        }
      ]
    })

    const summary = completion.choices[0].message.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Errore durante il riassunto' },
      { status: 500 }
    )
  }
}
