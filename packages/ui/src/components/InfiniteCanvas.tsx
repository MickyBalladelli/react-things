import { useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type InfiniteCanvasItem = {
  id: string
  x: number
  y: number
  width?: number
  height?: number
  label?: string
  color?: string
  data?: unknown
}

export type InfiniteCanvasViewport = {
  x: number
  y: number
  zoom: number
}

export type InfiniteCanvasProps = Omit<BoxProps, 'onChange'> & {
  items?: InfiniteCanvasItem[]
  defaultViewport?: InfiniteCanvasViewport
  viewport?: InfiniteCanvasViewport
  minZoom?: number
  maxZoom?: number
  showGrid?: boolean
  showMinimap?: boolean
  selectedItemId?: string | null
  renderItem?: (item: InfiniteCanvasItem, selected: boolean) => ReactNode
  onViewportChange?: (viewport: InfiniteCanvasViewport) => void
  onItemMove?: (itemId: string, position: { x: number, y: number }) => void
  onItemSelect?: (item: InfiniteCanvasItem | null) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function InfiniteCanvas({
  items = [],
  defaultViewport = { x: 0, y: 0, zoom: 1 },
  viewport,
  minZoom = 0.3,
  maxZoom = 2.5,
  showGrid = true,
  showMinimap = true,
  selectedItemId,
  renderItem,
  onViewportChange,
  onItemMove,
  onItemSelect,
  sx,
  ...props
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [internalViewport, setInternalViewport] = useState(defaultViewport)
  const [itemPositions, setItemPositions] = useState<Record<string, { x: number, y: number }>>(
    Object.fromEntries(items.map((item) => [item.id, { x: item.x, y: item.y }]))
  )
  const [internalSelectedItemId, setInternalSelectedItemId] = useState<string | null>(selectedItemId ?? null)
  const view = viewport ?? internalViewport
  const selectedId = selectedItemId ?? internalSelectedItemId
  const bounds = useMemo(() => {
    const points = items.map((item) => ({
      x: itemPositions[item.id]?.x ?? item.x,
      y: itemPositions[item.id]?.y ?? item.y,
      width: item.width ?? 140,
      height: item.height ?? 80
    }))

    if (!points.length) {
      return { minX: -200, minY: -120, width: 400, height: 240 }
    }

    const minX = Math.min(...points.map((item) => item.x)) - 80
    const minY = Math.min(...points.map((item) => item.y)) - 80
    const maxX = Math.max(...points.map((item) => item.x + item.width)) + 80
    const maxY = Math.max(...points.map((item) => item.y + item.height)) + 80

    return { minX, minY, width: maxX - minX, height: maxY - minY }
  }, [itemPositions, items])

  function commitViewport(nextViewport: InfiniteCanvasViewport) {
    const finalViewport = {
      ...nextViewport,
      zoom: clamp(nextViewport.zoom, minZoom, maxZoom)
    }

    if (viewport === undefined) {
      setInternalViewport(finalViewport)
    }

    onViewportChange?.(finalViewport)
  }

  function screenToWorld(clientX: number, clientY: number) {
    const bounds = containerRef.current?.getBoundingClientRect()

    return {
      x: ((clientX - (bounds?.left ?? 0)) - view.x) / view.zoom,
      y: ((clientY - (bounds?.top ?? 0)) - view.y) / view.zoom
    }
  }

  function selectItem(item: InfiniteCanvasItem | null) {
    setInternalSelectedItemId(item?.id ?? null)
    onItemSelect?.(item)
  }

  return (
    <Box
      {...props}
      ref={containerRef}
      onWheel={(event) => {
        event.preventDefault()
        const nextZoom = clamp(view.zoom * (event.deltaY > 0 ? 0.92 : 1.08), minZoom, maxZoom)
        const world = screenToWorld(event.clientX, event.clientY)
        const bounds = containerRef.current?.getBoundingClientRect()
        const nextX = (event.clientX - (bounds?.left ?? 0)) - world.x * nextZoom
        const nextY = (event.clientY - (bounds?.top ?? 0)) - world.y * nextZoom

        commitViewport({ x: nextX, y: nextY, zoom: nextZoom })
      }}
      onPointerDown={(event) => {
        if (event.target !== event.currentTarget) {
          return
        }

        selectItem(null)
        const startX = event.clientX
        const startY = event.clientY
        const start = view
        event.currentTarget.setPointerCapture(event.pointerId)

        function move(moveEvent: PointerEvent) {
          commitViewport({
            ...start,
            x: start.x + moveEvent.clientX - startX,
            y: start.y + moveEvent.clientY - startY
          })
        }

        function up() {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
        }

        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }}
      sx={[
        {
          position: 'relative',
          minHeight: 420,
          overflow: 'hidden',
          bgcolor: '#f8fafc',
          cursor: 'grab',
          touchAction: 'none'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: showGrid
            ? 'linear-gradient(rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.25) 1px, transparent 1px)'
            : undefined,
          backgroundSize: `${32 * view.zoom}px ${32 * view.zoom}px`,
          backgroundPosition: `${view.x}px ${view.y}px`
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: view.x,
          top: view.y,
          transform: `scale(${view.zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {items.map((item) => {
          const position = itemPositions[item.id] ?? { x: item.x, y: item.y }
          const selected = item.id === selectedId

          return (
            <Box
              key={item.id}
              onPointerDown={(event) => {
                event.stopPropagation()
                selectItem(item)
                const start = itemPositions[item.id] ?? { x: item.x, y: item.y }
                const startWorld = screenToWorld(event.clientX, event.clientY)
                event.currentTarget.setPointerCapture(event.pointerId)

                function move(moveEvent: PointerEvent) {
                  const nextWorld = screenToWorld(moveEvent.clientX, moveEvent.clientY)
                  const nextPosition = {
                    x: start.x + nextWorld.x - startWorld.x,
                    y: start.y + nextWorld.y - startWorld.y
                  }

                  setItemPositions((positions) => ({
                    ...positions,
                    [item.id]: nextPosition
                  }))
                  onItemMove?.(item.id, nextPosition)
                }

                function up() {
                  window.removeEventListener('pointermove', move)
                  window.removeEventListener('pointerup', up)
                }

                window.addEventListener('pointermove', move)
                window.addEventListener('pointerup', up)
              }}
              sx={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: item.width ?? 140,
                height: item.height ?? 80,
                display: 'grid',
                placeItems: 'center',
                border: selected ? 2 : 1,
                borderColor: selected ? 'primary.main' : 'divider',
                borderRadius: 1,
                bgcolor: item.color ?? 'background.paper',
                boxShadow: selected ? '0 18px 40px rgba(37,99,235,0.24)' : '0 12px 28px rgba(15,23,42,0.13)',
                cursor: 'grab',
                userSelect: 'none'
              }}
            >
              {renderItem ? renderItem(item, selected) : <Typography fontWeight={900}>{item.label ?? item.id}</Typography>}
            </Box>
          )
        })}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          display: 'flex',
          gap: 0.75,
          alignItems: 'center',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.92)',
          border: 1,
          borderColor: 'divider',
          fontSize: 12,
          fontWeight: 800
        }}
      >
        {Math.round(view.zoom * 100)}%
      </Box>

      {showMinimap ? (
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            width: 160,
            height: 100,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.9)',
            overflow: 'hidden'
          }}
        >
          {items.map((item) => {
            const position = itemPositions[item.id] ?? { x: item.x, y: item.y }
            const left = ((position.x - bounds.minX) / bounds.width) * 100
            const top = ((position.y - bounds.minY) / bounds.height) * 100
            const width = ((item.width ?? 140) / bounds.width) * 100
            const height = ((item.height ?? 80) / bounds.height) * 100

            return (
              <Box
                key={item.id}
                sx={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  minWidth: 6,
                  minHeight: 4,
                  borderRadius: 0.5,
                  bgcolor: item.id === selectedId ? 'primary.main' : item.color ?? '#94a3b8'
                }}
              />
            )
          })}
        </Box>
      ) : null}
    </Box>
  )
}
