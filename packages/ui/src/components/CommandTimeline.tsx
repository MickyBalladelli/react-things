import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import RedoOutlinedIcon from '@mui/icons-material/RedoOutlined'
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined'
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined'
import { alpha } from '@mui/material/styles'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'

export type CommandTimelineStatus = 'past' | 'current' | 'future'

export type CommandTimelineEntry = {
  id: string
  label: string
  description?: string
  timestamp?: string | number | Date
  actor?: string
  group?: string
  icon?: ReactNode
  color?: string
  data?: unknown
}

export type CommandTimelineChangeReason = 'undo' | 'redo' | 'jump' | 'reset'

export type CommandTimelineProps = Omit<PaperProps, 'onChange'> & {
  entries: CommandTimelineEntry[]
  currentId?: string
  defaultCurrentId?: string
  title?: ReactNode
  subtitle?: ReactNode
  orientation?: 'vertical' | 'horizontal'
  showControls?: boolean
  showMetadata?: boolean
  onChange?: (entry: CommandTimelineEntry, reason: CommandTimelineChangeReason) => void
  renderEntry?: (entry: CommandTimelineEntry, status: CommandTimelineStatus) => ReactNode
}

function formatTime(value?: string | number | Date) {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
}

function getCurrentIndex(entries: CommandTimelineEntry[], currentId?: string) {
  const foundIndex = entries.findIndex((entry) => entry.id === currentId)

  return foundIndex >= 0 ? foundIndex : Math.max(0, entries.length - 1)
}

function getStatus(index: number, currentIndex: number): CommandTimelineStatus {
  if (index < currentIndex) {
    return 'past'
  }

  if (index > currentIndex) {
    return 'future'
  }

  return 'current'
}

export function CommandTimeline({
  entries,
  currentId,
  defaultCurrentId,
  title = 'Command history',
  subtitle = 'Undo, redo, or jump to any saved state.',
  orientation = 'vertical',
  showControls = true,
  showMetadata = true,
  onChange,
  renderEntry,
  sx,
  ...props
}: CommandTimelineProps) {
  const [internalCurrentId, setInternalCurrentId] = useState(defaultCurrentId ?? entries.at(-1)?.id)
  const activeId = currentId ?? internalCurrentId
  const currentIndex = getCurrentIndex(entries, activeId)
  const currentEntry = entries[currentIndex]
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < entries.length - 1
  const pastCount = Math.max(0, currentIndex)
  const futureCount = Math.max(0, entries.length - currentIndex - 1)
  const groups = useMemo(() => {
    return entries.reduce<Record<string, CommandTimelineEntry[]>>((grouped, entry) => {
      const group = entry.group ?? 'History'

      return {
        ...grouped,
        [group]: [...(grouped[group] ?? []), entry]
      }
    }, {})
  }, [entries])

  function commit(entry: CommandTimelineEntry | undefined, reason: CommandTimelineChangeReason) {
    if (!entry) {
      return
    }

    if (currentId === undefined) {
      setInternalCurrentId(entry.id)
    }

    onChange?.(entry, reason)
  }

  function renderNode(entry: CommandTimelineEntry, index: number) {
    const status = getStatus(index, currentIndex)
    const selected = status === 'current'
    const color = entry.color ?? (selected ? '#2563eb' : status === 'past' ? '#059669' : '#94a3b8')
    const time = formatTime(entry.timestamp)

    return (
      <Box
        key={entry.id}
        component="button"
        type="button"
        onClick={() => commit(entry, 'jump')}
        sx={{
          border: 0,
          width: '100%',
          p: 0,
          bgcolor: 'transparent',
          color: 'inherit',
          textAlign: 'left',
          cursor: 'pointer'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: orientation === 'vertical' ? '28px minmax(0, 1fr)' : '1fr',
            gap: 1,
            alignItems: 'start'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
              width: 28,
              height: 28,
              mx: orientation === 'horizontal' ? 'auto' : 0
            }}
          >
            <Box
              sx={{
                width: selected ? 18 : 12,
                height: selected ? 18 : 12,
                borderRadius: 99,
                bgcolor: color,
                boxShadow: selected ? `0 0 0 5px ${alpha(color, 0.18)}` : 'none'
              }}
            />
          </Box>

          <Paper
            variant="outlined"
            sx={(theme) => ({
              p: 1.25,
              borderRadius: 1,
              borderColor: selected ? color : 'divider',
              bgcolor: selected
                ? alpha(color, theme.palette.mode === 'dark' ? 0.22 : 0.08)
                : status === 'future'
                  ? alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.06 : 0.03)
                  : 'background.paper',
              opacity: status === 'future' ? 0.74 : 1
            })}
          >
            {renderEntry ? renderEntry(entry, status) : (
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                    {entry.icon ? <Box sx={{ color, display: 'grid', placeItems: 'center' }}>{entry.icon}</Box> : null}
                    <Typography noWrap fontWeight={selected ? 950 : 850} sx={{ minWidth: 0 }}>
                      {entry.label}
                    </Typography>
                  </Stack>
                  <Chip size="small" label={status} color={selected ? 'primary' : 'default'} />
                </Stack>
                {entry.description ? (
                  <Typography variant="body2" color="text.secondary">
                    {entry.description}
                  </Typography>
                ) : null}
                {showMetadata && (entry.actor || time) ? (
                  <Typography variant="caption" color="text.secondary">
                    {[entry.actor, time].filter(Boolean).join(' · ')}
                  </Typography>
                ) : null}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    )
  }

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        {
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={950}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          {showControls ? (
            <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end">
              <Tooltip title="Undo">
                <span>
                  <IconButton size="small" disabled={!canUndo} onClick={() => commit(entries[currentIndex - 1], 'undo')} aria-label="Undo command">
                    <UndoOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Redo">
                <span>
                  <IconButton size="small" disabled={!canRedo} onClick={() => commit(entries[currentIndex + 1], 'redo')} aria-label="Redo command">
                    <RedoOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Jump to latest">
                <span>
                  <IconButton size="small" disabled={!canRedo} onClick={() => commit(entries.at(-1), 'reset')} aria-label="Jump to latest command">
                    <RestoreOutlinedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip size="small" label={`${entries.length} states`} />
          <Chip size="small" color="success" label={`${pastCount} undo`} />
          <Chip size="small" label={currentEntry?.label ?? 'No state'} />
          <Chip size="small" color="warning" label={`${futureCount} redo`} />
        </Stack>

        <Box
          sx={{
            position: 'relative',
            display: orientation === 'horizontal' ? 'grid' : 'block',
            gridAutoFlow: orientation === 'horizontal' ? 'column' : undefined,
            gridAutoColumns: orientation === 'horizontal' ? 'minmax(190px, 1fr)' : undefined,
            gap: orientation === 'horizontal' ? 1 : undefined,
            overflowX: orientation === 'horizontal' ? 'auto' : undefined,
            pb: orientation === 'horizontal' ? 0.5 : 0
          }}
        >
          {orientation === 'vertical' ? (
            <Box sx={{ position: 'absolute', left: 13, top: 8, bottom: 8, width: 2, bgcolor: 'divider' }} />
          ) : null}

          {Object.entries(groups).map(([group, groupEntries]) => (
            <Box key={group} sx={{ mb: orientation === 'vertical' ? 1.25 : 0, minWidth: 0 }}>
              {orientation === 'vertical' ? (
                <Typography variant="caption" color="text.secondary" fontWeight={950} sx={{ display: 'block', ml: 4.5, mb: 0.75, textTransform: 'uppercase' }}>
                  {group}
                </Typography>
              ) : null}
              <Stack spacing={1}>
                {groupEntries.map((entry) => renderNode(entry, entries.findIndex((item) => item.id === entry.id)))}
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  )
}
