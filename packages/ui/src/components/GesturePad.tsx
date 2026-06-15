import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { PaperProps } from '@mui/material/Paper'
import type { PointerEvent, ReactNode } from 'react'

export type GesturePadState = {
  x: number
  y: number
  zoom: number
  rotation: number
  scrub: number
}

export type GesturePadChangeReason = 'pan' | 'zoom' | 'rotate' | 'scrub' | 'reset'

export type GesturePadProps = Omit<PaperProps, 'children' | 'defaultValue' | 'onChange' | 'value'> & {
  value?: GesturePadState
  defaultValue?: GesturePadState
  minZoom?: number
  maxZoom?: number
  scrubStep?: number
  title?: ReactNode
  subtitle?: ReactNode
  showReadout?: boolean
  children?: ReactNode | ((state: GesturePadState) => ReactNode)
  onChange?: (state: GesturePadState, reason: GesturePadChangeReason) => void
}

const defaultState: GesturePadState = {
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
  scrub: 0
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function GesturePad({
  value,
  defaultValue = defaultState,
  minZoom = 0.4,
  maxZoom = 3,
  scrubStep = 1,
  title = 'Gesture pad',
  subtitle = 'Drag to pan. Wheel to zoom. Shift-wheel rotates. Alt-wheel scrubs.',
  showReadout = true,
  children,
  onChange,
  sx,
  ...props
}: GesturePadProps) {
  const [internalState, setInternalState] = useState(defaultValue)
  const state = value ?? internalState
  const padRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ x: number, y: number, state: GesturePadState } | null>(null)

  function commit(nextState: GesturePadState, reason: GesturePadChangeReason) {
    const finalState = {
      ...nextState,
      zoom: clamp(nextState.zoom, minZoom, maxZoom)
    }

    if (value === undefined) {
      setInternalState(finalState)
    }

    onChange?.(finalState, reason)
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    dragRef.current = { x: event.clientX, y: event.clientY, state }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current

    if (!drag) {
      return
    }

    commit({
      ...drag.state,
      x: drag.state.x + event.clientX - drag.x,
      y: drag.state.y + event.clientY - drag.y
    }, 'pan')
  }

  function handleWheel(event: globalThis.WheelEvent) {
    event.preventDefault()
    event.stopPropagation()

    if (event.altKey) {
      commit({ ...state, scrub: state.scrub + Math.sign(event.deltaY) * scrubStep }, 'scrub')
      return
    }

    if (event.shiftKey) {
      commit({ ...state, rotation: state.rotation + event.deltaY * 0.16 }, 'rotate')
      return
    }

    commit({ ...state, zoom: state.zoom * (event.deltaY > 0 ? 0.92 : 1.08) }, 'zoom')
  }

  useEffect(() => {
    const pad = padRef.current

    if (!pad) {
      return
    }

    pad.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      pad.removeEventListener('wheel', handleWheel)
    }
  })

  const content = useMemo(() => typeof children === 'function' ? children(state) : children, [children, state])

  return (
    <Paper
      ref={padRef}
      variant="outlined"
      {...props}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        dragRef.current = null
      }}
      onPointerCancel={() => {
        dragRef.current = null
      }}
      sx={[
        (theme) => ({
          position: 'relative',
          minHeight: 320,
          overflow: 'hidden',
          borderRadius: 1,
          cursor: dragRef.current ? 'grabbing' : 'grab',
          touchAction: 'none',
          bgcolor: 'background.default',
          backgroundImage: `radial-gradient(circle at 1px 1px, ${alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.18 : 0.14)} 1px, transparent 0)`,
          backgroundSize: '22px 22px'
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack spacing={0.25} sx={{ position: 'absolute', left: 16, top: 14, zIndex: 2 }}>
        <Typography fontWeight={950}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
      </Stack>

      {showReadout ? (
        <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ position: 'absolute', right: 12, top: 12, zIndex: 2 }}>
          <Chip size="small" label={`${Math.round(state.zoom * 100)}%`} />
          <Chip size="small" label={`${Math.round(state.rotation)}deg`} />
          <Chip size="small" label={`scrub ${state.scrub}`} />
        </Stack>
      ) : null}

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) rotate(${state.rotation}deg) scale(${state.zoom})`,
          transformOrigin: 'center',
          transition: dragRef.current ? 'none' : 'transform 80ms ease'
        }}
      >
        {content ?? (
          <Paper variant="outlined" sx={{ width: 170, height: 110, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: 'background.paper' }}>
            <Typography fontWeight={950}>Gesture target</Typography>
          </Paper>
        )}
      </Box>
    </Paper>
  )
}
