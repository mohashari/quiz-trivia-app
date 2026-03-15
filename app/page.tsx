'use client'

import * as React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SetupScreen from '@/components/SetupScreen'
import QuestionCard, { TIMER_SECONDS } from '@/components/QuestionCard'
import ResultScreen from '@/components/ResultScreen'
import { ThemeToggleContext } from '@/lib/ThemeRegistry'
import { decode, shuffle } from '@/lib/decode'
import { GameState, LeaderboardEntry, Question, TriviaQuestion } from '@/types/quiz'

// ─── Reducer ────────────────────────────────────────────────────────────────

type Action =
  | { type: 'START'; questions: Question[] }
  | { type: 'ANSWER'; answer: string }
  | { type: 'TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT' }
  | { type: 'RESTART' }

const INITIAL: GameState = {
  phase: 'setup',
  questions: [],
  current: 0,
  score: 0,
  selected: null,
  answered: false,
  timeLeft: TIMER_SECONDS,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return { ...INITIAL, phase: 'playing', questions: action.questions, timeLeft: TIMER_SECONDS }

    case 'ANSWER': {
      if (state.answered) return state
      const correct = action.answer === state.questions[state.current].correct
      return {
        ...state,
        selected: action.answer,
        answered: true,
        score: correct ? state.score + 1 : state.score,
      }
    }

    case 'TICK':
      if (state.answered || state.timeLeft <= 0) return state
      return { ...state, timeLeft: state.timeLeft - 1 }

    case 'TIMEOUT':
      return { ...state, answered: true, selected: null }

    case 'NEXT': {
      const isLast = state.current + 1 >= state.questions.length
      if (isLast) return { ...state, phase: 'result' }
      return { ...state, current: state.current + 1, selected: null, answered: false, timeLeft: TIMER_SECONDS }
    }

    case 'RESTART':
      return INITIAL

    default:
      return state
  }
}

// ─── Leaderboard helpers ─────────────────────────────────────────────────────

const LS_KEY = 'quiz-leaderboard'

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries))
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { mode, setMode } = React.useContext(ThemeToggleContext)
  const [state, dispatch] = React.useReducer(reducer, INITIAL)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([])
  const [setupOpts, setSetupOpts] = React.useState({ category: '', difficulty: '', amount: 10 })

  React.useEffect(() => {
    setLeaderboard(loadLeaderboard())
  }, [])

  // Timer tick
  React.useEffect(() => {
    if (state.phase !== 'playing' || state.answered) return
    if (state.timeLeft <= 0) {
      dispatch({ type: 'TIMEOUT' })
      return
    }
    const id = setTimeout(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearTimeout(id)
  }, [state.phase, state.answered, state.timeLeft])

  async function handleStart(opts: { category: string; difficulty: string; amount: number }) {
    setSetupOpts(opts)
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ amount: String(opts.amount) })
      if (opts.category) params.set('category', opts.category)
      if (opts.difficulty) params.set('difficulty', opts.difficulty)

      const res = await fetch(`/api/questions?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to load questions')

      const questions: Question[] = (data as TriviaQuestion[]).map((q) => ({
        question: decode(q.question),
        correct: decode(q.correct_answer),
        answers: shuffle([q.correct_answer, ...q.incorrect_answers].map(decode)),
        category: decode(q.category),
        difficulty: q.difficulty,
      }))

      dispatch({ type: 'START', questions })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleSaveScore(name: string) {
    const entry: LeaderboardEntry = {
      name,
      score: state.score,
      total: state.questions.length,
      category: setupOpts.category,
      difficulty: setupOpts.difficulty,
      date: new Date().toLocaleDateString(),
    }
    const updated = [entry, ...leaderboard]
      .sort((a, b) => b.score / b.total - a.score / a.total)
      .slice(0, 10)
    setLeaderboard(updated)
    saveLeaderboard(updated)
  }

  const q = state.questions[state.current]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={700} color="primary">
          Quiz Time
        </Typography>
        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {state.phase === 'setup' && (
          <SetupScreen onStart={handleStart} loading={loading} />
        )}

        {state.phase === 'playing' && q && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <QuestionCard
              question={q}
              index={state.current}
              total={state.questions.length}
              score={state.score}
              selected={state.selected}
              answered={state.answered}
              timeLeft={state.timeLeft}
              onAnswer={(answer) => dispatch({ type: 'ANSWER', answer })}
              onNext={() => dispatch({ type: 'NEXT' })}
            />
          </Box>
        )}

        {state.phase === 'result' && (
          <ResultScreen
            score={state.score}
            total={state.questions.length}
            category={setupOpts.category}
            difficulty={setupOpts.difficulty}
            leaderboard={leaderboard}
            onRestart={() => dispatch({ type: 'RESTART' })}
            onSaveScore={handleSaveScore}
          />
        )}
      </Container>
    </Box>
  )
}
