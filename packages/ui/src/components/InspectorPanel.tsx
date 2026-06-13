import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'

export type InspectorPanelFieldOption = {
  label: string
  value: string | number
}

export type InspectorPanelField = {
  id: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color'
  value: string | number | boolean
  defaultValue?: string | number | boolean
  description?: string
  group?: string
  unit?: string
  min?: number
  max?: number
  step?: number
  options?: InspectorPanelFieldOption[]
  disabled?: boolean
}

export type InspectorPanelProps = {
  fields: InspectorPanelField[]
  onChange?: (id: string, value: string | number | boolean) => void
  title?: string
  description?: string
  density?: 'comfortable' | 'compact'
  showValueSummary?: boolean
  showReset?: boolean
  sx?: BoxProps['sx']
}

function formatFieldValue(field: InspectorPanelField) {
  if (field.type === 'boolean') {
    return field.value ? 'On' : 'Off'
  }

  return `${field.value}${field.unit ? ` ${field.unit}` : ''}`
}

function groupFields(fields: InspectorPanelField[]) {
  return fields.reduce<Record<string, InspectorPanelField[]>>((groups, field) => {
    const groupName = field.group ?? 'Settings'

    return {
      ...groups,
      [groupName]: [...(groups[groupName] ?? []), field]
    }
  }, {})
}

export function InspectorPanel({
  fields,
  onChange,
  title = 'Inspector',
  description,
  density = 'comfortable',
  showValueSummary = true,
  showReset = true,
  sx
}: InspectorPanelProps) {
  const groupedFields = groupFields(fields)
  const spacing = density === 'compact' ? 1.25 : 2
  const fieldSize = density === 'compact' ? 'small' : 'medium'

  function resetField(field: InspectorPanelField) {
    if (field.defaultValue !== undefined) {
      onChange?.(field.id, field.defaultValue)
    }
  }

  return (
    <Paper variant="outlined" sx={[{ p: density === 'compact' ? 1.5 : 2, borderRadius: 1 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Stack spacing={spacing}>
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle1" fontWeight={850}>
              {title}
            </Typography>
            {showValueSummary ? <Chip size="small" label={`${fields.length} fields`} /> : null}
          </Stack>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          ) : null}
        </Box>

        {Object.entries(groupedFields).map(([groupName, groupItems], groupIndex) => (
          <Stack key={groupName} spacing={spacing}>
            {groupIndex > 0 ? <Divider /> : null}
            <Typography variant="caption" color="text.secondary" fontWeight={850} sx={{ textTransform: 'uppercase' }}>
              {groupName}
            </Typography>

            {groupItems.map((field) => {
              const canReset = showReset && field.defaultValue !== undefined && field.defaultValue !== field.value

              if (field.type === 'boolean') {
                return (
                  <Box key={field.id}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={Boolean(field.value)}
                            disabled={field.disabled}
                            onChange={(event) => onChange?.(field.id, event.target.checked)}
                          />
                        )}
                        label={field.label}
                      />
                      {canReset ? <Button size="small" onClick={() => resetField(field)}>Reset</Button> : null}
                    </Stack>
                    {field.description ? (
                      <Typography variant="caption" color="text.secondary">
                        {field.description}
                      </Typography>
                    ) : null}
                  </Box>
                )
              }

              if (field.type === 'number') {
                return (
                  <Stack key={field.id} spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <TextField
                        fullWidth
                        size={fieldSize}
                        label={field.label}
                        type="number"
                        value={field.value}
                        helperText={field.description}
                        disabled={field.disabled}
                        inputProps={{
                          min: field.min,
                          max: field.max,
                          step: field.step
                        }}
                        onChange={(event) => onChange?.(field.id, Number(event.target.value))}
                      />
                      {field.unit ? <Chip label={field.unit} size="small" sx={{ mt: 1 }} /> : null}
                      {canReset ? <Button size="small" onClick={() => resetField(field)} sx={{ mt: 0.5 }}>Reset</Button> : null}
                    </Stack>
                    {field.min !== undefined || field.max !== undefined ? (
                      <Slider
                        value={Number(field.value)}
                        min={field.min ?? 0}
                        max={field.max ?? 100}
                        step={field.step ?? 1}
                        disabled={field.disabled}
                        valueLabelDisplay="auto"
                        onChange={(_, value) => onChange?.(field.id, Array.isArray(value) ? value[0] : value)}
                      />
                    ) : null}
                  </Stack>
                )
              }

              if (field.type === 'select') {
                return (
                  <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      select
                      fullWidth
                      size={fieldSize}
                      label={field.label}
                      value={field.value}
                      helperText={field.description}
                      disabled={field.disabled}
                      onChange={(event) => onChange?.(field.id, event.target.value)}
                    >
                      {(field.options ?? []).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    {canReset ? <Button size="small" onClick={() => resetField(field)} sx={{ mt: 0.5 }}>Reset</Button> : null}
                  </Stack>
                )
              }

              if (field.type === 'color') {
                return (
                  <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      size={fieldSize}
                      label={field.label}
                      value={field.value}
                      helperText={field.description}
                      disabled={field.disabled}
                      onChange={(event) => onChange?.(field.id, event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <Box
                            component="input"
                            type="color"
                            value={String(field.value)}
                            disabled={field.disabled}
                            onChange={(event) => onChange?.(field.id, event.target.value)}
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
                    {canReset ? <Button size="small" onClick={() => resetField(field)} sx={{ mt: 0.5 }}>Reset</Button> : null}
                  </Stack>
                )
              }

              return (
                <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
                  <TextField
                    fullWidth
                    size={fieldSize}
                    label={field.label}
                    value={field.value}
                    helperText={field.description}
                    disabled={field.disabled}
                    onChange={(event) => onChange?.(field.id, event.target.value)}
                  />
                  {canReset ? <Button size="small" onClick={() => resetField(field)} sx={{ mt: 0.5 }}>Reset</Button> : null}
                </Stack>
              )
            })}
          </Stack>
        ))}

        {showValueSummary ? (
          <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={850}>
              Current values
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
              {fields.map((field) => (
                <Chip key={field.id} size="small" label={`${field.label}: ${formatFieldValue(field)}`} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
