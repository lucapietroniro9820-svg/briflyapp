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
         content: `
Du bist ein professioneller Assistent für Textzusammenfassungen.

Aufgabe:
- Fasse den folgenden Text auf Deutsch zusammen
- Verwende eine klare, einfache Sprache
- Maximal 5–7 kurze Sätze
- Behalte die wichtigsten Informationen
- Kein unnötiger Kommentar
- Kein Titel

Stil:
- Sachlich
- Gut lesbar
- Für Studenten und Berufstätige geeignet
`

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
