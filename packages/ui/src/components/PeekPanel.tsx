import { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactElement, ReactNode } from 'react'

export type PeekPanelTrigger = 'hover' | 'click' | 'both'

export type PeekPanelAction = {
  id: string
  label: ReactNode
  icon?: ReactNode
  onClick?: () => void
}

export type PeekPanelProps = Omit<BoxProps, 'title' | 'content' | 'onChange' | 'width'> & {
  children: ReactElement
  title?: ReactNode
  subtitle?: ReactNode
  content?: ReactNode
  preview?: ReactNode
  footer?: ReactNode
  actions?: PeekPanelAction[]
  trigger?: PeekPanelTrigger
  placement?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  defaultOpen?: boolean
  openDelay?: number
  closeDelay?: number
  width?: number
  onOpenChange?: (open: boolean) => void
}

export function PeekPanel({
  children,
  title,
  subtitle,
  content,
  preview,
  footer,
  actions = [],
  trigger = 'both',
  placement = 'bottom',
  open,
  defaultOpen = false,
  openDelay = 250,
  closeDelay = 150,
  width = 420,
  onOpenChange,
  sx,
  ...props
}: PeekPanelProps) {
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const clearTimers = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }
  }

  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  const show = () => {
    clearTimers()
    openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay)
  }

  const hide = () => {
    clearTimers()
    closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay)
  }

  const toggle = () => {
    clearTimers()
    setOpen(!isOpen)
  }

  return (
    <>
      <Box
        ref={setAnchorEl}
        component="span"
        onMouseEnter={() => {
          if (trigger === 'hover' || trigger === 'both') {
            show()
          }
        }}
        onMouseLeave={() => {
          if (trigger === 'hover' || trigger === 'both') {
            hide()
          }
        }}
        onClick={() => {
          if (trigger === 'click' || trigger === 'both') {
            toggle()
          }
        }}
        sx={{ display: 'inline-flex' }}
      >
        {children}
      </Box>

      <Popper
        open={isOpen && Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement={placement}
        modifiers={[
          { name: 'offset', options: { offset: [0, 12] } },
          { name: 'flip', enabled: true },
          { name: 'preventOverflow', options: { padding: 12 } }
        ]}
        sx={{ zIndex: 1500 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box
            onMouseEnter={clearTimers}
            onMouseLeave={trigger === 'hover' || trigger === 'both' ? hide : undefined}
            {...props}
            sx={[
              (theme) => ({
                width,
                maxWidth: 'calc(100vw - 24px)',
                overflow: 'hidden',
                borderRadius: 1.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: alpha(theme.palette.text.primary, 0.12),
                boxShadow: '0 28px 80px rgba(15,23,42,0.28)'
              }),
              ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
            ]}
          >
            <Box sx={(theme) => ({
              px: 1.5,
              py: 1.25,
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              borderBottom: '1px solid',
              borderColor: 'divider'
            })}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  {title ? <Typography noWrap fontWeight={950}>{title}</Typography> : null}
                  {subtitle ? <Typography noWrap variant="caption" color="text.secondary">{subtitle}</Typography> : null}
                </Box>
                <IconButton size="small" aria-label="Close peek panel" onClick={() => setOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {content ? (
              <Box sx={{ px: 1.5, py: 1.25 }}>
                {typeof content === 'string' ? <Typography variant="body2" color="text.secondary">{content}</Typography> : content}
              </Box>
            ) : null}

            {preview ? (
              <>
                {content ? <Divider /> : null}
                <Box sx={{ maxHeight: 280, overflow: 'auto', bgcolor: '#0f172a', color: '#e5e7eb' }}>
                  {preview}
                </Box>
              </>
            ) : null}

            {(actions.length || footer) ? (
              <>
                <Divider />
                <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1.25, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 120 }}>
                    {footer}
                  </Box>
                  {actions.map((action) => (
                    <Button
                      key={action.id}
                      size="small"
                      variant="outlined"
                      startIcon={action.icon ?? <OpenInNewIcon fontSize="small" />}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </>
            ) : null}
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
