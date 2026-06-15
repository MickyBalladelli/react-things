import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import IconButton from '@mui/material/IconButton'
import CssBaseline from '@mui/material/CssBaseline'
import Tooltip from '@mui/material/Tooltip'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DemoApp } from './DemoApp'

type ThemeMode = 'light' | 'dark'

function readThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedMode = window.localStorage.getItem('react-things-demo-theme')

  if (storedMode === 'light' || storedMode === 'dark') {
    return storedMode
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function createDemoTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#7dd3fc' : '#1769aa'
      },
      secondary: {
        main: mode === 'dark' ? '#86efac' : '#2e7d32'
      },
      background: {
        default: mode === 'dark' ? '#0b1120' : '#f7f8fa',
        paper: mode === 'dark' ? '#111827' : '#ffffff'
      },
      divider: mode === 'dark' ? 'rgba(148, 163, 184, 0.24)' : 'rgba(15, 23, 42, 0.12)'
    },
    shape: {
      borderRadius: 8
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            colorScheme: mode,
            transition: 'background-color 160ms ease, color 160ms ease'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      }
    }
  })
}

function ThemedDemo() {
  const [mode, setMode] = useState<ThemeMode>(readThemeMode)
  const theme = useMemo(() => createDemoTheme(mode), [mode])

  function toggleMode() {
    setMode((currentMode) => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light'
      window.localStorage.setItem('react-things-demo-theme', nextMode)

      return nextMode
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Tooltip title={mode === 'light' ? 'Dark theme' : 'Light theme'}>
        <IconButton
          color="inherit"
          onClick={toggleMode}
          aria-label="Toggle demo theme"
          sx={{
            position: 'fixed',
            zIndex: 1400,
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          {mode === 'light' ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <DemoApp />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemedDemo />
  </React.StrictMode>
)
