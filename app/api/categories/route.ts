import { NextResponse } from 'next/server'

export interface TriviaCategory {
  id: number
  name: string
}

export async function GET() {
  try {
    const res = await fetch('https://opentdb.com/api_category.php', {
      next: { revalidate: 3600 },
    })
    const data: { trivia_categories: TriviaCategory[] } = await res.json()
    return NextResponse.json(data.trivia_categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
