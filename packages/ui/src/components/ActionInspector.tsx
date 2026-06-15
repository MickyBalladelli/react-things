import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'

export type ActionInspectorAction = {
  id: string
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  tone?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  disabled?: boolean
}

export type ActionInspectorPropValue = string | number | boolean

export type ActionInspectorProp = {
  id: string
  label: string
  value: ActionInspectorPropValue
  type?: 'text' | 'number' | 'boolean' | 'select'
  options?: Array<{ label: string, value: string | number | boolean }>
  description?: ReactNode
  disabled?: boolean
}

export type ActionInspectorTarget = {
  id: string
  label: ReactNode
  description?: ReactNode
  meta?: ReactNode
  icon?: ReactNode
}

export type ActionInspectorProps = Omit<PaperProps, 'onChange'> & {
  target?: ActionInspectorTarget
  targets?: ActionInspectorTarget[]
  selectedTargetId?: string
  defaultTargetId?: string
  actions?: ActionInspectorAction[]
  getActions?: (target: ActionInspectorTarget) => ActionInspectorAction[]
  props?: ActionInspectorProp[]
  getProps?: (target: ActionInspectorTarget) => ActionInspectorProp[]
  title?: ReactNode
  searchPlaceholder?: string
  onAction?: (action: ActionInspectorAction, target: ActionInspectorTarget) => void
  onTargetChange?: (target: ActionInspectorTarget) => void
  onPropChange?: (prop: ActionInspectorProp, value: ActionInspectorPropValue, target: ActionInspectorTarget) => void
}

const actionColors = {
  default: 'inherit',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'error'
} as const

export function ActionInspector({
  target,
  targets,
  selectedTargetId,
  defaultTargetId,
  actions = [],
  getActions,
  props: fields = [],
  getProps,
  title = 'Action inspector',
  searchPlaceholder = 'Search objects',
  onAction,
  onTargetChange,
  onPropChange,
  sx,
  ...paperProps
}: ActionInspectorProps) {
  const [query, setQuery] = useState('')
  const allTargets = targets ?? (target ? [target] : [])
  const [internalTargetId, setInternalTargetId] = useState(defaultTargetId ?? selectedTargetId ?? allTargets[0]?.id)
  const activeTarget = allTargets.find((item) => item.id === (selectedTargetId ?? internalTargetId)) ?? allTargets[0]
  const activeActions = activeTarget ? (getActions?.(activeTarget) ?? actions) : actions
  const activeFields = activeTarget ? (getProps?.(activeTarget) ?? fields) : fields
  const filteredTargets = useMemo(() => {
    const normalized = query.toLowerCase().trim()

    return normalized
      ? allTargets.filter((item) => [item.label, item.description, item.meta, item.id].join(' ').toLowerCase().includes(normalized))
      : allTargets
  }, [allTargets, query])

  function selectTarget(nextTarget: ActionInspectorTarget) {
    if (selectedTargetId === undefined) {
      setInternalTargetId(nextTarget.id)
    }

    onTargetChange?.(nextTarget)
  }

  function renderField(field: ActionInspectorProp) {
    if (!activeTarget) {
      return null
    }

    if (field.type === 'boolean') {
      return (
        <Stack key={field.id} direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography fontWeight={850}>{field.label}</Typography>
            {field.description ? <Typography variant="caption" color="text.secondary">{field.description}</Typography> : null}
          </Box>
          <Switch checked={Boolean(field.value)} disabled={field.disabled} onChange={(event) => onPropChange?.(field, event.target.checked, activeTarget)} />
        </Stack>
      )
    }

    return (
      <TextField
        key={field.id}
        fullWidth
        size="small"
        select={field.type === 'select'}
        type={field.type === 'number' ? 'number' : 'text'}
        label={field.label}
        value={field.value}
        disabled={field.disabled}
        helperText={field.description}
        onChange={(event) => onPropChange?.(field, field.type === 'number' ? Number(event.target.value) : event.target.value, activeTarget)}
      >
        {field.type === 'select' ? (field.options ?? []).map((option) => (
          <MenuItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </MenuItem>
        )) : null}
      </TextField>
    )
  }

  return (
    <Paper
      variant="outlined"
      {...paperProps}
      sx={[
        {
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={900}>{title}</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
          {activeTarget?.icon ? <Box sx={{ display: 'grid', placeItems: 'center' }}>{activeTarget.icon}</Box> : null}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography noWrap fontWeight={950}>{activeTarget?.label ?? 'No target selected'}</Typography>
            {activeTarget?.description ? <Typography noWrap variant="body2" color="text.secondary">{activeTarget.description}</Typography> : null}
          </Box>
          {activeTarget?.meta ? <Chip size="small" label={activeTarget.meta} /> : null}
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.9fr 1fr' }, minHeight: 320 }}>
        <Box sx={{ p: 1.5, borderRight: { md: 1 }, borderBottom: { xs: 1, md: 0 }, borderColor: 'divider' }}>
          <TextField size="small" fullWidth label={searchPlaceholder} value={query} onChange={(event) => setQuery(event.target.value)} />
          <Stack spacing={1} sx={{ mt: 1.25 }}>
            {filteredTargets.map((item) => {
              const selected = item.id === activeTarget?.id

              return (
                <Paper
                  key={item.id}
                  component="button"
                  variant="outlined"
                  onClick={() => selectTarget(item)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    textAlign: 'left',
                    bgcolor: selected ? 'action.selected' : 'background.paper',
                    borderColor: selected ? 'primary.main' : 'divider',
                    color: 'text.primary',
                    cursor: 'pointer'
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.icon ? <Box sx={{ display: 'grid', placeItems: 'center' }}>{item.icon}</Box> : null}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography noWrap fontWeight={900}>{item.label}</Typography>
                      {item.description ? <Typography noWrap variant="caption" color="text.secondary">{item.description}</Typography> : null}
                    </Box>
                    {item.meta ? <Chip size="small" label={item.meta} /> : null}
                  </Stack>
                </Paper>
              )
            })}
          </Stack>
        </Box>

        <Box sx={{ p: 1.5, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" fontWeight={950}>Actions</Typography>
          <Stack direction="row" spacing={1} rowGap={1} flexWrap="wrap" sx={{ mt: 1.25, mb: 2 }}>
            {activeActions.map((action) => (
              <Button
                key={action.id}
                variant={action.tone === 'primary' ? 'contained' : 'outlined'}
                color={actionColors[action.tone ?? 'default']}
                startIcon={action.icon}
                disabled={action.disabled}
                onClick={() => activeTarget && onAction?.(action, activeTarget)}
              >
                {action.label}
              </Button>
            ))}
          </Stack>

          <Typography variant="subtitle2" fontWeight={950}>Properties</Typography>
          <Divider sx={{ my: 1.25 }} />
          <Stack spacing={1.25}>
            {activeFields.length ? activeFields.map(renderField) : <Typography color="text.secondary">No editable properties.</Typography>}
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
