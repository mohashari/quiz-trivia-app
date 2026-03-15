export interface TriviaQuestion {
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface TriviaResponse {
  response_code: number
  results: TriviaQuestion[]
}

export interface Question {
  question: string
  answers: string[]       // shuffled, decoded
  correct: string         // decoded
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface LeaderboardEntry {
  name: string
  score: number
  total: number
  category: string
  difficulty: string
  date: string
}

export type GamePhase = 'setup' | 'playing' | 'result'

export interface GameState {
  phase: GamePhase
  questions: Question[]
  current: number
  score: number
  selected: string | null  // answer chosen for current question
  answered: boolean
  timeLeft: number
}
