import { useLayoutEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type DraggableBoxPosition = {
  x: number
  y: number
}

export type DraggableBoxMetrics = {
  containerWidth: number
  containerHeight: number
  draggableWidth: number
  draggableHeight: number
  draggableLeft: number
  draggableTop: number
  containerBackgroundImage: string
  containerBackgroundSize: string
  containerBackgroundPosition: string
}

export type DraggableBoxProps = BoxProps & {
  children: ReactNode
  initialPosition?: DraggableBoxPosition
  dragSx?: BoxProps['sx']
  onPositionChange?: (position: DraggableBoxPosition, metrics?: DraggableBoxMetrics) => void
  onDraggingChange?: (dragging: boolean) => void
}

type DragOffset = {
  x: number
  y: number
}

export function DraggableBox({
  children,
  initialPosition = { x: 50, y: 50 },
  dragSx,
  onPositionChange,
  onDraggingChange,
  sx,
  ...props
}: DraggableBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(initialPosition)
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const draggable = draggableRef.current

    if (!container || !draggable) {
      return
    }

    const containerBounds = container.getBoundingClientRect()
    const draggableBounds = draggable.getBoundingClientRect()
    const containerStyle = window.getComputedStyle(container)
    const centerX = (position.x / 100) * containerBounds.width
    const centerY = (position.y / 100) * containerBounds.height

    onPositionChange?.(position, {
      containerWidth: containerBounds.width,
      containerHeight: containerBounds.height,
      draggableWidth: draggableBounds.width,
      draggableHeight: draggableBounds.height,
      draggableLeft: centerX - draggableBounds.width / 2,
      draggableTop: centerY - draggableBounds.height / 2,
      containerBackgroundImage: containerStyle.backgroundImage,
      containerBackgroundSize: containerStyle.backgroundSize,
      containerBackgroundPosition: containerStyle.backgroundPosition
    })
  }, [])

  function updatePosition(nextPosition: DraggableBoxPosition, metrics?: DraggableBoxMetrics) {
    setPosition(nextPosition)
    onPositionChange?.(nextPosition, metrics)
  }

  function moveToPointer(clientX: number, clientY: number, offset = dragOffset) {
    const container = containerRef.current
    const draggable = draggableRef.current

    if (!container || !draggable) {
      return
    }

    const containerBounds = container.getBoundingClientRect()
    const draggableBounds = draggable.getBoundingClientRect()
    const containerStyle = window.getComputedStyle(container)
    const centerX = clientX - offset.x + draggableBounds.width / 2
    const centerY = clientY - offset.y + draggableBounds.height / 2
    const halfWidth = (draggableBounds.width / containerBounds.width) * 50
    const halfHeight = (draggableBounds.height / containerBounds.height) * 50
    const nextX = ((centerX - containerBounds.left) / containerBounds.width) * 100
    const nextY = ((centerY - containerBounds.top) / containerBounds.height) * 100

    const nextPosition = {
      x: Math.min(Math.max(nextX, halfWidth), 100 - halfWidth),
      y: Math.min(Math.max(nextY, halfHeight), 100 - halfHeight)
    }
    const finalCenterX = (nextPosition.x / 100) * containerBounds.width
    const finalCenterY = (nextPosition.y / 100) * containerBounds.height

    updatePosition(nextPosition, {
      containerWidth: containerBounds.width,
      containerHeight: containerBounds.height,
      draggableWidth: draggableBounds.width,
      draggableHeight: draggableBounds.height,
      draggableLeft: finalCenterX - draggableBounds.width / 2,
      draggableTop: finalCenterY - draggableBounds.height / 2,
      containerBackgroundImage: containerStyle.backgroundImage,
      containerBackgroundSize: containerStyle.backgroundSize,
      containerBackgroundPosition: containerStyle.backgroundPosition
    })
  }

  return (
    <Box
      {...props}
      ref={containerRef}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      onPointerMove={(event) => {
        if (dragging) {
          moveToPointer(event.clientX, event.clientY)
        }
      }}
      onPointerUp={(event) => {
        setDragging(false)
        onDraggingChange?.(false)
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onPointerCancel={() => {
        setDragging(false)
        onDraggingChange?.(false)
      }}
    >
      <Box
        ref={draggableRef}
        sx={[
          {
            position: 'absolute',
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none'
          },
          ...(Array.isArray(dragSx) ? dragSx : dragSx ? [dragSx] : [])
        ]}
        onPointerDown={(event) => {
          const draggableBounds = event.currentTarget.getBoundingClientRect()
          const nextOffset = {
            x: event.clientX - draggableBounds.left,
            y: event.clientY - draggableBounds.top
          }

          setDragging(true)
          onDraggingChange?.(true)
          setDragOffset(nextOffset)
          event.currentTarget.setPointerCapture(event.pointerId)
          moveToPointer(event.clientX, event.clientY, nextOffset)
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
