import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CompressOutlinedIcon from '@mui/icons-material/CompressOutlined'
import ExpandOutlinedIcon from '@mui/icons-material/ExpandOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined'
import { alpha } from '@mui/material/styles'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'

export type DensityControllerValue = 'compact' | 'cozy' | 'spacious'

export type DensityControllerOption = {
  value: DensityControllerValue
  label: string
  description: string
  scale: number
  icon: ReactNode
}

export type DensityControllerRenderState = {
  density: DensityControllerValue
  option: DensityControllerOption
  spacing: number
  padding: number
  radius: number
  rowHeight: number
}

export type DensityControllerProps = Omit<PaperProps, 'children' | 'onChange'> & {
  value?: DensityControllerValue
  defaultValue?: DensityControllerValue
  persistKey?: string
  title?: ReactNode
  subtitle?: ReactNode
  showSummary?: boolean
  showReset?: boolean
  children?: ReactNode | ((state: DensityControllerRenderState) => ReactNode)
  onChange?: (density: DensityControllerValue, state: DensityControllerRenderState) => void
}

const densityOptions: DensityControllerOption[] = [
  {
    value: 'compact',
    label: 'Compact',
    description: 'More rows, tighter controls',
    scale: 0.78,
    icon: <CompressOutlinedIcon fontSize="small" />
  },
  {
    value: 'cozy',
    label: 'Cozy',
    description: 'Balanced daily default',
    scale: 1,
    icon: <UnfoldMoreOutlinedIcon fontSize="small" />
  },
  {
    value: 'spacious',
    label: 'Spacious',
    description: 'More air, touch friendly',
    scale: 1.24,
    icon: <ExpandOutlinedIcon fontSize="small" />
  }
]

function isDensity(value: string | null): value is DensityControllerValue {
  return value === 'compact' || value === 'cozy' || value === 'spacious'
}

function readStoredDensity(persistKey?: string) {
  if (!persistKey || typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(persistKey)
  } catch {
    return null
  }
}

function writeStoredDensity(persistKey: string | undefined, density: DensityControllerValue) {
  if (!persistKey || typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(persistKey, density)
  } catch {
    return
  }
}

function removeStoredDensity(persistKey?: string) {
  if (!persistKey || typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(persistKey)
  } catch {
    return
  }
}

function getOption(value: DensityControllerValue) {
  return densityOptions.find((option) => option.value === value) ?? densityOptions[1]
}

function createDensityState(density: DensityControllerValue): DensityControllerRenderState {
  const option = getOption(density)

  return {
    density,
    option,
    spacing: Math.round(12 * option.scale),
    padding: Math.round(16 * option.scale),
    radius: Math.round(8 * option.scale),
    rowHeight: Math.round(46 * option.scale)
  }
}

export function DensityController({
  value,
  defaultValue = 'cozy',
  persistKey,
  title = 'Density',
  subtitle = 'Choose how much space this layout uses.',
  showSummary = true,
  showReset = true,
  children,
  onChange,
  sx,
  ...props
}: DensityControllerProps) {
  const [internalDensity, setInternalDensity] = useState<DensityControllerValue>(() => {
    const stored = readStoredDensity(persistKey)

    return isDensity(stored) ? stored : defaultValue
  })
  const density = value ?? internalDensity
  const state = useMemo(() => createDensityState(density), [density])

  useEffect(() => {
    writeStoredDensity(persistKey, density)
  }, [density, persistKey])

  function setDensity(nextDensity: DensityControllerValue) {
    const nextState = createDensityState(nextDensity)

    if (value === undefined) {
      setInternalDensity(nextDensity)
    }

    writeStoredDensity(persistKey, nextDensity)

    onChange?.(nextDensity, nextState)
  }

  function resetDensity() {
    removeStoredDensity(persistKey)

    setDensity(defaultValue)
  }

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        {
          p: state.padding / 8,
          borderRadius: 1,
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack spacing={state.spacing / 8}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={950}>
                {title}
              </Typography>
              {showSummary ? (
                <Chip size="small" label={`${state.option.label} layout`} />
              ) : null}
            </Stack>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <ButtonGroup size="small" variant="outlined" aria-label="Choose layout density">
              {densityOptions.map((option) => {
                const selected = option.value === density

                return (
                  <Tooltip key={option.value} title={option.description}>
                    <Button
                      startIcon={option.icon}
                      variant={selected ? 'contained' : 'outlined'}
                      onClick={() => setDensity(option.value)}
                      aria-pressed={selected}
                      sx={{
                        px: { xs: 1, sm: 1.25 },
                        minWidth: { xs: 42, sm: 106 },
                        color: selected ? 'primary.contrastText' : 'text.primary',
                        bgcolor: selected ? 'primary.main' : 'background.paper',
                        '& .MuiButton-startIcon': {
                          mr: { xs: 0, sm: 0.75 }
                        }
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        {option.label}
                      </Box>
                    </Button>
                  </Tooltip>
                )
              })}
            </ButtonGroup>

            {showReset ? (
              <Tooltip title="Reset density">
                <Button
                  size="small"
                  variant="text"
                  onClick={resetDensity}
                  aria-label="Reset density"
                  sx={{ minWidth: 34, px: 1 }}
                >
                  <RestartAltOutlinedIcon fontSize="small" />
                </Button>
              </Tooltip>
            ) : null}
          </Stack>
        </Stack>

        {children ? (
          <Box
            data-density={density}
            sx={{
              '--rt-density-scale': state.option.scale,
              '--rt-density-spacing': `${state.spacing}px`,
              '--rt-density-padding': `${state.padding}px`,
              '--rt-density-radius': `${state.radius}px`,
              '--rt-density-row-height': `${state.rowHeight}px`,
              p: state.padding / 8,
              borderRadius: `${state.radius}px`,
              bgcolor: alpha('#64748b', 0.06),
              transition: 'padding 160ms ease, border-radius 160ms ease'
            }}
          >
            {typeof children === 'function' ? children(state) : children}
          </Box>
        ) : null}
      </Stack>
    </Paper>
  )
}
