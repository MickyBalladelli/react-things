import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'

export type ColorStudioTokenFormat = 'css' | 'json' | 'mui'

export type ColorStudioColor = {
  id: string
  name: string
  value: string
}

export type ColorStudioGradientStop = {
  id: string
  color: string
  position: number
}

export type ColorStudioProps = BoxProps & {
  initialColors?: ColorStudioColor[]
  initialGradientStops?: ColorStudioGradientStop[]
  tokenFormat?: ColorStudioTokenFormat
  onColorsChange?: (colors: ColorStudioColor[]) => void
  onGradientChange?: (stops: ColorStudioGradientStop[], gradient: string) => void
}

const defaultColors: ColorStudioColor[] = [
  { id: 'primary', name: 'Primary', value: '#2563eb' },
  { id: 'accent', name: 'Accent', value: '#db2777' },
  { id: 'success', name: 'Success', value: '#059669' },
  { id: 'surface', name: 'Surface', value: '#f8fafc' }
]

const defaultStops: ColorStudioGradientStop[] = [
  { id: 'start', color: '#2563eb', position: 0 },
  { id: 'end', color: '#db2777', position: 100 }
]

function cleanHex(value: string) {
  const hex = value.trim()

  if (/^#[0-9a-f]{6}$/i.test(hex)) {
    return hex.toLowerCase()
  }

  return '#000000'
}

function hexToRgb(value: string) {
  const hex = cleanHex(value).slice(1)

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}

function mixColor(first: string, second: string, amount: number) {
  const a = hexToRgb(first)
  const b = hexToRgb(second)

  return rgbToHex(
    a.r + (b.r - a.r) * amount,
    a.g + (b.g - a.g) * amount,
    a.b + (b.b - a.b) * amount
  )
}

function relativeLuminance(value: string) {
  const { r, g, b } = hexToRgb(value)
  const channels = [r, g, b].map((channel) => {
    const next = channel / 255

    return next <= 0.03928 ? next / 12.92 : ((next + 0.055) / 1.055) ** 2.4
  })

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastRatio(foreground: string, background: string) {
  const first = relativeLuminance(foreground)
  const second = relativeLuminance(background)
  const light = Math.max(first, second)
  const dark = Math.min(first, second)

  return (light + 0.05) / (dark + 0.05)
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'color'
}

function createGradient(stops: ColorStudioGradientStop[]) {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position)

  return `linear-gradient(90deg, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`
}

function createTokenOutput(colors: ColorStudioColor[], gradient: string, format: ColorStudioTokenFormat) {
  if (format === 'json') {
    return JSON.stringify({
      colors: Object.fromEntries(colors.map((color) => [slug(color.name), color.value])),
      gradients: {
        brand: gradient
      }
    }, null, 2)
  }

  if (format === 'mui') {
    return `const themeTokens = {
  palette: {
${colors.map((color) => `    ${slug(color.name)}: { main: '${color.value}' }`).join(',\n')}
  },
  gradients: {
    brand: '${gradient}'
  }
}`
  }

  return `:root {
${colors.map((color) => `  --color-${slug(color.name)}: ${color.value};`).join('\n')}
  --gradient-brand: ${gradient};
}`
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function ColorStudio({
  initialColors = defaultColors,
  initialGradientStops = defaultStops,
  tokenFormat = 'css',
  onColorsChange,
  onGradientChange,
  sx,
  ...props
}: ColorStudioProps) {
  const [colors, setColors] = useState(initialColors)
  const [gradientStops, setGradientStops] = useState(initialGradientStops)
  const [format, setFormat] = useState<ColorStudioTokenFormat>(tokenFormat)
  const [foregroundId, setForegroundId] = useState(initialColors[0]?.id ?? '')
  const [backgroundId, setBackgroundId] = useState(initialColors[3]?.id ?? initialColors[1]?.id ?? '')
  const foreground = colors.find((color) => color.id === foregroundId) ?? colors[0]
  const background = colors.find((color) => color.id === backgroundId) ?? colors[1] ?? colors[0]
  const gradient = useMemo(() => createGradient(gradientStops), [gradientStops])
  const contrast = foreground && background ? contrastRatio(foreground.value, background.value) : 1
  const tokenOutput = useMemo(() => createTokenOutput(colors, gradient, format), [colors, format, gradient])

  function updateColors(nextColors: ColorStudioColor[]) {
    setColors(nextColors)
    onColorsChange?.(nextColors)
  }

  function updateGradient(nextStops: ColorStudioGradientStop[]) {
    setGradientStops(nextStops)
    onGradientChange?.(nextStops, createGradient(nextStops))
  }

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(320px, 0.9fr) minmax(420px, 1.1fr)' },
          gap: 2
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={900}>Palette</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => updateColors([...colors, { id: createId('color'), name: `Color ${colors.length + 1}`, value: '#64748b' }])}
            >
              Add
            </Button>
          </Stack>

          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {colors.map((color) => (
              <Paper key={color.id} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box component="input" type="color" value={color.value} onChange={(event) => updateColors(colors.map((item) => item.id === color.id ? { ...item, value: event.target.value } : item))} sx={{ width: 40, height: 40, p: 0, border: 0, bgcolor: 'transparent' }} />
                  <TextField size="small" label="Name" value={color.name} onChange={(event) => updateColors(colors.map((item) => item.id === color.id ? { ...item, name: event.target.value } : item))} sx={{ flex: 1 }} />
                  <TextField size="small" label="Hex" value={color.value} onChange={(event) => updateColors(colors.map((item) => item.id === color.id ? { ...item, value: cleanHex(event.target.value) } : item))} sx={{ width: 120 }} />
                  <IconButton aria-label="Delete color" size="small" disabled={colors.length <= 2} onClick={() => updateColors(colors.filter((item) => item.id !== color.id))}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={900}>Contrast</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
            <TextField select size="small" label="Text" value={foreground?.id ?? ''} onChange={(event) => setForegroundId(event.target.value)} fullWidth>
              {colors.map((color) => <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Surface" value={background?.id ?? ''} onChange={(event) => setBackgroundId(event.target.value)} fullWidth>
              {colors.map((color) => <MenuItem key={color.id} value={color.id}>{color.name}</MenuItem>)}
            </TextField>
          </Stack>
          <Box sx={{ mt: 2, p: 2, borderRadius: 1, bgcolor: background?.value, color: foreground?.value, border: 1, borderColor: 'divider' }}>
            <Typography variant="h4" fontWeight={950}>Aa</Typography>
            <Typography fontWeight={800}>{contrast.toFixed(2)}:1</Typography>
            <Typography variant="body2">
              AA {contrast >= 4.5 ? 'pass' : 'fail'} · Large text {contrast >= 3 ? 'pass' : 'fail'} · AAA {contrast >= 7 ? 'pass' : 'fail'}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={900}>Gradient</Typography>
          <Box sx={{ mt: 2, height: 132, borderRadius: 1, border: 1, borderColor: 'divider', background: gradient }} />
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {gradientStops.map((stop) => (
              <Paper key={stop.id} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <TextField select size="small" label="Color" value={stop.color} onChange={(event) => updateGradient(gradientStops.map((item) => item.id === stop.id ? { ...item, color: event.target.value } : item))} sx={{ minWidth: 160 }}>
                    {colors.map((color) => <MenuItem key={color.id} value={color.value}>{color.name}</MenuItem>)}
                  </TextField>
                  <Slider value={stop.position} min={0} max={100} valueLabelDisplay="auto" onChange={(_, value) => updateGradient(gradientStops.map((item) => item.id === stop.id ? { ...item, position: Array.isArray(value) ? value[0] : value } : item))} sx={{ flex: 1 }} />
                  <IconButton aria-label="Delete gradient stop" size="small" disabled={gradientStops.length <= 2} onClick={() => updateGradient(gradientStops.filter((item) => item.id !== stop.id))}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ mt: 1.5 }}
            onClick={() => updateGradient([...gradientStops, { id: createId('stop'), color: mixColor(gradientStops[0]?.color ?? '#000000', gradientStops.at(-1)?.color ?? '#ffffff', 0.5), position: 50 }])}
          >
            Add stop
          </Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={900}>Tokens</Typography>
            <Stack direction="row" spacing={1}>
              <TextField select size="small" label="Format" value={format} onChange={(event) => setFormat(event.target.value as ColorStudioTokenFormat)} sx={{ width: 120 }}>
                <MenuItem value="css">CSS</MenuItem>
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="mui">MUI</MenuItem>
              </TextField>
              <IconButton aria-label="Copy tokens" onClick={() => navigator.clipboard?.writeText(tokenOutput)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
          <Box component="pre" sx={{ mt: 2, p: 2, minHeight: 220, overflow: 'auto', borderRadius: 1, bgcolor: '#111827', color: '#e5e7eb', fontSize: 13, lineHeight: 1.6 }}>
            {tokenOutput}
          </Box>
        </Paper>
      </Stack>
    </Box>
  )
}
