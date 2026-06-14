import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode, RefObject } from 'react'

export type FocusRingTone = 'primary' | 'success' | 'warning' | 'error'

export type FocusRingProps = BoxProps & {
  children?: ReactNode
  target?: string | RefObject<HTMLElement | null>
  active?: boolean
  tone?: FocusRingTone
  pulse?: boolean
  padding?: number
  radius?: number
  thickness?: number
  pulseSize?: number
}

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

const toneColors: Record<FocusRingTone, string> = {
  primary: '#2563eb',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626'
}

function getTargetElement(target: FocusRingProps['target']) {
  if (!target) {
    return null
  }

  if (typeof target === 'string') {
    return document.querySelector(target) as HTMLElement | null
  }

  return target.current
}

function Ring({
  color,
  active,
  pulse,
  radius,
  thickness,
  pulseSize
}: {
  color: string
  active: boolean
  pulse: boolean
  radius: number
  thickness: number
  pulseSize: number
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        '--focus-ring-pulse-size': `${pulseSize}px`,
        border: `${thickness}px solid ${color}`,
        borderRadius: radius,
        opacity: active ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 160ms ease, box-shadow 160ms ease',
        boxShadow: active ? `0 0 0 var(--focus-ring-pulse-size) ${color}33` : 'none',
        animation: active && pulse ? 'focus-ring-pulse 1400ms ease-in-out infinite' : 'none',
        '@keyframes focus-ring-pulse': {
          '0%': {
            boxShadow: `0 0 0 calc(var(--focus-ring-pulse-size) * 0.3) ${color}18`
          },
          '50%': {
            boxShadow: `0 0 0 var(--focus-ring-pulse-size) ${color}44`
          },
          '100%': {
            boxShadow: `0 0 0 calc(var(--focus-ring-pulse-size) * 0.3) ${color}18`
          }
        }
      }}
    />
  )
}

export function FocusRing({
  children,
  target,
  active,
  tone = 'primary',
  pulse = true,
  padding = 6,
  radius = 10,
  thickness = 2,
  pulseSize = 10,
  sx,
  ...props
}: FocusRingProps) {
  const [focused, setFocused] = useState(false)
  const [rect, setRect] = useState<Rect | null>(null)
  const color = toneColors[tone]
  const shown = active ?? focused

  useEffect(() => {
    if (!target) {
      return
    }

    function updateRect() {
      const element = getTargetElement(target)

      if (!element) {
        setRect(null)
        return
      }

      const bounds = element.getBoundingClientRect()
      setRect({
        top: bounds.top - padding,
        left: bounds.left - padding,
        width: bounds.width + padding * 2,
        height: bounds.height + padding * 2
      })
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [padding, target])

  if (target) {
    return rect ? (
      <Box
        {...props}
        sx={[
          {
            position: 'fixed',
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            zIndex: 1500,
            pointerEvents: 'none'
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
        ]}
      >
        <Ring color={color} active={shown} pulse={pulse} radius={radius} thickness={thickness} pulseSize={pulseSize} />
      </Box>
    ) : null
  }

  return (
    <Box
      {...props}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      sx={[
        {
          position: 'relative',
          display: 'inline-flex',
          borderRadius: radius
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
      <Box
        sx={{
          position: 'absolute',
          inset: -padding,
          pointerEvents: 'none'
        }}
      >
        <Ring color={color} active={shown} pulse={pulse} radius={radius + padding} thickness={thickness} pulseSize={pulseSize} />
      </Box>
    </Box>
  )
}
