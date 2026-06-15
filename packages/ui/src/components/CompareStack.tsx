import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import type { PaperProps } from '@mui/material/Paper'
import type { CSSProperties, ReactNode } from 'react'

export type CompareStackLayer = {
  id: string
  label: string
  content: ReactNode
  description?: string
  opacity?: number
  visible?: boolean
  color?: string
  blendMode?: CSSProperties['mixBlendMode']
}

export type CompareStackChange = {
  id: string
  opacity: number
  visible: boolean
}

export type CompareStackProps = Omit<PaperProps, 'onChange'> & {
  layers: CompareStackLayer[]
  title?: ReactNode
  subtitle?: ReactNode
  opacities?: Record<string, number>
  defaultOpacities?: Record<string, number>
  visibleLayers?: Record<string, boolean>
  defaultVisibleLayers?: Record<string, boolean>
  minHeight?: number
  showControls?: boolean
  showLegend?: boolean
  onChange?: (change: CompareStackChange, state: Record<string, CompareStackChange>) => void
}

function clampOpacity(value: number) {
  return Math.min(Math.max(value, 0), 100)
}

function createInitialOpacities(layers: CompareStackLayer[], defaults: Record<string, number>) {
  return layers.reduce<Record<string, number>>((nextOpacities, layer, index) => {
    nextOpacities[layer.id] = clampOpacity(defaults[layer.id] ?? layer.opacity ?? (index === 0 ? 100 : 72))
    return nextOpacities
  }, {})
}

function createInitialVisibility(layers: CompareStackLayer[], defaults: Record<string, boolean>) {
  return layers.reduce<Record<string, boolean>>((nextVisibility, layer) => {
    nextVisibility[layer.id] = defaults[layer.id] ?? layer.visible ?? true
    return nextVisibility
  }, {})
}

function buildState(layers: CompareStackLayer[], opacities: Record<string, number>, visible: Record<string, boolean>) {
  return layers.reduce<Record<string, CompareStackChange>>((state, layer) => {
    state[layer.id] = {
      id: layer.id,
      opacity: clampOpacity(opacities[layer.id] ?? layer.opacity ?? 100),
      visible: visible[layer.id] ?? layer.visible ?? true
    }
    return state
  }, {})
}

export function CompareStack({
  layers,
  title = 'Compare stack',
  subtitle = 'Blend multiple before and after layers.',
  opacities,
  defaultOpacities = {},
  visibleLayers,
  defaultVisibleLayers = {},
  minHeight = 340,
  showControls = true,
  showLegend = true,
  onChange,
  sx,
  ...props
}: CompareStackProps) {
  const [internalOpacities, setInternalOpacities] = useState(() => createInitialOpacities(layers, defaultOpacities))
  const [internalVisibleLayers, setInternalVisibleLayers] = useState(() => createInitialVisibility(layers, defaultVisibleLayers))
  const activeOpacities = opacities ?? internalOpacities
  const activeVisibleLayers = visibleLayers ?? internalVisibleLayers
  const state = useMemo(() => buildState(layers, activeOpacities, activeVisibleLayers), [activeOpacities, activeVisibleLayers, layers])
  const visibleCount = layers.filter((layer) => state[layer.id]?.visible).length

  function commitChange(id: string, nextOpacity: number, nextVisible: boolean) {
    const nextChange = {
      id,
      opacity: clampOpacity(nextOpacity),
      visible: nextVisible
    }
    const nextState = {
      ...state,
      [id]: nextChange
    }

    if (!opacities) {
      setInternalOpacities((current) => ({
        ...current,
        [id]: nextChange.opacity
      }))
    }

    if (!visibleLayers) {
      setInternalVisibleLayers((current) => ({
        ...current,
        [id]: nextChange.visible
      }))
    }

    onChange?.(nextChange, nextState)
  }

  function resetLayer(layer: CompareStackLayer, index: number) {
    const opacity = layer.opacity ?? (index === 0 ? 100 : 72)
    const visible = layer.visible ?? true
    commitChange(layer.id, opacity, visible)
  }

  return (
    <Paper
      variant="outlined"
      {...props}
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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
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
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip size="small" label={`${visibleCount}/${layers.length} visible`} />
            <Chip size="small" label={`${layers.length} layers`} />
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: showControls ? 'minmax(0, 1fr) 320px' : '1fr' }, minHeight }}>
        <Box
          sx={{
            position: 'relative',
            minHeight,
            overflow: 'hidden',
            bgcolor: '#0f172a',
            backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.08) 75%)',
            backgroundSize: '28px 28px',
            backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0'
          }}
        >
          {layers.map((layer, index) => {
            const layerState = state[layer.id]

            return (
              <Box
                key={layer.id}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: layerState.visible ? layerState.opacity / 100 : 0,
                  mixBlendMode: layer.blendMode,
                  transition: 'opacity 140ms ease',
                  zIndex: index + 1,
                  pointerEvents: 'none'
                }}
              >
                {layer.content}
              </Box>
            )
          })}

          {showLegend ? (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ position: 'absolute', left: 12, bottom: 12, zIndex: layers.length + 2 }}>
              {layers.map((layer) => (
                <Chip
                  key={layer.id}
                  size="small"
                  label={layer.label}
                  sx={{
                    bgcolor: layer.color ?? 'rgba(255,255,255,0.92)',
                    color: layer.color ? '#ffffff' : 'text.primary',
                    fontWeight: 900,
                    boxShadow: '0 10px 26px rgba(15,23,42,0.18)'
                  }}
                />
              ))}
            </Stack>
          ) : null}
        </Box>

        {showControls ? (
          <Box sx={{ p: 1.5, borderLeft: { lg: 1 }, borderTop: { xs: 1, lg: 0 }, borderColor: 'divider', bgcolor: '#f8fafc' }}>
            <Stack spacing={1.25}>
              {layers.map((layer, index) => {
                const layerState = state[layer.id]
                const color = layer.color ?? '#2563eb'

                return (
                  <Paper key={layer.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: 99, bgcolor: color, flex: '0 0 auto' }} />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography noWrap fontWeight={900}>
                              {layer.label}
                            </Typography>
                            {layer.description ? (
                              <Typography noWrap variant="caption" color="text.secondary">
                                {layer.description}
                              </Typography>
                            ) : null}
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={0.25} alignItems="center">
                          <Tooltip title={layerState.visible ? 'Hide layer' : 'Show layer'}>
                            <Switch
                              size="small"
                              checked={layerState.visible}
                              onChange={(event) => commitChange(layer.id, layerState.opacity, event.target.checked)}
                              inputProps={{ 'aria-label': `${layer.label} visibility` }}
                            />
                          </Tooltip>
                          <Tooltip title="Reset layer">
                            <IconButton size="small" onClick={() => resetLayer(layer, index)} aria-label={`Reset ${layer.label}`}>
                              <RestartAltOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={1.25} alignItems="center">
                        {layerState.visible ? <VisibilityOutlinedIcon fontSize="small" color="disabled" /> : <VisibilityOffOutlinedIcon fontSize="small" color="disabled" />}
                        <Slider
                          size="small"
                          value={layerState.opacity}
                          min={0}
                          max={100}
                          valueLabelDisplay="auto"
                          disabled={!layerState.visible}
                          onChange={(_, value) => commitChange(layer.id, Array.isArray(value) ? value[0] : value, layerState.visible)}
                          sx={{
                            color
                          }}
                        />
                        <Typography variant="caption" fontWeight={900} sx={{ width: 38, textAlign: 'right' }}>
                          {Math.round(layerState.opacity)}%
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Paper>
  )
}
