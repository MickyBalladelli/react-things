import { useEffect, useState } from 'react'
import AddBoxIcon from '@mui/icons-material/AddBox'
import AddLinkIcon from '@mui/icons-material/AddLink'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type NodeCanvasNode = {
  id: string
  label: string
  x: number
  y: number
  color?: string
  data?: unknown
}

export type NodeCanvasConnection = {
  from: string
  to: string
  type?: NodeCanvasConnectionType | string
  label?: string
  color?: string
}

export type NodeCanvasConnectionType = 'line' | 'curved' | 'step' | 'ellipse'

export type NodeCanvasPosition = {
  x: number
  y: number
}

export type NodeCanvasProps = BoxProps & {
  nodes: NodeCanvasNode[]
  connections?: NodeCanvasConnection[]
  nodeWidth?: number
  nodeHeight?: number
  mode?: 'edit' | 'readonly'
  snapToGrid?: boolean
  gridSize?: number
  showGrid?: boolean
  selectedNodeId?: string | null
  connectionStyle?: NodeCanvasConnectionType
  editableTools?: boolean
  linkTypes?: NodeCanvasConnectionType[]
  renderNode?: (node: NodeCanvasNode, selected: boolean) => ReactNode
  onNodesChange?: (nodes: NodeCanvasNode[]) => void
  onConnectionsChange?: (connections: NodeCanvasConnection[]) => void
  onNodeMove?: (nodeId: string, position: NodeCanvasPosition) => void
  onNodeSelect?: (node: NodeCanvasNode) => void
}

function snap(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize
}

function getPath(
  from: NodeCanvasPosition,
  to: NodeCanvasPosition,
  nodeWidth: number,
  nodeHeight: number,
  style: NodeCanvasConnectionType | string
) {
  const fromX = from.x + nodeWidth / 2
  const fromY = from.y + nodeHeight / 2
  const toX = to.x + nodeWidth / 2
  const toY = to.y + nodeHeight / 2
  const middleX = (fromX + toX) / 2

  if (style === 'ellipse') {
    const radiusX = Math.max(Math.abs(toX - fromX) / 2, 24)
    const radiusY = Math.max(Math.abs(toY - fromY) / 2, 24)

    return `M ${fromX} ${fromY} A ${radiusX} ${radiusY} 0 0 1 ${toX} ${toY}`
  }

  if (style === 'curved') {
    return `M ${fromX} ${fromY} C ${middleX} ${fromY}, ${middleX} ${toY}, ${toX} ${toY}`
  }

  if (style === 'step') {
    return `M ${fromX} ${fromY} L ${middleX} ${fromY} L ${middleX} ${toY} L ${toX} ${toY}`
  }

  return `M ${fromX} ${fromY} L ${toX} ${toY}`
}

export function NodeCanvas({
  nodes,
  connections = [],
  nodeWidth = 132,
  nodeHeight = 52,
  mode = 'edit',
  snapToGrid = false,
  gridSize = 24,
  showGrid = false,
  selectedNodeId,
  connectionStyle = 'line',
  editableTools = false,
  linkTypes = ['line', 'curved', 'step', 'ellipse'],
  renderNode,
  onNodesChange,
  onConnectionsChange,
  onNodeMove,
  onNodeSelect,
  sx,
  ...props
}: NodeCanvasProps) {
  const [internalNodes, setInternalNodes] = useState(nodes)
  const [internalConnections, setInternalConnections] = useState(connections)
  const canvasNodes = editableTools ? internalNodes : nodes
  const canvasConnections = editableTools ? internalConnections : connections
  const [nodePositions, setNodePositions] = useState<Record<string, NodeCanvasPosition>>(
    Object.fromEntries(canvasNodes.map((node) => [node.id, { x: node.x, y: node.y }]))
  )
  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState<string | null>(selectedNodeId ?? null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [linkTargetId, setLinkTargetId] = useState('')
  const [linkType, setLinkType] = useState<NodeCanvasConnectionType>(linkTypes[0] ?? 'line')
  const [linkLabel, setLinkLabel] = useState('')
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null)
  const selectedId = selectedNodeId ?? internalSelectedNodeId
  const selectedNode = canvasNodes.find((node) => node.id === selectedId) ?? null
  const selectedLinks = canvasConnections
    .map((connection, index) => ({ connection, index }))
    .filter(({ connection }) => connection.from === selectedId || connection.to === selectedId)
  const nodesSignature = nodes.map((node) => `${node.id}:${node.label}:${node.x}:${node.y}:${node.color ?? ''}`).join('|')
  const connectionsSignature = connections.map((connection) => `${connection.from}:${connection.to}:${connection.type ?? ''}:${connection.label ?? ''}:${connection.color ?? ''}`).join('|')

  useEffect(() => {
    if (!editableTools) {
      setInternalNodes(nodes)
    }

    setNodePositions((currentPositions) => ({
      ...Object.fromEntries(nodes.map((node) => [node.id, currentPositions[node.id] ?? { x: node.x, y: node.y }]))
    }))
  }, [editableTools, nodesSignature])

  useEffect(() => {
    if (!editableTools) {
      setInternalConnections(connections)
    }
  }, [connectionsSignature, editableTools])

  function commitNodes(nextNodes: NodeCanvasNode[]) {
    setInternalNodes(nextNodes)
    onNodesChange?.(nextNodes)
  }

  function commitConnections(nextConnections: NodeCanvasConnection[]) {
    setInternalConnections(nextConnections)
    onConnectionsChange?.(nextConnections)
  }

  function commitPosition(nodeId: string, position: NodeCanvasPosition) {
    const nextPosition = snapToGrid
      ? { x: snap(position.x, gridSize), y: snap(position.y, gridSize) }
      : position

    setNodePositions((current) => ({
      ...current,
      [nodeId]: nextPosition
    }))

    if (editableTools) {
      commitNodes(canvasNodes.map((node) => node.id === nodeId ? { ...node, ...nextPosition } : node))
    }

    onNodeMove?.(nodeId, nextPosition)
  }

  function addNode() {
    const nextIndex = canvasNodes.length + 1
    const node = {
      id: `node-${Date.now()}`,
      label: `Box ${nextIndex}`,
      x: 48 + nextIndex * 18,
      y: 48 + nextIndex * 18,
      color: '#2563eb'
    }

    commitNodes([...canvasNodes, node])
    setNodePositions((currentPositions) => ({
      ...currentPositions,
      [node.id]: { x: node.x, y: node.y }
    }))
    setInternalSelectedNodeId(node.id)
  }

  function removeSelectedNode() {
    if (!selectedId) {
      return
    }

    commitNodes(canvasNodes.filter((node) => node.id !== selectedId))
    commitConnections(canvasConnections.filter((connection) => connection.from !== selectedId && connection.to !== selectedId))
    setInternalSelectedNodeId(null)
    setEditorOpen(false)
  }

  function updateSelectedNode(partialNode: Partial<NodeCanvasNode>) {
    if (!selectedId) {
      return
    }

    commitNodes(canvasNodes.map((node) => node.id === selectedId ? { ...node, ...partialNode } : node))
  }

  function addLink() {
    if (!selectedId || !linkTargetId || selectedId === linkTargetId) {
      return
    }

    const nextConnection = {
      from: selectedId,
      to: linkTargetId,
      type: linkType,
      label: linkLabel,
      color: linkType === 'ellipse' ? '#db2777' : linkType === 'step' ? '#059669' : '#2563eb'
    }
    const nextConnections = [
      ...canvasConnections.filter((connection) => !(connection.from === selectedId && connection.to === linkTargetId)),
      nextConnection
    ]

    commitConnections(nextConnections)
    setLinkTargetId('')
    setLinkLabel('')
    setSelectedLinkIndex(nextConnections.indexOf(nextConnection))
  }

  function updateLink(connectionIndex: number, partialConnection: Partial<NodeCanvasConnection>) {
    const currentConnection = canvasConnections[connectionIndex]

    if (!currentConnection) {
      return
    }

    const nextConnection = { ...currentConnection, ...partialConnection }
    const nextConnections = canvasConnections
      .map((connection, index) => index === connectionIndex ? nextConnection : connection)
      .filter((connection, index) => (
        index === connectionIndex ||
        connection.from !== nextConnection.from ||
        connection.to !== nextConnection.to
      ))

    commitConnections(nextConnections)
  }

  function removeLink(connectionIndex: number) {
    commitConnections(canvasConnections.filter((_, index) => index !== connectionIndex))
    setSelectedLinkIndex(null)
  }

  return (
    <Box
      {...props}
      sx={[
        (theme) => ({
          position: 'relative',
          minHeight: 360,
          overflow: 'hidden',
          bgcolor: 'background.default',
          backgroundImage: showGrid
            ? `linear-gradient(${alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.14 : 0.16)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.14 : 0.16)} 1px, transparent 1px)`
            : undefined,
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : undefined
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box component="svg" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {canvasConnections.map((connection) => {
          const from = nodePositions[connection.from]
          const to = nodePositions[connection.to]

          if (!from || !to) {
            return null
          }

          const path = getPath(from, to, nodeWidth, nodeHeight, connection.type ?? connectionStyle)

          const labelX = (from.x + to.x + nodeWidth) / 2
          const labelY = (from.y + to.y + nodeHeight) / 2

          return (
            <g key={`${connection.from}-${connection.to}-${connection.type ?? connection.label ?? 'link'}`}>
              <path d={path} fill="none" stroke={connection.color ?? '#94a3b8'} strokeWidth="2.5" />
              {connection.label ? (
                <text x={labelX} y={labelY - 8} textAnchor="middle" fill={connection.color ?? '#64748b'} fontSize="11" fontWeight="700">
                  {connection.label}
                </text>
              ) : null}
            </g>
          )
        })}
      </Box>
      {canvasNodes.map((node) => {
        const position = nodePositions[node.id]
        const selected = node.id === selectedId

        return (
          <Box
            key={node.id}
            role="button"
            tabIndex={0}
            sx={(theme) => ({
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: nodeWidth,
              height: nodeHeight,
              display: 'grid',
              placeItems: 'center',
              border: selected ? 2 : 1,
              borderColor: selected ? 'primary.main' : node.color ? alpha(node.color, theme.palette.mode === 'dark' ? 0.34 : 0.22) : 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              color: 'text.primary',
              cursor: mode === 'edit' ? 'grab' : 'pointer',
              userSelect: 'none',
              overflow: 'hidden',
              boxShadow: selected
                ? `0 18px 34px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.32 : 0.22)}`
                : `0 12px 28px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.32 : 0.12)}`,
              touchAction: 'none',
              '&::before': node.color ? {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: 4,
                bgcolor: node.color
              } : undefined
            })}
            onPointerDown={(event) => {
              setInternalSelectedNodeId(node.id)
              setSelectedLinkIndex(null)
              if (editableTools) {
                setEditorOpen(true)
              }
              onNodeSelect?.(node)

              if (mode === 'readonly') {
                return
              }

              const startX = event.clientX
              const startY = event.clientY
              const start = nodePositions[node.id]
              event.currentTarget.setPointerCapture(event.pointerId)

              function move(moveEvent: PointerEvent) {
                commitPosition(node.id, {
                  x: start.x + moveEvent.clientX - startX,
                  y: start.y + moveEvent.clientY - startY
                })
              }

              function up() {
                window.removeEventListener('pointermove', move)
                window.removeEventListener('pointerup', up)
              }

              window.addEventListener('pointermove', move)
              window.addEventListener('pointerup', up)
            }}
            onKeyDown={(event) => {
              if (mode === 'readonly') {
                return
              }

              const step = snapToGrid ? gridSize : 8
              const current = nodePositions[node.id]

              if (event.key === 'ArrowLeft') {
                commitPosition(node.id, { x: current.x - step, y: current.y })
                event.preventDefault()
              }

              if (event.key === 'ArrowRight') {
                commitPosition(node.id, { x: current.x + step, y: current.y })
                event.preventDefault()
              }

              if (event.key === 'ArrowUp') {
                commitPosition(node.id, { x: current.x, y: current.y - step })
                event.preventDefault()
              }

              if (event.key === 'ArrowDown') {
                commitPosition(node.id, { x: current.x, y: current.y + step })
                event.preventDefault()
              }
            }}
          >
            {renderNode ? renderNode(node, selected) : <Typography fontWeight={800}>{node.label}</Typography>}
          </Box>
        )
      })}

      {editableTools && selectedNode && editorOpen ? (
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            zIndex: 20,
            width: 340,
            maxWidth: 'calc(100% - 24px)',
            maxHeight: 'calc(100% - 24px)',
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            boxShadow: '0 20px 48px rgba(15,23,42,0.22)'
          }}
        >
          <Stack spacing={1.25} sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="subtitle2" fontWeight={900} sx={{ flex: 1 }}>
                Box editor
              </Typography>
              <Tooltip title="Add box">
                <IconButton size="small" color="primary" onClick={addNode}>
                  <AddBoxIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove box">
                <span>
                  <IconButton size="small" color="error" onClick={removeSelectedNode} disabled={!selectedNode}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Close editor">
                <IconButton size="small" onClick={() => setEditorOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 96px', gap: 1 }}>
              <TextField
                size="small"
                label="Label"
                value={selectedNode?.label ?? ''}
                disabled={!selectedNode}
                onChange={(event) => updateSelectedNode({ label: event.target.value })}
              />
              <TextField
                size="small"
                label="Color"
                type="color"
                value={selectedNode?.color ?? '#ffffff'}
                disabled={!selectedNode}
                onChange={(event) => updateSelectedNode({ color: event.target.value })}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.25 }}>
              <Stack spacing={1}>
                <Typography variant="caption" fontWeight={900} color="text.secondary">
                  Links
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 32px', gap: 0.5, alignItems: 'center' }}>
                  <TextField
                    select
                    size="small"
                    label="To"
                    value={linkTargetId}
                    disabled={!selectedNode}
                    onChange={(event) => setLinkTargetId(event.target.value)}
                  >
                    <MenuItem value="">Pick target</MenuItem>
                    {canvasNodes.filter((node) => node.id !== selectedId).map((node) => (
                      <MenuItem key={node.id} value={node.id}>{node.label}</MenuItem>
                    ))}
                  </TextField>
                  <Tooltip title={`Add link from ${selectedNode?.label ?? 'box'}`}>
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        disabled={!selectedNode || !linkTargetId}
                        onClick={addLink}
                        sx={{ width: 32, height: 32, border: 1, borderColor: 'divider', borderRadius: 1 }}
                      >
                        <AddLinkIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                {selectedLinks.length ? selectedLinks.map(({ connection, index }) => {
                  const sourceNode = canvasNodes.find((node) => node.id === connection.from)
                  const targetNode = canvasNodes.find((node) => node.id === connection.to)
                  const active = selectedLinkIndex === index

                  return (
                    <Box
                      key={`${connection.from}-${connection.to}-${index}`}
                      sx={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '1fr 32px',
                        gap: 0.5,
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        component="button"
                        onClick={() => setSelectedLinkIndex(index)}
                        sx={{
                          px: 1,
                          py: 0.75,
                          minWidth: 0,
                          border: 1,
                          borderColor: active ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          bgcolor: active ? 'primary.main' : 'background.paper',
                          color: active ? 'primary.contrastText' : 'text.primary',
                          cursor: 'pointer',
                          font: 'inherit',
                          textAlign: 'left'
                        }}
                      >
                        {(sourceNode?.label ?? connection.from) + ' -> ' + (targetNode?.label ?? connection.to)}
                      </Box>
                      <Tooltip title="Remove link">
                        <IconButton size="small" color="error" onClick={() => removeLink(index)} sx={{ width: 32, height: 32 }}>
                          <LinkOffIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                }) : (
                  <Typography variant="body2" color="text.secondary">
                    No linked boxes.
                  </Typography>
                )}
              </Stack>

              <Stack spacing={1}>
                <Typography variant="caption" fontWeight={900} color="text.secondary">
                  Link details
                </Typography>
                {selectedLinkIndex !== null && canvasConnections[selectedLinkIndex] ? (
                  <>
                    <TextField
                      select
                      size="small"
                      label="From"
                      value={canvasConnections[selectedLinkIndex].from}
                      onChange={(event) => updateLink(selectedLinkIndex, { from: event.target.value })}
                    >
                      {canvasNodes.filter((node) => node.id !== canvasConnections[selectedLinkIndex].to).map((node) => (
                        <MenuItem key={node.id} value={node.id}>{node.label}</MenuItem>
                      ))}
                    </TextField>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      <TextField
                        select
                        size="small"
                        label="To"
                        value={canvasConnections[selectedLinkIndex].to}
                        onChange={(event) => updateLink(selectedLinkIndex, { to: event.target.value })}
                      >
                        {canvasNodes.filter((node) => node.id !== canvasConnections[selectedLinkIndex].from).map((node) => (
                          <MenuItem key={node.id} value={node.id}>{node.label}</MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size="small"
                        label="Shape"
                        value={canvasConnections[selectedLinkIndex].type ?? connectionStyle}
                        onChange={(event) => updateLink(selectedLinkIndex, { type: event.target.value as NodeCanvasConnectionType })}
                      >
                        {linkTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Box>
                    <TextField
                      size="small"
                      label="Label"
                      value={canvasConnections[selectedLinkIndex].label ?? ''}
                      onChange={(event) => updateLink(selectedLinkIndex, { label: event.target.value })}
                    />
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Pick a link.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
