import { useState } from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'

export type ResizableFrameProps = BoxProps & {
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
}

export function ResizableFrame({
  initialWidth = 320,
  initialHeight = 220,
  minWidth = 160,
  minHeight = 120,
  sx,
  children,
  ...props
}: ResizableFrameProps) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })

  return (
    <Box
      {...props}
      sx={[
        {
          position: 'relative',
          width: size.width,
          height: size.height,
          overflow: 'auto',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
      <Box
        sx={{
          position: 'absolute',
          right: 4,
          bottom: 4,
          width: 28,
          height: 28,
          display: 'grid',
          placeItems: 'center',
          cursor: 'nwse-resize',
          color: 'text.secondary',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: '0 6px 16px rgba(15,23,42,0.14)'
        }}
        onPointerDown={(event) => {
          const startX = event.clientX
          const startY = event.clientY
          const start = size

          function move(moveEvent: PointerEvent) {
            setSize({
              width: Math.max(minWidth, start.width + moveEvent.clientX - startX),
              height: Math.max(minHeight, start.height + moveEvent.clientY - startY)
            })
          }

          function up() {
            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }

          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
    </Box>
  )
}
