import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type SplitPaneOrientation = 'horizontal' | 'vertical'
export type SplitPaneCollapse = 'first' | 'second' | null

export type SplitPaneProps = BoxProps & {
  first: ReactNode
  second: ReactNode
  orientation?: SplitPaneOrientation
  initialSize?: number
  size?: number
  defaultSize?: number
  minSize?: number
  maxSize?: number
  dividerSize?: number
  snapPoints?: number[]
  snapThreshold?: number
  resetSize?: number
  collapsed?: SplitPaneCollapse
  defaultCollapsed?: SplitPaneCollapse
  collapsedSize?: number
  persistKey?: string
  keyboardStep?: number
  onSizeChange?: (size: number) => void
  onCollapsedChange?: (collapsed: SplitPaneCollapse) => void
  onDraggingChange?: (dragging: boolean) => void
  dividerLabel?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getStoredSize(persistKey: string | undefined) {
  if (!persistKey || typeof window === 'undefined') {
    return null
  }

  const storedSize = window.localStorage.getItem(persistKey)
  const parsedSize = storedSize === null ? Number.NaN : Number(storedSize)

  return Number.isFinite(parsedSize) ? parsedSize : null
}

export function SplitPane({
  first,
  second,
  orientation = 'horizontal',
  initialSize = 50,
  size: controlledSize,
  defaultSize,
  minSize = 20,
  maxSize = 80,
  dividerSize = 8,
  snapPoints = [],
  snapThreshold = 4,
  resetSize = defaultSize ?? initialSize,
  collapsed: controlledCollapsed,
  defaultCollapsed = null,
  collapsedSize = 0,
  persistKey,
  keyboardStep = 5,
  onSizeChange,
  onCollapsedChange,
  onDraggingChange,
  dividerLabel = 'Resize panels',
  sx,
  ...props
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [internalSize, setInternalSize] = useState(() => getStoredSize(persistKey) ?? defaultSize ?? initialSize)
  const [internalCollapsed, setInternalCollapsed] = useState<SplitPaneCollapse>(defaultCollapsed)
  const [dragging, setDragging] = useState(false)
  const horizontal = orientation === 'horizontal'
  const rawSize = controlledSize ?? internalSize
  const size = clamp(rawSize, minSize, maxSize)
  const collapsed = controlledCollapsed ?? internalCollapsed
  const shownSize = collapsed === 'first'
    ? collapsedSize
    : collapsed === 'second'
      ? 100 - collapsedSize
      : size
  const firstHidden = collapsed === 'first' && collapsedSize <= 0
  const secondHidden = collapsed === 'second' && collapsedSize <= 0

  useEffect(() => {
    if (persistKey) {
      window.localStorage.setItem(persistKey, String(size))
    }
  }, [persistKey, size])

  useEffect(() => {
    onDraggingChange?.(dragging)
  }, [dragging, onDraggingChange])

  function commitSize(nextSize: number) {
    const snappedSize = snapPoints.reduce((closestSize, snapPoint) => {
      const closestDistance = Math.abs(closestSize - nextSize)
      const snapDistance = Math.abs(snapPoint - nextSize)

      return snapDistance < closestDistance ? snapPoint : closestSize
    }, nextSize)
    const shouldSnap = Math.abs(snappedSize - nextSize) <= snapThreshold
    const finalSize = clamp(shouldSnap ? snappedSize : nextSize, minSize, maxSize)

    if (controlledSize === undefined) {
      setInternalSize(finalSize)
    }

    onSizeChange?.(finalSize)
    setCollapsedState(null)
  }

  function updateSize(clientX: number, clientY: number) {
    const container = containerRef.current

    if (!container) {
      return
    }

    const bounds = container.getBoundingClientRect()
    const rawSize = horizontal
      ? ((clientX - bounds.left) / bounds.width) * 100
      : ((clientY - bounds.top) / bounds.height) * 100
    commitSize(rawSize)
  }

  function resizeBy(delta: number) {
    commitSize(size + delta)
  }

  function reset() {
    commitSize(resetSize)
  }

  function toggleCollapse(nextCollapsed: Exclude<SplitPaneCollapse, null>) {
    setCollapsedState(collapsed === nextCollapsed ? null : nextCollapsed)
  }

  function setCollapsedState(nextCollapsed: SplitPaneCollapse) {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(nextCollapsed)
    }

    onCollapsedChange?.(nextCollapsed)
  }

  return (
    <Box
      {...props}
      ref={containerRef}
      sx={[
        {
          display: 'grid',
          gridTemplateColumns: horizontal ? `${shownSize}% ${dividerSize}px 1fr` : '1fr',
          gridTemplateRows: horizontal ? '1fr' : `${shownSize}% ${dividerSize}px 1fr`,
          minHeight: 280,
          overflow: 'hidden',
          userSelect: dragging ? 'none' : undefined
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      onPointerMove={(event) => {
        if (dragging) {
          updateSize(event.clientX, event.clientY)
        }
      }}
      onPointerUp={() => {
        setDragging(false)
      }}
      onPointerCancel={() => setDragging(false)}
    >
      <Box sx={{ minWidth: 0, minHeight: 0, overflow: 'auto', display: firstHidden ? 'none' : undefined }}>
        {first}
      </Box>
      <Box
        role="separator"
        aria-label={dividerLabel}
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        aria-valuenow={Math.round(size)}
        tabIndex={0}
        onPointerDown={(event) => {
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
          updateSize(event.clientX, event.clientY)
        }}
        onPointerUp={(event) => {
          setDragging(false)
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onDoubleClick={reset}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            reset()
            event.preventDefault()
          }

          if (event.key === 'Home') {
            toggleCollapse('first')
            event.preventDefault()
          }

          if (event.key === 'End') {
            toggleCollapse('second')
            event.preventDefault()
          }

          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            resizeBy(-keyboardStep)
            event.preventDefault()
          }

          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            resizeBy(keyboardStep)
            event.preventDefault()
          }
        }}
        sx={{
          position: 'relative',
          bgcolor: dragging ? 'primary.main' : 'divider',
          cursor: horizontal ? 'col-resize' : 'row-resize',
          touchAction: 'none',
          transition: 'background-color 120ms ease',
          '&:hover': {
            bgcolor: 'primary.main'
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: -2
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: horizontal ? '30% -4px' : '-4px 30%',
            borderRadius: 999,
            bgcolor: dragging ? 'primary.contrastText' : 'text.disabled',
            opacity: 0.55
          }
        }}
      />
      <Box sx={{ minWidth: 0, minHeight: 0, overflow: 'auto', display: secondHidden ? 'none' : undefined }}>
        {second}
      </Box>
    </Box>
  )
}
