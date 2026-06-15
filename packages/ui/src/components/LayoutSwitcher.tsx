import { useMemo, useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type LayoutSwitcherView = 'table' | 'cards' | 'kanban' | 'calendar' | 'list'

export type LayoutSwitcherItem = {
  id: string
  title: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  status?: string
  group?: string
  date?: string | Date
  color?: string
  data?: unknown
}

export type LayoutSwitcherColumn = {
  id: string
  label: ReactNode
  render?: (item: LayoutSwitcherItem) => ReactNode
}

export type LayoutSwitcherProps = Omit<BoxProps, 'onChange'> & {
  items: LayoutSwitcherItem[]
  columns?: LayoutSwitcherColumn[]
  views?: LayoutSwitcherView[]
  view?: LayoutSwitcherView
  defaultView?: LayoutSwitcherView
  title?: ReactNode
  subtitle?: ReactNode
  groupOrder?: string[]
  calendarDays?: number
  animated?: boolean
  dense?: boolean
  emptyState?: ReactNode
  renderItem?: (item: LayoutSwitcherItem, view: LayoutSwitcherView) => ReactNode
  onViewChange?: (view: LayoutSwitcherView) => void
  onItemSelect?: (item: LayoutSwitcherItem) => void
}

const viewMeta: Record<LayoutSwitcherView, { label: string, icon: ReactNode }> = {
  table: { label: 'Table', icon: <TableRowsIcon fontSize="small" /> },
  cards: { label: 'Cards', icon: <ViewModuleIcon fontSize="small" /> },
  kanban: { label: 'Kanban', icon: <ViewColumnIcon fontSize="small" /> },
  calendar: { label: 'Calendar', icon: <CalendarMonthIcon fontSize="small" /> },
  list: { label: 'List', icon: <ViewAgendaIcon fontSize="small" /> }
}

function stringify(value: ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

function getItemDate(item: LayoutSwitcherItem) {
  if (!item.date) {
    return null
  }

  const date = item.date instanceof Date ? item.date : new Date(item.date)

  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

function groupItems(items: LayoutSwitcherItem[], groupOrder?: string[]) {
  const groups = items.reduce<Record<string, LayoutSwitcherItem[]>>((groupedItems, item) => {
    const group = item.group ?? item.status ?? 'Backlog'

    return {
      ...groupedItems,
      [group]: [...(groupedItems[group] ?? []), item]
    }
  }, {})

  const orderedKeys = groupOrder?.filter((group) => groups[group]) ?? []
  const remainingKeys = Object.keys(groups).filter((group) => !orderedKeys.includes(group))

  return [...orderedKeys, ...remainingKeys].map((group) => ({ group, items: groups[group] }))
}

function defaultColumns(items: LayoutSwitcherItem[]): LayoutSwitcherColumn[] {
  const hasStatus = items.some((item) => item.status)
  const hasDate = items.some((item) => item.date)

  return [
    { id: 'title', label: 'Item', render: (item) => item.title },
    ...(hasStatus ? [{ id: 'status', label: 'Status', render: (item: LayoutSwitcherItem) => item.status ?? '-' }] : []),
    ...(hasDate ? [{ id: 'date', label: 'Date', render: (item: LayoutSwitcherItem) => {
      const date = getItemDate(item)

      return date ? formatDate(date) : '-'
    } }] : [])
  ]
}

function ItemCard({
  item,
  view,
  dense,
  renderItem,
  onSelect
}: {
  item: LayoutSwitcherItem
  view: LayoutSwitcherView
  dense?: boolean
  renderItem?: (item: LayoutSwitcherItem, view: LayoutSwitcherView) => ReactNode
  onSelect?: (item: LayoutSwitcherItem) => void
}) {
  if (renderItem) {
    return <>{renderItem(item, view)}</>
  }

  const color = item.color ?? '#2563eb'

  return (
    <Paper
      variant="outlined"
      onClick={() => onSelect?.(item)}
      sx={{
        p: dense ? 1.25 : 1.5,
        borderRadius: 1,
        borderColor: alpha(color, 0.34),
        bgcolor: alpha(color, 0.08),
        cursor: onSelect ? 'pointer' : 'default',
        '&:hover': onSelect ? { borderColor: color } : undefined
      }}
    >
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
          <Typography fontWeight={950}>{item.title}</Typography>
          {item.status ? <Chip size="small" label={item.status} /> : null}
        </Stack>
        {item.subtitle ? <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography> : null}
        {item.description ? <Typography variant="caption" color="text.secondary">{item.description}</Typography> : null}
      </Stack>
    </Paper>
  )
}

export function LayoutSwitcher({
  items,
  columns,
  views = ['table', 'cards', 'kanban', 'calendar', 'list'],
  view: controlledView,
  defaultView = 'cards',
  title,
  subtitle,
  groupOrder,
  calendarDays = 7,
  animated = true,
  dense = false,
  emptyState = 'No items',
  renderItem,
  onViewChange,
  onItemSelect,
  sx,
  ...props
}: LayoutSwitcherProps) {
  const [internalView, setInternalView] = useState(defaultView)
  const activeView = controlledView ?? internalView
  const tableColumns = columns ?? defaultColumns(items)
  const groups = useMemo(() => groupItems(items, groupOrder), [groupOrder, items])
  const calendarDates = useMemo(() => {
    const now = new Date()

    return Array.from({ length: calendarDays }, (_, index) => {
      const date = new Date(now)
      date.setDate(now.getDate() + index)

      return date
    })
  }, [calendarDays])

  function setView(nextView: LayoutSwitcherView) {
    if (controlledView === undefined) {
      setInternalView(nextView)
    }

    onViewChange?.(nextView)
  }

  function renderEmpty() {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, textAlign: 'center', color: 'text.secondary' }}>
        {emptyState}
      </Paper>
    )
  }

  function renderView() {
    if (!items.length) {
      return renderEmpty()
    }

    if (activeView === 'table') {
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell key={column.id} sx={{ fontWeight: 900, color: 'text.secondary' }}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} hover={Boolean(onItemSelect)} onClick={() => onItemSelect?.(item)} sx={{ cursor: onItemSelect ? 'pointer' : 'default' }}>
                  {tableColumns.map((column) => (
                    <TableCell key={column.id}>{column.render ? column.render(item) : stringify((item as unknown as Record<string, ReactNode>)[column.id])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
    }

    if (activeView === 'cards') {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} view={activeView} dense={dense} renderItem={renderItem} onSelect={onItemSelect} />
          ))}
        </Box>
      )
    }

    if (activeView === 'kanban') {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: `repeat(${Math.min(groups.length, 4)}, minmax(180px, 1fr))` }, gap: 1.5 }}>
          {groups.map(({ group, items: groupItems }) => (
            <Paper key={group} variant="outlined" sx={{ p: 1.25, borderRadius: 1, bgcolor: 'background.default' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography fontWeight={950}>{group}</Typography>
                <Chip size="small" label={groupItems.length} />
              </Stack>
              <Stack spacing={1}>
                {groupItems.map((item) => (
                  <ItemCard key={item.id} item={item} view={activeView} dense renderItem={renderItem} onSelect={onItemSelect} />
                ))}
              </Stack>
            </Paper>
          ))}
        </Box>
      )
    }

    if (activeView === 'calendar') {
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(calendarDates.length, 7)}, minmax(120px, 1fr))` }, gap: 1 }}>
          {calendarDates.map((date) => {
            const dayItems = items.filter((item) => {
              const itemDate = getItemDate(item)

              return itemDate?.toDateString() === date.toDateString()
            })

            return (
              <Paper key={date.toISOString()} variant="outlined" sx={{ p: 1.25, borderRadius: 1, minHeight: 180 }}>
                <Typography fontWeight={950}>{formatDate(date)}</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {dayItems.length ? dayItems.map((item) => (
                    <ItemCard key={item.id} item={item} view={activeView} dense renderItem={renderItem} onSelect={onItemSelect} />
                  )) : <Typography variant="caption" color="text.secondary">Clear</Typography>}
                </Stack>
              </Paper>
            )
          })}
        </Box>
      )
    }

    return (
      <Stack spacing={1}>
        {items.map((item) => (
          <Paper
            key={item.id}
            variant="outlined"
            onClick={() => onItemSelect?.(item)}
            sx={{
              p: dense ? 1.25 : 1.5,
              borderRadius: 1,
              cursor: onItemSelect ? 'pointer' : 'default'
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Box>
                <Typography fontWeight={950}>{item.title}</Typography>
                {item.subtitle ? <Typography variant="body2" color="text.secondary">{item.subtitle}</Typography> : null}
              </Box>
              <Stack direction="row" spacing={0.75}>
                {item.status ? <Chip size="small" label={item.status} /> : null}
                {item.date ? <Chip size="small" variant="outlined" label={formatDate(getItemDate(item) ?? new Date())} /> : null}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    )
  }

  const content = (
    <Box key={activeView} sx={{ mt: 1.5 }}>
      {renderView()}
    </Box>
  )

  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
        <Box sx={{ minWidth: 0 }}>
          {title ? <Typography variant="h6" fontWeight={950}>{title}</Typography> : null}
          {subtitle ? <Typography variant="body2" color="text.secondary">{subtitle}</Typography> : null}
        </Box>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={activeView}
          onChange={(_, nextView) => nextView && setView(nextView)}
          aria-label="Layout view"
        >
          {views.map((item) => (
            <ToggleButton key={item} value={item} aria-label={`${viewMeta[item].label} view`}>
              {viewMeta[item].icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {animated ? (
        <Fade in timeout={180} key={activeView}>
          {content}
        </Fade>
      ) : content}
    </Box>
  )
}
