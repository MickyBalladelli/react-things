import { useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'

export type MagneticCardProps = BoxProps & {
  strength?: number
  tilt?: number
  lift?: number
  glare?: boolean
  perspective?: number
}

export function MagneticCard({
  strength = 18,
  tilt = 10,
  lift = 10,
  glare = true,
  perspective = 900,
  sx,
  children,
  ...props
}: MagneticCardProps) {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    active: false
  })

  return (
    <Box
      {...props}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const localX = (event.clientX - bounds.left) / bounds.width
        const localY = (event.clientY - bounds.top) / bounds.height
        const x = (localX - 0.5) * strength
        const y = (localY - 0.5) * strength

        setState({
          x,
          y,
          rotateX: (0.5 - localY) * tilt,
          rotateY: (localX - 0.5) * tilt,
          glareX: localX * 100,
          glareY: localY * 100,
          active: true
        })
      }}
      onMouseLeave={() => setState({
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        glareX: 50,
        glareY: 50,
        active: false
      })}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          transform: `
            perspective(${perspective}px)
            translate3d(${state.x}px, ${state.y}px, ${state.active ? -lift : 0}px)
            rotateX(${state.rotateX}deg)
            rotateY(${state.rotateY}deg)
          `,
          transformStyle: 'preserve-3d',
          transition: state.active
            ? 'transform 80ms ease-out, box-shadow 120ms ease-out'
            : 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 260ms ease',
          willChange: 'transform',
          boxShadow: state.active
            ? '0 28px 70px rgba(15, 23, 42, 0.24)'
            : '0 14px 34px rgba(15, 23, 42, 0.12)',
          '&::before': glare ? {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: state.active ? 0.78 : 0,
            transition: 'opacity 160ms ease',
            background: `radial-gradient(circle at ${state.glareX}% ${state.glareY}%, rgba(255,255,255,0.55), rgba(255,255,255,0.16) 22%, transparent 48%)`,
            mixBlendMode: 'screen'
          } : undefined,
          '& > *': {
            position: 'relative',
            zIndex: 1,
            transform: state.active ? 'translateZ(24px)' : 'translateZ(0)',
            transition: 'transform 180ms ease'
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  )
}
