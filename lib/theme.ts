import { createTheme } from '@mui/material/styles'

export function buildTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#7c3aed' },
      secondary: { main: '#06b6d4' },
      background: {
        default: mode === 'dark' ? '#0f0a1e' : '#f3f0ff',
        paper: mode === 'dark' ? '#1a1033' : '#ffffff',
      },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  })
}
