import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DemoApp } from './DemoApp'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1769aa'
    },
    secondary: {
      main: '#2e7d32'
    },
    background: {
      default: '#f7f8fa'
    }
  },
  shape: {
    borderRadius: 8
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DemoApp />
    </ThemeProvider>
  </React.StrictMode>
)
