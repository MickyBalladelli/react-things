import { useMemo, useState } from 'react'
import { Box, Button, Chip, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined'
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material'

export type DiffViewerMode = 'text' | 'object'
export type DiffViewerDecision = 'accepted' | 'rejected'

export type DiffViewerComment = {
  id: string
  hunkId: string
  author?: string
  body: string
}

export type DiffViewerChange = {
  hunkId: string
  decision: DiffViewerDecision
}

export type DiffViewerProps = {
  before: string | unknown
  after: string | unknown
  mode?: DiffViewerMode
  title?: string
  subtitle?: string
  comments?: DiffViewerComment[]
  defaultComments?: DiffViewerComment[]
  decisions?: Record<string, DiffViewerDecision>
  defaultDecisions?: Record<string, DiffViewerDecision>
  beforeLabel?: string
  afterLabel?: string
  contextLines?: number
  onCommentAdd?: (comment: DiffViewerComment) => void
  onDecisionChange?: (change: DiffViewerChange) => void
  renderComment?: (comment: DiffViewerComment) => ReactNode
  sx?: BoxProps['sx']
}

type LineToken = {
  value: string
  lineNumber: number
}

type DiffLineKind = 'equal' | 'add' | 'remove' | 'change'

type DiffLine = {
  id: string
  kind: DiffLineKind
  before?: LineToken
  after?: LineToken
}

type WordPart = {
  value: string
  changed: boolean
}

const codeFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

function formatObject(value: unknown) {
  return JSON.stringify(sortObject(value), null, 2)
}

function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObject)
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((sorted, key) => {
        sorted[key] = sortObject((value as Record<string, unknown>)[key])
        return sorted
      }, {})
  }

  return value
}

function toLines(value: string) {
  const lines = value.split('\n')
  return lines.map((line, index) => ({ value: line, lineNumber: index + 1 }))
}

function createDiff(beforeValue: string, afterValue: string) {
  const before = toLines(beforeValue)
  const after = toLines(afterValue)
  const table = Array.from({ length: before.length + 1 }, () => Array(after.length + 1).fill(0) as number[])

  let beforeTableIndex = before.length - 1

  while (beforeTableIndex >= 0) {
    let afterTableIndex = after.length - 1

    while (afterTableIndex >= 0) {
      table[beforeTableIndex][afterTableIndex] = before[beforeTableIndex].value === after[afterTableIndex].value
        ? table[beforeTableIndex + 1][afterTableIndex + 1] + 1
        : Math.max(table[beforeTableIndex + 1][afterTableIndex], table[beforeTableIndex][afterTableIndex + 1])
      afterTableIndex -= 1
    }

    beforeTableIndex -= 1
  }

  const rawLines: DiffLine[] = []
  let beforeIndex = 0
  let afterIndex = 0

  while (beforeIndex < before.length && afterIndex < after.length) {
    if (before[beforeIndex].value === after[afterIndex].value) {
      rawLines.push({
        id: `equal-${before[beforeIndex].lineNumber}-${after[afterIndex].lineNumber}`,
        kind: 'equal',
        before: before[beforeIndex],
        after: after[afterIndex]
      })
      beforeIndex += 1
      afterIndex += 1
    } else if (table[beforeIndex + 1][afterIndex] >= table[beforeIndex][afterIndex + 1]) {
      rawLines.push({
        id: `remove-${before[beforeIndex].lineNumber}`,
        kind: 'remove',
        before: before[beforeIndex]
      })
      beforeIndex += 1
    } else {
      rawLines.push({
        id: `add-${after[afterIndex].lineNumber}`,
        kind: 'add',
        after: after[afterIndex]
      })
      afterIndex += 1
    }
  }

  while (beforeIndex < before.length) {
    rawLines.push({
      id: `remove-${before[beforeIndex].lineNumber}`,
      kind: 'remove',
      before: before[beforeIndex]
    })
    beforeIndex += 1
  }

  while (afterIndex < after.length) {
    rawLines.push({
      id: `add-${after[afterIndex].lineNumber}`,
      kind: 'add',
      after: after[afterIndex]
    })
    afterIndex += 1
  }

  return pairChangedLines(rawLines)
}

function pairChangedLines(lines: DiffLine[]) {
  const paired: DiffLine[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.kind !== 'remove') {
      paired.push(line)
      index += 1
      continue
    }

    const removed: DiffLine[] = []
    const added: DiffLine[] = []

    while (lines[index]?.kind === 'remove') {
      removed.push(lines[index])
      index += 1
    }

    while (lines[index]?.kind === 'add') {
      added.push(lines[index])
      index += 1
    }

    const length = Math.max(removed.length, added.length)
    let pairIndex = 0

    while (pairIndex < length) {
      const removeLine = removed[pairIndex]
      const addLine = added[pairIndex]

      if (removeLine && addLine) {
        paired.push({
          id: `change-${removeLine.before?.lineNumber}-${addLine.after?.lineNumber}`,
          kind: 'change',
          before: removeLine.before,
          after: addLine.after
        })
      } else if (removeLine) {
        paired.push(removeLine)
      } else if (addLine) {
        paired.push(addLine)
      }

      pairIndex += 1
    }
  }

  return paired
}

function createHunks(lines: DiffLine[], contextLines: number) {
  const changeIndexes = lines
    .map((line, index) => line.kind === 'equal' ? -1 : index)
    .filter((index) => index >= 0)

  if (!changeIndexes.length) {
    return []
  }

  const ranges: Array<{ start: number, end: number }> = []

  changeIndexes.forEach((changeIndex) => {
    const start = Math.max(0, changeIndex - contextLines)
    const end = Math.min(lines.length - 1, changeIndex + contextLines)
    const previous = ranges[ranges.length - 1]

    if (previous && start <= previous.end + 1) {
      previous.end = Math.max(previous.end, end)
      return
    }

    ranges.push({ start, end })
  })

  return ranges.map((range, index) => {
    const hunkLines = lines.slice(range.start, range.end + 1)
    const firstChangedLine = hunkLines.find((line) => line.kind !== 'equal') ?? hunkLines[0]
    const beforeStart = hunkLines.find((line) => line.before)?.before?.lineNumber ?? 1
    const afterStart = hunkLines.find((line) => line.after)?.after?.lineNumber ?? 1

    return {
      id: `hunk-${index + 1}-${firstChangedLine.before?.lineNumber ?? 0}-${firstChangedLine.after?.lineNumber ?? 0}`,
      lines: hunkLines,
      beforeStart,
      afterStart
    }
  })
}

function diffWords(beforeValue = '', afterValue = '') {
  const before = beforeValue.split(/(\s+|[.,:()[\]{}])/g).filter(Boolean)
  const after = afterValue.split(/(\s+|[.,:()[\]{}])/g).filter(Boolean)
  const table = Array.from({ length: before.length + 1 }, () => Array(after.length + 1).fill(0) as number[])
  let beforeTableIndex = before.length - 1

  while (beforeTableIndex >= 0) {
    let afterTableIndex = after.length - 1

    while (afterTableIndex >= 0) {
      table[beforeTableIndex][afterTableIndex] = before[beforeTableIndex] === after[afterTableIndex]
        ? table[beforeTableIndex + 1][afterTableIndex + 1] + 1
        : Math.max(table[beforeTableIndex + 1][afterTableIndex], table[beforeTableIndex][afterTableIndex + 1])
      afterTableIndex -= 1
    }

    beforeTableIndex -= 1
  }

  const beforeParts: WordPart[] = []
  const afterParts: WordPart[] = []
  let beforeIndex = 0
  let afterIndex = 0

  while (beforeIndex < before.length && afterIndex < after.length) {
    if (before[beforeIndex] === after[afterIndex]) {
      beforeParts.push({ value: before[beforeIndex], changed: false })
      afterParts.push({ value: after[afterIndex], changed: false })
      beforeIndex += 1
      afterIndex += 1
    } else if (table[beforeIndex + 1][afterIndex] >= table[beforeIndex][afterIndex + 1]) {
      beforeParts.push({ value: before[beforeIndex], changed: true })
      beforeIndex += 1
    } else {
      afterParts.push({ value: after[afterIndex], changed: true })
      afterIndex += 1
    }
  }

  while (beforeIndex < before.length) {
    beforeParts.push({ value: before[beforeIndex], changed: true })
    beforeIndex += 1
  }

  while (afterIndex < after.length) {
    afterParts.push({ value: after[afterIndex], changed: true })
    afterIndex += 1
  }

  return { beforeParts, afterParts }
}

function renderParts(parts: WordPart[], color: string) {
  return parts.map((part, index) => (
    <Box
      key={`${part.value}-${index}`}
      component="span"
      sx={{
        bgcolor: part.changed ? color : 'transparent',
        borderRadius: part.changed ? 0.75 : 0,
        px: part.changed ? 0.25 : 0
      }}
    >
      {part.value}
    </Box>
  ))
}

function getDisplayValue(value: string | unknown, mode: DiffViewerMode) {
  if (mode === 'object') {
    return formatObject(value)
  }

  return String(value ?? '')
}

function summarize(lines: DiffLine[]) {
  return lines.reduce(
    (total, line) => ({
      added: total.added + (line.kind === 'add' || line.kind === 'change' ? 1 : 0),
      removed: total.removed + (line.kind === 'remove' || line.kind === 'change' ? 1 : 0)
    }),
    { added: 0, removed: 0 }
  )
}

export function DiffViewer({
  before,
  after,
  mode = 'text',
  title = 'DiffViewer',
  subtitle = 'Review changes, comment in context, accept or reject each hunk.',
  comments,
  defaultComments = [],
  decisions,
  defaultDecisions = {},
  beforeLabel = 'Before',
  afterLabel = 'After',
  contextLines = 3,
  onCommentAdd,
  onDecisionChange,
  renderComment,
  sx
}: DiffViewerProps) {
  const [localComments, setLocalComments] = useState(defaultComments)
  const [draftComments, setDraftComments] = useState<Record<string, string>>({})
  const [activeCommentHunkId, setActiveCommentHunkId] = useState<string | null>(null)
  const [localDecisions, setLocalDecisions] = useState<Record<string, DiffViewerDecision>>(defaultDecisions)
  const visibleComments = comments ?? localComments
  const visibleDecisions = decisions ?? localDecisions
  const beforeValue = useMemo(() => getDisplayValue(before, mode), [before, mode])
  const afterValue = useMemo(() => getDisplayValue(after, mode), [after, mode])
  const diffLines = useMemo(() => createDiff(beforeValue, afterValue), [beforeValue, afterValue])
  const hunks = useMemo(() => createHunks(diffLines, contextLines), [diffLines, contextLines])
  const totals = summarize(diffLines)
  const decidedCount = Object.keys(visibleDecisions).length

  function changeDecision(hunkId: string, decision: DiffViewerDecision) {
    if (!decisions) {
      setLocalDecisions((current) => ({
        ...current,
        [hunkId]: decision
      }))
    }

    onDecisionChange?.({ hunkId, decision })
  }

  function addComment(hunkId: string) {
    const body = draftComments[hunkId]?.trim()

    if (!body) {
      return
    }

    const comment = {
      id: `${hunkId}-${Date.now()}`,
      hunkId,
      author: 'You',
      body
    }

    if (!comments) {
      setLocalComments((current) => [...current, comment])
    }

    setDraftComments((current) => ({
      ...current,
      [hunkId]: ''
    }))
    setActiveCommentHunkId(null)
    onCommentAdd?.(comment)
  }

  function decideAll(decision: DiffViewerDecision) {
    const nextDecisions = hunks.reduce<Record<string, DiffViewerDecision>>((next, hunk) => {
      next[hunk.id] = decision
      return next
    }, {})

    if (!decisions) {
      setLocalDecisions(nextDecisions)
    }

    hunks.forEach((hunk) => onDecisionChange?.({ hunkId: hunk.id, decision }))
  }

  function resetDecisions() {
    if (!decisions) {
      setLocalDecisions({})
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: '#f8fafc',
        ...sx
      }}
    >
      <Box sx={{ p: 2, bgcolor: '#ffffff', borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h6" fontWeight={950}>
                {title}
              </Typography>
              <Chip size="small" icon={<SwapHorizOutlinedIcon />} label={mode} />
              <Chip size="small" color="success" label={`+${totals.added}`} />
              <Chip size="small" color="error" label={`-${totals.removed}`} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Accept all">
              <IconButton color="success" onClick={() => decideAll('accepted')} aria-label="Accept all changes">
                <DoneAllOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject all">
              <IconButton color="error" onClick={() => decideAll('rejected')} aria-label="Reject all changes">
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset decisions">
              <IconButton onClick={resetDecisions} aria-label="Reset diff decisions">
                <RestartAltOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Chip size="small" label={`${decidedCount}/${hunks.length} decided`} />
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, bgcolor: '#111827', color: '#d1d5db', borderBottom: 1, borderColor: '#243044' }}>
        <Box sx={{ px: 2, py: 1, borderRight: { lg: 1 }, borderColor: '#243044' }}>
          <Typography variant="caption" fontWeight={900}>
            {beforeLabel}
          </Typography>
        </Box>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" fontWeight={900}>
            {afterLabel}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.5} sx={{ p: 1.5 }}>
        {!hunks.length ? (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff', borderRadius: 1 }}>
            <Typography fontWeight={900}>No changes</Typography>
            <Typography variant="body2" color="text.secondary">Both sides match.</Typography>
          </Box>
        ) : hunks.map((hunk) => {
          const hunkComments = visibleComments.filter((comment) => comment.hunkId === hunk.id)
          const decision = visibleDecisions[hunk.id]

          return (
            <Paper key={hunk.id} variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden', borderColor: decision === 'accepted' ? '#86efac' : decision === 'rejected' ? '#fecaca' : 'divider' }}>
              <Box sx={{ px: 1.5, py: 1, bgcolor: '#ffffff', borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip size="small" label={`-${hunk.beforeStart} +${hunk.afterStart}`} />
                    {decision && (
                      <Chip
                        size="small"
                        color={decision === 'accepted' ? 'success' : 'error'}
                        label={decision}
                      />
                    )}
                    {hunkComments.length > 0 && <Chip size="small" label={`${hunkComments.length} comments`} />}
                  </Stack>

                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Add comment">
                      <IconButton size="small" onClick={() => setActiveCommentHunkId(activeCommentHunkId === hunk.id ? null : hunk.id)} aria-label="Add comment">
                        <AddCommentOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Button size="small" color="success" startIcon={<CheckCircleOutlineOutlinedIcon />} onClick={() => changeDecision(hunk.id, 'accepted')}>
                      Accept
                    </Button>
                    <Button size="small" color="error" startIcon={<CloseOutlinedIcon />} onClick={() => changeDecision(hunk.id, 'rejected')}>
                      Reject
                    </Button>
                  </Stack>
                </Stack>
              </Box>

              <Box>
                {hunk.lines.map((line) => {
                  const words = line.kind === 'change' ? diffWords(line.before?.value, line.after?.value) : null

                  return (
                    <Box
                      key={line.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                        borderBottom: 1,
                        borderColor: '#e5e7eb',
                        '&:last-child': {
                          borderBottom: 0
                        }
                      }}
                    >
                      <DiffCell
                        kind={line.kind === 'add' ? 'empty' : line.kind}
                        lineNumber={line.before?.lineNumber}
                        marker={line.kind === 'add' ? '' : line.kind === 'equal' ? ' ' : '-'}
                        value={words ? renderParts(words.beforeParts, '#fecaca') : line.before?.value}
                      />
                      <DiffCell
                        kind={line.kind === 'remove' ? 'empty' : line.kind}
                        lineNumber={line.after?.lineNumber}
                        marker={line.kind === 'remove' ? '' : line.kind === 'equal' ? ' ' : '+'}
                        value={words ? renderParts(words.afterParts, '#bbf7d0') : line.after?.value}
                      />
                    </Box>
                  )
                })}
              </Box>

              {(activeCommentHunkId === hunk.id || hunkComments.length > 0) && (
                <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderTop: 1, borderColor: 'divider' }}>
                  <Stack spacing={1.25}>
                    {hunkComments.map((comment) => (
                      <Box key={comment.id} sx={{ p: 1.25, borderRadius: 1, bgcolor: '#f8fafc', border: 1, borderColor: '#e5e7eb' }}>
                        {renderComment ? renderComment(comment) : (
                          <>
                            <Typography variant="caption" fontWeight={900} color="text.secondary">
                              {comment.author ?? 'Comment'}
                            </Typography>
                            <Typography variant="body2">{comment.body}</Typography>
                          </>
                        )}
                      </Box>
                    ))}

                    {activeCommentHunkId === hunk.id && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Write inline comment"
                          value={draftComments[hunk.id] ?? ''}
                          onChange={(event) => setDraftComments((current) => ({
                            ...current,
                            [hunk.id]: event.target.value
                          }))}
                        />
                        <Button variant="contained" onClick={() => addComment(hunk.id)}>
                          Comment
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              )}
            </Paper>
          )
        })}
      </Stack>
    </Paper>
  )
}

function DiffCell({
  kind,
  lineNumber,
  marker,
  value
}: {
  kind: DiffLineKind | 'empty'
  lineNumber?: number
  marker: string
  value?: ReactNode
}) {
  const colors = {
    equal: '#ffffff',
    add: '#ecfdf5',
    remove: '#fff1f2',
    change: '#fffbeb',
    empty: '#f8fafc'
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '52px 24px minmax(0, 1fr)',
        minHeight: 34,
        bgcolor: colors[kind],
        borderRight: { lg: 1 },
        borderColor: '#e5e7eb'
      }}
    >
      <Box sx={{ px: 1, py: 0.75, color: '#94a3b8', bgcolor: 'rgba(15, 23, 42, 0.04)', fontFamily: codeFont, fontSize: 12, textAlign: 'right', userSelect: 'none' }}>
        {lineNumber ?? ''}
      </Box>
      <Box sx={{ py: 0.75, color: kind === 'add' ? '#059669' : kind === 'remove' ? '#dc2626' : '#64748b', fontFamily: codeFont, fontSize: 13, textAlign: 'center', userSelect: 'none' }}>
        {marker}
      </Box>
      <Box
        component="pre"
        sx={{
          m: 0,
          px: 1,
          py: 0.75,
          minWidth: 0,
          overflowX: 'auto',
          color: '#0f172a',
          fontFamily: codeFont,
          fontSize: 13,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere'
        }}
      >
        {value ?? ''}
      </Box>
    </Box>
  )
}
