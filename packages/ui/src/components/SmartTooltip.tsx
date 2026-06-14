import { useRef, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactElement, ReactNode } from 'react'

export type SmartTooltipAction = {
  id: string
  label: string
  icon?: ReactNode
  onClick?: () => void
}

export type SmartTooltipProps = Omit<BoxProps, 'title' | 'content'> & {
  children: ReactElement
  title?: ReactNode
  content?: ReactNode
  media?: ReactNode
  actions?: SmartTooltipAction[]
  copyText?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  pinMode?: boolean
  defaultPinned?: boolean
  openDelay?: number
}

export function SmartTooltip({
  children,
  title,
  content,
  media,
  actions = [],
  copyText,
  placement = 'top',
  pinMode = true,
  defaultPinned = false,
  openDelay = 500,
  sx,
  ...props
}: SmartTooltipProps) {
  const closeTimerRef = useRef<number | null>(null)
  const openTimerRef = useRef<number | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(defaultPinned)
  const [pinned, setPinned] = useState(defaultPinned)
  const [copied, setCopied] = useState(false)

  function clearTimers() {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
    }

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
    }
  }

  function show() {
    clearTimers()

    if (open) {
      return
    }

    openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay)
  }

  function keepOpen() {
    clearTimers()
    setOpen(true)
  }

  function hide() {
    clearTimers()

    if (!pinned) {
      closeTimerRef.current = window.setTimeout(() => setOpen(false), 100)
    }
  }

  function togglePin() {
    const nextPinned = !pinned

    setPinned(nextPinned)
    setOpen(nextPinned || open)
  }

  async function copy() {
    if (!copyText) {
      return
    }

    await navigator.clipboard?.writeText(copyText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1100)
  }

  return (
    <>
      <Box
        component="span"
        ref={setAnchorEl}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => {
          if (pinMode) {
            setOpen(true)
            setPinned(true)
          }
        }}
        sx={{ display: 'inline-flex' }}
      >
        {children}
      </Box>

      <Popper
        open={open && Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement={placement}
        modifiers={[
          { name: 'offset', options: { offset: [0, 10] } },
          { name: 'preventOverflow', options: { padding: 12 } }
        ]}
        sx={{ zIndex: 1500 }}
      >
        <ClickAwayListener
          onClickAway={() => {
            if (pinned) {
              setOpen(false)
              setPinned(false)
            }
          }}
        >
          <Box
            onMouseEnter={keepOpen}
            onMouseLeave={hide}
            sx={{
              width: 320,
              maxWidth: 'calc(100vw - 24px)',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(15,23,42,0.28)',
              bgcolor: 'background.paper'
            }}
          >
            <Box {...props} sx={[{ p: 1.25 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
              <Stack spacing={1.25}>
                {media ? (
                  <Box sx={{ borderRadius: 1, overflow: 'hidden', bgcolor: '#e5e7eb' }}>
                    {media}
                  </Box>
                ) : null}

                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    {title ? <Typography fontWeight={900}>{title}</Typography> : null}
                    {content ? <Typography variant="body2" color="text.secondary" sx={{ mt: title ? 0.25 : 0 }}>{content}</Typography> : null}
                  </Box>
                  {pinMode ? (
                    <Tooltip title={pinned ? 'Unpin' : 'Pin'}>
                      <IconButton size="small" onClick={togglePin}>
                        {pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>

                {(copyText || actions.length) ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {copyText ? (
                      <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copy}>
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    ) : null}
                    {actions.map((action) => (
                      <Button key={action.id} size="small" variant="contained" startIcon={action.icon} onClick={action.onClick}>
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
