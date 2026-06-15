import CloseIcon from '@mui/icons-material/Close'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type BulkActionBarAction = {
  id: string
  label: ReactNode
  icon?: ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  disabled?: boolean
  hidden?: boolean
  overflow?: boolean
  onClick?: (selectedIds: string[]) => void
}

export type BulkActionBarProps = Omit<BoxProps, 'onSelect' | 'position'> & {
  selectedIds: string[]
  actions: BulkActionBarAction[]
  totalCount?: number
  label?: ReactNode
  maxPrimaryActions?: number
  position?: 'inline' | 'sticky' | 'floating'
  showClear?: boolean
  onClear?: () => void
}

const toneColors: Record<NonNullable<BulkActionBarAction['tone']>, string> = {
  default: '#64748b',
  primary: '#2563eb',
  success: '#059669',
  warning: '#d97706',
  danger: '#dc2626'
}

function getActionColor(action: BulkActionBarAction) {
  return toneColors[action.tone ?? 'default']
}

export function BulkActionBar({
  selectedIds,
  actions,
  totalCount,
  label,
  maxPrimaryActions = 3,
  position = 'inline',
  showClear = true,
  onClear,
  sx,
  ...props
}: BulkActionBarProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const visibleActions = useMemo(() => actions.filter((action) => !action.hidden), [actions])
  const primaryActions = visibleActions.filter((action) => !action.overflow).slice(0, maxPrimaryActions)
  const overflowActions = [
    ...visibleActions.filter((action) => action.overflow),
    ...visibleActions.filter((action) => !action.overflow).slice(maxPrimaryActions)
  ]
  const selectedCount = selectedIds.length
  const open = Boolean(anchorEl)

  if (!selectedCount) {
    return null
  }

  function runAction(action: BulkActionBarAction) {
    action.onClick?.(selectedIds)
    setAnchorEl(null)
  }

  return (
    <Box
      {...props}
      sx={[
        {
          borderRadius: 1,
          p: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: position === 'floating' ? '0 18px 42px rgba(15,23,42,0.16)' : undefined,
          position: position === 'sticky' ? 'sticky' : position === 'floating' ? 'fixed' : 'relative',
          bottom: position === 'floating' ? 18 : undefined,
          left: position === 'floating' ? '50%' : undefined,
          transform: position === 'floating' ? 'translateX(-50%)' : undefined,
          top: position === 'sticky' ? 12 : undefined,
          zIndex: position === 'inline' ? undefined : 20,
          width: position === 'floating' ? 'min(720px, calc(100vw - 32px))' : '100%'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Chip color="primary" label={selectedCount} />
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={950} noWrap>
              {label ?? `${selectedCount} selected`}
            </Typography>
            {totalCount !== undefined ? (
              <Typography variant="caption" color="text.secondary">
                {selectedCount} of {totalCount} items
              </Typography>
            ) : null}
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} flexWrap="wrap">
          {primaryActions.map((action) => {
            const color = getActionColor(action)

            return (
              <Button
                key={action.id}
                size="small"
                variant={action.tone === 'default' || !action.tone ? 'outlined' : 'contained'}
                disabled={action.disabled}
                startIcon={action.icon}
                onClick={() => runAction(action)}
                sx={{
                  bgcolor: action.tone && action.tone !== 'default' ? color : undefined,
                  borderColor: alpha(color, 0.45),
                  color: action.tone && action.tone !== 'default' ? '#fff' : color,
                  '&:hover': {
                    bgcolor: action.tone && action.tone !== 'default' ? color : alpha(color, 0.08),
                    borderColor: color
                  }
                }}
              >
                {action.label}
              </Button>
            )
          })}

          {overflowActions.length ? (
            <>
              <IconButton size="small" aria-label="More bulk actions" onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreHorizIcon fontSize="small" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                {overflowActions.map((action) => (
                  <MenuItem key={action.id} disabled={action.disabled} onClick={() => runAction(action)}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {action.icon}
                      <span>{action.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : null}

          {showClear ? (
            <IconButton size="small" aria-label="Clear selection" onClick={onClear}>
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  )
}
