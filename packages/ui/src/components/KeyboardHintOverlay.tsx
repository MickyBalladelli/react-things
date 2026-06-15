import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type KeyboardHint = {
  id: string
  label: ReactNode
  shortcut: ReactNode
  description?: ReactNode
  x: number
  y: number
  group?: string
}

export type KeyboardHintOverlayProps = BoxProps & {
  hints: KeyboardHint[]
  children?: ReactNode
  holdKey?: string
  open?: boolean
  defaultOpen?: boolean
  dim?: boolean
  title?: ReactNode
  onOpenChange?: (open: boolean) => void
}

function matchesKey(event: KeyboardEvent, holdKey: string) {
  return event.key.toLowerCase() === holdKey.toLowerCase()
}

export function KeyboardHintOverlay({
  hints,
  children,
  holdKey = '?',
  open,
  defaultOpen = false,
  dim = true,
  title = 'Keyboard shortcuts',
  onOpenChange,
  sx,
  ...props
}: KeyboardHintOverlayProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const shown = open ?? internalOpen

  useEffect(() => {
    if (open !== undefined) {
      return
    }

    function keyDown(event: KeyboardEvent) {
      if (matchesKey(event, holdKey)) {
        setInternalOpen(true)
        onOpenChange?.(true)
      }
    }

    function keyUp(event: KeyboardEvent) {
      if (matchesKey(event, holdKey)) {
        setInternalOpen(false)
        onOpenChange?.(false)
      }
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [holdKey, onOpenChange, open])

  return (
    <Box
      {...props}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
      {shown ? (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            pointerEvents: 'none',
            bgcolor: dim ? alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.28 : 0.12) : 'transparent'
          })}
        >
          <Paper
            variant="outlined"
            sx={{
              position: 'absolute',
              left: 12,
              top: 12,
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="caption" fontWeight={950}>
              {title}
            </Typography>
          </Paper>

          {hints.map((hint) => (
            <Paper
              key={hint.id}
              variant="outlined"
              sx={{
                position: 'absolute',
                left: `${hint.x}%`,
                top: `${hint.y}%`,
                transform: 'translate(-50%, -50%)',
                maxWidth: 220,
                p: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 3
              }}
            >
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Chip size="small" label={hint.shortcut} sx={{ fontWeight: 950 }} />
                  <Typography variant="body2" fontWeight={900}>
                    {hint.label}
                  </Typography>
                </Stack>
                {hint.description ? (
                  <Typography variant="caption" color="text.secondary">
                    {hint.description}
                  </Typography>
                ) : null}
              </Stack>
            </Paper>
          ))}
        </Box>
      ) : null}
    </Box>
  )
}
