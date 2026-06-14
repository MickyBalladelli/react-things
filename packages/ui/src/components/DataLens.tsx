import { useMemo, useState } from 'react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda'
import ViewListIcon from '@mui/icons-material/ViewList'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Chip from '@mui/material/Chip'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
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

export type DataLensView = 'table' | 'cards'
export type DataLensSortDirection = 'asc' | 'desc'
export type DataLensChart = 'bar' | 'sparkline'

export type DataLensColumn<Row extends object = Record<string, unknown>> = {
  id: string
  label: string
  accessor?: keyof Row | ((row: Row) => unknown)
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  options?: string[]
  chart?: DataLensChart
  width?: number | string
  render?: (value: unknown, row: Row) => ReactNode
}

export type DataLensSort = {
  columnId: string
  direction: DataLensSortDirection
}

export type DataLensProps<Row extends object = Record<string, unknown>> = Omit<BoxProps, 'onChange'> & {
  rows: Row[]
  columns: DataLensColumn<Row>[]
  title?: ReactNode
  subtitle?: ReactNode
  defaultView?: DataLensView
  searchPlaceholder?: string
  initialSort?: DataLensSort
  emptyState?: ReactNode
  dense?: boolean
  onRowSelect?: (row: Row) => void
}

function getValue<Row extends object>(row: Row, column: DataLensColumn<Row>) {
  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }

  if (column.accessor) {
    return row[column.accessor]
  }

  return (row as Record<string, unknown>)[column.id]
}

function stringify(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(' ')
  }

  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

function numericValue(value: unknown) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))

    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function sortRows<Row extends object>(rows: Row[], columns: DataLensColumn<Row>[], sort: DataLensSort | undefined) {
  if (!sort) {
    return rows
  }

  const column = columns.find((candidate) => candidate.id === sort.columnId)

  if (!column) {
    return rows
  }

  return [...rows].sort((first, second) => {
    const firstValue = getValue(first, column)
    const secondValue = getValue(second, column)
    const firstNumber = numericValue(firstValue)
    const secondNumber = numericValue(secondValue)
    const direction = sort.direction === 'asc' ? 1 : -1

    if (firstNumber !== null && secondNumber !== null) {
      return (firstNumber - secondNumber) * direction
    }

    return stringify(firstValue).localeCompare(stringify(secondValue)) * direction
  })
}

function TinyChart({ value, color = '#2563eb', type = 'bar' }: { value: unknown, color?: string, type?: DataLensChart }) {
  if (type === 'sparkline' && Array.isArray(value) && value.every((item) => typeof item === 'number')) {
    const width = 96
    const height = 28
    const min = Math.min(...value)
    const max = Math.max(...value)
    const range = max - min || 1
    const path = value.map((point, index) => {
      const x = (index / Math.max(value.length - 1, 1)) * width
      const y = height - ((point - min) / range) * height

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')

    return (
      <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width, height, display: 'block' }}>
        <Box component="path" d={path} sx={{ fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
      </Box>
    )
  }

  const number = numericValue(value) ?? 0
  const width = Math.max(4, Math.min(100, Math.abs(number)))

  return (
    <Box sx={{ width: 104, height: 8, borderRadius: 999, bgcolor: alpha(color, 0.14), overflow: 'hidden' }}>
      <Box sx={{ width: `${width}%`, height: '100%', borderRadius: 'inherit', bgcolor: color }} />
    </Box>
  )
}

export function DataLens<Row extends object = Record<string, unknown>>({
  rows,
  columns,
  title,
  subtitle,
  defaultView = 'table',
  searchPlaceholder = 'Filter data',
  initialSort,
  emptyState = 'No rows match',
  dense = false,
  onRowSelect,
  sx,
  ...props
}: DataLensProps<Row>) {
  const [view, setView] = useState<DataLensView>(defaultView)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<DataLensSort | undefined>(initialSort)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const filterableColumns = columns.filter((column) => column.filterable || column.options?.length)

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    return rows.filter((row) => {
      const matchesQuery = !normalizedQuery || columns.some((column) => stringify(getValue(row, column)).toLowerCase().includes(normalizedQuery))
      const matchesFilters = Object.entries(filters).every(([columnId, filterValue]) => {
        if (!filterValue) {
          return true
        }

        const column = columns.find((candidate) => candidate.id === columnId)

        return column ? stringify(getValue(row, column)) === filterValue : true
      })

      return matchesQuery && matchesFilters
    })
  }, [columns, filters, query, rows])

  const visibleRows = useMemo(() => sortRows(filteredRows, columns, sort), [columns, filteredRows, sort])

  function toggleSort(column: DataLensColumn<Row>) {
    if (!column.sortable) {
      return
    }

    setSort((currentSort) => {
      if (currentSort?.columnId !== column.id) {
        return { columnId: column.id, direction: 'asc' }
      }

      return { columnId: column.id, direction: currentSort.direction === 'asc' ? 'desc' : 'asc' }
    })
  }

  function renderValue(row: Row, column: DataLensColumn<Row>) {
    const value = getValue(row, column)

    if (column.render) {
      return column.render(value, row)
    }

    if (column.chart) {
      return <TinyChart value={value} type={column.chart} />
    }

    return stringify(value)
  }

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
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          {title ? (
            <Typography variant="h6" fontWeight={900}>{title}</Typography>
          ) : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          ) : null}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ minWidth: 180, px: 1.25, py: 0.75, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
            <InputBase value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} sx={{ width: '100%', fontSize: 14 }} />
          </Box>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(_, nextView) => nextView && setView(nextView)}
            aria-label="Data view"
          >
            <ToggleButton value="table" aria-label="Table view"><ViewListIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="cards" aria-label="Card view"><ViewAgendaIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {filterableColumns.length ? (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          {filterableColumns.map((column) => (
            <Select
              key={column.id}
              size="small"
              displayEmpty
              value={filters[column.id] ?? ''}
              onChange={(event) => setFilters((currentFilters) => ({ ...currentFilters, [column.id]: event.target.value }))}
              sx={{ minWidth: 140, bgcolor: 'background.paper' }}
            >
              <MenuItem value="">All {column.label}</MenuItem>
              {(column.options ?? []).map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          ))}
          {Object.values(filters).some(Boolean) ? (
            <Chip size="small" label="Clear filters" onClick={() => setFilters({})} />
          ) : null}
        </Stack>
      ) : null}

      {view === 'table' ? (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ width: column.width, fontWeight: 900, color: 'text.secondary' }}>
                    <ButtonBase
                      disabled={!column.sortable}
                      onClick={() => toggleSort(column)}
                      sx={{ gap: 0.75, font: 'inherit', color: 'inherit', justifyContent: column.align === 'right' ? 'flex-end' : 'flex-start', width: '100%' }}
                    >
                      {column.label}
                      {sort?.columnId === column.id ? (
                        sort.direction === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />
                      ) : null}
                    </ButtonBase>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, rowIndex) => (
                <TableRow key={stringify((row as Record<string, unknown>).id) || rowIndex} hover={Boolean(onRowSelect)} onClick={() => onRowSelect?.(row)} sx={{ cursor: onRowSelect ? 'pointer' : 'default' }}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {renderValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!visibleRows.length ? (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>{emptyState}</Box>
          ) : null}
        </TableContainer>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
          {visibleRows.map((row, rowIndex) => (
            <Paper key={stringify((row as Record<string, unknown>).id) || rowIndex} variant="outlined" onClick={() => onRowSelect?.(row)} sx={{ p: dense ? 1.5 : 2, borderRadius: 1, cursor: onRowSelect ? 'pointer' : 'default' }}>
              <Stack spacing={1}>
                {columns.map((column, columnIndex) => (
                  <Stack key={column.id} direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant={columnIndex === 0 ? 'subtitle1' : 'caption'} color={columnIndex === 0 ? 'text.primary' : 'text.secondary'} fontWeight={columnIndex === 0 ? 900 : 800}>
                      {columnIndex === 0 ? renderValue(row, column) : column.label}
                    </Typography>
                    {columnIndex === 0 ? null : (
                      <Box sx={{ textAlign: 'right' }}>{renderValue(row, column)}</Box>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Paper>
          ))}
          {!visibleRows.length ? (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, color: 'text.secondary', textAlign: 'center' }}>{emptyState}</Paper>
          ) : null}
        </Box>
      )}
    </Box>
  )
}
