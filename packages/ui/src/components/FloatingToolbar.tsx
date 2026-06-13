import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode, RefObject } from 'react'

export type FloatingToolbarPlacement = 'top' | 'bottom'

export type FloatingToolbarProps = BoxProps & {
  open: boolean
  children: ReactNode
  anchorEl?: HTMLElement | null
  anchorRect?: DOMRect | null
  containerRef?: RefObject<HTMLElement | null>
  placement?: FloatingToolbarPlacement
  offset?: number
  boundaryPadding?: number
  autoUpdate?: boolean
  arrow?: boolean
}

type Position = {
  left: number
  top: number
}

function getAnchorRect(anchorEl?: HTMLElement | null, anchorRect?: DOMRect | null) {
  return anchorRect ?? anchorEl?.getBoundingClientRect() ?? null
}

export function FloatingToolbar({
  open,
  children,
  anchorEl,
  anchorRect,
  containerRef,
  placement = 'top',
  offset = 8,
  boundaryPadding = 8,
  autoUpdate = true,
  arrow = true,
  sx,
  ...props
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState<Position>({ left: -9999, top: -9999 })

  const updatePosition = useCallback(() => {
    if (!open) {
      return
    }

    const rect = getAnchorRect(anchorEl, anchorRect)
    const toolbar = toolbarRef.current

    if (!rect || !toolbar) {
      return
    }

    const containerRect = containerRef?.current?.getBoundingClientRect()
    const leftBase = containerRect?.left ?? 0
    const topBase = containerRect?.top ?? 0
    const boundaryWidth = containerRect?.width ?? window.innerWidth
    const boundaryHeight = containerRect?.height ?? window.innerHeight
    const halfWidth = toolbar.offsetWidth / 2
    const height = toolbar.offsetHeight
    const rawLeft = rect.left - leftBase + rect.width / 2
    const rawTop = placement === 'top'
      ? rect.top - topBase - offset
      : rect.bottom - topBase + offset
    const left = Math.min(Math.max(rawLeft, halfWidth + boundaryPadding), boundaryWidth - halfWidth - boundaryPadding)
    const top = placement === 'top'
      ? Math.max(rawTop, height + boundaryPadding)
      : Math.min(rawTop, boundaryHeight - height - boundaryPadding)

    setPosition({ left, top })
  }, [anchorEl, anchorRect, boundaryPadding, containerRef, offset, open, placement])

  useLayoutEffect(() => {
    updatePosition()
  }, [updatePosition])

  useEffect(() => {
    if (!open || !autoUpdate) {
      return undefined
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [autoUpdate, open, updatePosition])

  if (!open) {
    return null
  }

  return (
    <Box
      {...props}
      ref={toolbarRef}
      role="toolbar"
      sx={[
        {
          position: containerRef ? 'absolute' : 'fixed',
          left: position.left,
          top: position.top,
          zIndex: 1300,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          p: 0.5,
          borderRadius: 1.5,
          bgcolor: 'rgba(15,23,42,0.96)',
          color: '#e5e7eb',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.34)',
          transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
          backdropFilter: 'blur(12px)',
          '&::after': arrow ? {
            content: '""',
            position: 'absolute',
            left: '50%',
            width: 10,
            height: 10,
            bgcolor: 'rgba(15,23,42,0.96)',
            transform: 'translateX(-50%) rotate(45deg)',
            bottom: placement === 'top' ? -5 : undefined,
            top: placement === 'bottom' ? -5 : undefined
          } : undefined
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}
    </Box>
  )
}
