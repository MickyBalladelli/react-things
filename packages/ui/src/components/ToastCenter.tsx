import { useEffect, useMemo, useState } from 'react'
import ArchiveIcon from '@mui/icons-material/Archive'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import HistoryIcon from '@mui/icons-material/History'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type ToastCenterTone = 'info' | 'success' | 'warning' | 'error'

export type ToastCenterAction = {
  id: string
  label: string
  onClick?: () => void
}

export type ToastCenterToast = {
  id: string
  title: ReactNode
  message?: ReactNode
  tone?: ToastCenterTone
  group?: string
  timestamp?: number
  actions?: ToastCenterAction[]
  autoHideDuration?: number
}

export type ToastCenterProps = BoxProps & {
  toasts?: ToastCenterToast[]
  defaultToasts?: ToastCenterToast[]
  maxVisible?: number
  groupToasts?: boolean
  historyTitle?: ReactNode
  onToastsChange?: (toasts: ToastCenterToast[]) => void
  onDismiss?: (toast: ToastCenterToast) => void
}

const toneStyles: Record<ToastCenterTone, { color: string, bg: string, icon: ReactNode }> = {
  info: { color: '#2563eb', bg: '#eff6ff', icon: <InfoIcon fontSize="small" /> },
  success: { color: '#059669', bg: '#ecfdf5', icon: <CheckCircleIcon fontSize="small" /> },
  warning: { color: '#d97706', bg: '#fffbeb', icon: <WarningIcon fontSize="small" /> },
  error: { color: '#dc2626', bg: '#fef2f2', icon: <ErrorIcon fontSize="small" /> }
}

function now() {
  return Date.now()
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(timestamp)
}

function groupKey(toast: ToastCenterToast) {
  return toast.group ?? String(toast.title)
}

function groupVisibleToasts(toasts: ToastCenterToast[], groupToasts: boolean) {
  if (!groupToasts) {
    return toasts.map((toast) => ({ key: toast.id, toast, count: 1, items: [toast] }))
  }

  const groups = new Map<string, ToastCenterToast[]>()

  toasts.forEach((toast) => {
    const key = groupKey(toast)
    groups.set(key, [...(groups.get(key) ?? []), toast])
  })

  return [...groups.entries()].map(([key, items]) => ({
    key,
    toast: items[items.length - 1],
    count: items.length,
    items
  }))
}

function ToastCard({
  toast,
  count,
  onDismiss
}: {
  toast: ToastCenterToast
  count?: number
  onDismiss?: () => void
}) {
  const tone = toast.tone ?? 'info'
  const style = toneStyles[tone]

  return (
    <Paper
      variant="outlined"
      sx={{
        width: 360,
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: '0 18px 42px rgba(15,23,42,0.16)',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 1.25, p: 1.5 }}>
        <Box sx={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 1, color: style.color, bgcolor: style.bg }}>
          {style.icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={900} noWrap>{toast.title}</Typography>
            {count && count > 1 ? <Chip size="small" label={count} /> : null}
          </Stack>
          {toast.message ? <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{toast.message}</Typography> : null}
          {toast.actions?.length ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {toast.actions.map((action) => (
                <Button key={action.id} size="small" variant="outlined" onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </Stack>
          ) : null}
        </Box>
        <IconButton aria-label="Dismiss notification" size="small" onClick={onDismiss} sx={{ alignSelf: 'start' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}

export function ToastCenter({
  toasts: controlledToasts,
  defaultToasts = [],
  maxVisible = 4,
  groupToasts = true,
  historyTitle = 'Notification history',
  onToastsChange,
  onDismiss,
  sx,
  ...props
}: ToastCenterProps) {
  const [internalToasts, setInternalToasts] = useState<ToastCenterToast[]>(() => defaultToasts.map((toast) => ({ ...toast, timestamp: toast.timestamp ?? now() })))
  const [history, setHistory] = useState<ToastCenterToast[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const toasts = controlledToasts ?? internalToasts
  const visibleToasts = toasts.slice(0, maxVisible)
  const groupedToasts = useMemo(() => groupVisibleToasts(visibleToasts, groupToasts), [groupToasts, visibleToasts])
  const hiddenCount = Math.max(0, toasts.length - visibleToasts.length)

  useEffect(() => {
    const timers = toasts
      .filter((toast) => toast.autoHideDuration && toast.autoHideDuration > 0)
      .map((toast) => window.setTimeout(() => dismissToast(toast.id), toast.autoHideDuration))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [toasts])

  function commitToasts(nextToasts: ToastCenterToast[]) {
    if (controlledToasts === undefined) {
      setInternalToasts(nextToasts)
    }

    onToastsChange?.(nextToasts)
  }

  function dismissToast(id: string) {
    const dismissed = toasts.find((toast) => toast.id === id)

    if (!dismissed) {
      return
    }

    commitToasts(toasts.filter((toast) => toast.id !== id))
    setHistory((items) => [{ ...dismissed, timestamp: dismissed.timestamp ?? now() }, ...items])
    onDismiss?.(dismissed)
  }

  function dismissGroup(items: ToastCenterToast[]) {
    const ids = new Set(items.map((toast) => toast.id))

    commitToasts(toasts.filter((toast) => !ids.has(toast.id)))
    setHistory((currentHistory) => [
      ...items.map((toast) => ({ ...toast, timestamp: toast.timestamp ?? now() })).reverse(),
      ...currentHistory
    ])
    items.forEach((toast) => onDismiss?.(toast))
  }

  return (
    <>
      <Box
        {...props}
        sx={[
          {
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: 1600,
            display: 'grid',
            justifyItems: 'end',
            gap: 1
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
        ]}
      >
        <Stack spacing={1} alignItems="flex-end">
          {groupedToasts.map((group) => (
            <ToastCard
              key={group.key}
              toast={group.toast}
              count={group.count}
              onDismiss={() => dismissGroup(group.items)}
            />
          ))}
          {hiddenCount ? (
            <Paper variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
              <Typography variant="body2" color="text.secondary">+{hiddenCount} more</Typography>
            </Paper>
          ) : null}
        </Stack>

        <Badge badgeContent={history.length} color="primary">
          <Button
            size="small"
            variant="contained"
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryOpen(true)}
          >
            History
          </Button>
        </Badge>
      </Box>

      <Drawer anchor="right" open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <Box sx={{ width: 360, maxWidth: '100vw', p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={900}>{historyTitle}</Typography>
            <IconButton aria-label="Close history" onClick={() => setHistoryOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 2 }} />
          {history.length ? (
            <Stack spacing={1.25}>
              {history.map((toast) => {
                const tone = toast.tone ?? 'info'
                const style = toneStyles[tone]

                return (
                  <Paper key={`${toast.id}-${toast.timestamp}`} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Box sx={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 1, color: style.color, bgcolor: style.bg }}>
                        {style.icon}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography fontWeight={850}>{toast.title}</Typography>
                        {toast.message ? <Typography variant="body2" color="text.secondary">{toast.message}</Typography> : null}
                        <Typography variant="caption" color="text.secondary">{formatTime(toast.timestamp ?? now())}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          ) : (
            <Box sx={{ minHeight: 180, display: 'grid', placeItems: 'center', color: 'text.secondary' }}>
              <Stack spacing={1} alignItems="center">
                <ArchiveIcon />
                <Typography>No history yet</Typography>
              </Stack>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}
