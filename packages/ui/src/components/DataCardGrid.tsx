import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type DataCardGridStatus = 'neutral' | 'good' | 'warning' | 'danger'

export type DataCardGridMetric = {
  id: string
  label: string
  value: number | string
  previousValue?: number
  delta?: number
  helper?: string
  unit?: string
  color?: string
  status?: DataCardGridStatus
  progress?: number
  trend?: number[]
  icon?: ReactNode
  formatter?: (value: number | string) => string
}

export type DataCardGridProps = BoxProps & {
  metrics: DataCardGridMetric[]
  title?: string
  subtitle?: string
  columns?: number
  density?: 'comfortable' | 'compact'
  showSparklines?: boolean
  showProgress?: boolean
}

const statusColors: Record<DataCardGridStatus, string> = {
  neutral: '#64748b',
  good: '#059669',
  warning: '#d97706',
  danger: '#dc2626'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getMetricColor(metric: DataCardGridMetric) {
  return metric.color ?? statusColors[metric.status ?? 'neutral']
}

function getDelta(metric: DataCardGridMetric) {
  if (typeof metric.delta === 'number') {
    return metric.delta
  }

  if (typeof metric.value === 'number' && typeof metric.previousValue === 'number' && metric.previousValue !== 0) {
    return ((metric.value - metric.previousValue) / Math.abs(metric.previousValue)) * 100
  }

  return null
}

function formatValue(metric: DataCardGridMetric) {
  if (metric.formatter) {
    return metric.formatter(metric.value)
  }

  if (typeof metric.value === 'number') {
    return new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(metric.value)
  }

  return metric.value
}

function getSparklinePath(values: number[], width: number, height: number) {
  if (values.length < 2) {
    return ''
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return values.map((value, index) => {
    const x = (index / (values.length - 1)) * width
    const y = height - ((value - min) / range) * height

    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
}

function Sparkline({ values, color }: { values: number[], color: string }) {
  const width = 180
  const height = 54
  const path = getSparklinePath(values, width, height)
  const fillPath = path ? `${path} L ${width} ${height} L 0 ${height} Z` : ''

  return (
    <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ display: 'block', width: '100%', height: 54 }}>
      <Box component="path" d={fillPath} sx={{ fill: alpha(color, 0.14) }} />
      <Box component="path" d={path} sx={{ fill: 'none', stroke: color, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      {values.length ? (
        <Box
          component="circle"
          cx={width}
          cy={height - ((values[values.length - 1] - Math.min(...values)) / ((Math.max(...values) - Math.min(...values)) || 1)) * height}
          r={4}
          sx={{ fill: color }}
        />
      ) : null}
    </Box>
  )
}

export function DataCardGrid({
  metrics,
  title,
  subtitle,
  columns = 3,
  density = 'comfortable',
  showSparklines = true,
  showProgress = true,
  sx,
  ...props
}: DataCardGridProps) {
  const compact = density === 'compact'

  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {title || subtitle ? (
        <Box sx={{ mb: 2 }}>
          {title ? (
            <Typography variant="h6" fontWeight={900}>
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: `repeat(${columns}, minmax(0, 1fr))`
          },
          gap: compact ? 1.25 : 2
        }}
      >
        {metrics.map((metric) => {
          const color = getMetricColor(metric)
          const delta = getDelta(metric)
          const positive = (delta ?? 0) >= 0

          return (
            <Paper
              key={metric.id}
              variant="outlined"
              sx={{
                p: compact ? 1.5 : 2,
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                borderColor: alpha(color, 0.32),
                background: `linear-gradient(180deg, ${alpha(color, 0.08)}, rgba(255,255,255,0) 42%)`
              }}
            >
              <Stack spacing={compact ? 1 : 1.5}>
                <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={850} sx={{ textTransform: 'uppercase' }}>
                      {metric.label}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mt: 0.5 }}>
                      <Typography variant={compact ? 'h5' : 'h4'} fontWeight={950} sx={{ lineHeight: 1 }}>
                        {formatValue(metric)}
                      </Typography>
                      {metric.unit ? (
                        <Typography variant="body2" color="text.secondary" fontWeight={800}>
                          {metric.unit}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Box>

                  {metric.icon ? (
                    <Box sx={{ color, display: 'grid', placeItems: 'center', mt: 0.25 }}>
                      {metric.icon}
                    </Box>
                  ) : null}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  {delta !== null ? (
                    <Chip
                      size="small"
                      label={`${positive ? '+' : ''}${delta.toFixed(1)}%`}
                      sx={{
                        color: positive ? statusColors.good : statusColors.danger,
                        bgcolor: alpha(positive ? statusColors.good : statusColors.danger, 0.12),
                        fontWeight: 850
                      }}
                    />
                  ) : <Box />}

                  {metric.helper ? (
                    <Typography variant="caption" color="text.secondary" textAlign="right">
                      {metric.helper}
                    </Typography>
                  ) : null}
                </Stack>

                {showSparklines && metric.trend?.length ? <Sparkline values={metric.trend} color={color} /> : null}

                {showProgress && typeof metric.progress === 'number' ? (
                  <LinearProgress
                    variant="determinate"
                    value={clamp(metric.progress, 0, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      bgcolor: alpha(color, 0.14),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: color,
                        borderRadius: 999
                      }
                    }}
                  />
                ) : null}
              </Stack>
            </Paper>
          )
        })}
      </Box>
    </Box>
  )
}
