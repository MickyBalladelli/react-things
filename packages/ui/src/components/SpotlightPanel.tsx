import { useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'

export type SpotlightPanelProps = BoxProps & {
  radius?: number
  dim?: number
}

export function SpotlightPanel({ radius = 160, dim = 0.72, sx, children, ...props }: SpotlightPanelProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  return (
    <Box
      {...props}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        setPosition({
          x: ((event.clientX - bounds.left) / bounds.width) * 100,
          y: ((event.clientY - bounds.top) / bounds.height) * 100
        })
      }}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle ${radius}px at ${position.x}% ${position.y}%, transparent 0, transparent 45%, rgba(0,0,0,${dim}) 100%)`
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  )
}
