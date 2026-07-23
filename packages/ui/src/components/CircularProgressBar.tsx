import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type CircularProgressBarTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type CircularProgressBarVariant = 'determinate' | 'indeterminate'

export type CircularProgressBarProps = BoxProps & {
  value?: number
  min?: number
  max?: number
  variant?: CircularProgressBarVariant
  tone?: CircularProgressBarTone
  size?: number
  label?: ReactNode
  showValue?: boolean
  animated?: boolean
  /** Minimum stroke width at 0% progress. Default 6. */
  minStrokeWidth?: number
  /** Maximum stroke width at 100% progress. Default 22. */
  maxStrokeWidth?: number
}

const toneColors: Record<CircularProgressBarTone, { base: string; light: string; dark: string; glow: string }> = {
  primary: { base: '#2563eb', light: '#60a5fa', dark: '#1d4ed8', glow: '#3b82f666' },
  success: { base: '#059669', light: '#34d399', dark: '#047857', glow: '#10b98166' },
  warning: { base: '#d97706', light: '#fbbf24', dark: '#b45309', glow: '#f59e0b66' },
  error: { base: '#dc2626', light: '#f87171', dark: '#b91c1c', glow: '#ef444466' },
  info: { base: '#0891b2', light: '#22d3ee', dark: '#0e7490', glow: '#06b6d466' }
}

const indeterminateRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const indeterminateDash = keyframes`
  0% { stroke-dasharray: 1, 400; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 180, 400; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 180, 400; stroke-dashoffset: -400; }
`

const floatPulse = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function CircularProgressBar({
  value = 0,
  min = 0,
  max = 100,
  variant = 'determinate',
  tone = 'primary',
  size = 120,
  label,
  showValue = false,
  animated = true,
  minStrokeWidth = 6,
  maxStrokeWidth = 22,
  sx,
  ...props
}: CircularProgressBarProps) {
  const palette = toneColors[tone]
  const isIndeterminate = variant === 'indeterminate'
  const percent = isIndeterminate ? 0 : clamp(((value - min) / (max - min)) * 100, 0, 100)

  // Stroke grows from minStrokeWidth → maxStrokeWidth as progress goes 0→100
  const strokeWidth = isIndeterminate
    ? (minStrokeWidth + maxStrokeWidth) / 2
    : minStrokeWidth + ((maxStrokeWidth - minStrokeWidth) * percent) / 100

  // Radius must account for half the stroke so it doesn't get clipped
  const maxStrokeHalf = maxStrokeWidth / 2
  const viewBoxSize = size + maxStrokeWidth
  const center = viewBoxSize / 2
  const radius = (size - strokeWidth) / 2

  // SVG arc calculation
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (percent / 100) * circumference

  // Track ring uses min stroke width for a subtle baseline
  const trackRadius = (size - minStrokeWidth) / 2
  const trackCircumference = 2 * Math.PI * trackRadius

  // Arc path for the growing ring cap effect at the leading edge
  const getArcPoint = (pct: number) => {
    const angle = ((pct / 100) * 360 - 90) * (Math.PI / 180)
    const r = radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }

  const leadingPoint = getArcPoint(percent)
  const capRadius = strokeWidth / 2

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {/* SVG Container */}
      <Box
        sx={{
          width: viewBoxSize,
          height: viewBoxSize,
          position: 'relative',
          ...(isIndeterminate ? {
            animation: `${floatPulse} 2.4s ease-in-out infinite`
          } : {})
        }}
      >
        <Box
          component="svg"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          sx={{
            width: viewBoxSize,
            height: viewBoxSize,
            transform: 'rotate(-90deg)',
            ...(isIndeterminate ? {
              animation: `${indeterminateRotate} 1.6s linear infinite`
            } : {})
          }}
        >
          {/* Subtle background circle */}
          <circle
            cx={center}
            cy={center}
            r={trackRadius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={minStrokeWidth}
            strokeLinecap="round"
          />

          {/* Outer glow ring that pulses */}
          {percent > 0 && !isIndeterminate ? (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={palette.glow}
              strokeWidth={strokeWidth + 8}
              strokeLinecap="round"
              opacity={0.25}
              strokeDasharray={`${(percent / 100) * circumference} ${circumference}`}
              strokeDashoffset={0}
              style={{
                filter: 'blur(6px)',
                transition: animated ? 'stroke-dasharray 600ms cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
              }}
            />
          ) : null}

          {/* Main progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#circular-gradient-${tone})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={isIndeterminate ? undefined : `${circumference}`}
            strokeDashoffset={isIndeterminate ? undefined : dashOffset}
            style={{
              transition: animated && !isIndeterminate
                ? 'stroke-dashoffset 600ms cubic-bezier(0.34, 1.56, 0.64, 1), stroke-width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
              ...(isIndeterminate ? {
                animation: `${indeterminateDash} 1.6s ease-in-out infinite`
              } : {}),
              filter: percent > 0 || isIndeterminate
                ? `drop-shadow(0 0 6px ${palette.glow})`
                : 'none'
            }}
          />

          {/* Leading cap dot that grows with stroke */}
          {percent > 0 && percent < 100 && !isIndeterminate ? (
            <circle
              cx={leadingPoint.x}
              cy={leadingPoint.y}
              r={capRadius}
              fill={palette.light}
              style={{
                transition: animated ? 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                filter: `drop-shadow(0 0 8px ${palette.glow})`
              }}
            />
          ) : null}

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`circular-gradient-${tone}`}
              gradientTransform="rotate(45)"
            >
              <stop offset="0%" stopColor={palette.light} />
              <stop offset="50%" stopColor={palette.base} />
              <stop offset="100%" stopColor={palette.dark} />
            </linearGradient>
          </defs>
        </Box>

        {/* Center percentage / label */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          {showValue && !isIndeterminate ? (
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: size * 0.24,
                color: palette.base,
                lineHeight: 1,
                textShadow: `0 0 16px ${palette.glow}`,
                fontVariantNumeric: 'tabular-nums',
                transition: animated ? 'font-size 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                // Scale percentage text slightly as progress grows
                transform: `scale(${0.85 + (percent / 100) * 0.15})`
              }}
            >
              {Math.round(percent)}%
            </Typography>
          ) : isIndeterminate ? (
            <Box
              sx={{
                width: size * 0.2,
                height: size * 0.2,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${palette.light} 0%, ${palette.base} 100%)`,
                animation: `${glowPulse} 1.4s ease-in-out infinite`,
                boxShadow: `0 0 20px ${palette.glow}`
              }}
            />
          ) : null}
        </Box>
      </Box>

      {/* Label */}
      {label ? (
        <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>
          {label}
        </Typography>
      ) : null}
    </Box>
  )
}