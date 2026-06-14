import { useEffect, useMemo, useRef, useState } from 'react'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { PointerEvent, ReactNode } from 'react'

export type ResizableDashboardBreakpoint = {
  name: string
  minWidth: number
  columns: number
}

export type ResizableDashboardLayoutItem = {
  id: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

export type ResizableDashboardWidget = {
  id: string
  title?: ReactNode
  children: ReactNode
  layout?: Omit<ResizableDashboardLayoutItem, 'id'>
  layouts?: Record<string, Omit<ResizableDashboardLayoutItem, 'id'>>
}

export type ResizableDashboardProps = BoxProps & {
  widgets: ResizableDashboardWidget[]
  layouts?: Record<string, ResizableDashboardLayoutItem[]>
  defaultLayouts?: Record<string, ResizableDashboardLayoutItem[]>
  breakpoints?: ResizableDashboardBreakpoint[]
  rowHeight?: number
  gap?: number
  persistKey?: string
  showGuides?: boolean
  onLayoutsChange?: (layouts: Record<string, ResizableDashboardLayoutItem[]>, breakpoint: string) => void
}

type DragState = {
  id: string
  mode: 'move' | 'resize'
  startX: number
  startY: number
  item: ResizableDashboardLayoutItem
  layout: ResizableDashboardLayoutItem[]
}

const defaultBreakpoints: ResizableDashboardBreakpoint[] = [
  { name: 'lg', minWidth: 1100, columns: 12 },
  { name: 'md', minWidth: 760, columns: 8 },
  { name: 'sm', minWidth: 0, columns: 4 }
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function itemsOverlap(first: ResizableDashboardLayoutItem, second: ResizableDashboardLayoutItem) {
  return first.x < second.x + second.w &&
    first.x + first.w > second.x &&
    first.y < second.y + second.h &&
    first.y + first.h > second.y
}

function cloneLayout(layout: ResizableDashboardLayoutItem[]) {
  return layout.map((item) => ({ ...item }))
}

function getStoredLayouts(persistKey: string | undefined) {
  if (!persistKey || typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(persistKey)
    return stored ? JSON.parse(stored) as Record<string, ResizableDashboardLayoutItem[]> : null
  } catch {
    return null
  }
}

function getBreakpoint(width: number, breakpoints: ResizableDashboardBreakpoint[]) {
  return [...breakpoints].sort((a, b) => b.minWidth - a.minWidth).find((breakpoint) => width >= breakpoint.minWidth) ?? breakpoints[0]
}

function normalizeItem(item: ResizableDashboardLayoutItem, columns: number): ResizableDashboardLayoutItem {
  const minW = item.minW ?? 1
  const minH = item.minH ?? 1
  const maxW = item.maxW ?? columns
  const maxH = item.maxH ?? 999
  const w = clamp(Math.round(item.w), minW, Math.min(maxW, columns))
  const h = clamp(Math.round(item.h), minH, maxH)

  return {
    ...item,
    minW,
    minH,
    maxW,
    maxH,
    w,
    h,
    x: clamp(Math.round(item.x), 0, Math.max(0, columns - w)),
    y: Math.max(0, Math.round(item.y))
  }
}

function createLayout(widgets: ResizableDashboardWidget[], columns: number, breakpoint: string) {
  let cursorX = 0
  let cursorY = 0
  let rowHeight = 0

  return widgets.map((widget) => {
    const source = widget.layouts?.[breakpoint] ?? widget.layout
    const generated = {
      x: cursorX,
      y: cursorY,
      w: Math.min(4, columns),
      h: 3
    }
    const item = normalizeItem({ id: widget.id, ...(source ?? generated) }, columns)

    cursorX += item.w
    rowHeight = Math.max(rowHeight, item.h)

    if (cursorX >= columns) {
      cursorX = 0
      cursorY += rowHeight
      rowHeight = 0
    }

    return item
  })
}

function syncLayout(layout: ResizableDashboardLayoutItem[], widgets: ResizableDashboardWidget[], columns: number, breakpoint: string) {
  const byId = new Map(layout.map((item) => [item.id, item]))
  const generated = createLayout(widgets, columns, breakpoint)

  return widgets.map((widget, index) => normalizeItem(byId.get(widget.id) ?? generated[index], columns))
}

function settleLayout(layout: ResizableDashboardLayoutItem[], columns: number, activeId?: string) {
  const nextLayout = cloneLayout(layout).map((item) => normalizeItem(item, columns))
  const sorted = [...nextLayout].sort((a, b) => {
    if (a.id === activeId) {
      return -1
    }

    if (b.id === activeId) {
      return 1
    }

    return a.y - b.y || a.x - b.x
  })

  sorted.forEach((item) => {
    let moved = true

    while (moved) {
      moved = false

      sorted.forEach((other) => {
        if (other.id !== item.id && itemsOverlap(item, other)) {
          other.y = item.y + item.h
          moved = true
        }
      })
    }
  })

  return nextLayout
}

function compactLayout(layout: ResizableDashboardLayoutItem[]) {
  const nextLayout = cloneLayout(layout).sort((a, b) => a.y - b.y || a.x - b.x)

  nextLayout.forEach((item) => {
    while (item.y > 0) {
      const candidate = { ...item, y: item.y - 1 }

      if (nextLayout.some((other) => other.id !== item.id && itemsOverlap(candidate, other))) {
        break
      }

      item.y -= 1
    }
  })

  return nextLayout
}

export function ResizableDashboard({
  widgets,
  layouts: controlledLayouts,
  defaultLayouts,
  breakpoints = defaultBreakpoints,
  rowHeight = 88,
  gap = 12,
  persistKey,
  showGuides = true,
  onLayoutsChange,
  sx,
  ...props
}: ResizableDashboardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  const [internalLayouts, setInternalLayouts] = useState<Record<string, ResizableDashboardLayoutItem[]>>(() => getStoredLayouts(persistKey) ?? defaultLayouts ?? {})
  const [dragState, setDragState] = useState<DragState | null>(null)
  const breakpoint = useMemo(() => getBreakpoint(width, breakpoints), [breakpoints, width])
  const layouts = controlledLayouts ?? internalLayouts
  const currentLayout = useMemo(
    () => syncLayout(layouts[breakpoint.name] ?? [], widgets, breakpoint.columns, breakpoint.name),
    [breakpoint.columns, breakpoint.name, layouts, widgets]
  )
  const dashboardHeight = Math.max(1, ...currentLayout.map((item) => item.y + item.h)) * (rowHeight + gap) - gap
  const columnWidth = width > 0 ? (width - gap * (breakpoint.columns - 1)) / breakpoint.columns : 0
  const activeItem = dragState ? currentLayout.find((item) => item.id === dragState.id) : null

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (persistKey && controlledLayouts === undefined) {
      window.localStorage.setItem(persistKey, JSON.stringify(internalLayouts))
    }
  }, [controlledLayouts, internalLayouts, persistKey])

  function commitLayout(nextLayout: ResizableDashboardLayoutItem[], shouldCompact = false) {
    const settledLayout = settleLayout(nextLayout, breakpoint.columns, dragState?.id)
    const finalLayout = shouldCompact ? compactLayout(settledLayout) : settledLayout
    const nextLayouts = {
      ...layouts,
      [breakpoint.name]: finalLayout
    }

    if (controlledLayouts === undefined) {
      setInternalLayouts(nextLayouts)
    }

    onLayoutsChange?.(nextLayouts, breakpoint.name)
  }

  function updateActive(clientX: number, clientY: number) {
    if (!dragState || columnWidth <= 0) {
      return
    }

    const dx = clientX - dragState.startX
    const dy = clientY - dragState.startY
    const deltaX = Math.round(dx / (columnWidth + gap))
    const deltaY = Math.round(dy / (rowHeight + gap))
    const nextLayout = cloneLayout(dragState.layout)
    const item = nextLayout.find((layoutItem) => layoutItem.id === dragState.id)

    if (!item) {
      return
    }

    if (dragState.mode === 'move') {
      item.x = clamp(dragState.item.x + deltaX, 0, Math.max(0, breakpoint.columns - item.w))
      item.y = Math.max(0, dragState.item.y + deltaY)
    } else {
      item.w = clamp(dragState.item.w + deltaX, item.minW ?? 1, Math.min(item.maxW ?? breakpoint.columns, breakpoint.columns - item.x))
      item.h = clamp(dragState.item.h + deltaY, item.minH ?? 1, item.maxH ?? 999)
    }

    commitLayout(nextLayout)
  }

  function startDrag(event: PointerEvent<HTMLElement>, item: ResizableDashboardLayoutItem, mode: DragState['mode']) {
    const nextDragState = {
      id: item.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      item,
      layout: currentLayout
    }

    setDragState(nextDragState)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function stopDrag() {
    if (dragState) {
      commitLayout(currentLayout, true)
    }

    setDragState(null)
  }

  return (
    <Box
      {...props}
      ref={containerRef}
      sx={[
        {
          position: 'relative',
          minHeight: dashboardHeight,
          touchAction: 'none',
          userSelect: dragState ? 'none' : undefined,
          opacity: width > 0 ? 1 : 0,
          backgroundImage: showGuides
            ? `linear-gradient(to right, rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.08) 1px, transparent 1px)`
            : undefined,
          backgroundSize: showGuides ? `${columnWidth + gap}px ${rowHeight + gap}px` : undefined,
          backgroundPosition: showGuides ? `0 0` : undefined
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      onPointerMove={(event) => updateActive(event.clientX, event.clientY)}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
    >
      {showGuides && activeItem && (
        <Box
          sx={{
            position: 'absolute',
            left: activeItem.x * (columnWidth + gap),
            top: activeItem.y * (rowHeight + gap),
            width: activeItem.w * columnWidth + (activeItem.w - 1) * gap,
            height: activeItem.h * rowHeight + (activeItem.h - 1) * gap,
            border: '2px dashed',
            borderColor: 'primary.main',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}

      {widgets.map((widget) => {
        const item = currentLayout.find((layoutItem) => layoutItem.id === widget.id)

        if (!item) {
          return null
        }

        return (
          <Paper
            key={widget.id}
            variant="outlined"
            sx={{
              position: 'absolute',
              left: item.x * (columnWidth + gap),
              top: item.y * (rowHeight + gap),
              width: item.w * columnWidth + (item.w - 1) * gap,
              height: item.h * rowHeight + (item.h - 1) * gap,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              boxShadow: dragState?.id === item.id ? '0 18px 40px rgba(15,23,42,0.18)' : '0 8px 22px rgba(15,23,42,0.08)',
              transition: dragState ? 'none' : 'left 160ms ease, top 160ms ease, width 160ms ease, height 160ms ease, box-shadow 160ms ease',
              zIndex: dragState?.id === item.id ? 2 : 0
            }}
          >
            <Box
              sx={{
                height: 42,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderBottom: 1,
                borderColor: 'divider',
                cursor: dragState?.id === item.id && dragState.mode === 'move' ? 'grabbing' : 'grab',
                bgcolor: 'background.default'
              }}
              onPointerDown={(event) => startDrag(event, item, 'move')}
            >
              <DragIndicatorIcon fontSize="small" color="disabled" />
              <Typography variant="subtitle2" fontWeight={850} noWrap sx={{ minWidth: 0 }}>
                {widget.title ?? widget.id}
              </Typography>
            </Box>
            <Box sx={{ height: 'calc(100% - 42px)', overflow: 'auto', p: 2 }}>
              {widget.children}
            </Box>
            <Box
              aria-label="Resize widget"
              role="button"
              tabIndex={0}
              sx={{
                position: 'absolute',
                right: 6,
                bottom: 6,
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
              onPointerDown={(event) => startDrag(event, item, 'resize')}
            >
              <OpenWithIcon fontSize="small" />
            </Box>
          </Paper>
        )
      })}
    </Box>
  )
}
