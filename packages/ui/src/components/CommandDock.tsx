import { Fragment, useMemo, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type CommandDockItem = {
  id: string
  label: string
  description?: string
  group?: string
  icon?: ReactNode
  badge?: ReactNode
  keywords?: string[]
  children?: CommandDockItem[]
  onSelect?: () => void
}

export type CommandDockProps = Omit<BoxProps, 'onSelect'> & {
  items: CommandDockItem[]
  selectedId?: string
  title?: ReactNode
  logo?: ReactNode
  footer?: ReactNode
  placeholder?: string
  collapsed?: boolean
  defaultCollapsed?: boolean
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  width?: number
  collapsedWidth?: number
  persistKey?: string
  onCollapsedChange?: (collapsed: boolean) => void
  onExpandedIdsChange?: (expandedIds: string[]) => void
  onSelect?: (item: CommandDockItem) => void
}

function normalize(value: string) {
  return value.toLowerCase().trim()
}

function itemSearchText(item: CommandDockItem): string {
  return normalize([
    item.label,
    item.description,
    item.group,
    ...(item.keywords ?? []),
    ...(item.children ?? []).map(itemSearchText)
  ].filter(Boolean).join(' '))
}

function filterItems(items: CommandDockItem[], query: string): CommandDockItem[] {
  if (!query) {
    return items
  }

  return items.reduce<CommandDockItem[]>((filteredItems, item) => {
    const children = filterItems(item.children ?? [], query)

    if (itemSearchText(item).includes(query) || children.length > 0) {
      filteredItems.push({ ...item, children })
    }

    return filteredItems
  }, [])
}

function groupedItems(items: CommandDockItem[]) {
  return items.reduce<Record<string, CommandDockItem[]>>((groups, item) => {
    const group = item.group ?? 'Commands'

    return {
      ...groups,
      [group]: [...(groups[group] ?? []), item]
    }
  }, {})
}

function readCollapsed(persistKey: string | undefined, fallback: boolean) {
  if (!persistKey || typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(persistKey) === 'true'
}

function collectExpandedIds(items: CommandDockItem[]) {
  return items.reduce<string[]>((ids, item) => {
    if (item.children?.length) {
      ids.push(item.id, ...collectExpandedIds(item.children))
    }

    return ids
  }, [])
}

export function CommandDock({
  items,
  selectedId,
  title = 'CommandDock',
  logo = 'C',
  footer,
  placeholder = 'Search',
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  width = 280,
  collapsedWidth = 64,
  persistKey,
  onCollapsedChange,
  onExpandedIdsChange,
  onSelect,
  sx,
  ...props
}: CommandDockProps) {
  const [query, setQuery] = useState('')
  const [internalCollapsed, setInternalCollapsed] = useState(() => readCollapsed(persistKey, defaultCollapsed))
  const [internalExpandedIds, setInternalExpandedIds] = useState(() => defaultExpandedIds ?? collectExpandedIds(items))
  const collapsed = controlledCollapsed ?? internalCollapsed
  const expandedIds = controlledExpandedIds ?? internalExpandedIds
  const normalizedQuery = normalize(query)
  const filteredItems = useMemo(() => filterItems(items, normalizedQuery), [items, normalizedQuery])
  const groups = groupedItems(filteredItems)
  const expandedIdSet = useMemo(() => new Set(normalizedQuery ? collectExpandedIds(filteredItems) : expandedIds), [expandedIds, filteredItems, normalizedQuery])

  function setCollapsed(nextCollapsed: boolean) {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(nextCollapsed)
    }

    if (persistKey) {
      window.localStorage.setItem(persistKey, String(nextCollapsed))
    }

    onCollapsedChange?.(nextCollapsed)
  }

  function toggleExpanded(itemId: string) {
    const nextExpandedIds = expandedIdSet.has(itemId)
      ? expandedIds.filter((expandedId) => expandedId !== itemId)
      : [...expandedIds, itemId]

    if (controlledExpandedIds === undefined) {
      setInternalExpandedIds(nextExpandedIds)
    }

    onExpandedIdsChange?.(nextExpandedIds)
  }

  function selectItem(item: CommandDockItem) {
    item.onSelect?.()
    onSelect?.(item)
  }

  function renderItem(item: CommandDockItem, depth = 0) {
    const selected = item.id === selectedId
    const hasChildren = Boolean(item.children?.length)
    const expanded = expandedIdSet.has(item.id)
    const button = (
      <ListItemButton
        selected={selected}
        onClick={() => selectItem(item)}
        sx={{
          minHeight: 40,
          borderRadius: 1,
          mb: 0.25,
          pl: collapsed ? 1 : 1 + depth * 2,
          pr: collapsed ? 1 : 0.75,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: selected ? 'primary.main' : 'text.secondary', justifyContent: 'center' }}>
          {item.icon ?? item.label.slice(0, 1)}
        </ListItemIcon>
        {!collapsed ? (
          <ListItemText
            primary={item.label}
            secondary={item.description}
            primaryTypographyProps={{ fontWeight: selected ? 850 : 700, noWrap: true }}
            secondaryTypographyProps={{ noWrap: true }}
          />
        ) : null}
        {!collapsed && item.badge ? (
          <Box sx={{ ml: 1 }}>{item.badge}</Box>
        ) : null}
        {!collapsed && hasChildren ? (
          <IconButton
            size="small"
            aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            onClick={(event) => {
              event.stopPropagation()
              toggleExpanded(item.id)
            }}
            sx={{ ml: 0.5 }}
          >
            {expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        ) : null}
      </ListItemButton>
    )

    return (
      <Fragment key={item.id}>
        {collapsed ? (
          <Tooltip title={item.label} placement="right">
            {button}
          </Tooltip>
        ) : (
          button
        )}
        {!collapsed && hasChildren ? (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List disablePadding dense>
              {item.children?.map((child) => renderItem(child, depth + 1))}
            </List>
          </Collapse>
        ) : null}
      </Fragment>
    )
  }

  return (
    <Box
      {...props}
      component="nav"
      sx={[
        {
          width: collapsed ? collapsedWidth : width,
          minWidth: collapsed ? collapsedWidth : width,
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr auto',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'width 180ms ease, min-width 180ms ease',
          overflow: 'hidden'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        {!collapsed ? (
          <Box sx={{ minWidth: 34, width: 34, height: 34, borderRadius: 1, display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 900 }}>
            {logo}
          </Box>
        ) : null}
        {!collapsed ? (
          <Typography fontWeight={950} noWrap sx={{ minWidth: 0, flex: 1 }}>{title}</Typography>
        ) : null}
        <IconButton size="small" aria-label="Toggle command dock" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      {!collapsed ? (
        <Box sx={{ mx: 1.25, mb: 1, display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: '#f8fafc' }}>
          <SearchIcon fontSize="small" color="disabled" />
          <InputBase value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} sx={{ flex: 1, fontSize: 14 }} />
        </Box>
      ) : null}

      <Box sx={{ minHeight: 0, overflow: 'auto', px: 0.75, pb: 1 }}>
        {Object.entries(groups).map(([group, groupItems]) => (
          <Box key={group} sx={{ mt: collapsed ? 0.5 : 1 }}>
            {!collapsed ? (
              <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ display: 'block', px: 1, py: 0.75, textTransform: 'uppercase' }}>
                {group}
              </Typography>
            ) : null}
            <List disablePadding dense>
              {groupItems.map((item) => renderItem(item))}
            </List>
          </Box>
        ))}
      </Box>

      {!collapsed && footer ? (
        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 1.25 }}>
          {footer}
        </Box>
      ) : null}
    </Box>
  )
}
