import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const text: string | undefined = body?.text

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Testo mancante o non valido' },
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
- Verwende Stichpunkte (Bullet Points)
- Maximal 5 Punkte
- Jeder Punkt maximal 1–2 kurze Sätze
- Konzentriere dich nur auf die wichtigsten Informationen
- Kein Titel, keine Einleitung, keine Schlussfolgerung

Stil:
- Klar
- Sachlich
- Gut strukturiert
- Für Studium und Beruf geeignet
          `.trim()
        },
        {
          role: 'user',
          content: text.trim()
        }
      ],
      temperature: 0.3
    })

    const summary = completion.choices?.[0]?.message?.content

    if (!summary) {
      return NextResponse.json(
        { error: 'Nessun riassunto generato' },
        { status: 500 }
      )
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Errore OpenAI:', error)

    return NextResponse.json(
      { error: 'Errore durante la generazione del riassunto' },
      { status: 500 }
    )
  }
}
