import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { DragEvent } from 'react'

export type KanbanCard = {
  id: string
  title: string
  description?: string
  tags?: string[]
  color?: string
  data?: unknown
}

export type KanbanColumn = {
  id: string
  title: string
  cards: KanbanCard[]
  color?: string
}

export type KanbanBoardProps = Omit<BoxProps, 'onChange'> & {
  columns?: KanbanColumn[]
  defaultColumns?: KanbanColumn[]
  title?: string
  subtitle?: string
  density?: 'comfortable' | 'compact'
  allowColumnDrag?: boolean
  onChange?: (columns: KanbanColumn[]) => void
  onCardSelect?: (card: KanbanCard, column: KanbanColumn) => void
}

type DragState =
  | { type: 'card', cardId: string, fromColumnId: string }
  | { type: 'column', columnId: string }
  | null

type CardEditorState = {
  mode: 'add' | 'edit'
  columnId: string
  card?: KanbanCard
}

type DropPreview = {
  columnId: string
  index: number
}

const defaultBoard: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    color: '#2563eb',
    cards: [
      { id: 'card-1', title: 'Map user journey', description: 'Find the rough edges before building.', tags: ['Research'] },
      { id: 'card-2', title: 'Write API contract', description: 'Lock the shape of the data.', tags: ['Backend'] }
    ]
  },
  {
    id: 'doing',
    title: 'Doing',
    color: '#d97706',
    cards: [
      { id: 'card-3', title: 'Build board interactions', description: 'Drag between columns and reorder cards.', tags: ['UI'], color: '#fef3c7' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    color: '#059669',
    cards: [
      { id: 'card-4', title: 'Choose visual system', description: 'Dense, clean, and readable.', tags: ['Design'], color: '#dcfce7' }
    ]
  }
]

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [item] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, item)

  return nextItems
}

function findCard(columns: KanbanColumn[], cardId: string) {
  for (const column of columns) {
    const card = column.cards.find((item) => item.id === cardId)

    if (card) {
      return { card, column }
    }
  }

  return null
}

function removeCard(columns: KanbanColumn[], cardId: string) {
  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => card.id !== cardId)
  }))
}

function insertCard(columns: KanbanColumn[], columnId: string, card: KanbanCard, index: number) {
  return columns.map((column) => {
    if (column.id !== columnId) {
      return column
    }

    const cards = [...column.cards]
    cards.splice(index, 0, card)

    return {
      ...column,
      cards
    }
  })
}

function getDropIndex(event: DragEvent<HTMLElement>, cardIndex: number) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const afterCard = event.clientY > bounds.top + bounds.height / 2

  return afterCard ? cardIndex + 1 : cardIndex
}

function normalizeTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function isSameCardPosition(
  columns: KanbanColumn[],
  dragState: DragState,
  columnId: string,
  index: number
) {
  if (!dragState || dragState.type !== 'card' || dragState.fromColumnId !== columnId) {
    return false
  }

  const sourceColumn = columns.find((column) => column.id === columnId)
  const sourceIndex = sourceColumn?.cards.findIndex((card) => card.id === dragState.cardId) ?? -1

  return index === sourceIndex || index === sourceIndex + 1
}

function DropSlot({
  compact,
  onDragOver,
  onDrop
}: {
  compact: boolean
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDrop: (event: DragEvent<HTMLElement>) => void
}) {
  return (
    <Box
      onDragOver={onDragOver}
      onDrop={onDrop}
      sx={(theme) => ({
        height: compact ? 44 : 56,
        border: 1,
        borderStyle: 'dashed',
        borderColor: 'primary.main',
        borderRadius: 1,
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08),
        transition: 'height 120ms ease, background-color 120ms ease'
      })}
    />
  )
}

export function KanbanBoard({
  columns,
  defaultColumns = defaultBoard,
  title = 'Kanban',
  subtitle,
  density = 'comfortable',
  allowColumnDrag = true,
  onChange,
  onCardSelect,
  sx,
  ...props
}: KanbanBoardProps) {
  const [internalColumns, setInternalColumns] = useState(defaultColumns)
  const [dragState, setDragState] = useState<DragState>(null)
  const [dropPreview, setDropPreview] = useState<DropPreview | null>(null)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [newCardTitleByColumn, setNewCardTitleByColumn] = useState<Record<string, string>>({})
  const [cardEditor, setCardEditor] = useState<CardEditorState | null>(null)
  const [cardTitle, setCardTitle] = useState('')
  const [cardDescription, setCardDescription] = useState('')
  const [cardTags, setCardTags] = useState('')
  const [cardColor, setCardColor] = useState('#ffffff')
  const boardColumns = columns ?? internalColumns
  const compact = density === 'compact'
  const selectedCardMatch = cardEditor?.card ? findCard(boardColumns, cardEditor.card.id) : null
  const cardCount = useMemo(() => boardColumns.reduce((total, column) => total + column.cards.length, 0), [boardColumns])

  function commitColumns(nextColumns: KanbanColumn[]) {
    if (!columns) {
      setInternalColumns(nextColumns)
    }

    onChange?.(nextColumns)
  }

  function addColumn() {
    const titleText = newColumnTitle.trim()

    if (!titleText) {
      return
    }

    commitColumns([
      ...boardColumns,
      {
        id: createId('column'),
        title: titleText,
        cards: [],
        color: '#64748b'
      }
    ])
    setNewColumnTitle('')
  }

  function renameColumn(columnId: string, titleText: string) {
    commitColumns(boardColumns.map((column) => column.id === columnId ? { ...column, title: titleText } : column))
  }

  function deleteColumn(columnId: string) {
    commitColumns(boardColumns.filter((column) => column.id !== columnId))
  }

  function addQuickCard(columnId: string) {
    const titleText = newCardTitleByColumn[columnId]?.trim()

    if (!titleText) {
      return
    }

    const card = {
      id: createId('card'),
      title: titleText
    }

    commitColumns(boardColumns.map((column) => column.id === columnId ? { ...column, cards: [...column.cards, card] } : column))
    setNewCardTitleByColumn((current) => ({ ...current, [columnId]: '' }))
  }

  function openCardEditor(columnId: string, mode: 'add' | 'edit', card?: KanbanCard) {
    setCardEditor({ columnId, mode, card })
    setCardTitle(card?.title ?? '')
    setCardDescription(card?.description ?? '')
    setCardTags((card?.tags ?? []).join(', '))
    setCardColor(card?.color ?? '#ffffff')
  }

  function closeCardEditor() {
    setCardEditor(null)
    setCardTitle('')
    setCardDescription('')
    setCardTags('')
    setCardColor('#ffffff')
  }

  function saveCard() {
    if (!cardEditor || !cardTitle.trim()) {
      return
    }

    const card: KanbanCard = {
      id: cardEditor.card?.id ?? createId('card'),
      title: cardTitle.trim(),
      description: cardDescription.trim() || undefined,
      tags: normalizeTags(cardTags),
      color: cardColor
    }

    if (cardEditor.mode === 'add') {
      commitColumns(boardColumns.map((column) => column.id === cardEditor.columnId ? { ...column, cards: [...column.cards, card] } : column))
      closeCardEditor()
      return
    }

    commitColumns(boardColumns.map((column) => ({
      ...column,
      cards: column.cards.map((item) => item.id === card.id ? card : item)
    })))
    closeCardEditor()
  }

  function deleteCard(cardId: string) {
    commitColumns(removeCard(boardColumns, cardId))
    closeCardEditor()
  }

  function moveCard(cardId: string, targetColumnId: string, targetIndex: number) {
    const match = findCard(boardColumns, cardId)

    if (!match) {
      return
    }

    const sourceIndex = match.column.cards.findIndex((card) => card.id === cardId)
    const adjustedTargetIndex = match.column.id === targetColumnId && sourceIndex < targetIndex
      ? targetIndex - 1
      : targetIndex
    const withoutCard = removeCard(boardColumns, cardId)
    const targetColumn = withoutCard.find((column) => column.id === targetColumnId)
    const safeIndex = Math.min(Math.max(adjustedTargetIndex, 0), targetColumn?.cards.length ?? 0)

    commitColumns(insertCard(withoutCard, targetColumnId, match.card, safeIndex))
  }

  function updateDropPreview(columnId: string, index: number) {
    if (isSameCardPosition(boardColumns, dragState, columnId, index)) {
      setDropPreview(null)
      return
    }

    setDropPreview((current) => {
      if (current?.columnId === columnId && current.index === index) {
        return current
      }

      return { columnId, index }
    })
  }

  function clearDragState() {
    setDragState(null)
    setDropPreview(null)
  }

  function moveColumn(sourceColumnId: string, targetColumnId: string) {
    const fromIndex = boardColumns.findIndex((column) => column.id === sourceColumnId)
    const toIndex = boardColumns.findIndex((column) => column.id === targetColumnId)

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return
    }

    commitColumns(moveItem(boardColumns, fromIndex, toIndex))
  }

  function handleColumnDrop(event: DragEvent<HTMLElement>, targetColumnId: string) {
    event.preventDefault()

    if (!dragState) {
      return
    }

    if (dragState.type === 'column') {
      moveColumn(dragState.columnId, targetColumnId)
      clearDragState()
      return
    }

    const targetColumn = boardColumns.find((column) => column.id === targetColumnId)
    const targetIndex = targetColumn?.cards.length ?? 0

    if (!isSameCardPosition(boardColumns, dragState, targetColumnId, targetIndex)) {
      moveCard(dragState.cardId, targetColumnId, targetIndex)
    }

    clearDragState()
  }

  function handleCardDrop(event: DragEvent<HTMLElement>, targetColumnId: string, targetCardIndex: number) {
    event.preventDefault()
    event.stopPropagation()

    if (!dragState || dragState.type !== 'card') {
      return
    }

    const targetIndex = getDropIndex(event, targetCardIndex)

    if (!isSameCardPosition(boardColumns, dragState, targetColumnId, targetIndex)) {
      moveCard(dragState.cardId, targetColumnId, targetIndex)
    }

    clearDragState()
  }

  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%',
          color: 'text.primary'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={900}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle ?? `${boardColumns.length} columns, ${cardCount} cards`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="New column"
            value={newColumnTitle}
            onChange={(event) => setNewColumnTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                addColumn()
              }
            }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={addColumn}>
            Column
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: { xs: 'row', md: 'column' },
          gridAutoColumns: { md: 'minmax(280px, 1fr)' },
          gridTemplateColumns: { xs: '1fr', md: 'none' },
          gap: 2,
          overflowX: { xs: 'visible', md: 'auto' },
          pb: 1
        }}
      >
        {boardColumns.map((column) => (
          <Paper
            key={column.id}
            variant="outlined"
            draggable={allowColumnDrag && dragState?.type !== 'card'}
            onDragStart={() => {
              if (allowColumnDrag) {
                setDragState({ type: 'column', columnId: column.id })
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()

              if (dragState?.type === 'card' && event.target === event.currentTarget) {
                updateDropPreview(column.id, column.cards.length)
              }
            }}
            onDrop={(event) => handleColumnDrop(event, column.id)}
            onDragEnd={clearDragState}
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              p: compact ? 1.25 : 1.5,
              pt: compact ? 1.5 : 1.75,
              borderRadius: 1,
              minHeight: 260,
              bgcolor: 'background.paper',
              borderColor: alpha(column.color ?? theme.palette.text.secondary, theme.palette.mode === 'dark' ? 0.32 : 0.22),
              boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.24 : 0.06)}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                bgcolor: column.color ?? 'text.secondary'
              }
            })}
          >
            <Stack spacing={compact ? 1 : 1.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                {allowColumnDrag ? <DragIndicatorIcon fontSize="small" color="disabled" /> : null}
                {editingColumnId === column.id ? (
                  <TextField
                    autoFocus
                    fullWidth
                    size="small"
                    value={column.title}
                    onChange={(event) => renameColumn(column.id, event.target.value)}
                    onBlur={() => setEditingColumnId(null)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        setEditingColumnId(null)
                      }
                    }}
                  />
                ) : (
                  <Typography fontWeight={900} sx={{ flex: 1, minWidth: 0 }}>
                    {column.title}
                  </Typography>
                )}
                <Chip size="small" label={column.cards.length} />
                <Tooltip title="Rename column">
                  <IconButton size="small" onClick={() => setEditingColumnId(column.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete column">
                  <IconButton size="small" onClick={() => deleteColumn(column.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack spacing={1}>
                {column.cards.map((card, cardIndex) => {
                  const showDropSlot = dragState?.type === 'card'
                    && dragState.cardId !== card.id
                    && dropPreview?.columnId === column.id
                    && dropPreview.index === cardIndex
                  const draggingCard = dragState?.type === 'card' && dragState.cardId === card.id

                  return (
                    <Box key={card.id}>
                      {showDropSlot ? (
                        <Box sx={{ mb: 1 }}>
                          <DropSlot
                            compact={compact}
                            onDragOver={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              updateDropPreview(column.id, cardIndex)
                            }}
                            onDrop={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              if (dragState?.type === 'card') {
                                if (!isSameCardPosition(boardColumns, dragState, column.id, cardIndex)) {
                                  moveCard(dragState.cardId, column.id, cardIndex)
                                }

                                clearDragState()
                              }
                            }}
                          />
                        </Box>
                      ) : null}
                      <Paper
                        variant="outlined"
                        draggable
                        onDragStart={(event) => {
                          event.stopPropagation()
                          event.dataTransfer.effectAllowed = 'move'
                          setDragState({ type: 'card', cardId: card.id, fromColumnId: column.id })
                          updateDropPreview(column.id, cardIndex)
                        }}
                        onDragOver={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          updateDropPreview(column.id, getDropIndex(event, cardIndex))
                        }}
                        onDrop={(event) => handleCardDrop(event, column.id, cardIndex)}
                        onDragEnd={clearDragState}
                        onClick={() => onCardSelect?.(card, column)}
                        sx={(theme) => {
                          const cardAccent = card.color && card.color.toLowerCase() !== '#ffffff'
                            ? card.color
                            : column.color ?? theme.palette.primary.main

                          return {
                            position: 'relative',
                            overflow: 'hidden',
                            p: compact ? 1.25 : 1.5,
                            pl: compact ? 1.5 : 1.75,
                            borderRadius: 1,
                            cursor: draggingCard ? 'grabbing' : 'grab',
                            bgcolor: 'background.paper',
                            borderColor: draggingCard ? 'primary.main' : alpha(cardAccent, theme.palette.mode === 'dark' ? 0.28 : 0.18),
                            color: 'text.primary',
                            opacity: draggingCard ? 0.5 : 1,
                            transform: draggingCard ? 'scale(0.98)' : 'scale(1)',
                            transition: 'transform 120ms ease, opacity 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
                            boxShadow: draggingCard
                              ? `0 18px 40px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.32 : 0.22)}`
                              : `0 8px 20px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.26 : 0.08)}`,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              width: 4,
                              bgcolor: cardAccent
                            },
                            '&:hover': {
                              borderColor: alpha(cardAccent, theme.palette.mode === 'dark' ? 0.52 : 0.38),
                              boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.34 : 0.12)}`
                            }
                          }
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography fontWeight={850}>
                                {card.title}
                              </Typography>
                              {card.description ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {card.description}
                                </Typography>
                              ) : null}
                            </Box>
                            <IconButton size="small" onClick={(event) => {
                              event.stopPropagation()
                              openCardEditor(column.id, 'edit', card)
                            }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Stack>

                          {card.tags?.length ? (
                            <Stack direction="row" flexWrap="wrap" gap={0.75}>
                              {card.tags.map((tag) => (
                                <Chip key={tag} size="small" label={tag} />
                              ))}
                            </Stack>
                          ) : null}
                        </Stack>
                      </Paper>
                    </Box>
                  )
                })}
                {dragState?.type === 'card' && dropPreview?.columnId === column.id && dropPreview.index === column.cards.length ? (
                  <DropSlot
                    compact={compact}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      updateDropPreview(column.id, column.cards.length)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      if (dragState?.type === 'card') {
                        if (!isSameCardPosition(boardColumns, dragState, column.id, column.cards.length)) {
                          moveCard(dragState.cardId, column.id, column.cards.length)
                        }

                        clearDragState()
                      }
                    }}
                  />
                ) : null}
              </Stack>

              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="Quick card"
                  value={newCardTitleByColumn[column.id] ?? ''}
                  onChange={(event) => setNewCardTitleByColumn((current) => ({ ...current, [column.id]: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      addQuickCard(column.id)
                    }
                  }}
                />
                <Button variant="outlined" onClick={() => addQuickCard(column.id)}>
                  Add
                </Button>
              </Stack>

              <Button startIcon={<AddIcon />} onClick={() => openCardEditor(column.id, 'add')}>
                Detailed card
              </Button>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Dialog open={Boolean(cardEditor)} onClose={closeCardEditor} fullWidth maxWidth="sm">
        <DialogTitle>{cardEditor?.mode === 'add' ? 'Add card' : 'Edit card'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Title" value={cardTitle} onChange={(event) => setCardTitle(event.target.value)} autoFocus />
            <TextField label="Description" value={cardDescription} onChange={(event) => setCardDescription(event.target.value)} multiline minRows={3} />
            <TextField label="Tags" helperText="Comma separated" value={cardTags} onChange={(event) => setCardTags(event.target.value)} />
            <TextField label="Color" value={cardColor} onChange={(event) => setCardColor(event.target.value)} select>
              {[
                { label: 'White', value: '#ffffff' },
                { label: 'Blue', value: '#dbeafe' },
                { label: 'Green', value: '#dcfce7' },
                { label: 'Yellow', value: '#fef3c7' },
                { label: 'Red', value: '#fee2e2' }
              ].map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          {selectedCardMatch ? (
            <Button color="error" onClick={() => deleteCard(selectedCardMatch.card.id)}>
              Delete
            </Button>
          ) : null}
          <Button onClick={closeCardEditor}>Cancel</Button>
          <Button variant="contained" onClick={saveCard}>{cardEditor?.mode === 'add' ? 'Add' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
