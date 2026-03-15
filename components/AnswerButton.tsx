'use client'

import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

interface Props {
  label: string
  state: 'idle' | 'correct' | 'wrong' | 'reveal'
  onClick: () => void
  disabled: boolean
}

export default function AnswerButton({ label, state, onClick, disabled }: Props) {
  const colorMap = {
    idle: 'default',
    correct: 'success',
    wrong: 'error',
    reveal: 'success',
  } as const

  const bgMap = {
    idle: undefined,
    correct: 'success.main',
    wrong: 'error.main',
    reveal: 'success.main',
  }

  return (
    <Button
      fullWidth
      variant={state === 'idle' ? 'outlined' : 'contained'}
      color={colorMap[state] === 'default' ? 'inherit' : colorMap[state]}
      onClick={onClick}
      disabled={disabled}
      startIcon={
        state === 'correct' || state === 'reveal' ? (
          <CheckCircleIcon />
        ) : state === 'wrong' ? (
          <CancelIcon />
        ) : null
      }
      sx={{
        justifyContent: 'flex-start',
        py: 1.5,
        px: 2,
        textAlign: 'left',
        fontWeight: 500,
        fontSize: '0.95rem',
        bgcolor: bgMap[state],
        transition: 'all 0.25s ease',
        '&:hover': state === 'idle' ? { bgcolor: 'action.hover' } : {},
      }}
    >
      {label}
    </Button>
  )
}
