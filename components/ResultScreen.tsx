'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ShareIcon from '@mui/icons-material/Share'
import ReplayIcon from '@mui/icons-material/Replay'
import { LeaderboardEntry } from '@/types/quiz'

interface Props {
  score: number
  total: number
  category: string
  difficulty: string
  leaderboard: LeaderboardEntry[]
  onRestart: () => void
  onSaveScore: (name: string) => void
}

function grade(score: number, total: number) {
  const pct = score / total
  if (pct === 1) return { label: 'Perfect!', color: '#ffd700', emoji: '🏆' }
  if (pct >= 0.8) return { label: 'Excellent!', color: '#22c55e', emoji: '🎉' }
  if (pct >= 0.6) return { label: 'Good job!', color: '#3b82f6', emoji: '👍' }
  if (pct >= 0.4) return { label: 'Keep practicing', color: '#f59e0b', emoji: '📚' }
  return { label: 'Try again!', color: '#ef4444', emoji: '💪' }
}

export default function ResultScreen({ score, total, category, difficulty, leaderboard, onRestart, onSaveScore }: Props) {
  const [name, setName] = React.useState('')
  const [saved, setSaved] = React.useState(false)
  const { label, color, emoji } = grade(score, total)

  function handleSave() {
    if (!name.trim()) return
    onSaveScore(name.trim())
    setSaved(true)
  }

  function handleShare() {
    const text = `I scored ${score}/${total} on the Quiz Time app! ${emoji} Category: ${category || 'Any'} | Difficulty: ${difficulty || 'Any'}`
    if (navigator.share) {
      navigator.share({ title: 'Quiz Time Score', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <Fade in timeout={400}>
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 520 }}>

          {/* Score card */}
          <Card sx={{ mb: 3, textAlign: 'center' }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <EmojiEventsIcon sx={{ fontSize: 56, color }} />
              <Typography variant="h3" fontWeight={800} sx={{ color, mt: 1 }}>
                {score}/{total}
              </Typography>
              <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                {label} {emoji}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                {category && <Chip label={category} size="small" />}
                {difficulty && <Chip label={difficulty} size="small" color="primary" sx={{ textTransform: 'capitalize' }} />}
              </Box>
            </CardContent>
          </Card>

          {/* Save score */}
          {!saved ? (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                  Save your score
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="contained" onClick={handleSave} disabled={!name.trim()}>
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
              ✓ Score saved to leaderboard!
            </Typography>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<ReplayIcon />}
              onClick={onRestart}
              fullWidth
            >
              Play Again
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShare}
              fullWidth
            >
              Share
            </Button>
          </Box>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>
                  🏅 Leaderboard
                </Typography>
                {leaderboard.map((entry, i) => (
                  <React.Fragment key={i}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                          {i + 1}.
                        </Typography>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{entry.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {entry.category || 'Any'} · {entry.difficulty || 'Any'}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {entry.score}/{entry.total}
                      </Typography>
                    </Box>
                    {i < leaderboard.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Fade>
  )
}
