'use client'

import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import TimerBar from './TimerBar'
import AnswerButton from './AnswerButton'
import { Question } from '@/types/quiz'

const TIMER_SECONDS = 20

interface Props {
  question: Question
  index: number
  total: number
  score: number
  selected: string | null
  answered: boolean
  timeLeft: number
  onAnswer: (answer: string) => void
  onNext: () => void
}

const DIFFICULTY_COLOR = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const

export default function QuestionCard({
  question,
  index,
  total,
  score,
  selected,
  answered,
  timeLeft,
  onAnswer,
  onNext,
}: Props) {
  function getState(answer: string) {
    if (!answered) return 'idle'
    if (answer === question.correct) return answer === selected ? 'correct' : 'reveal'
    if (answer === selected) return 'wrong'
    return 'idle'
  }

  return (
    <Fade in timeout={300}>
      <Card sx={{ width: '100%', maxWidth: 640 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Question {index + 1} / {total}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={question.difficulty}
                size="small"
                color={DIFFICULTY_COLOR[question.difficulty]}
                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
              />
              <Chip label={`Score: ${score}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
            </Box>
          </Box>

          {/* Timer */}
          <TimerBar timeLeft={timeLeft} total={TIMER_SECONDS} />

          {/* Category */}
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            {question.category}
          </Typography>

          {/* Question */}
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, lineHeight: 1.5 }}>
            {question.question}
          </Typography>

          {/* Answers */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {question.answers.map((answer) => (
              <AnswerButton
                key={answer}
                label={answer}
                state={getState(answer)}
                onClick={() => onAnswer(answer)}
                disabled={answered}
              />
            ))}
          </Box>

          {/* Next button */}
          {answered && (
            <Fade in timeout={200}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={onNext} sx={{ px: 4 }}>
                  {index + 1 === total ? 'See Results' : 'Next Question →'}
                </Button>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Fade>
  )
}

export { TIMER_SECONDS }
