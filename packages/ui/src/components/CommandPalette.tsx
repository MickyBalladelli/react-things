import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type CommandPaletteVariant = 'list' | 'tree'
export type CommandPaletteDescriptionDisplay = 'inline' | 'tooltip' | 'both' | 'none'

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
  descriptionDisplay?: CommandPaletteDescriptionDisplay
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
  descriptionDisplay = 'inline',
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
    const showInlineDescription = descriptionDisplay === 'inline' || descriptionDisplay === 'both'
    const showTooltipDescription = Boolean(item.description) && (descriptionDisplay === 'tooltip' || descriptionDisplay === 'both')
    const button = (
      <ListItemButton
        selected={selected}
        dense={dense}
        onClick={() => selectItem(item)}
        sx={{
          borderRadius: 1,
          alignItems: showInlineDescription ? 'flex-start' : 'center',
          gap: 0.75,
          my: 0.25,
          minHeight: showInlineDescription ? (dense ? 46 : 58) : (dense ? 36 : 44),
          pl: 1.25 + depth * 1.5,
          pr: 1,
          border: 1,
          borderColor: selected ? 'primary.light' : 'transparent',
          borderLeftWidth: selected ? 3 : 1,
          bgcolor: selected ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
          '&.Mui-selected': {
            bgcolor: 'rgba(37, 99, 235, 0.08)',
            color: 'primary.main'
          },
          '&.Mui-selected:hover, &:hover': {
            bgcolor: selected ? 'rgba(37, 99, 235, 0.12)' : 'rgba(15, 23, 42, 0.04)'
          }
        }}
      >
        {item.icon ? (
          <ListItemIcon sx={{ minWidth: 30, mt: showInlineDescription ? 0.25 : 0, color: 'inherit' }}>
            {item.icon}
          </ListItemIcon>
        ) : null}
        <ListItemText
          primary={item.label}
          secondary={showInlineDescription ? item.description : undefined}
          sx={{ my: 0 }}
          primaryTypographyProps={{
            fontWeight: selected ? 900 : 780,
            fontSize: dense ? 13.5 : 14.5,
            lineHeight: 1.25,
            color: selected ? 'primary.main' : 'text.primary'
          }}
          secondaryTypographyProps={{
            color: 'text.secondary',
            fontSize: 12,
            lineHeight: 1.3,
            sx: {
              mt: 0.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }
          }}
        />
      </ListItemButton>
    )

    return showTooltipDescription ? (
      <Tooltip key={item.id} title={item.description} placement="right" arrow enterDelay={350}>
        {button}
      </Tooltip>
    ) : (
      <Box key={item.id}>
        {button}
      </Box>
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
      const groupItems = filteredItems.filter((item) => item.group === group)

      return (
        <Box key={group} sx={{ mb: 0.75 }}>
          <ListItemButton
            dense={dense}
            onClick={() => toggleGroup(group)}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 0.75,
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'rgba(15, 23, 42, 0.04)'
              }
            }}
          >
            <Typography component="span" aria-hidden="true" sx={{ mr: 0.75, width: 16, color: 'text.secondary', fontSize: 13 }}>
              {open ? '▾' : '▸'}
            </Typography>
            <ListItemText
              primary={group}
              primaryTypographyProps={{ fontWeight: 950, fontSize: 12, letterSpacing: 0, textTransform: 'uppercase', color: 'text.secondary' }}
              sx={{ my: 0 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
              {groupItems.length}
            </Typography>
          </ListItemButton>
          <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 0.5, borderLeft: 1, borderColor: 'divider', ml: 1 }}>
              {groupItems.map((item) => renderItem(item, 1))}
            </Box>
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
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 2,
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)'
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
