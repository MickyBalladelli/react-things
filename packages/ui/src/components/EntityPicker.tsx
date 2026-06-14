import { useMemo, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import { alpha } from '@mui/material/styles'
import type { PaperProps } from '@mui/material/Paper'
import type { ReactNode } from 'react'

export type EntityPickerType = 'user' | 'file' | 'project'
export type EntityPickerFilter = 'all' | 'recent' | 'pinned'

export type EntityPickerEntity = {
  id: string
  type: EntityPickerType
  label: string
  description?: string
  group?: string
  avatarUrl?: string
  avatarText?: string
  color?: string
  status?: string
  recent?: boolean
  pinned?: boolean
  keywords?: string[]
  meta?: ReactNode
  data?: unknown
}

export type EntityPickerProps = Omit<PaperProps, 'defaultValue' | 'onChange'> & {
  entities: EntityPickerEntity[]
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  multiple?: boolean
  title?: ReactNode
  subtitle?: ReactNode
  placeholder?: string
  emptyText?: ReactNode
  maxHeight?: number
  showFilters?: boolean
  showSelected?: boolean
  onChange?: (value: string | string[] | null, entities: EntityPickerEntity[]) => void
  onSelect?: (entity: EntityPickerEntity) => void
}

function normalize(value: string) {
  return value.toLowerCase().trim()
}

function getSearchText(entity: EntityPickerEntity) {
  return normalize([
    entity.label,
    entity.description,
    entity.group,
    entity.status,
    entity.type,
    ...(entity.keywords ?? [])
  ].filter(Boolean).join(' '))
}

function getInitials(entity: EntityPickerEntity) {
  if (entity.avatarText) {
    return entity.avatarText
  }

  return entity.label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function typeIcon(type: EntityPickerType) {
  if (type === 'file') {
    return <InsertDriveFileOutlinedIcon fontSize="small" />
  }

  if (type === 'project') {
    return <WorkOutlineOutlinedIcon fontSize="small" />
  }

  return null
}

function groupEntities(entities: EntityPickerEntity[]) {
  return entities.reduce<Record<string, EntityPickerEntity[]>>((groups, entity) => {
    const group = entity.group ?? entity.type[0].toUpperCase() + entity.type.slice(1)

    return {
      ...groups,
      [group]: [...(groups[group] ?? []), entity]
    }
  }, {})
}

function toIdArray(value: string | string[] | null | undefined) {
  if (Array.isArray(value)) {
    return value
  }

  return value ? [value] : []
}

export function EntityPicker({
  entities,
  value,
  defaultValue = null,
  multiple = false,
  title = 'Pick entity',
  subtitle = 'Find users, files, and projects.',
  placeholder = 'Search users, files, projects',
  emptyText = 'No matching entities',
  maxHeight = 420,
  showFilters = true,
  showSelected = true,
  onChange,
  onSelect,
  sx,
  ...props
}: EntityPickerProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<EntityPickerFilter>('all')
  const [internalValue, setInternalValue] = useState<string[]>(toIdArray(defaultValue))
  const selectedIds = value === undefined ? internalValue : toIdArray(value)
  const normalizedQuery = normalize(query)
  const filteredEntities = useMemo(() => {
    return entities
      .filter((entity) => {
        if (filter === 'recent' && !entity.recent) {
          return false
        }

        if (filter === 'pinned' && !entity.pinned) {
          return false
        }

        return normalizedQuery ? getSearchText(entity).includes(normalizedQuery) : true
      })
      .sort((first, second) => Number(second.pinned) - Number(first.pinned) || Number(second.recent) - Number(first.recent) || first.label.localeCompare(second.label))
  }, [entities, filter, normalizedQuery])
  const groupedEntities = groupEntities(filteredEntities)
  const selectedEntities = entities.filter((entity) => selectedIds.includes(entity.id))

  function commitSelection(nextIds: string[], entity: EntityPickerEntity) {
    const nextValue = multiple ? nextIds : nextIds[0] ?? null
    const nextEntities = entities.filter((item) => nextIds.includes(item.id))

    if (value === undefined) {
      setInternalValue(nextIds)
    }

    onSelect?.(entity)
    onChange?.(nextValue, nextEntities)
  }

  function toggleEntity(entity: EntityPickerEntity) {
    const selected = selectedIds.includes(entity.id)
    const nextIds = multiple
      ? selected
        ? selectedIds.filter((id) => id !== entity.id)
        : [...selectedIds, entity.id]
      : selected
        ? []
        : [entity.id]

    commitSelection(nextIds, entity)
  }

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        {
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Stack spacing={1.25}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" fontWeight={950}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              ) : null}
            </Box>
            <Chip size="small" label={`${filteredEntities.length}/${entities.length}`} />
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <SearchOutlinedIcon fontSize="small" color="disabled" />
            <InputBase
              fullWidth
              value={query}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
              sx={{ fontSize: 14 }}
            />
          </Box>

          {showFilters ? (
            <Stack direction="row" spacing={0.75} flexWrap="wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'recent', label: 'Recent' },
                { value: 'pinned', label: 'Pinned' }
              ].map((item) => (
                <Chip
                  key={item.value}
                  label={item.label}
                  color={filter === item.value ? 'primary' : 'default'}
                  variant={filter === item.value ? 'filled' : 'outlined'}
                  size="small"
                  onClick={() => setFilter(item.value as EntityPickerFilter)}
                />
              ))}
            </Stack>
          ) : null}

          {showSelected && selectedEntities.length > 0 ? (
            <Stack direction="row" spacing={0.75} flexWrap="wrap">
              {selectedEntities.map((entity) => (
                <Chip
                  key={entity.id}
                  size="small"
                  avatar={<Avatar src={entity.avatarUrl}>{getInitials(entity)}</Avatar>}
                  label={entity.label}
                  onDelete={() => toggleEntity(entity)}
                />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Box>

      <List disablePadding sx={{ maxHeight, overflow: 'auto', p: 0.75 }}>
        {filteredEntities.length ? Object.entries(groupedEntities).map(([group, groupItems]) => (
          <Box key={group}>
            <Typography variant="caption" color="text.secondary" fontWeight={950} sx={{ display: 'block', px: 1, py: 0.75, textTransform: 'uppercase' }}>
              {group}
            </Typography>
            {groupItems.map((entity) => {
              const selected = selectedIds.includes(entity.id)
              const accent = entity.color ?? (entity.type === 'user' ? '#2563eb' : entity.type === 'file' ? '#059669' : '#7c3aed')

              return (
                <ListItemButton
                  key={entity.id}
                  selected={selected}
                  onClick={() => toggleEntity(entity)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.25,
                    gap: 0.75,
                    border: 1,
                    borderColor: selected ? alpha(accent, 0.45) : 'transparent',
                    bgcolor: selected ? alpha(accent, 0.08) : 'transparent',
                    '&.Mui-selected': {
                      bgcolor: alpha(accent, 0.08)
                    },
                    '&.Mui-selected:hover, &:hover': {
                      bgcolor: alpha(accent, selected ? 0.12 : 0.06)
                    }
                  }}
                >
                  {multiple ? <Checkbox edge="start" size="small" checked={selected} tabIndex={-1} disableRipple /> : null}
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar src={entity.avatarUrl} sx={{ width: 34, height: 34, bgcolor: alpha(accent, 0.16), color: accent, fontWeight: 950 }}>
                      {typeIcon(entity.type) ?? getInitials(entity)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={(
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                        <Typography noWrap fontWeight={selected ? 950 : 800} sx={{ minWidth: 0 }}>
                          {entity.label}
                        </Typography>
                        {entity.pinned ? (
                          <Tooltip title="Pinned">
                            <PushPinOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary', flex: '0 0 auto' }} />
                          </Tooltip>
                        ) : null}
                        {entity.status ? <Chip size="small" label={entity.status} sx={{ height: 20 }} /> : null}
                      </Stack>
                    )}
                    secondary={entity.description}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  {entity.meta ? (
                    <Box sx={{ flex: '0 0 auto', color: 'text.secondary' }}>
                      {entity.meta}
                    </Box>
                  ) : null}
                </ListItemButton>
              )
            })}
          </Box>
        )) : (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            {emptyText}
          </Box>
        )}
      </List>
    </Paper>
  )
}
