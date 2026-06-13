import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export type ColorPickerProps = {
  value: string
  alpha?: number
  swatches?: string[]
  showValue?: boolean
  onChange?: (value: string) => void
  onAlphaChange?: (alpha: number) => void
}

export function ColorPicker({
  value,
  alpha = 1,
  swatches = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#f59e0b', '#059669'],
  showValue = true,
  onChange,
  onAlphaChange
}: ColorPickerProps) {
  const alphaPercent = Math.round(alpha * 100)
  const rgbaValue = `${value}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
      <Stack spacing={2}>
        <Box
          sx={{
            height: 96,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
            backgroundSize: '18px 18px',
            backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0'
          }}
        >
          <Box sx={{ height: '100%', borderRadius: 1, bgcolor: value, opacity: alpha }} />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label="Color"
            type="color"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            sx={{ width: { xs: '100%', sm: 120 } }}
          />
          <TextField
            label="Hex"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            fullWidth
          />
        </Stack>

        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            Alpha
          </Typography>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={alpha}
            onChange={(_, next) => onAlphaChange?.(Array.isArray(next) ? next[0] : next)}
            valueLabelDisplay="auto"
            valueLabelFormat={(next) => `${Math.round(next * 100)}%`}
          />
          <TextField
            label="Alpha"
            type="number"
            value={alphaPercent}
            onChange={(event) => onAlphaChange?.(Math.min(Math.max(Number(event.target.value), 0), 100) / 100)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
            fullWidth
          />
        </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {swatches.map((swatch) => (
          <Box
            key={swatch}
            component="button"
            aria-label={swatch}
            onClick={() => onChange?.(swatch)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 2,
              borderColor: swatch.toLowerCase() === value.toLowerCase() ? 'text.primary' : 'divider',
              bgcolor: swatch,
              cursor: 'pointer'
            }}
          />
        ))}
      </Box>

        {showValue ? (
          <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: '#0f172a', color: '#e5e7eb' }}>
            <Typography variant="caption" color="#94a3b8">
              selected color
            </Typography>
            <Typography fontFamily="monospace">
              {rgbaValue}
            </Typography>
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
