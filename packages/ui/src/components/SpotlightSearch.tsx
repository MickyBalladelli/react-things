import { useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type SpotlightSearchAction = {
  id: string
  label: ReactNode
  icon?: ReactNode
  onClick?: (item: SpotlightSearchItem) => void
}

export type SpotlightSearchItem = {
  id: string
  label: string
  description?: string
  group?: string
  icon?: ReactNode
  keywords?: string[]
  preview?: ReactNode
  actions?: SpotlightSearchAction[]
  data?: unknown
}

export type SpotlightSearchProps = Omit<BoxProps, 'onSelect'> & {
  items: SpotlightSearchItem[]
  selectedId?: string
  placeholder?: string
  emptyText?: ReactNode
  maxResults?: number
  previewTitle?: ReactNode
  fuzzy?: boolean
  autoFocus?: boolean
  onSelect?: (item: SpotlightSearchItem) => void
  onQueryChange?: (query: string) => void
}

function normalize(value: string) {
  return value.toLowerCase().trim()
}

function getSearchText(item: SpotlightSearchItem) {
  return normalize([
    item.label,
    item.description,
    item.group,
    ...(item.keywords ?? [])
  ].filter(Boolean).join(' '))
}

function fuzzyScore(query: string, text: string) {
  if (!query) {
    return 1
  }

  if (text.includes(query)) {
    return 100 + query.length / Math.max(text.length, 1)
  }

  let queryIndex = 0
  let score = 0

  for (let textIndex = 0; textIndex < text.length && queryIndex < query.length; textIndex += 1) {
    if (text[textIndex] === query[queryIndex]) {
      queryIndex += 1
      score += 1
    }
  }

  return queryIndex === query.length ? score : 0
}

function groupItems(items: SpotlightSearchItem[]) {
  return items.reduce<Record<string, SpotlightSearchItem[]>>((groups, item) => {
    const group = item.group ?? 'Results'

    return {
      ...groups,
      [group]: [...(groups[group] ?? []), item]
    }
  }, {})
}

export function SpotlightSearch({
  items,
  selectedId,
  placeholder = 'Search anything',
  emptyText = 'No results',
  maxResults = 8,
  previewTitle = 'Preview',
  fuzzy = true,
  autoFocus = false,
  onSelect,
  onQueryChange,
  sx,
  ...props
}: SpotlightSearchProps) {
  const [query, setQuery] = useState('')
  const [internalSelectedId, setInternalSelectedId] = useState(selectedId ?? items[0]?.id)
  const normalizedQuery = normalize(query)
  const results = useMemo(() => {
    return items
      .map((item) => ({ item, score: fuzzy ? fuzzyScore(normalizedQuery, getSearchText(item)) : getSearchText(item).includes(normalizedQuery) ? 1 : 0 }))
      .filter(({ score }) => score > 0)
      .sort((first, second) => second.score - first.score || first.item.label.localeCompare(second.item.label))
      .slice(0, maxResults)
      .map(({ item }) => item)
  }, [fuzzy, items, maxResults, normalizedQuery])
  const activeItem = results.find((item) => item.id === (selectedId ?? internalSelectedId)) ?? results[0]
  const groupedResults = groupItems(results)

  function selectItem(item: SpotlightSearchItem) {
    setInternalSelectedId(item.id)
    onSelect?.(item)
  }

  return (
    <Box
      {...props}
      sx={[
        {
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 24px 70px rgba(15,23,42,0.14)'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.9fr) minmax(260px, 1fr)' }, minHeight: 420 }}>
        <Box sx={{ borderRight: { xs: 0, md: 1 }, borderBottom: { xs: 1, md: 0 }, borderColor: 'divider', minWidth: 0 }}>
          <Box sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon fontSize="small" color="disabled" />
            <InputBase
              autoFocus={autoFocus}
              fullWidth
              value={query}
              placeholder={placeholder}
              onChange={(event) => {
                setQuery(event.target.value)
                onQueryChange?.(event.target.value)
              }}
              onKeyDown={(event) => {
                const index = results.findIndex((item) => item.id === activeItem?.id)

                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setInternalSelectedId(results[Math.min(index + 1, results.length - 1)]?.id)
                }

                if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  setInternalSelectedId(results[Math.max(index - 1, 0)]?.id)
                }

                if (event.key === 'Enter' && activeItem) {
                  event.preventDefault()
                  selectItem(activeItem)
                }
              }}
              sx={{ fontSize: 16 }}
            />
            <Chip size="small" label={results.length} />
          </Box>

          <List disablePadding sx={{ maxHeight: 520, overflow: 'auto', p: 0.75 }}>
            {results.length ? Object.entries(groupedResults).map(([group, groupItems]) => (
              <Box key={group}>
                <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ display: 'block', px: 1, py: 0.75, textTransform: 'uppercase' }}>
                  {group}
                </Typography>
                {groupItems.map((item) => {
                  const selected = item.id === activeItem?.id

                  return (
                    <ListItemButton
                      key={item.id}
                      selected={selected}
                      onMouseEnter={() => setInternalSelectedId(item.id)}
                      onClick={() => selectItem(item)}
                      sx={{ borderRadius: 1, mb: 0.25 }}
                    >
                      {item.icon ? <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon> : null}
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                        primaryTypographyProps={{ fontWeight: selected ? 900 : 750 }}
                        secondaryTypographyProps={{ noWrap: true }}
                      />
                    </ListItemButton>
                  )
                })}
              </Box>
            )) : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>{emptyText}</Box>
            )}
          </List>
        </Box>

        <Box sx={{ minWidth: 0, p: 2, bgcolor: '#f8fafc' }}>
          {activeItem ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={900} sx={{ textTransform: 'uppercase' }}>{previewTitle}</Typography>
                <Typography variant="h5" fontWeight={950}>{activeItem.label}</Typography>
                {activeItem.description ? <Typography color="text.secondary">{activeItem.description}</Typography> : null}
              </Box>

              <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', border: 1, borderColor: 'divider', minHeight: 190 }}>
                {activeItem.preview ?? (
                  <Box sx={{ height: 160, display: 'grid', placeItems: 'center', borderRadius: 1, bgcolor: alpha('#2563eb', 0.08), color: 'text.secondary' }}>
                    No preview
                  </Box>
                )}
              </Box>

              {activeItem.actions?.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {activeItem.actions.map((action) => (
                    <Button key={action.id} size="small" variant="outlined" startIcon={action.icon} onClick={() => action.onClick?.(activeItem)}>
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              ) : null}
            </Stack>
          ) : (
            <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center', color: 'text.secondary' }}>{emptyText}</Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
