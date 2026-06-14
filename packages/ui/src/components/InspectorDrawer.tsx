import { useMemo, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import UndoIcon from '@mui/icons-material/Undo'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { DrawerProps } from '@mui/material/Drawer'
import type { ReactNode } from 'react'

export type InspectorDrawerFieldOption = {
  label: string
  value: string | number
}

export type InspectorDrawerFieldValue = string | number | boolean

export type InspectorDrawerField = {
  id: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color'
  value: InspectorDrawerFieldValue
  defaultValue?: InspectorDrawerFieldValue
  description?: string
  unit?: string
  min?: number
  max?: number
  step?: number
  options?: InspectorDrawerFieldOption[]
  disabled?: boolean
  validate?: (value: InspectorDrawerFieldValue, fields: InspectorDrawerField[]) => string | null | undefined
}

export type InspectorDrawerSection = {
  id: string
  title: ReactNode
  description?: ReactNode
  fields: InspectorDrawerField[]
}

export type InspectorDrawerChange = {
  fieldId: string
  value: InspectorDrawerFieldValue
  previousValue: InspectorDrawerFieldValue
}

export type InspectorDrawerProps = Omit<DrawerProps, 'children' | 'onChange'> & {
  sections: InspectorDrawerSection[]
  title?: ReactNode
  subtitle?: ReactNode
  width?: number
  density?: 'comfortable' | 'compact'
  showUndo?: boolean
  onFieldChange?: (change: InspectorDrawerChange) => void
  onSectionsChange?: (sections: InspectorDrawerSection[]) => void
}

function getAllFields(sections: InspectorDrawerSection[]) {
  return sections.flatMap((section) => section.fields)
}

function getErrors(sections: InspectorDrawerSection[]) {
  const fields = getAllFields(sections)

  return fields.reduce<Record<string, string>>((errors, field) => {
    const error = field.validate?.(field.value, fields)

    if (error) {
      errors[field.id] = error
    }

    return errors
  }, {})
}

function updateField(sections: InspectorDrawerSection[], fieldId: string, value: InspectorDrawerFieldValue) {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => field.id === fieldId ? { ...field, value } : field)
  }))
}

function findField(sections: InspectorDrawerSection[], fieldId: string) {
  return getAllFields(sections).find((field) => field.id === fieldId)
}

export function InspectorDrawer({
  sections,
  title = 'Inspector',
  subtitle,
  width = 380,
  density = 'comfortable',
  showUndo = true,
  onFieldChange,
  onSectionsChange,
  PaperProps,
  ...props
}: InspectorDrawerProps) {
  const [internalSections, setInternalSections] = useState(sections)
  const historyRef = useRef<InspectorDrawerChange[]>([])
  const activeSections = onSectionsChange ? sections : internalSections
  const errors = useMemo(() => getErrors(activeSections), [activeSections])
  const errorCount = Object.keys(errors).length
  const compact = density === 'compact'

  function commitField(fieldId: string, value: InspectorDrawerFieldValue) {
    const field = findField(activeSections, fieldId)

    if (!field || field.value === value) {
      return
    }

    const change = { fieldId, value, previousValue: field.value }
    const nextSections = updateField(activeSections, fieldId, value)

    historyRef.current = [...historyRef.current, change].slice(-40)
    setInternalSections(nextSections)
    onSectionsChange?.(nextSections)
    onFieldChange?.(change)
  }

  function undo() {
    const change = historyRef.current.at(-1)

    if (!change) {
      return
    }

    historyRef.current = historyRef.current.slice(0, -1)
    const nextSections = updateField(activeSections, change.fieldId, change.previousValue)

    setInternalSections(nextSections)
    onSectionsChange?.(nextSections)
    onFieldChange?.({ fieldId: change.fieldId, value: change.previousValue, previousValue: change.value })
  }

  function renderField(field: InspectorDrawerField) {
    const error = errors[field.id]
    const size = compact ? 'small' : 'medium'

    if (field.type === 'boolean') {
      return (
        <Box key={field.id}>
          <FormControlLabel
            control={(
              <Switch
                checked={Boolean(field.value)}
                disabled={field.disabled}
                onChange={(event) => commitField(field.id, event.target.checked)}
              />
            )}
            label={field.label}
          />
          <Typography variant="caption" color={error ? 'error' : 'text.secondary'}>
            {error ?? field.description}
          </Typography>
        </Box>
      )
    }

    if (field.type === 'number') {
      return (
        <Stack key={field.id} spacing={1}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              size={size}
              label={field.label}
              type="number"
              value={field.value}
              error={Boolean(error)}
              helperText={error ?? field.description}
              disabled={field.disabled}
              inputProps={{ min: field.min, max: field.max, step: field.step }}
              onChange={(event) => commitField(field.id, Number(event.target.value))}
            />
            {field.unit ? <Chip label={field.unit} size="small" sx={{ mt: 1 }} /> : null}
          </Stack>
          {field.min !== undefined || field.max !== undefined ? (
            <Slider
              value={Number(field.value)}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              disabled={field.disabled}
              valueLabelDisplay="auto"
              onChange={(_, value) => commitField(field.id, Array.isArray(value) ? value[0] : value)}
            />
          ) : null}
        </Stack>
      )
    }

    if (field.type === 'select') {
      return (
        <TextField
          key={field.id}
          select
          fullWidth
          size={size}
          label={field.label}
          value={field.value}
          error={Boolean(error)}
          helperText={error ?? field.description}
          disabled={field.disabled}
          onChange={(event) => commitField(field.id, event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )
    }

    if (field.type === 'color') {
      return (
        <TextField
          key={field.id}
          fullWidth
          size={size}
          label={field.label}
          value={field.value}
          error={Boolean(error)}
          helperText={error ?? field.description}
          disabled={field.disabled}
          onChange={(event) => commitField(field.id, event.target.value)}
          InputProps={{
            startAdornment: (
              <Box
                component="input"
                type="color"
                value={String(field.value)}
                disabled={field.disabled}
                onChange={(event) => commitField(field.id, event.target.value)}
                sx={{
                  width: 28,
                  height: 28,
                  p: 0,
                  mr: 1,
                  border: 0,
                  bgcolor: 'transparent',
                  cursor: field.disabled ? 'default' : 'pointer'
                }}
              />
            )
          }}
        />
      )
    }

    return (
      <TextField
        key={field.id}
        fullWidth
        size={size}
        label={field.label}
        value={field.value}
        error={Boolean(error)}
        helperText={error ?? field.description}
        disabled={field.disabled}
        onChange={(event) => commitField(field.id, event.target.value)}
      />
    )
  }

  return (
    <Drawer
      anchor="right"
      {...props}
      PaperProps={{
        ...PaperProps,
        sx: [
          {
            width: { xs: '100%', sm: width },
            maxWidth: '100%',
            bgcolor: '#f8fafc'
          },
          ...(Array.isArray(PaperProps?.sx) ? PaperProps.sx : PaperProps?.sx ? [PaperProps.sx] : [])
        ]
      }}
    >
      <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
        <Box sx={{ p: compact ? 1.5 : 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={950}>{title}</Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
              ) : null}
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              {errorCount ? <Chip size="small" color="error" label={`${errorCount} errors`} /> : <Chip size="small" color="success" label="Valid" />}
              {showUndo ? (
                <IconButton size="small" aria-label="Undo inspector change" onClick={undo} disabled={!historyRef.current.length}>
                  <UndoIcon fontSize="small" />
                </IconButton>
              ) : null}
              {props.onClose ? (
                <IconButton size="small" aria-label="Close inspector" onClick={(event) => props.onClose?.(event, 'backdropClick')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ minHeight: 0, overflow: 'auto', p: compact ? 1.5 : 2 }}>
          <Stack spacing={compact ? 1.5 : 2}>
            {activeSections.map((section) => (
              <Box key={section.id} sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ p: compact ? 1.25 : 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={950}>{section.title}</Typography>
                  {section.description ? (
                    <Typography variant="caption" color="text.secondary">{section.description}</Typography>
                  ) : null}
                </Box>
                <Divider />
                <Stack spacing={compact ? 1.25 : 1.75} sx={{ p: compact ? 1.25 : 1.5 }}>
                  {section.fields.map((field) => renderField(field))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: compact ? 1.5 : 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {getAllFields(activeSections).length} properties
            </Typography>
            <Button size="small" variant="outlined" onClick={undo} disabled={!showUndo || !historyRef.current.length}>
              Undo
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
