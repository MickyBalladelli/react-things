import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { DragEvent } from 'react'
import type { PaperProps } from '@mui/material/Paper'

export type FieldComposerType = 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'date'

export type FieldComposerField = {
  id: string
  label: string
  name: string
  type: FieldComposerType
  required?: boolean
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
}

export type FieldComposerProps = Omit<PaperProps, 'onChange'> & {
  fields?: FieldComposerField[]
  defaultFields?: FieldComposerField[]
  title?: string
  subtitle?: string
  onChange?: (fields: FieldComposerField[], schema: Record<string, unknown>, errors: string[]) => void
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function createField(type: FieldComposerType): FieldComposerField {
  const id = createId('field')

  return {
    id,
    label: type === 'email' ? 'Email' : `${type[0].toUpperCase()}${type.slice(1)} field`,
    name: `${type}_${id.split('-').at(-1)}`,
    type,
    required: false,
    placeholder: type === 'select' || type === 'checkbox' ? undefined : 'Enter value',
    options: type === 'select' ? ['Option A', 'Option B'] : undefined
  }
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [item] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, item)

  return nextItems
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase()
}

function validateFields(fields: FieldComposerField[]) {
  const errors: string[] = []
  const names = new Set<string>()

  fields.forEach((field) => {
    if (!field.label.trim()) {
      errors.push('Field label is required')
    }

    if (!field.name.trim()) {
      errors.push(`${field.label || 'Field'} needs a name`)
    }

    if (names.has(field.name)) {
      errors.push(`Duplicate field name: ${field.name}`)
    }

    names.add(field.name)

    if (field.type === 'select' && !field.options?.length) {
      errors.push(`${field.label} needs options`)
    }
  })

  return errors
}

function buildSchema(fields: FieldComposerField[]) {
  return {
    type: 'object',
    required: fields.filter((field) => field.required).map((field) => field.name),
    properties: fields.reduce<Record<string, unknown>>((properties, field) => {
      properties[field.name] = {
        type: field.type === 'number' ? 'number' : field.type === 'checkbox' ? 'boolean' : 'string',
        title: field.label,
        ...(field.placeholder ? { placeholder: field.placeholder } : {}),
        ...(field.type === 'select' ? { enum: field.options ?? [] } : {}),
        ...(field.min !== undefined ? { minimum: field.min } : {}),
        ...(field.max !== undefined ? { maximum: field.max } : {})
      }

      return properties
    }, {})
  }
}

export function FieldComposer({
  fields,
  defaultFields = [createField('text'), createField('email'), createField('select')],
  title = 'Field composer',
  subtitle = 'Drag fields, preview validation, and export JSON schema.',
  onChange,
  sx,
  ...props
}: FieldComposerProps) {
  const [internalFields, setInternalFields] = useState(defaultFields)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const activeFields = fields ?? internalFields
  const errors = useMemo(() => validateFields(activeFields), [activeFields])
  const schema = useMemo(() => buildSchema(activeFields), [activeFields])

  function commit(nextFields: FieldComposerField[]) {
    if (!fields) {
      setInternalFields(nextFields)
    }

    onChange?.(nextFields, buildSchema(nextFields), validateFields(nextFields))
  }

  function updateField(fieldId: string, updates: Partial<FieldComposerField>) {
    commit(activeFields.map((field) => field.id === fieldId ? { ...field, ...updates } : field))
  }

  function removeField(fieldId: string) {
    commit(activeFields.filter((field) => field.id !== fieldId))
  }

  function addField(type: FieldComposerType) {
    commit([...activeFields, createField(type)])
  }

  function handleDrop(event: DragEvent<HTMLElement>, targetId: string) {
    event.preventDefault()

    if (!draggedId || draggedId === targetId) {
      return
    }

    const fromIndex = activeFields.findIndex((field) => field.id === draggedId)
    const toIndex = activeFields.findIndex((field) => field.id === targetId)

    if (fromIndex >= 0 && toIndex >= 0) {
      commit(moveItem(activeFields, fromIndex, toIndex))
    }

    setDraggedId(null)
  }

  function renderPreviewField(field: FieldComposerField) {
    if (field.type === 'checkbox') {
      return <FormControlLabel control={<Checkbox />} label={field.label} />
    }

    return (
      <TextField
        fullWidth
        size="small"
        select={field.type === 'select'}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
        label={field.label}
        required={field.required}
        placeholder={field.placeholder}
        InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
      >
        {field.type === 'select' ? (field.options ?? []).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>) : null}
      </TextField>
    )
  }

  return (
    <Paper variant="outlined" {...props} sx={[{ borderRadius: 1, overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight={950}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" label={`${activeFields.length} fields`} />
            <Chip size="small" color={errors.length ? 'error' : 'success'} label={errors.length ? `${errors.length} issues` : 'Valid'} />
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, minHeight: 480 }}>
        <Box sx={{ p: 1.5, bgcolor: '#f8fafc' }}>
          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(['text', 'number', 'email', 'select', 'checkbox', 'date'] as FieldComposerType[]).map((type) => (
                <Button key={type} size="small" startIcon={<AddIcon />} onClick={() => addField(type)}>
                  {type}
                </Button>
              ))}
            </Stack>

            {activeFields.map((field) => (
              <Paper
                key={field.id}
                variant="outlined"
                draggable
                onDragStart={() => setDraggedId(field.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, field.id)}
                sx={{ p: 1.25, borderRadius: 1, opacity: draggedId === field.id ? 0.55 : 1 }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DragIndicatorIcon color="disabled" />
                    <TextField size="small" label="Label" value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} sx={{ flex: 1 }} />
                    <TextField size="small" label="Name" value={field.name} onChange={(event) => updateField(field.id, { name: normalizeName(event.target.value) })} sx={{ flex: 1 }} />
                    <TextField select size="small" label="Type" value={field.type} onChange={(event) => updateField(field.id, { type: event.target.value as FieldComposerType })} sx={{ width: 130 }}>
                      {(['text', 'number', 'email', 'select', 'checkbox', 'date'] as FieldComposerType[]).map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                    </TextField>
                    <Tooltip title="Remove field">
                      <IconButton onClick={() => removeField(field.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                    <TextField size="small" label="Placeholder" value={field.placeholder ?? ''} onChange={(event) => updateField(field.id, { placeholder: event.target.value })} sx={{ flex: 1 }} />
                    <TextField size="small" label="Options" value={(field.options ?? []).join(', ')} disabled={field.type !== 'select'} onChange={(event) => updateField(field.id, { options: event.target.value.split(',').map((option) => option.trim()).filter(Boolean) })} sx={{ flex: 1 }} />
                    <FormControlLabel control={<Checkbox checked={Boolean(field.required)} onChange={(event) => updateField(field.id, { required: event.target.checked })} />} label="Required" />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: 1.5, borderLeft: { lg: 1 }, borderTop: { xs: 1, lg: 0 }, borderColor: 'divider' }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="subtitle2" fontWeight={950}>Validation preview</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {activeFields.map((field) => <Box key={field.id}>{renderPreviewField(field)}</Box>)}
              </Stack>
              {errors.length ? (
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {errors.map((error, index) => <Typography key={`${error}-${index}`} variant="caption" color="error">{error}</Typography>)}
                </Stack>
              ) : null}
            </Box>
            <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1, bgcolor: '#0f172a', color: '#e5e7eb', maxHeight: 260, overflow: 'auto' }}>
              <Typography variant="caption" color="#94a3b8" fontWeight={900}>GENERATED JSON</Typography>
              <Box component="pre" sx={{ m: 0, mt: 1, fontSize: 12, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                {JSON.stringify(schema, null, 2)}
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Box>
    </Paper>
  )
}
