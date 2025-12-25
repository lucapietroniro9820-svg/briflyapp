import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const text = body.text ?? ''

  return NextResponse.json({
    summary: `Riassunto demo: ${text.slice(0, 100)}...`
  })
}
