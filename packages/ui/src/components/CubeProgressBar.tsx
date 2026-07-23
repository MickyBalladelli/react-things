import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type CubeProgressBarTone = 'primary' | 'success' | 'warning' | 'error' | 'info'

export type CubeProgressBarVariant = 'determinate' | 'indeterminate'

export type CubeProgressBarProps = BoxProps & {
  value?: number
  min?: number
  max?: number
  variant?: CubeProgressBarVariant
  tone?: CubeProgressBarTone
  size?: number
  label?: ReactNode
  showValue?: boolean
  animated?: boolean
}

const toneColors: Record<CubeProgressBarTone, { base: string; light: string; dark: string; glow: string }> = {
  primary: { base: '#2563eb', light: '#60a5fa', dark: '#1d4ed8', glow: '#3b82f666' },
  success: { base: '#059669', light: '#34d399', dark: '#047857', glow: '#10b98166' },
  warning: { base: '#d97706', light: '#fbbf24', dark: '#b45309', glow: '#f59e0b66' },
  error: { base: '#dc2626', light: '#f87171', dark: '#b91c1c', glow: '#ef444466' },
  info: { base: '#0891b2', light: '#22d3ee', dark: '#0e7490', glow: '#06b6d466' }
}

const cubeSpin = keyframes`
  0% {
    transform: rotateX(-24deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(-24deg) rotateY(360deg);
  }
`

const floatPulse = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function CubeProgressBar({
  value = 0,
  min = 0,
  max = 100,
  variant = 'determinate',
  tone = 'primary',
  size = 80,
  label,
  showValue = false,
  animated = true,
  sx,
  ...props
}: CubeProgressBarProps) {
  const palette = toneColors[tone]
  const isIndeterminate = variant === 'indeterminate'
  const percent = isIndeterminate ? 0 : clamp(((value - min) / (max - min)) * 100, 0, 100)
  const halfSize = size / 2
  const faceSize = size * 0.76

  // Map progress 0→100 to rotation 0→360 degrees
  const rotateY = isIndeterminate ? 0 : (percent / 100) * 360

  // Cube face colors from light (top) to dark (bottom)
  const frontColor = palette.base
  const backColor = palette.dark
  const rightColor = palette.light
  const leftColor = palette.base
  const topColor = palette.light
  const bottomColor = palette.dark

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
      {/* 3D Scene */}
      <Box
        sx={{
          width: size,
          height: size,
          perspective: 600,
          ...(isIndeterminate ? {
            animation: `${floatPulse} 2.4s ease-in-out infinite`
          } : {})
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: isIndeterminate
              ? `rotateX(-24deg) rotateY(0deg)`
              : `rotateX(-24deg) rotateY(${rotateY}deg)`,
            transition: animated && !isIndeterminate
              ? 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
              : 'none',
            ...(isIndeterminate ? {
              animation: `${cubeSpin} 2.2s linear infinite`
            } : {}),
            cursor: 'pointer',
            '&:hover': !isIndeterminate ? {
              transform: `rotateX(-24deg) rotateY(${rotateY}deg) scale(1.08)`
            } : {}
          }}
        >
          {/* Front face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${frontColor} 0%, ${palette.dark} 100%)`,
              borderRadius: 3,
              transform: `translateZ(${faceSize / 2}px)`,
              boxShadow: `0 0 20px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showValue && !isIndeterminate ? (
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: size * 0.28,
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  fontVariantNumeric: 'tabular-nums',
                  userSelect: 'none'
                }}
              >
                {Math.round(percent)}%
              </Typography>
            ) : null}
          </Box>

          {/* Back face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${backColor} 0%, ${palette.dark} 100%)`,
              borderRadius: 3,
              transform: `rotateY(180deg) translateZ(${faceSize / 2}px)`,
              boxShadow: `0 0 12px ${palette.glow}`,
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Right face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${rightColor} 0%, ${palette.base} 100%)`,
              borderRadius: 3,
              transform: `rotateY(90deg) translateZ(${faceSize / 2}px)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15)`,
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Left face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${leftColor} 0%, ${palette.dark} 100%)`,
              borderRadius: 3,
              transform: `rotateY(-90deg) translateZ(${faceSize / 2}px)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15)`,
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Top face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${topColor} 0%, ${palette.light} 100%)`,
              borderRadius: 3,
              transform: `rotateX(90deg) translateZ(${faceSize / 2}px)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)`,
              backfaceVisibility: 'hidden'
            }}
          />

          {/* Bottom face */}
          <Box
            sx={{
              position: 'absolute',
              width: faceSize,
              height: faceSize,
              top: '50%',
              left: '50%',
              marginTop: `-${faceSize / 2}px`,
              marginLeft: `-${faceSize / 2}px`,
              background: `linear-gradient(135deg, ${bottomColor} 0%, ${palette.dark} 100%)`,
              borderRadius: 3,
              transform: `rotateX(-90deg) translateZ(${faceSize / 2}px)`,
              boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.15)`,
              backfaceVisibility: 'hidden'
            }}
          />
        </Box>
      </Box>

      {/* Ground shadow */}
      <Box
        sx={{
          width: size * 0.7,
          height: size * 0.12,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${palette.glow} 0%, transparent 70%)`,
          ...(isIndeterminate ? {
            animation: `${floatPulse} 2.4s ease-in-out infinite`,
            animationDelay: '0.15s'
          } : {
            transition: animated ? 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            transform: `scaleX(${0.6 + (percent / 100) * 0.4})`
          })
        }}
      />

      {/* Label + value */}
      {(label || (showValue && !isIndeterminate)) ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
          {label ? (
            <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>
              {label}
            </Typography>
          ) : null}
          {showValue && !isIndeterminate ? (
            <Typography
              variant="caption"
              fontWeight={800}
              sx={{
                color: palette.base,
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 8px ${palette.glow}`
              }}
            >
              {Math.round(percent)}%
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}