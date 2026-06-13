import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type CommandPaletteVariant = 'list' | 'tree'

export type CommandPaletteItem = {
  id: string
  label: string
  description?: string
  group?: string
  parentId?: string
  icon?: ReactNode
  keywords?: string[]
  onSelect?: () => void
}

export type CommandPaletteProps = Omit<BoxProps, 'onSelect'> & {
  items: CommandPaletteItem[]
  variant?: CommandPaletteVariant
  selectedId?: string
  placeholder?: string
  emptyText?: string
  maxResults?: number
  showSearch?: boolean
  dense?: boolean
  expandedGroups?: string[]
  defaultExpandedGroups?: string[]
  onExpandedGroupsChange?: (groups: string[]) => void
  onSelect?: (item: CommandPaletteItem) => void
}

function normalize(value: string) {
  return value.toLowerCase().trim()
}

function itemSearchText(item: CommandPaletteItem) {
  return normalize([
    item.label,
    item.description,
    item.group,
    item.parentId,
    ...(item.keywords ?? [])
  ].filter(Boolean).join(' '))
}

function uniqueGroups(items: CommandPaletteItem[]) {
  return Array.from(new Set(items.map((item) => item.group).filter(Boolean))) as string[]
}

export function CommandPalette({
  items,
  variant = 'list',
  selectedId,
  placeholder = 'Search',
  emptyText = 'No items found',
  maxResults,
  showSearch = true,
  dense = false,
  expandedGroups,
  defaultExpandedGroups,
  onExpandedGroupsChange,
  onSelect,
  sx,
  ...props
}: CommandPaletteProps) {
  const initialGroups = defaultExpandedGroups ?? uniqueGroups(items)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [internalExpandedGroups, setInternalExpandedGroups] = useState(initialGroups)
  const normalizedQuery = normalize(query)
  const expanded = expandedGroups ?? internalExpandedGroups
  const filteredItems = useMemo(() => {
    const matchingItems = normalizedQuery
      ? items.filter((item) => itemSearchText(item).includes(normalizedQuery))
      : items

    return typeof maxResults === 'number' ? matchingItems.slice(0, maxResults) : matchingItems
  }, [items, maxResults, normalizedQuery])
  const visibleGroups = uniqueGroups(filteredItems)
  const flatItems = variant === 'tree'
    ? filteredItems
    : filteredItems

  function selectItem(item: CommandPaletteItem) {
    item.onSelect?.()
    onSelect?.(item)
    setQuery('')
    setActiveIndex(0)
  }

  function setExpanded(nextExpanded: string[]) {
    if (expandedGroups === undefined) {
      setInternalExpandedGroups(nextExpanded)
    }

    onExpandedGroupsChange?.(nextExpanded)
  }

  function toggleGroup(group: string) {
    setExpanded(expanded.includes(group)
      ? expanded.filter((expandedGroup) => expandedGroup !== group)
      : [...expanded, group])
  }

  function renderItem(item: CommandPaletteItem, depth = 0) {
    const selected = item.id === selectedId

    return (
      <ListItemButton
        key={item.id}
        selected={selected}
        dense={dense}
        onClick={() => selectItem(item)}
        sx={{
          borderRadius: 1,
          pl: 1.25 + depth * 2,
          '&.Mui-selected': {
            bgcolor: 'action.selected',
            color: 'primary.main'
          },
          '&.Mui-selected:hover, &:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        {item.icon ? (
          <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
        ) : null}
        <ListItemText
          primary={item.label}
          secondary={item.description}
          primaryTypographyProps={{ fontWeight: selected ? 850 : 700 }}
          secondaryTypographyProps={{ color: 'text.secondary' }}
        />
      </ListItemButton>
    )
  }

  function renderList() {
    if (!filteredItems.length) {
      return <Box sx={{ px: 2, py: 4, textAlign: 'center', color: 'text.secondary' }}>{emptyText}</Box>
    }

    if (!visibleGroups.length) {
      return filteredItems.map((item) => renderItem(item))
    }

    return visibleGroups.map((group) => (
      <Box key={group}>
        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', px: 1.25, pt: 1.5, pb: 0.5 }}>
          {group}
        </Typography>
        {filteredItems.filter((item) => item.group === group).map((item) => renderItem(item))}
      </Box>
    ))
  }

  function renderTree() {
    if (!filteredItems.length) {
      return <Box sx={{ px: 2, py: 4, textAlign: 'center', color: 'text.secondary' }}>{emptyText}</Box>
    }

    if (!visibleGroups.length) {
      return filteredItems.map((item) => renderItem(item))
    }

    return visibleGroups.map((group) => {
      const open = normalizedQuery || expanded.includes(group)

      return (
        <Box key={group}>
          <ListItemButton
            dense={dense}
            onClick={() => toggleGroup(group)}
            sx={{ borderRadius: 1, px: 1.25 }}
          >
            <Typography component="span" aria-hidden="true" sx={{ mr: 1, width: 16, color: 'text.secondary' }}>
              {open ? '▾' : '▸'}
            </Typography>
            <ListItemText
              primary={group}
              primaryTypographyProps={{ fontWeight: 900 }}
            />
          </ListItemButton>
          <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
            {filteredItems.filter((item) => item.group === group).map((item) => renderItem(item, 1))}
          </Collapse>
        </Box>
      )
    })
  }

  return (
    <Box
      {...props}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: 0
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {showSearch ? (
        <Box
          sx={{
            px: 1.25,
            py: 0.75,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <InputBase
            fullWidth
            value={query}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((currentIndex) => Math.min(currentIndex + 1, flatItems.length - 1))
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0))
              }

              if (event.key === 'Enter' && flatItems[activeIndex]) {
                event.preventDefault()
                selectItem(flatItems[activeIndex])
              }
            }}
            sx={{ fontSize: 14 }}
          />
        </Box>
      ) : null}

      <List disablePadding dense={dense} sx={{ overflow: 'auto' }}>
        {variant === 'tree' ? renderTree() : renderList()}
      </List>
    </Box>
  )
}
