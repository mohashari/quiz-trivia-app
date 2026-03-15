import { NextRequest, NextResponse } from 'next/server'
import { TriviaResponse } from '@/types/quiz'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const amount = searchParams.get('amount') ?? '10'
  const category = searchParams.get('category') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const type = searchParams.get('type') ?? 'multiple'

  const params = new URLSearchParams({ amount, type })
  if (category) params.set('category', category)
  if (difficulty) params.set('difficulty', difficulty)

  try {
    const res = await fetch(
      `https://opentdb.com/api.php?${params.toString()}`,
      { next: { revalidate: 0 } }
    )
    const data: TriviaResponse = await res.json()

    if (data.response_code !== 0) {
      return NextResponse.json(
        { error: 'Not enough questions available. Try different settings.' },
        { status: 422 }
      )
    }

    return NextResponse.json(data.results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
