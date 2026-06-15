import { useEffect, useMemo, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { DragEvent, ReactNode } from 'react'

export type DockTabPlacement = 'top' | 'left'

export type DockTab = {
  id: string
  label: ReactNode
  icon?: ReactNode
  preview?: ReactNode
  disabled?: boolean
  dock?: DockTabPlacement
}

export type DockTabsProps = BoxProps & {
  tabs: DockTab[]
  activeId?: string
  defaultActiveId?: string
  maxVisible?: number
  allowDrag?: boolean
  leftDockWidth?: number
  onTabsChange?: (tabs: DockTab[]) => void
  onActiveChange?: (tab: DockTab) => void
  onDockChange?: (tab: DockTab, dock: DockTabPlacement) => void
}

type DragState = {
  tabId: string
  fromDock: DockTabPlacement
} | null

type DropPreview = {
  dock: DockTabPlacement
  index: number
} | null

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [item] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, item)

  return nextItems
}

function tabDock(tab: DockTab): DockTabPlacement {
  return tab.dock ?? 'top'
}

function getDropIndex(event: DragEvent<HTMLElement>, index: number, vertical: boolean) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const pointer = vertical ? event.clientY : event.clientX
  const center = vertical ? bounds.top + bounds.height / 2 : bounds.left + bounds.width / 2

  return pointer > center ? index + 1 : index
}

function getDockTabs(tabs: DockTab[], dock: DockTabPlacement) {
  return tabs.filter((tab) => tabDock(tab) === dock)
}

function replaceDockTabs(tabs: DockTab[], dock: DockTabPlacement, nextDockTabs: DockTab[]) {
  const nextIds = new Set(nextDockTabs.map((tab) => tab.id))
  const otherTabs = tabs.filter((tab) => tabDock(tab) !== dock && !nextIds.has(tab.id))

  if (dock === 'left') {
    return [...nextDockTabs, ...otherTabs]
  }

  return [...otherTabs, ...nextDockTabs]
}

function moveTabToDock(tabs: DockTab[], tabId: string, dock: DockTabPlacement, index: number) {
  const tab = tabs.find((item) => item.id === tabId)

  if (!tab) {
    return tabs
  }

  const nextTab = { ...tab, dock }
  const nextDockTabs = getDockTabs(tabs.filter((item) => item.id !== tabId), dock)
  nextDockTabs.splice(Math.max(0, Math.min(index, nextDockTabs.length)), 0, nextTab)

  return replaceDockTabs(tabs.filter((item) => item.id !== tabId), dock, nextDockTabs)
}

export function DockTabs({
  tabs: controlledTabs,
  activeId: controlledActiveId,
  defaultActiveId,
  maxVisible = 8,
  allowDrag = true,
  leftDockWidth = 176,
  onTabsChange,
  onActiveChange,
  onDockChange,
  sx,
  ...props
}: DockTabsProps) {
  const [internalTabs, setInternalTabs] = useState(controlledTabs)
  const [internalActiveId, setInternalActiveId] = useState(defaultActiveId ?? controlledTabs[0]?.id)
  const [dragState, setDragState] = useState<DragState>(null)
  const [dropPreview, setDropPreview] = useState<DropPreview>(null)
  const [overflowAnchor, setOverflowAnchor] = useState<HTMLElement | null>(null)
  const tabs = internalTabs
  const activeId = controlledActiveId ?? internalActiveId
  const topTabs = useMemo(() => getDockTabs(tabs, 'top'), [tabs])
  const leftTabs = useMemo(() => getDockTabs(tabs, 'left'), [tabs])
  const visibleTopTabs = topTabs.slice(0, maxVisible)
  const visibleLeftTabs = leftTabs.slice(0, maxVisible)
  const hiddenTopCount = Math.max(0, topTabs.length - visibleTopTabs.length)
  const hiddenLeftCount = Math.max(0, leftTabs.length - visibleLeftTabs.length)

  useEffect(() => {
    setInternalTabs(controlledTabs)
  }, [controlledTabs])

  function commitTabs(nextTabs: DockTab[]) {
    setInternalTabs(nextTabs)
    onTabsChange?.(nextTabs)
  }

  function activate(tab: DockTab) {
    if (tab.disabled) {
      return
    }

    if (controlledActiveId === undefined) {
      setInternalActiveId(tab.id)
    }

    onActiveChange?.(tab)
  }

  function commitDrop(dock: DockTabPlacement, index: number) {
    if (!dragState) {
      return
    }

    const nextTabs = moveTabToDock(tabs, dragState.tabId, dock, index)
    const changedTab = nextTabs.find((tab) => tab.id === dragState.tabId)

    commitTabs(nextTabs)

    if (changedTab) {
      onDockChange?.(changedTab, dock)
    }

    setDropPreview(null)
    setDragState(null)
  }

  function moveWithinDock(tab: DockTab, dockTabs: DockTab[], dock: DockTabPlacement, index: number) {
    if (!dragState || dragState.tabId !== tab.id) {
      return
    }

    const fromIndex = dockTabs.findIndex((item) => item.id === tab.id)
    const nextDockTabs = moveItem(dockTabs, fromIndex, index > fromIndex ? index - 1 : index).map((item) => ({ ...item, dock }))
    commitTabs(replaceDockTabs(tabs, dock, nextDockTabs))
  }

  function renderTab(tab: DockTab, index: number, dock: DockTabPlacement, dockTabs: DockTab[]) {
    const selected = activeId === tab.id
    const vertical = dock === 'left'

    return (
      <Box key={tab.id} sx={{ position: 'relative' }}>
        {dropPreview?.dock === dock && dropPreview.index === index ? (
          <Box
            sx={{
              position: 'absolute',
              left: vertical ? 0 : -4,
              top: vertical ? -4 : 0,
              width: vertical ? '100%' : 3,
              height: vertical ? 3 : '100%',
              borderRadius: 999,
              bgcolor: 'primary.main',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        ) : null}
        <Tooltip title={tab.preview ?? tab.label} enterDelay={450} placement={vertical ? 'right' : 'bottom'}>
          <Paper
            draggable={allowDrag && !tab.disabled}
            onDragStart={(event) => {
              setDragState({ tabId: tab.id, fromDock: dock })
              event.dataTransfer.effectAllowed = 'move'
            }}
            onDragOver={(event) => {
              if (!dragState) {
                return
              }

              event.preventDefault()
              event.stopPropagation()
              setDropPreview({ dock, index: getDropIndex(event, index, vertical) })
            }}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              const nextIndex = getDropIndex(event, index, vertical)

              if (dragState?.fromDock === dock && dragState.tabId === tab.id) {
                moveWithinDock(tab, dockTabs, dock, nextIndex)
              } else {
                commitDrop(dock, nextIndex)
              }
            }}
            onDragEnd={() => {
              setDragState(null)
              setDropPreview(null)
            }}
            onClick={() => activate(tab)}
            variant="outlined"
            sx={(theme) => ({
              height: 38,
              width: vertical ? '100%' : 148,
              maxWidth: vertical ? 'none' : 190,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              alignItems: 'center',
              gap: 0.75,
              px: 1,
              borderRadius: vertical ? '8px 0 0 8px' : '8px 8px 0 0',
              borderColor: selected ? 'primary.main' : 'divider',
              bgcolor: selected ? 'background.paper' : alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.06 : 0.03),
              boxShadow: selected ? `0 10px 22px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.34 : 0.12)}` : 'none',
              opacity: tab.disabled ? 0.5 : dragState?.tabId === tab.id ? 0.46 : 1,
              cursor: allowDrag ? 'grab' : 'default',
              userSelect: 'none'
            })}
          >
            <Box sx={{ display: 'grid', placeItems: 'center', width: 22 }}>
              {tab.icon ?? String(tab.label).slice(0, 1)}
            </Box>
            <Typography variant="body2" fontWeight={selected ? 850 : 700} noWrap sx={{ minWidth: 0 }}>
              {tab.label}
            </Typography>
          </Paper>
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gridTemplateColumns: leftTabs.length || dragState ? `${leftDockWidth}px 1fr` : '0 1fr',
          minWidth: 0,
          minHeight: 0,
          bgcolor: 'background.default'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        onDragOver={(event) => {
          event.preventDefault()
          setDropPreview({ dock: 'top', index: topTabs.length })
        }}
        onDrop={(event) => {
          event.preventDefault()
          commitDrop('top', topTabs.length)
        }}
        sx={{
          gridColumn: '1 / -1',
          display: 'flex',
          alignItems: 'end',
          gap: 0.5,
          minWidth: 0,
          overflow: 'hidden',
          borderBottom: 1,
          borderColor: 'divider',
          px: 1,
          pt: 1
        }}
      >
        {visibleTopTabs.map((tab, index) => renderTab(tab, index, 'top', topTabs))}
        {dropPreview?.dock === 'top' && dropPreview.index >= topTabs.length ? (
          <Box sx={{ width: 3, height: 36, borderRadius: 999, bgcolor: 'primary.main', flex: '0 0 auto' }} />
        ) : null}
        {hiddenTopCount ? (
          <Paper
            component="button"
            variant="outlined"
            onClick={(event) => setOverflowAnchor(event.currentTarget)}
            sx={{ height: 36, px: 1.25, display: 'flex', alignItems: 'center', gap: 0.5, borderRadius: '8px 8px 0 0', cursor: 'pointer', bgcolor: 'background.paper' }}
          >
            <MoreHorizIcon fontSize="small" />
            <Typography variant="body2">+{hiddenTopCount}</Typography>
          </Paper>
        ) : null}
      </Box>

      <Box
        onDragOver={(event) => {
          event.preventDefault()
          setDropPreview({ dock: 'left', index: leftTabs.length })
        }}
        onDrop={(event) => {
          event.preventDefault()
          commitDrop('left', leftTabs.length)
        }}
        sx={{
          minHeight: 220,
          overflow: 'hidden',
          borderRight: 1,
          borderColor: 'divider',
          p: 1,
          display: leftTabs.length || dragState ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 0.5
        }}
      >
        {visibleLeftTabs.map((tab, index) => renderTab(tab, index, 'left', leftTabs))}
        {dropPreview?.dock === 'left' && dropPreview.index >= leftTabs.length ? (
          <Box sx={{ width: '100%', height: 3, borderRadius: 999, bgcolor: 'primary.main', flex: '0 0 auto' }} />
        ) : null}
        {hiddenLeftCount ? (
          <Paper
            component="button"
            variant="outlined"
            onClick={(event) => setOverflowAnchor(event.currentTarget)}
            sx={{ height: 36, px: 1.25, display: 'flex', alignItems: 'center', gap: 0.5, borderRadius: 1, cursor: 'pointer', bgcolor: 'background.paper' }}
          >
            <MoreHorizIcon fontSize="small" />
            <Typography variant="body2">+{hiddenLeftCount}</Typography>
          </Paper>
        ) : null}
      </Box>

      <Box sx={{ minWidth: 0, minHeight: 0, bgcolor: 'background.paper' }} />

      <Menu anchorEl={overflowAnchor} open={Boolean(overflowAnchor)} onClose={() => setOverflowAnchor(null)}>
        {[...topTabs.slice(maxVisible), ...leftTabs.slice(maxVisible)].map((tab) => (
          <MenuItem
            key={tab.id}
            selected={tab.id === activeId}
            onClick={() => {
              activate(tab)
              setOverflowAnchor(null)
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 20 }}>{tab.icon ?? String(tab.label).slice(0, 1)}</Box>
              <Typography>{tab.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
