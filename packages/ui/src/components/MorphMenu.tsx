import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { KeyboardEvent, ReactElement, ReactNode } from 'react'

export type MorphMenuItem = {
  id: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export type MorphMenuProps = Omit<BoxProps, 'onSelect'> & {
  children: ReactElement
  items: MorphMenuItem[]
  open?: boolean
  defaultOpen?: boolean
  radius?: number
  startAngle?: number
  endAngle?: number
  itemSize?: number
  showLabels?: boolean
  closeOnSelect?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (item: MorphMenuItem) => void
}

function polarToCartesian(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius
  }
}

function getNextEnabledIndex(items: MorphMenuItem[], currentIndex: number, direction: 1 | -1) {
  if (!items.length) {
    return -1
  }

  let nextIndex = currentIndex

  for (let index = 0; index < items.length; index += 1) {
    nextIndex = (nextIndex + direction + items.length) % items.length

    if (!items[nextIndex].disabled) {
      return nextIndex
    }
  }

  return currentIndex
}

export function MorphMenu({
  children,
  items,
  open: controlledOpen,
  defaultOpen = false,
  radius = 112,
  startAngle = -160,
  endAngle = -20,
  itemSize = 52,
  showLabels = true,
  closeOnSelect = true,
  onOpenChange,
  onSelect,
  sx,
  ...props
}: MorphMenuProps) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const open = controlledOpen ?? internalOpen
  const firstEnabledIndex = useMemo(() => items.findIndex((item) => !item.disabled), [items])
  const triggerRect = triggerRef.current?.getBoundingClientRect()
  const origin = triggerRect
    ? {
      x: triggerRect.left + triggerRect.width / 2,
      y: triggerRect.top + triggerRect.height / 2
    }
    : { x: 0, y: 0 }

  useEffect(() => {
    if (open) {
      const nextIndex = firstEnabledIndex >= 0 ? firstEnabledIndex : 0

      setFocusedIndex(nextIndex)
      window.setTimeout(() => itemRefs.current[nextIndex]?.focus(), 120)
    }
  }, [firstEnabledIndex, open])

  function setOpen(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  function selectItem(item: MorphMenuItem) {
    if (item.disabled) {
      return
    }

    item.onClick?.()
    onSelect?.(item)

    if (closeOnSelect) {
      setOpen(false)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!open && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown')) {
      setOpen(true)
      event.preventDefault()
      return
    }

    if (!open) {
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
      triggerRef.current?.focus()
      event.preventDefault()
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      const nextIndex = getNextEnabledIndex(items, focusedIndex, 1)
      setFocusedIndex(nextIndex)
      itemRefs.current[nextIndex]?.focus()
      event.preventDefault()
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      const nextIndex = getNextEnabledIndex(items, focusedIndex, -1)
      setFocusedIndex(nextIndex)
      itemRefs.current[nextIndex]?.focus()
      event.preventDefault()
    }

    if (event.key === 'Enter' || event.key === ' ') {
      const item = items[focusedIndex]

      if (item) {
        selectItem(item)
        event.preventDefault()
      }
    }
  }

  return (
    <>
      <Box
        component="span"
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        sx={{ display: 'inline-flex' }}
      >
        {children}
      </Box>
      <Fade in={open}>
        <Box
          {...props}
          role="menu"
          onKeyDown={handleKeyDown}
          sx={[
            {
              position: 'fixed',
              inset: 0,
              zIndex: 1500,
              pointerEvents: open ? 'auto' : 'none'
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
          ]}
        >
          <ClickAwayListener
            onClickAway={(event) => {
              if (triggerRef.current?.contains(event.target as Node)) {
                return
              }

              setOpen(false)
            }}
          >
            <Box sx={{ position: 'absolute', left: origin.x, top: origin.y }}>
              <Paper
                elevation={10}
                sx={{
                  position: 'absolute',
                  left: -itemSize / 2,
                  top: -itemSize / 2,
                  width: itemSize,
                  height: itemSize,
                  borderRadius: '50%',
                  transform: open ? 'scale(1)' : 'scale(0.2)',
                  opacity: open ? 0.18 : 0,
                  transition: 'transform 180ms ease, opacity 180ms ease',
                  bgcolor: 'primary.main'
                }}
              />
              {items.map((item, index) => {
                const angle = items.length === 1 ? (startAngle + endAngle) / 2 : startAngle + ((endAngle - startAngle) / (items.length - 1)) * index
                const position = polarToCartesian(radius, angle)
                const focused = focusedIndex === index

                return (
                  <Box
                    key={item.id}
                    sx={{
                      position: 'absolute',
                      left: -itemSize / 2,
                      top: -itemSize / 2,
                      transform: open ? `translate(${position.x}px, ${position.y}px) scale(1)` : 'translate(0, 0) scale(0.2)',
                      opacity: open ? 1 : 0,
                      transition: `transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 24}ms, opacity 160ms ease ${index * 24}ms`
                    }}
                  >
                    <IconButton
                      ref={(element) => {
                        itemRefs.current[index] = element
                      }}
                      role="menuitem"
                      aria-label={typeof item.label === 'string' ? item.label : item.id}
                      disabled={item.disabled}
                      onClick={() => selectItem(item)}
                      onFocus={() => setFocusedIndex(index)}
                      sx={{
                        width: itemSize,
                        height: itemSize,
                        border: 1,
                        borderColor: focused ? 'primary.main' : 'divider',
                        bgcolor: 'background.paper',
                        boxShadow: focused ? '0 0 0 4px rgba(37,99,235,0.16), 0 18px 38px rgba(15,23,42,0.18)' : '0 12px 28px rgba(15,23,42,0.16)',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      {item.icon ?? String(item.label).slice(0, 1)}
                    </IconButton>
                    {showLabels ? (
                      <Typography
                        variant="caption"
                        fontWeight={850}
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          top: itemSize + 6,
                          transform: 'translateX(-50%)',
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.75,
                          whiteSpace: 'nowrap',
                          bgcolor: 'background.paper',
                          boxShadow: '0 8px 20px rgba(15,23,42,0.14)'
                        }}
                      >
                        {item.label}
                      </Typography>
                    ) : null}
                  </Box>
                )
              })}
            </Box>
          </ClickAwayListener>
        </Box>
      </Fade>
    </>
  )
}
