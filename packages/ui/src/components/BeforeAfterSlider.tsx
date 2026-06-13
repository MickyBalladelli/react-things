import { useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type BeforeAfterSliderProps = BoxProps & {
  before: ReactNode
  after: ReactNode
  initialPosition?: number
}

export function BeforeAfterSlider({ before, after, initialPosition = 50, sx, ...props }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(initialPosition)

  return (
    <Box
      {...props}
      sx={[
        { position: 'relative', overflow: 'hidden', minHeight: 280 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      onPointerMove={(event) => {
        if (event.buttons !== 1) {
          return
        }
        const bounds = event.currentTarget.getBoundingClientRect()
        setPosition(((event.clientX - bounds.left) / bounds.width) * 100)
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0 }}>{after}</Box>
      <Box sx={{ position: 'absolute', inset: 0, width: `${position}%`, overflow: 'hidden' }}>{before}</Box>
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${position}%`, width: 3, bgcolor: '#ffffff', boxShadow: '0 0 0 1px rgba(0,0,0,0.2)', cursor: 'ew-resize' }} />
    </Box>
  )
}
