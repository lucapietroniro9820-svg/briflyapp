'use client'

import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

 const summarize = async () => {
  if (!text) return
  setLoading(true)

  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Errore API')
    }

    setResult(data.summary)
  } catch (error: any) {
    setResult(`Errore: ${error.message}`)
  } finally {
    setLoading(false)
  }
}


  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Briefly – AI summary in German
      </h1>

      <textarea
        className="w-full border p-3 h-40"
        placeholder="Paste the text to summarize here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={summarize}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Summarize'}
      </button>

      {result && (
        <div className="border p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </main>
  )
}
