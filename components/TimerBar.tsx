'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

interface Props {
  timeLeft: number
  total: number
}

export default function TimerBar({ timeLeft, total }: Props) {
  const pct = (timeLeft / total) * 100
  const color = pct > 50 ? 'success' : pct > 25 ? 'warning' : 'error'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ flex: 1, height: 8, borderRadius: 4 }}
      />
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ minWidth: 32, color: pct <= 25 ? 'error.main' : 'text.secondary' }}
      >
        {timeLeft}s
      </Typography>
    </Box>
  )
}
