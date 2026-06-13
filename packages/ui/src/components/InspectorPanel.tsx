import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

export type InspectorPanelField = {
  id: string
  label: string
  type: 'text' | 'number' | 'boolean'
  value: string | number | boolean
  min?: number
  max?: number
}

export type InspectorPanelProps = {
  fields: InspectorPanelField[]
  onChange?: (id: string, value: string | number | boolean) => void
}

export function InspectorPanel({ fields, onChange }: InspectorPanelProps) {
  return (
    <Stack spacing={2}>
      {fields.map((field) => {
        if (field.type === 'boolean') {
          return (
            <FormControlLabel
              key={field.id}
              control={<Checkbox checked={Boolean(field.value)} onChange={(event) => onChange?.(field.id, event.target.checked)} />}
              label={field.label}
            />
          )
        }

        if (field.type === 'number') {
          return (
            <Stack key={field.id} spacing={1}>
              <TextField label={field.label} type="number" value={field.value} onChange={(event) => onChange?.(field.id, Number(event.target.value))} />
              <Slider value={Number(field.value)} min={field.min ?? 0} max={field.max ?? 100} onChange={(_, value) => onChange?.(field.id, Array.isArray(value) ? value[0] : value)} />
            </Stack>
          )
        }

        return (
          <TextField key={field.id} label={field.label} value={field.value} onChange={(event) => onChange?.(field.id, event.target.value)} />
        )
      })}
    </Stack>
  )
}
