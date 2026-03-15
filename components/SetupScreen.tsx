'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import QuizIcon from '@mui/icons-material/Quiz'
import { TriviaCategory } from '@/app/api/categories/route'

interface Props {
  onStart: (opts: { category: string; difficulty: string; amount: number }) => void
  loading: boolean
}

const DIFFICULTIES = ['any', 'easy', 'medium', 'hard']
const AMOUNTS = [5, 10, 15, 20]

export default function SetupScreen({ onStart, loading }: Props) {
  const [categories, setCategories] = React.useState<TriviaCategory[]>([])
  const [category, setCategory] = React.useState('')
  const [difficulty, setDifficulty] = React.useState('any')
  const [amount, setAmount] = React.useState(10)
  const [fetching, setFetching] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: TriviaCategory[]) => setCategories(data))
      .finally(() => setFetching(false))
  }, [])

  function handleStart() {
    onStart({
      category,
      difficulty: difficulty === 'any' ? '' : difficulty,
      amount,
    })
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', px: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 480 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                mb: 2,
              }}
            >
              <QuizIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Box>
            <Typography variant="h4" fontWeight={700}>
              Quiz Time
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Test your knowledge
            </Typography>
          </Box>

          {/* Category */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              disabled={fetching}
            >
              <MenuItem value="">Any Category</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Difficulty */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={difficulty}
              label="Difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {DIFFICULTIES.map((d) => (
                <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>
                  {d === 'any' ? 'Any Difficulty' : d.charAt(0).toUpperCase() + d.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Number of questions */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Questions</InputLabel>
            <Select
              value={amount}
              label="Questions"
              onChange={(e) => setAmount(Number(e.target.value))}
            >
              {AMOUNTS.map((n) => (
                <MenuItem key={n} value={n}>
                  {n} Questions
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleStart}
            disabled={loading || fetching}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Quiz'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
