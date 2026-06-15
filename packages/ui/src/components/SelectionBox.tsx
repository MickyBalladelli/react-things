import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { PointerEvent, ReactNode } from 'react'

export type SelectionBoxRect = {
  x: number
  y: number
  width: number
  height: number
}

export type SelectionBoxChangeReason = 'click' | 'drag' | 'clear'

export type SelectionBoxChange = {
  selectedIds: string[]
  addedIds: string[]
  removedIds: string[]
  reason: SelectionBoxChangeReason
}

export type SelectionBoxProps = Omit<BoxProps, 'children' | 'onChange'> & {
  children?: ReactNode | ((state: { selectedIds: string[], selecting: boolean, selectionRect: SelectionBoxRect | null }) => ReactNode)
  selectedIds?: string[]
  defaultSelectedIds?: string[]
  itemSelector?: string
  selectedAttribute?: string
  dragThreshold?: number
  clearOnEmpty?: boolean
  selectionColor?: string
  selectionRectSx?: BoxProps['sx']
  disabled?: boolean
  onSelectionChange?: (change: SelectionBoxChange) => void
}

function getSelectionRect(startX: number, startY: number, currentX: number, currentY: number): SelectionBoxRect {
  return {
    x: Math.min(startX, currentX),
    y: Math.min(startY, currentY),
    width: Math.abs(currentX - startX),
    height: Math.abs(currentY - startY)
  }
}

function intersects(first: DOMRect | SelectionBoxRect, second: DOMRect | SelectionBoxRect) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y
}

function diffIds(nextIds: string[], previousIds: string[]) {
  return {
    addedIds: nextIds.filter((id) => !previousIds.includes(id)),
    removedIds: previousIds.filter((id) => !nextIds.includes(id))
  }
}

function mergeSelection(baseIds: string[], hitIds: string[], event: PointerEvent | PointerEvent<Element> | PointerEvent<HTMLDivElement>) {
  if (event.metaKey || event.ctrlKey) {
    return Array.from(new Set([
      ...baseIds.filter((id) => !hitIds.includes(id)),
      ...hitIds.filter((id) => !baseIds.includes(id))
    ]))
  }

  if (event.shiftKey) {
    return Array.from(new Set([...baseIds, ...hitIds]))
  }

  return hitIds
}

export function SelectionBox({
  children,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  itemSelector = '[data-selection-id]',
  selectedAttribute = 'data-selection-selected',
  dragThreshold = 4,
  clearOnEmpty = true,
  selectionColor = '#2563eb',
  selectionRectSx,
  disabled = false,
  onSelectionChange,
  sx,
  ...props
}: SelectionBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startLocalX: number
    startLocalY: number
    baseIds: string[]
    originId: string | null
    additiveEvent: PointerEvent<HTMLDivElement>
  } | null>(null)
  const [internalSelectedIds, setInternalSelectedIds] = useState(defaultSelectedIds)
  const [selectionRect, setSelectionRect] = useState<SelectionBoxRect | null>(null)
  const [selecting, setSelecting] = useState(false)
  const selectedIds = controlledSelectedIds ?? internalSelectedIds
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    container.querySelectorAll<HTMLElement>(itemSelector).forEach((element) => {
      const id = element.dataset.selectionId

      if (!id) {
        return
      }

      if (selectedIdSet.has(id)) {
        element.setAttribute(selectedAttribute, 'true')
      } else {
        element.removeAttribute(selectedAttribute)
      }
    })
  }, [itemSelector, selectedAttribute, selectedIdSet])

  function commitSelection(nextIds: string[], reason: SelectionBoxChangeReason) {
    const normalizedIds = Array.from(new Set(nextIds))
    const { addedIds, removedIds } = diffIds(normalizedIds, selectedIds)

    if (controlledSelectedIds === undefined) {
      setInternalSelectedIds(normalizedIds)
    }

    onSelectionChange?.({
      selectedIds: normalizedIds,
      addedIds,
      removedIds,
      reason
    })
  }

  function getLocalPoint(clientX: number, clientY: number) {
    const bounds = containerRef.current?.getBoundingClientRect()

    return {
      x: clientX - (bounds?.left ?? 0),
      y: clientY - (bounds?.top ?? 0)
    }
  }

  function getHitIds(rect: SelectionBoxRect) {
    const container = containerRef.current
    const bounds = container?.getBoundingClientRect()

    if (!container || !bounds) {
      return []
    }

    const screenRect = {
      x: bounds.left + rect.x,
      y: bounds.top + rect.y,
      width: rect.width,
      height: rect.height
    }

    return Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
      .filter((element) => intersects(element.getBoundingClientRect(), screenRect))
      .map((element) => element.dataset.selectionId)
      .filter((id): id is string => Boolean(id))
  }

  function startSelection(event: PointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0) {
      return
    }

    const target = event.target as HTMLElement
    const item = target.closest<HTMLElement>(itemSelector)
    const point = getLocalPoint(event.clientX, event.clientY)

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startLocalX: point.x,
      startLocalY: point.y,
      baseIds: selectedIds,
      originId: item?.dataset.selectionId ?? null,
      additiveEvent: event
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveSelection(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const moved = Math.hypot(event.clientX - dragState.startClientX, event.clientY - dragState.startClientY)

    if (moved < dragThreshold) {
      return
    }

    const point = getLocalPoint(event.clientX, event.clientY)
    const rect = getSelectionRect(dragState.startLocalX, dragState.startLocalY, point.x, point.y)
    const hitIds = getHitIds(rect)

    setSelecting(true)
    setSelectionRect(rect)
    commitSelection(mergeSelection(dragState.baseIds, hitIds, dragState.additiveEvent), 'drag')
  }

  function endSelection(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const wasSelecting = selecting

    dragStateRef.current = null
    setSelecting(false)
    setSelectionRect(null)

    if (wasSelecting) {
      return
    }

    if (dragState.originId) {
      commitSelection(mergeSelection(dragState.baseIds, [dragState.originId], dragState.additiveEvent), 'click')
      return
    }

    if (clearOnEmpty) {
      commitSelection([], 'clear')
    }
  }

  return (
    <Box
      {...props}
      ref={containerRef}
      onPointerDown={startSelection}
      onPointerMove={moveSelection}
      onPointerUp={endSelection}
      onPointerCancel={endSelection}
      sx={[
        {
          position: 'relative',
          userSelect: selecting ? 'none' : undefined,
          touchAction: 'none',
          '& [data-selection-id]': {
            cursor: 'default'
          },
          [`& [${selectedAttribute}="true"]`]: {
            outline: `2px solid ${selectionColor}`,
            outlineOffset: 2
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {typeof children === 'function' ? children({ selectedIds, selecting, selectionRect }) : children}
      {selectionRect ? (
        <Box
          sx={[
            {
              position: 'absolute',
              left: selectionRect.x,
              top: selectionRect.y,
              width: selectionRect.width,
              height: selectionRect.height,
              border: `1px solid ${selectionColor}`,
              bgcolor: `${selectionColor}22`,
              pointerEvents: 'none',
              zIndex: 20
            },
            ...(Array.isArray(selectionRectSx) ? selectionRectSx : selectionRectSx ? [selectionRectSx] : [])
          ]}
        />
      ) : null}
    </Box>
  )
}
