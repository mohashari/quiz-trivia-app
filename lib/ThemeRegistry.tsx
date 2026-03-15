'use client'

import * as React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { buildTheme } from './theme'

export const ThemeToggleContext = React.createContext<{
  mode: 'light' | 'dark'
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>
}>({ mode: 'dark', setMode: () => {} })

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark')
  const theme = buildTheme(mode)

  return (
    <ThemeToggleContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  )
}
