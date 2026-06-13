import { useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type DockBarItem = {
  id: string
  label: string
  icon: ReactNode
  onClick?: () => void
}

export type DockBarProps = BoxProps & {
  items: DockBarItem[]
  iconSize?: number
  magnification?: number
  gap?: number
  tooltip?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function DockBar({
  items,
  iconSize = 52,
  magnification = 1.7,
  gap = 10,
  tooltip = true,
  sx,
  ...props
}: DockBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Box
      {...props}
      role="toolbar"
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'flex-end',
          gap: `${gap}px`,
          p: 1,
          border: 1,
          borderColor: 'rgba(255,255,255,0.5)',
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.34)',
          boxShadow: '0 18px 44px rgba(15, 23, 42, 0.22)',
          backdropFilter: 'blur(18px) saturate(150%)',
          WebkitBackdropFilter: 'blur(18px) saturate(150%)'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, index) => {
        const distance = hoveredIndex === null ? 4 : Math.abs(index - hoveredIndex)
        const influence = clamp(1 - distance / 3, 0, 1)
        const scale = 1 + (magnification - 1) * influence
        const lift = -18 * influence
        const button = (
          <Box
            key={item.id}
            component="button"
            type="button"
            aria-label={item.label}
            onClick={item.onClick}
            onMouseEnter={() => setHoveredIndex(index)}
            sx={{
              width: iconSize,
              height: iconSize,
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
              border: 0,
              borderRadius: 2,
              p: 0,
              color: 'inherit',
              bgcolor: 'rgba(255,255,255,0.72)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 8px 18px rgba(15, 23, 42, 0.18)',
              cursor: 'pointer',
              transform: `translateY(${lift}px) scale(${scale})`,
              transformOrigin: 'bottom center',
              transition: 'transform 130ms ease-out, background-color 130ms ease-out',
              '&:focus-visible': {
                outline: '2px solid #2563eb',
                outlineOffset: 3
              },
              '&:active': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            <Typography
              component="span"
              aria-hidden="true"
              sx={{
                display: 'grid',
                placeItems: 'center',
                fontSize: Math.round(iconSize * 0.52),
                lineHeight: 1
              }}
            >
              {item.icon}
            </Typography>
          </Box>
        )

        return tooltip ? (
          <Tooltip key={item.id} title={item.label} placement="top" arrow>
            {button}
          </Tooltip>
        ) : button
      })}
    </Box>
  )
}
