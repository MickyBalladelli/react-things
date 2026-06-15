import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { RefObject } from 'react'
import type { PaperProps } from '@mui/material/Paper'

export type MiniMapNavigatorItem = {
  id: string
  label: string
  description?: string
  targetId?: string
  top?: number
  height?: number
  color?: string
}

export type MiniMapNavigatorMeasure = {
  scrollTop: number
  viewportHeight: number
  contentHeight: number
}

export type MiniMapNavigatorProps = Omit<PaperProps, 'onChange'> & {
  items: MiniMapNavigatorItem[]
  containerRef?: RefObject<HTMLElement | null>
  activeId?: string
  title?: string
  subtitle?: string
  height?: number
  minItemHeight?: number
  sticky?: boolean
  showLabels?: boolean
  showProgress?: boolean
  onActiveChange?: (item: MiniMapNavigatorItem) => void
  onNavigate?: (item: MiniMapNavigatorItem) => void
  onMeasureChange?: (measure: MiniMapNavigatorMeasure) => void
}

type MeasuredItem = MiniMapNavigatorItem & {
  top: number
  height: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getScrollElement(containerRef?: RefObject<HTMLElement | null>) {
  return containerRef?.current ?? document.scrollingElement ?? document.documentElement
}

function findTarget(item: MiniMapNavigatorItem, container: Element) {
  if (!item.targetId) {
    return null
  }

  return container.querySelector(`#${CSS.escape(item.targetId)}`) ?? document.getElementById(item.targetId)
}

function measureItems(items: MiniMapNavigatorItem[], container: Element, scrollTop: number): MeasuredItem[] {
  const containerRect = container === document.documentElement || container === document.body
    ? { top: 0 }
    : container.getBoundingClientRect()

  return items.map((item, index) => {
    const target = findTarget(item, container)

    if (target) {
      const rect = target.getBoundingClientRect()

      return {
        ...item,
        top: rect.top - containerRect.top + scrollTop,
        height: Math.max(rect.height, item.height ?? 48)
      }
    }

    return {
      ...item,
      top: item.top ?? index * 180,
      height: item.height ?? 120
    }
  })
}

export function MiniMapNavigator({
  items,
  containerRef,
  activeId,
  title = 'Mini map',
  subtitle = 'Jump through long content.',
  height = 280,
  minItemHeight = 4,
  sticky = false,
  showLabels = true,
  showProgress = true,
  onActiveChange,
  onNavigate,
  onMeasureChange,
  sx,
  ...props
}: MiniMapNavigatorProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const notifiedActiveIdRef = useRef<string | null>(null)
  const [measure, setMeasure] = useState<MiniMapNavigatorMeasure>({
    scrollTop: 0,
    viewportHeight: 1,
    contentHeight: 1
  })
  const [measuredItems, setMeasuredItems] = useState<MeasuredItem[]>([])
  const progress = clamp(measure.scrollTop / Math.max(1, measure.contentHeight - measure.viewportHeight), 0, 1)
  const resolvedActiveId = activeId ?? measuredItems.find((item, index) => {
    const next = measuredItems[index + 1]

    return measure.scrollTop >= item.top - 8 && (!next || measure.scrollTop < next.top - 8)
  })?.id
  const activeItem = useMemo(
    () => measuredItems.find((item) => item.id === resolvedActiveId),
    [measuredItems, resolvedActiveId]
  )

  useEffect(() => {
    const container = getScrollElement(containerRef)

    function updateMeasure() {
      const nextMeasure = {
        scrollTop: 'scrollTop' in container ? container.scrollTop : window.scrollY,
        viewportHeight: 'clientHeight' in container ? container.clientHeight : window.innerHeight,
        contentHeight: 'scrollHeight' in container ? container.scrollHeight : document.documentElement.scrollHeight
      }

      const nextItems = measureItems(items, container, nextMeasure.scrollTop)

      setMeasure(nextMeasure)
      setMeasuredItems(nextItems)
      onMeasureChange?.(nextMeasure)

      const nextActive = nextItems.find((item, index) => {
        const following = nextItems[index + 1]

        return nextMeasure.scrollTop >= item.top - 8 && (!following || nextMeasure.scrollTop < following.top - 8)
      })

      if (nextActive) {
        if (notifiedActiveIdRef.current !== nextActive.id) {
          notifiedActiveIdRef.current = nextActive.id
          onActiveChange?.(nextActive)
        }
      }
    }

    updateMeasure()
    container.addEventListener('scroll', updateMeasure, { passive: true })
    window.addEventListener('resize', updateMeasure)

    return () => {
      container.removeEventListener('scroll', updateMeasure)
      window.removeEventListener('resize', updateMeasure)
    }
  }, [containerRef, items, onActiveChange, onMeasureChange])

  function scrollToTop(top: number, behavior: ScrollBehavior = 'smooth') {
    const container = getScrollElement(containerRef)
    container.scrollTo({
      top: clamp(top, 0, Math.max(0, measure.contentHeight - measure.viewportHeight)),
      behavior
    })
  }

  function navigateToItem(item: MeasuredItem) {
    scrollToTop(item.top)
    onNavigate?.(item)
  }

  function handleMapPointer(clientY: number) {
    const rect = mapRef.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    const percent = clamp((clientY - rect.top) / rect.height, 0, 1)
    const nextTop = percent * measure.contentHeight - measure.viewportHeight / 2
    scrollToTop(nextTop, 'auto')
  }

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        {
          p: 1.5,
          borderRadius: 1,
          position: sticky ? 'sticky' : 'relative',
          top: sticky ? 16 : undefined,
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack spacing={1.25}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={950}>
              {title}
            </Typography>
            {showProgress ? <Chip size="small" label={`${Math.round(progress * 100)}%`} /> : null}
          </Stack>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        <Box
          ref={mapRef}
          role="navigation"
          aria-label={title}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            handleMapPointer(event.clientY)
          }}
          onPointerMove={(event) => {
            if (event.buttons === 1) {
              handleMapPointer(event.clientY)
            }
          }}
          sx={(theme) => ({
            position: 'relative',
            height,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.03) : '#f8fafc',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.14 : 0.12)} 1px, transparent 1px)`,
            backgroundSize: '100% 24px'
          })}
        >
          {measuredItems.map((item) => {
            const top = `${(item.top / measure.contentHeight) * 100}%`
            const itemHeight = Math.max(minItemHeight, (item.height / measure.contentHeight) * height)
            const selected = item.id === resolvedActiveId

            return (
              <Tooltip key={item.id} title={item.description ?? item.label} placement="left" arrow>
                <Box
                  component="button"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    navigateToItem(item)
                  }}
                  sx={{
                    position: 'absolute',
                    left: selected ? 8 : 12,
                    right: selected ? 8 : 12,
                    top,
                    minHeight: itemHeight,
                    border: 0,
                    borderRadius: 0.75,
                    bgcolor: selected ? 'primary.main' : item.color ?? '#94a3b8',
                    opacity: selected ? 0.95 : 0.58,
                    cursor: 'pointer',
                    transition: 'left 140ms ease, right 140ms ease, opacity 140ms ease',
                    '&:hover': {
                      opacity: 0.92
                    }
                  }}
                />
              </Tooltip>
            )
          })}

          <Box
            sx={(theme) => ({
              position: 'absolute',
              left: 4,
              right: 4,
              top: `${(measure.scrollTop / measure.contentHeight) * 100}%`,
              height: `${Math.max(8, (measure.viewportHeight / measure.contentHeight) * height)}px`,
              border: 2,
              borderColor: 'primary.main',
              borderRadius: 0.75,
              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08),
              pointerEvents: 'none'
            })}
          />
        </Box>

        {showLabels ? (
          <Stack spacing={0.5}>
            {measuredItems.map((item) => (
              <Box
                key={item.id}
                component="button"
                type="button"
                onClick={() => navigateToItem(item)}
                sx={(theme) => ({
                  border: 0,
                  p: 0.75,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  textAlign: 'left',
                  bgcolor: item.id === resolvedActiveId ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08) : 'transparent',
                  color: item.id === resolvedActiveId ? 'primary.main' : 'text.primary',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.04)
                  }
                })}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: 99, bgcolor: item.color ?? '#94a3b8', flex: '0 0 auto' }} />
                <Typography variant="caption" fontWeight={item.id === resolvedActiveId ? 950 : 800} noWrap>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  )
}
