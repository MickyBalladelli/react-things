import { useMemo, useState } from 'react'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { PointerEvent, ReactNode } from 'react'

export type FlowBuilderPort = {
  id: string
  label: string
  type: string
}

export type FlowBuilderNode = {
  id: string
  label: string
  x: number
  y: number
  inputs?: FlowBuilderPort[]
  outputs?: FlowBuilderPort[]
  tone?: string
  data?: unknown
}

export type FlowBuilderConnection = {
  id: string
  fromNodeId: string
  fromPortId: string
  toNodeId: string
  toPortId: string
  type?: string
  label?: string
}

export type FlowBuilderValidation = {
  id: string
  message: string
  nodeId?: string
  connectionId?: string
  tone?: 'error' | 'warning'
}

export type FlowBuilderPosition = {
  x: number
  y: number
}

export type FlowBuilderProps = Omit<BoxProps, 'onChange'> & {
  nodes: FlowBuilderNode[]
  connections?: FlowBuilderConnection[]
  nodeWidth?: number
  nodeMinHeight?: number
  portTypes?: string[]
  selectedNodeId?: string | null
  selectedConnectionId?: string | null
  showGrid?: boolean
  snapToGrid?: boolean
  gridSize?: number
  validate?: (nodes: FlowBuilderNode[], connections: FlowBuilderConnection[]) => FlowBuilderValidation[]
  renderNode?: (node: FlowBuilderNode, selected: boolean, issues: FlowBuilderValidation[]) => ReactNode
  onNodesChange?: (nodes: FlowBuilderNode[]) => void
  onConnectionsChange?: (connections: FlowBuilderConnection[]) => void
  onNodeSelect?: (node: FlowBuilderNode | null) => void
  onConnectionSelect?: (connection: FlowBuilderConnection | null) => void
}

const defaultPortTypes = ['event', 'data', 'success', 'error']
const typeColors: Record<string, string> = {
  event: '#2563eb',
  data: '#7c3aed',
  success: '#059669',
  error: '#dc2626'
}

function snap(value: number, gridSize: number) {
  return Math.round(value / gridSize) * gridSize
}

function getPortPoint(node: FlowBuilderNode, portId: string, side: 'input' | 'output', nodeWidth: number) {
  const ports = side === 'input' ? node.inputs ?? [] : node.outputs ?? []
  const index = Math.max(ports.findIndex((port) => port.id === portId), 0)
  const gap = 30

  return {
    x: node.x + (side === 'input' ? 0 : nodeWidth),
    y: node.y + 58 + index * gap
  }
}

function getPath(from: FlowBuilderPosition, to: FlowBuilderPosition) {
  const middle = Math.max(Math.abs(to.x - from.x) * 0.5, 60)

  return `M ${from.x} ${from.y} C ${from.x + middle} ${from.y}, ${to.x - middle} ${to.y}, ${to.x} ${to.y}`
}

function defaultValidate(nodes: FlowBuilderNode[], connections: FlowBuilderConnection[]) {
  const issues: FlowBuilderValidation[] = []

  nodes.forEach((node) => {
    const inputs = node.inputs ?? []

    inputs.forEach((port) => {
      const hasInput = connections.some((connection) => connection.toNodeId === node.id && connection.toPortId === port.id)

      if (!hasInput) {
        issues.push({
          id: `${node.id}:${port.id}:missing`,
          nodeId: node.id,
          message: `${node.label} needs ${port.label}`,
          tone: 'warning'
        })
      }
    })
  })

  connections.forEach((connection) => {
    const fromNode = nodes.find((node) => node.id === connection.fromNodeId)
    const toNode = nodes.find((node) => node.id === connection.toNodeId)
    const fromPort = fromNode?.outputs?.find((port) => port.id === connection.fromPortId)
    const toPort = toNode?.inputs?.find((port) => port.id === connection.toPortId)

    if (!fromNode || !toNode || !fromPort || !toPort) {
      issues.push({
        id: `${connection.id}:missing-port`,
        connectionId: connection.id,
        message: 'Connection points at a missing node or port',
        tone: 'error'
      })
      return
    }

    if (fromPort.type !== toPort.type) {
      issues.push({
        id: `${connection.id}:type`,
        connectionId: connection.id,
        message: `${fromPort.type} cannot connect to ${toPort.type}`,
        tone: 'error'
      })
    }
  })

  return issues
}

function autoLayout(nodes: FlowBuilderNode[], connections: FlowBuilderConnection[], gridSize: number) {
  const incomingCount = Object.fromEntries(nodes.map((node) => [node.id, connections.filter((connection) => connection.toNodeId === node.id).length]))
  const levels = new Map<string, number>()

  nodes.forEach((node) => {
    if (!incomingCount[node.id]) {
      levels.set(node.id, 0)
    }
  })

  for (let pass = 0; pass < nodes.length; pass += 1) {
    connections.forEach((connection) => {
      const fromLevel = levels.get(connection.fromNodeId)

      if (fromLevel === undefined) {
        return
      }

      levels.set(connection.toNodeId, Math.max(levels.get(connection.toNodeId) ?? 0, fromLevel + 1))
    })
  }

  const byLevel = nodes.reduce<Record<number, FlowBuilderNode[]>>((groups, node) => {
    const level = levels.get(node.id) ?? 0

    return {
      ...groups,
      [level]: [...(groups[level] ?? []), node]
    }
  }, {})

  return nodes.map((node) => {
    const level = levels.get(node.id) ?? 0
    const index = byLevel[level].findIndex((item) => item.id === node.id)

    return {
      ...node,
      x: snap(48 + level * 260, gridSize),
      y: snap(56 + index * 150, gridSize)
    }
  })
}

export function FlowBuilder({
  nodes,
  connections = [],
  nodeWidth = 190,
  nodeMinHeight = 106,
  portTypes = defaultPortTypes,
  selectedNodeId,
  selectedConnectionId,
  showGrid = true,
  snapToGrid = true,
  gridSize = 24,
  validate = defaultValidate,
  renderNode,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
  onConnectionSelect,
  sx,
  ...props
}: FlowBuilderProps) {
  const [internalNodes, setInternalNodes] = useState(nodes)
  const [internalConnections, setInternalConnections] = useState(connections)
  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState<string | null>(selectedNodeId ?? null)
  const [internalSelectedConnectionId, setInternalSelectedConnectionId] = useState<string | null>(selectedConnectionId ?? null)
  const [draftType, setDraftType] = useState(portTypes[0] ?? 'event')
  const canvasNodes = onNodesChange ? nodes : internalNodes
  const canvasConnections = onConnectionsChange ? connections : internalConnections
  const activeNodeId = selectedNodeId ?? internalSelectedNodeId
  const activeConnectionId = selectedConnectionId ?? internalSelectedConnectionId
  const issues = useMemo(() => validate(canvasNodes, canvasConnections), [canvasConnections, canvasNodes, validate])
  const nodeIssueMap = useMemo(() => {
    return canvasNodes.reduce<Record<string, FlowBuilderValidation[]>>((map, node) => ({
      ...map,
      [node.id]: issues.filter((issue) => issue.nodeId === node.id)
    }), {})
  }, [canvasNodes, issues])

  function commitNodes(nextNodes: FlowBuilderNode[]) {
    setInternalNodes(nextNodes)
    onNodesChange?.(nextNodes)
  }

  function commitConnections(nextConnections: FlowBuilderConnection[]) {
    setInternalConnections(nextConnections)
    onConnectionsChange?.(nextConnections)
  }

  function selectNode(node: FlowBuilderNode | null) {
    setInternalSelectedNodeId(node?.id ?? null)
    onNodeSelect?.(node)
  }

  function selectConnection(connection: FlowBuilderConnection | null) {
    setInternalSelectedConnectionId(connection?.id ?? null)
    onConnectionSelect?.(connection)
  }

  function moveNode(event: PointerEvent<HTMLElement>, node: FlowBuilderNode) {
    event.stopPropagation()
    selectNode(node)
    const startX = event.clientX
    const startY = event.clientY
    const start = { x: node.x, y: node.y }
    event.currentTarget.setPointerCapture(event.pointerId)

    function move(moveEvent: globalThis.PointerEvent) {
      const nextPosition = {
        x: start.x + moveEvent.clientX - startX,
        y: start.y + moveEvent.clientY - startY
      }
      const finalPosition = snapToGrid
        ? { x: snap(nextPosition.x, gridSize), y: snap(nextPosition.y, gridSize) }
        : nextPosition

      commitNodes(canvasNodes.map((item) => item.id === node.id ? { ...item, ...finalPosition } : item))
    }

    function up() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function connect(fromNode: FlowBuilderNode, fromPort: FlowBuilderPort, toNode: FlowBuilderNode, toPort: FlowBuilderPort) {
    const id = `${fromNode.id}:${fromPort.id}->${toNode.id}:${toPort.id}`
    const nextConnection = {
      id,
      fromNodeId: fromNode.id,
      fromPortId: fromPort.id,
      toNodeId: toNode.id,
      toPortId: toPort.id,
      type: fromPort.type,
      label: fromPort.type
    }

    commitConnections([
      ...canvasConnections.filter((connection) => connection.id !== id),
      nextConnection
    ])
    selectConnection(nextConnection)
  }

  const selectedFromNode = activeNodeId ? canvasNodes.find((node) => node.id === activeNodeId) : null
  const selectedFromPorts = selectedFromNode?.outputs?.filter((port) => port.type === draftType) ?? []
  const targetPorts = canvasNodes
    .filter((node) => node.id !== activeNodeId)
    .flatMap((node) => (node.inputs ?? [])
      .filter((port) => port.type === draftType)
      .map((port) => ({ node, port })))

  return (
    <Box
      {...props}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          selectNode(null)
          selectConnection(null)
        }
      }}
      sx={[
        {
          position: 'relative',
          minHeight: 460,
          overflow: 'hidden',
          bgcolor: '#f8fafc',
          backgroundImage: showGrid
            ? `linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)`
            : undefined,
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : undefined
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ position: 'absolute', zIndex: 5, top: 12, left: 12 }}>
        <Button size="small" variant="contained" startIcon={<AutoFixHighIcon />} onClick={() => commitNodes(autoLayout(canvasNodes, canvasConnections, gridSize))}>
          Auto layout
        </Button>
        <TextField
          select
          size="small"
          label="Type"
          value={draftType}
          onChange={(event) => setDraftType(event.target.value)}
          sx={{ width: 130, bgcolor: 'background.paper' }}
        >
          {portTypes.map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
        {issues.length ? (
          <Chip color="warning" size="small" icon={<ErrorOutlineIcon />} label={`${issues.length} issues`} />
        ) : (
          <Chip color="success" size="small" label="Valid flow" />
        )}
      </Stack>

      <Box component="svg" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {canvasConnections.map((connection) => {
          const fromNode = canvasNodes.find((node) => node.id === connection.fromNodeId)
          const toNode = canvasNodes.find((node) => node.id === connection.toNodeId)

          if (!fromNode || !toNode) {
            return null
          }

          const from = getPortPoint(fromNode, connection.fromPortId, 'output', nodeWidth)
          const to = getPortPoint(toNode, connection.toPortId, 'input', nodeWidth)
          const color = typeColors[connection.type ?? ''] ?? '#2563eb'
          const invalid = issues.some((issue) => issue.connectionId === connection.id)

          return (
            <Box
              key={connection.id}
              component="path"
              d={getPath(from, to)}
              onPointerDown={(event) => {
                event.stopPropagation()
                selectConnection(connection)
              }}
              sx={{
                pointerEvents: 'stroke',
                fill: 'none',
                stroke: invalid ? '#dc2626' : color,
                strokeWidth: activeConnectionId === connection.id ? 5 : 3,
                strokeDasharray: invalid ? '8 7' : undefined,
                strokeLinecap: 'round',
                cursor: 'pointer'
              }}
            />
          )
        })}
      </Box>

      {canvasNodes.map((node) => {
        const selected = activeNodeId === node.id
        const nodeIssues = nodeIssueMap[node.id] ?? []
        const tone = node.tone ?? '#ffffff'

        return (
          <Paper
            key={node.id}
            variant="outlined"
            onPointerDown={(event) => moveNode(event, node)}
            sx={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: nodeWidth,
              minHeight: nodeMinHeight,
              p: 1.25,
              borderRadius: 1,
              borderColor: nodeIssues.some((issue) => issue.tone === 'error') ? 'error.main' : selected ? 'primary.main' : 'divider',
              boxShadow: selected ? `0 0 0 3px ${alpha('#2563eb', 0.16)}` : '0 10px 28px rgba(15,23,42,0.08)',
              bgcolor: tone,
              cursor: 'grab',
              zIndex: selected ? 4 : 2
            }}
          >
            {renderNode ? (
              renderNode(node, selected, nodeIssues)
            ) : (
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography fontWeight={950}>{node.label}</Typography>
                  {nodeIssues.length ? <Chip size="small" color="warning" label={nodeIssues.length} /> : null}
                </Stack>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Stack spacing={0.75}>
                    {(node.inputs ?? []).map((port) => (
                      <Chip key={port.id} size="small" label={port.label} sx={{ justifyContent: 'flex-start', bgcolor: alpha(typeColors[port.type] ?? '#64748b', 0.12) }} />
                    ))}
                  </Stack>
                  <Stack spacing={0.75} alignItems="flex-end">
                    {(node.outputs ?? []).map((port) => (
                      <Chip key={port.id} size="small" label={port.label} sx={{ justifyContent: 'flex-end', bgcolor: alpha(typeColors[port.type] ?? '#64748b', 0.12) }} />
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            )}

            {(node.inputs ?? []).map((port, index) => (
              <Box
                key={port.id}
                title={`${port.label}: ${port.type}`}
                sx={{
                  position: 'absolute',
                  left: -7,
                  top: 52 + index * 30,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: typeColors[port.type] ?? '#64748b',
                  border: '2px solid #fff'
                }}
              />
            ))}
            {(node.outputs ?? []).map((port, index) => (
              <Box
                key={port.id}
                title={`${port.label}: ${port.type}`}
                sx={{
                  position: 'absolute',
                  right: -7,
                  top: 52 + index * 30,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: typeColors[port.type] ?? '#64748b',
                  border: '2px solid #fff'
                }}
              />
            ))}
          </Paper>
        )
      })}

      {selectedFromNode && selectedFromPorts.length && targetPorts.length ? (
        <Paper variant="outlined" sx={{ position: 'absolute', right: 12, bottom: 12, zIndex: 5, p: 1.5, borderRadius: 1, width: 270 }}>
          <Typography variant="subtitle2" fontWeight={950}>Connect {draftType}</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {selectedFromPorts.slice(0, 2).map((fromPort) => (
              <TextField
                key={fromPort.id}
                select
                size="small"
                label={fromPort.label}
                value=""
                onChange={(event) => {
                  const [nodeId, portId] = event.target.value.split(':')
                  const target = targetPorts.find((item) => item.node.id === nodeId && item.port.id === portId)

                  if (target) {
                    connect(selectedFromNode, fromPort, target.node, target.port)
                  }
                }}
              >
                {targetPorts.map(({ node, port }) => (
                  <MenuItem key={`${node.id}:${port.id}`} value={`${node.id}:${port.id}`}>{node.label} · {port.label}</MenuItem>
                ))}
              </TextField>
            ))}
          </Stack>
        </Paper>
      ) : null}

      {issues.length ? (
        <Paper variant="outlined" sx={{ position: 'absolute', left: 12, bottom: 12, zIndex: 5, p: 1.25, borderRadius: 1, maxWidth: 330 }}>
          <Stack spacing={0.75}>
            {issues.slice(0, 3).map((issue) => (
              <Typography key={issue.id} variant="caption" color={issue.tone === 'error' ? 'error.main' : 'text.secondary'}>
                {issue.message}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ) : null}
    </Box>
  )
}
