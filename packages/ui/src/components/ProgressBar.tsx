import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type ProgressBarTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type ProgressBarSize = 'sm' | 'md' | 'lg'

export type ProgressBarVariant = 'determinate' | 'indeterminate'

export type ProgressBarProps = BoxProps & {
  value?: number
  min?: number
  max?: number
  variant?: ProgressBarVariant
  tone?: ProgressBarTone
  size?: ProgressBarSize
  label?: ReactNode
  showValue?: boolean
  showTrack?: boolean
  animated?: boolean
  striped?: boolean
  thickness?: number
  radius?: number
}

const toneColors: Record<ProgressBarTone, { base: string; light: string; dark: string; glow: string }> = {
  primary: { base: '#2563eb', light: '#60a5fa', dark: '#1d4ed8', glow: '#3b82f666' },
  success: { base: '#059669', light: '#34d399', dark: '#047857', glow: '#10b98166' },
  warning: { base: '#d97706', light: '#fbbf24', dark: '#b45309', glow: '#f59e0b66' },
  error: { base: '#dc2626', light: '#f87171', dark: '#b91c1c', glow: '#ef444466' },
  info: { base: '#0891b2', light: '#22d3ee', dark: '#0e7490', glow: '#06b6d466' }
}

const sizeHeights: Record<ProgressBarSize, number> = {
  sm: 6,
  md: 12,
  lg: 20
}

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(200%) skewX(-20deg); }
`

const stripedBg = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 32px 0; }
`

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function ProgressBar({
  value = 0,
  min = 0,
  max = 100,
  variant = 'determinate',
  tone = 'primary',
  size = 'md',
  label,
  showValue = false,
  showTrack = true,
  animated = true,
  striped = false,
  thickness,
  radius = 999,
  sx,
  ...props
}: ProgressBarProps) {
  const palette = toneColors[tone]
  const height = thickness ?? sizeHeights[size]
  const isIndeterminate = variant === 'indeterminate'
  const percent = isIndeterminate ? 0 : clamp(((value - min) / (max - min)) * 100, 0, 100)

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {(label || showValue) ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label ? (
            <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>
              {label}
            </Typography>
          ) : <Box />}
          {showValue && !isIndeterminate ? (
            <Typography
              variant="body2"
              fontWeight={800}
              sx={{
                color: palette.base,
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 12px ${palette.glow}`
              }}
            >
              {Math.round(percent)}%
            </Typography>
          ) : null}
        </Box>
      ) : null}

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height,
          borderRadius: radius,
          overflow: 'hidden',
          bgcolor: showTrack ? 'grey.200' : 'transparent',
          ...(showTrack ? {
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)'
          } : {})
        }}
      >
        {/* Track gradient accent */}
        {showTrack ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              background: `linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)`,
              pointerEvents: 'none'
            }}
          />
        ) : null}

        {/* Fill bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: isIndeterminate ? '100%' : `${percent}%`,
            borderRadius: radius,
            background: `linear-gradient(180deg, ${palette.light} 0%, ${palette.base} 40%, ${palette.dark} 100%)`,
            boxShadow: percent > 0 || isIndeterminate
              ? `0 0 12px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.25)`
              : 'none',
            transition: animated && !isIndeterminate
              ? 'width 420ms cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'none',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)',
              borderRadius: `${radius}px ${radius}px 0 0`
            },
            ...(striped ? {
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 6px,
                  rgba(255,255,255,0.12) 6px,
                  rgba(255,255,255,0.12) 12px
                )`,
                backgroundSize: '32px 32px',
                animation: `${stripedBg} 1.2s linear infinite`,
                borderRadius: radius
              }
            } : {}),
            ...(animated && percent > 0 && !isIndeterminate ? {
              '& > .shimmer': {
                animation: `${shimmer} 2.2s ease-in-out infinite`
              }
            } : {}),
            ...(isIndeterminate ? {
              animation: 'progress-bar-indeterminate 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
              width: '42%',
              '@keyframes progress-bar-indeterminate': {
                '0%': {
                  left: '-42%'
                },
                '100%': {
                  left: '100%'
                }
              }
            } : {})
          }}
        >
          {/* Shimmer highlight */}
          {percent > 0 && !isIndeterminate ? (
            <Box
              className="shimmer"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.22) 60%, transparent 100%)',
                transform: 'skewX(-20deg)',
                animation: `${shimmer} 2.2s ease-in-out infinite`,
                animationDelay: '0.4s'
              }}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}