import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import {
  BeforeAfterSlider,
  CodeViewer,
  ColorPicker,
  CommandPalette,
  DockBar,
  DraggableBox,
  FileDropZone,
  FloatingToolbar,
  GlassBox,
  InfiniteCanvas,
  InspectorPanel,
  MagneticCard,
  NodeCanvas,
  ResizableFrame,
  SmartTooltip,
  SplitPane,
  SpotlightPanel,
  TimelineScrubber
} from '@mickyballadelli/react-things'
import type { InspectorPanelField } from '@mickyballadelli/react-things'
import { DraggableGlassBoxPreview } from './DraggableGlassBoxPreview'

type PropReference = {
  name: string
  type: string
  defaultValue: string
  possibleValues: string
  description: string
}

type CodeSample = {
  label: string
  language: string
  initialCode: string
}

type ComponentDoc = {
  name: string
  summary: string
  description: string
  props: PropReference[]
  samples: CodeSample[]
}

type GlassBoxConfig = {
  transparency: number
  fill: number
  liquidColor: string
  glassColor: string
  children: string
}

function createBasicDoc(name: string, summary: string, description: string): ComponentDoc {
  return {
    name,
    summary,
    description,
    props: [
      {
        name: 'props',
        type: 'component-specific',
        defaultValue: '-',
        possibleValues: 'See TypeScript exports for complete prop type.',
        description: 'This component is available from @mickyballadelli/react-things and has a live preview here.'
      }
    ],
    samples: getBasicSamples(name)
  }
}

function getBasicSamples(name: string): CodeSample[] {
  const samples: Record<string, CodeSample[]> = {
    MagneticCard: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { MagneticCard } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <MagneticCard
      strength={22}
      tilt={14}
      lift={14}
      glare
      sx={{ padding: 24, border: '1px solid #ddd', borderRadius: 8 }}
    >
      Hover me
    </MagneticCard>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { MagneticCard, type MagneticCardProps } from '@mickyballadelli/react-things'

const props: MagneticCardProps = {
  strength: 22,
  tilt: 14,
  lift: 14,
  glare: true,
  perspective: 900,
  sx: { padding: 24, border: '1px solid #ddd', borderRadius: 8 }
}

export function Example() {
  return <MagneticCard {...props}>Hover me</MagneticCard>
}`
      }
    ],
    SpotlightPanel: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { SpotlightPanel } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <SpotlightPanel radius={180} dim={0.68} sx={{ padding: 32, background: '#111827', color: '#fff' }}>
      Move the mouse to reveal content.
    </SpotlightPanel>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { SpotlightPanel, type SpotlightPanelProps } from '@mickyballadelli/react-things'

const props: SpotlightPanelProps = {
  radius: 180,
  dim: 0.68,
  sx: { padding: 32, background: '#111827', color: '#fff' }
}

export function Example() {
  return <SpotlightPanel {...props}>Move the mouse.</SpotlightPanel>
}`
      }
    ],
    NodeCanvas: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { NodeCanvas } from '@mickyballadelli/react-things'

const initialNodes = [
  { id: 'a', label: 'Start', x: 48, y: 72, color: '#dbeafe' },
  { id: 'b', label: 'Build', x: 264, y: 168, color: '#dcfce7' }
]

export function Example() {
  const [nodes, setNodes] = useState(initialNodes)
  const [connections, setConnections] = useState([{ from: 'a', to: 'b', type: 'curved', label: 'depends on' }])
  const [selected, setSelected] = useState('a')

  return (
    <NodeCanvas
      nodes={nodes}
      connections={connections}
      selectedNodeId={selected}
      onNodeSelect={(node) => setSelected(node.id)}
      onNodesChange={setNodes}
      onConnectionsChange={setConnections}
      editableTools
      linkTypes={['line', 'curved', 'step', 'ellipse']}
      showGrid
      snapToGrid
      connectionStyle="curved"
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { NodeCanvas, type NodeCanvasConnection, type NodeCanvasNode } from '@mickyballadelli/react-things'

const initialNodes: NodeCanvasNode[] = [
  { id: 'a', label: 'Start', x: 48, y: 72, color: '#dbeafe' },
  { id: 'b', label: 'Build', x: 264, y: 168, color: '#dcfce7' }
]

export function Example() {
  const [nodes, setNodes] = useState<NodeCanvasNode[]>(initialNodes)
  const [connections, setConnections] = useState<NodeCanvasConnection[]>([
    { from: 'a', to: 'b', type: 'curved', label: 'depends on' }
  ])
  const [selected, setSelected] = useState<string | null>('a')

  return (
    <NodeCanvas
      nodes={nodes}
      connections={connections}
      selectedNodeId={selected}
      onNodeSelect={(node) => setSelected(node.id)}
      onNodesChange={setNodes}
      onConnectionsChange={setConnections}
      onNodeMove={(nodeId, position) => console.log(nodeId, position)}
      editableTools
      linkTypes={['line', 'curved', 'step', 'ellipse']}
      showGrid
      snapToGrid
      connectionStyle="curved"
    />
  )
}`
      }
    ],
    BeforeAfterSlider: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { BeforeAfterSlider } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <BeforeAfterSlider
      initialPosition={35}
      before={<div>Before</div>}
      after={<div>After</div>}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { BeforeAfterSlider, type BeforeAfterSliderProps } from '@mickyballadelli/react-things'

const props: BeforeAfterSliderProps = {
  initialPosition: 35,
  before: <div>Before</div>,
  after: <div>After</div>
}

export function Example() {
  return <BeforeAfterSlider {...props} />
}`
      }
    ],
    ResizableFrame: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { ResizableFrame } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <ResizableFrame initialWidth={360} initialHeight={220} minWidth={180} minHeight={120}>
      Resize from the drag handle.
    </ResizableFrame>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { ResizableFrame, type ResizableFrameProps } from '@mickyballadelli/react-things'

const props: ResizableFrameProps = {
  initialWidth: 360,
  initialHeight: 220,
  minWidth: 180,
  minHeight: 120
}

export function Example() {
  return <ResizableFrame {...props}>Resize me</ResizableFrame>
}`
      }
    ],
    InspectorPanel: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { InspectorPanel } from '@mickyballadelli/react-things'

export function Example() {
  const [fields, setFields] = useState([
    { id: 'title', label: 'Title', type: 'text', value: 'Launch card', defaultValue: 'Launch card', group: 'Content' },
    { id: 'size', label: 'Size', type: 'number', value: 48, defaultValue: 48, min: 12, max: 96, unit: 'px', group: 'Layout' },
    { id: 'tone', label: 'Tone', type: 'select', value: 'Calm', defaultValue: 'Calm', group: 'Style', options: [{ label: 'Calm', value: 'Calm' }, { label: 'Bold', value: 'Bold' }] },
    { id: 'enabled', label: 'Enabled', type: 'boolean', value: true, defaultValue: true, group: 'State' }
  ])

  return (
    <InspectorPanel
      title="Card inspector"
      description="Edit grouped props and reset changed values."
      fields={fields}
      onChange={(id, value) => setFields(fields.map((field) => field.id === id ? { ...field, value } : field))}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { InspectorPanel, type InspectorPanelField } from '@mickyballadelli/react-things'

export function Example() {
  const [fields, setFields] = useState<InspectorPanelField[]>([
    { id: 'title', label: 'Title', type: 'text', value: 'Launch card', defaultValue: 'Launch card', group: 'Content' },
    { id: 'size', label: 'Size', type: 'number', value: 48, defaultValue: 48, min: 12, max: 96, unit: 'px', group: 'Layout' },
    { id: 'tone', label: 'Tone', type: 'select', value: 'Calm', defaultValue: 'Calm', group: 'Style', options: [{ label: 'Calm', value: 'Calm' }, { label: 'Bold', value: 'Bold' }] },
    { id: 'enabled', label: 'Enabled', type: 'boolean', value: true, defaultValue: true, group: 'State' }
  ])

  return (
    <InspectorPanel
      title="Card inspector"
      description="Edit grouped props and reset changed values."
      fields={fields}
      onChange={(id, value) => setFields(fields.map((field) => field.id === id ? { ...field, value } : field))}
    />
  )
}`
      }
    ],
    ColorPicker: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { ColorPicker } from '@mickyballadelli/react-things'

export function Example() {
  const [color, setColor] = useState('#2563eb')
  const [alpha, setAlpha] = useState(0.8)

  return (
    <>
      <ColorPicker value={color} alpha={alpha} onChange={setColor} onAlphaChange={setAlpha} />
      <TextField label="Selected color" value={\`\${color}, alpha \${alpha.toFixed(2)}\`} />
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { ColorPicker } from '@mickyballadelli/react-things'

export function Example() {
  const [color, setColor] = useState('#2563eb')
  const [alpha, setAlpha] = useState(0.8)

  return (
    <>
      <ColorPicker value={color} alpha={alpha} onChange={setColor} onAlphaChange={setAlpha} showValue />
      <TextField label="Selected color" value={\`\${color}, alpha \${alpha.toFixed(2)}\`} />
    </>
  )
}`
      }
    ],
    TimelineScrubber: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { TimelineScrubber } from '@mickyballadelli/react-things'

const markers = [
  { id: 'intro', time: 12, label: 'Intro', color: '#2563eb' },
  { id: 'demo', time: 48, label: 'Demo', color: '#059669' },
  { id: 'ship', time: 92, label: 'Ship', color: '#db2777' }
]

export function Example() {
  const [time, setTime] = useState(24)

  return (
    <TimelineScrubber
      duration={120}
      value={time}
      markers={markers}
      onChange={setTime}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { TimelineScrubber, type TimelineScrubberMarker } from '@mickyballadelli/react-things'

const markers: TimelineScrubberMarker[] = [
  { id: 'intro', time: 12, label: 'Intro', color: '#2563eb' },
  { id: 'demo', time: 48, label: 'Demo', color: '#059669' },
  { id: 'ship', time: 92, label: 'Ship', color: '#db2777' }
]

export function Example() {
  const [time, setTime] = useState(24)

  return (
    <TimelineScrubber
      duration={120}
      value={time}
      markers={markers}
      step={0.5}
      onChange={(nextTime) => setTime(nextTime)}
    />
  )
}`
      }
    ],
    InfiniteCanvas: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { InfiniteCanvas } from '@mickyballadelli/react-things'

const items = [
  { id: 'a', label: 'Plan', x: 40, y: 80, color: '#dbeafe' },
  { id: 'b', label: 'Build', x: 300, y: 180, color: '#dcfce7' },
  { id: 'c', label: 'Ship', x: 620, y: 70, color: '#fee2e2' }
]

export function Example() {
  const [selected, setSelected] = useState(null)

  return (
    <InfiniteCanvas
      items={items}
      selectedItemId={selected}
      onItemSelect={(item) => setSelected(item?.id ?? null)}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { InfiniteCanvas, type InfiniteCanvasItem } from '@mickyballadelli/react-things'

const items: InfiniteCanvasItem[] = [
  { id: 'a', label: 'Plan', x: 40, y: 80, color: '#dbeafe' },
  { id: 'b', label: 'Build', x: 300, y: 180, color: '#dcfce7' },
  { id: 'c', label: 'Ship', x: 620, y: 70, color: '#fee2e2' }
]

export function Example() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <InfiniteCanvas
      items={items}
      selectedItemId={selected}
      onItemSelect={(item) => setSelected(item?.id ?? null)}
      onItemMove={(id, position) => console.log(id, position)}
    />
  )
}`
      }
    ],
    SmartTooltip: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import Button from '@mui/material/Button'
import { SmartTooltip } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <SmartTooltip
      title="Smart tooltip"
      content="Pin it, copy text, or run an action."
      copyText="Copied from SmartTooltip"
      actions={[{ id: 'open', label: 'Open', onClick: () => console.log('open') }]}
    >
      <Button variant="contained">Hover me</Button>
    </SmartTooltip>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import Button from '@mui/material/Button'
import { SmartTooltip, type SmartTooltipAction } from '@mickyballadelli/react-things'

const actions: SmartTooltipAction[] = [
  { id: 'open', label: 'Open', onClick: () => console.log('open') }
]

export function Example() {
  return (
    <SmartTooltip
      title="Smart tooltip"
      content="Pin it, copy text, or run an action."
      copyText="Copied from SmartTooltip"
      actions={actions}
      placement="bottom"
    >
      <Button variant="contained">Hover me</Button>
    </SmartTooltip>
  )
}`
      }
    ],
    FileDropZone: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { FileDropZone } from '@mickyballadelli/react-things'

export function Example() {
  const [names, setNames] = useState([])

  return (
    <>
      <FileDropZone onFiles={(files) => setNames(files.map((file) => file.name))} />
      <pre>{names.join('\\n')}</pre>
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { FileDropZone } from '@mickyballadelli/react-things'

export function Example() {
  const [names, setNames] = useState<string[]>([])

  return (
    <>
      <FileDropZone onFiles={(files) => setNames(files.map((file) => file.name))} />
      <pre>{names.join('\\n')}</pre>
    </>
  )
}`
      }
    ]
  }

  return samples[name] ?? [
    {
      label: 'JavaScript',
      language: 'javascript',
      initialCode: `import { ${name} } from '@mickyballadelli/react-things'

export function Example() {
  return <${name} />
}`
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      initialCode: `import { ${name} } from '@mickyballadelli/react-things'

export function Example() {
  return <${name} />
}`
    }
  ]
}

const componentDocs: ComponentDoc[] = [
  {
    name: 'GlassBox',
    summary: 'Liquid glass container with adjustable transparency, fill level, and color.',
    description: 'GlassBox is a decorative content wrapper that makes ordinary text or UI feel like it sits inside a translucent liquid-glass surface.',
    props: [
      {
        name: 'transparency',
        type: 'number',
        defaultValue: '0.36',
        possibleValues: '0 to 1. Values are clamped.',
        description: 'Controls how much of the background shows through. Use 0 for dense liquid, 1 for very clear glass.'
      },
      {
        name: 'fill',
        type: 'number',
        defaultValue: '0.72',
        possibleValues: '0 to 1. Values are clamped.',
        description: 'Controls the liquid level. Use 0 for empty, 1 for full.'
      },
      {
        name: 'liquidColor',
        type: 'string',
        defaultValue: '#39b8ff',
        possibleValues: 'Any CSS color: hex, rgb, hsl, named color, CSS variable.',
        description: 'Sets the main liquid color. Accepts CSS colors.'
      },
      {
        name: 'glassColor',
        type: 'string',
        defaultValue: '#ffffff',
        possibleValues: 'Any CSS color: hex, rgb, hsl, named color, CSS variable.',
        description: 'Sets shine, rim, and highlight color. Accepts CSS colors.'
      },
      {
        name: 'motion',
        type: 'number',
        defaultValue: '0',
        possibleValues: 'Any finite number. Change value to move liquid lens.',
        description: 'Moves the liquid lens refraction when the value changes. Keep stable for still water.'
      },
      {
        name: 'refractionActive',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Turns the liquid lens effect on or off. Use false when standing still.'
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any React renderable value: text, elements, fragments, null.',
        description: 'Content shown inside the glass box.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value: object, array, or theme callback.',
        description: 'Material UI style overrides. GlassBox also accepts normal MUI Box props.'
      }
    ],
    samples: []
  },
  {
    name: 'DraggableBox',
    summary: 'Container that lets one child be dragged inside its bounds.',
    description: 'DraggableBox is a bounded stage for one movable child, useful for draggable cards, labels, stickers, or preview objects.',
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Exactly one draggable child is best. Any React renderable works.',
        description: 'Element that can be dragged.'
      },
      {
        name: 'initialPosition',
        type: '{ x: number, y: number }',
        defaultValue: '{ x: 50, y: 50 }',
        possibleValues: 'x and y are percentages from 0 to 100. Position is clamped to keep child inside.',
        description: 'Initial center position as percentage x and y inside the container.'
      },
      {
        name: 'dragSx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value for draggable wrapper: width, maxWidth, height, etc.',
        description: 'Material UI styles for the draggable child wrapper.'
      },
      {
        name: 'onPositionChange',
        type: '(position, metrics) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving position percentages and optional pixel metrics.',
        description: 'Called with percentage x and y when the child moves.'
      },
      {
        name: 'onDraggingChange',
        type: '(dragging: boolean) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving true on press and false on release/cancel.',
        description: 'Called when dragging starts or stops.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value for container. Set size/background here.',
        description: 'Material UI styles for the drag container.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DraggableBox } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <DraggableBox
      initialPosition={{ x: 50, y: 50 }}
      sx={{ minHeight: 320, background: '#dbeafe' }}
      dragSx={{ width: 220 }}
    >
      <div>Drag me</div>
    </DraggableBox>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DraggableBox, type DraggableBoxProps } from '@mickyballadelli/react-things'

const props: DraggableBoxProps = {
  initialPosition: { x: 50, y: 50 },
  sx: { minHeight: 320, background: '#dbeafe' },
  dragSx: { width: 220 }
}

export function Example() {
  return (
    <DraggableBox {...props}>
      <div>Drag me</div>
    </DraggableBox>
  )
}`
      }
    ]
  },
  {
    name: 'CodeViewer',
    summary: 'Editable code viewer with line numbers and lightweight syntax colors.',
    description: 'CodeViewer is a small code editor display for demos, snippets, and examples where users can read and tweak source code.',
    props: [
      {
        name: 'label',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any string.',
        description: 'Title shown in the code viewer header.'
      },
      {
        name: 'language',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Case-insensitive: c, c++, typescript, javascript, java, powershell, rust, go, shell, python, c#, php, ruby, swift, kotlin, sql, html, css, dart. Aliases: cpp, ts, tsx, js, jsx, ps1, rs, golang, sh, bash, zsh, py, cs, rb, kt.',
        description: 'Language label shown in the code viewer header.'
      },
      {
        name: 'value',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any string, including multiline code.',
        description: 'Current code text.'
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving the next code string.',
        description: 'Called when code text changes.'
      },
      {
        name: 'minHeight',
        type: 'number',
        defaultValue: '360',
        possibleValues: 'Any positive number of pixels.',
        description: 'Minimum editor height in pixels.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { CodeViewer } from '@mickyballadelli/react-things'

export function Example() {
  const [code, setCode] = useState('const hello = "world"')

  return (
    <CodeViewer
      label="JavaScript"
      language="javascript"
      value={code}
      onChange={setCode}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { CodeViewer, type CodeViewerProps } from '@mickyballadelli/react-things'

export function Example() {
  const [code, setCode] = useState('const hello: string = "world"')
  const props: CodeViewerProps = {
    label: 'TypeScript',
    language: 'typescript',
    value: code,
    onChange: setCode
  }

  return <CodeViewer {...props} />
}`
      }
    ]
  },
  {
    name: 'DockBar',
    summary: 'macOS-style icon dock with magnify hover.',
    description: 'DockBar is an icon launcher strip for app shortcuts, navigation actions, or tool groups with animated hover focus.',
    props: [
      {
        name: 'items',
        type: 'DockBarItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, icon, onClick }. id and label are strings, icon is ReactNode, onClick is optional.',
        description: 'Icons shown in the dock.'
      },
      {
        name: 'iconSize',
        type: 'number',
        defaultValue: '52',
        possibleValues: 'Any positive pixel size. Useful range: 36 to 80.',
        description: 'Base icon button size before magnification.'
      },
      {
        name: 'magnification',
        type: 'number',
        defaultValue: '1.7',
        possibleValues: 'Any number above 1. Useful range: 1.2 to 2.2.',
        description: 'Maximum hover scale for the focused icon.'
      },
      {
        name: 'gap',
        type: 'number',
        defaultValue: '10',
        possibleValues: 'Any non-negative pixel gap.',
        description: 'Space between icons.'
      },
      {
        name: 'tooltip',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows Material UI tooltip labels on hover.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value for the dock shell.',
        description: 'Material UI styles for the dock container.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DockBar } from '@mickyballadelli/react-things'

const items = [
  { id: 'finder', label: 'Finder', icon: '🗂️' },
  { id: 'mail', label: 'Mail', icon: '✉️' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'photos', label: 'Photos', icon: '🌄' }
]

export function Example() {
  return <DockBar items={items} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DockBar, type DockBarItem } from '@mickyballadelli/react-things'

const items: DockBarItem[] = [
  { id: 'finder', label: 'Finder', icon: '🗂️' },
  { id: 'mail', label: 'Mail', icon: '✉️' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'photos', label: 'Photos', icon: '🌄' }
]

export function Example() {
  return <DockBar items={items} iconSize={56} magnification={1.8} />
}`
      }
    ]
  },
  {
    name: 'CommandPalette',
    summary: 'Reusable searchable navigation list or tree for side panes.',
    description: 'CommandPalette is a searchable list or tree for jumping between commands, docs pages, settings, or app sections.',
    props: [
      {
        name: 'items',
        type: 'CommandPaletteItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, description, group, parentId, icon, keywords, onSelect }.',
        description: 'Items available in the searchable navigation.'
      },
      {
        name: 'variant',
        type: '"list" | "tree"',
        defaultValue: 'list',
        possibleValues: 'list or tree.',
        description: 'List groups items with headings. Tree makes groups expandable.'
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any item id.',
        description: 'Marks the selected item.'
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: 'Search',
        possibleValues: 'Any string.',
        description: 'Placeholder shown in the search input.'
      },
      {
        name: 'emptyText',
        type: 'string',
        defaultValue: 'No items found',
        possibleValues: 'Any string.',
        description: 'Message shown when search has no results.'
      },
      {
        name: 'maxResults',
        type: 'number',
        defaultValue: '-',
        possibleValues: 'Any positive integer, or undefined for all matches.',
        description: 'Maximum number of items shown.'
      },
      {
        name: 'showSearch',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows or hides the search field.'
      },
      {
        name: 'dense',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Uses compact list rows.'
      },
      {
        name: 'expandedGroups',
        type: 'string[]',
        defaultValue: '-',
        possibleValues: 'Array of group names.',
        description: 'Controlled expanded tree groups.'
      },
      {
        name: 'defaultExpandedGroups',
        type: 'string[]',
        defaultValue: 'All groups',
        possibleValues: 'Array of group names.',
        description: 'Initial tree groups to open.'
      },
      {
        name: 'onExpandedGroupsChange',
        type: '(groups: string[]) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving group names.',
        description: 'Called when tree groups expand or collapse.'
      },
      {
        name: 'onSelect',
        type: '(item: CommandPaletteItem) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving selected item.',
        description: 'Called when user selects an item.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { CommandPalette } from '@mickyballadelli/react-things'

const items = [
  { id: 'components', label: 'Components', group: 'Docs' },
  { id: 'props', label: 'Props', group: 'Docs' },
  { id: 'samples', label: 'Samples', group: 'Docs' }
]

export function Example() {
  const [selectedId, setSelectedId] = useState('components')

  return (
    <CommandPalette
      items={items}
      selectedId={selectedId}
      onSelect={(item) => setSelectedId(item.id)}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { CommandPalette, type CommandPaletteItem } from '@mickyballadelli/react-things'

const items: CommandPaletteItem[] = [
  { id: 'display', label: 'Display', group: 'Components' },
  { id: 'layout', label: 'Layout', group: 'Components' },
  { id: 'input', label: 'Input', group: 'Components' }
]

export function Example() {
  const [selectedId, setSelectedId] = useState('display')

  return (
    <CommandPalette
      variant="tree"
      items={items}
      selectedId={selectedId}
      defaultExpandedGroups={['Components']}
      onSelect={(item) => setSelectedId(item.id)}
    />
  )
}`
      }
    ]
  },
  {
    name: 'SplitPane',
    summary: 'Draggable resizable panels for horizontal or vertical layouts.',
    description: 'SplitPane is a two-panel layout with a draggable divider for dashboards, editors, inspectors, and side-by-side workspaces.',
    props: [
      {
        name: 'first',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any React renderable content.',
        description: 'Content for the first panel.'
      },
      {
        name: 'second',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any React renderable content.',
        description: 'Content for the second panel.'
      },
      {
        name: 'orientation',
        type: '"horizontal" | "vertical"',
        defaultValue: 'horizontal',
        possibleValues: 'horizontal or vertical.',
        description: 'Direction of the split.'
      },
      {
        name: 'initialSize',
        type: 'number',
        defaultValue: '50',
        possibleValues: 'Percentage from 0 to 100. Clamped by minSize and maxSize.',
        description: 'Initial size of the first panel in percent.'
      },
      {
        name: 'defaultSize',
        type: 'number',
        defaultValue: '-',
        possibleValues: 'Percentage from 0 to 100. Used when size is uncontrolled.',
        description: 'Preferred uncontrolled starting size. Overrides initialSize.'
      },
      {
        name: 'size',
        type: 'number',
        defaultValue: '-',
        possibleValues: 'Percentage from 0 to 100. Clamped by minSize and maxSize.',
        description: 'Controlled first panel size.'
      },
      {
        name: 'minSize',
        type: 'number',
        defaultValue: '20',
        possibleValues: 'Percentage from 0 to 100.',
        description: 'Smallest allowed first panel size.'
      },
      {
        name: 'maxSize',
        type: 'number',
        defaultValue: '80',
        possibleValues: 'Percentage from 0 to 100.',
        description: 'Largest allowed first panel size.'
      },
      {
        name: 'dividerSize',
        type: 'number',
        defaultValue: '8',
        possibleValues: 'Any positive pixel size.',
        description: 'Thickness of draggable divider.'
      },
      {
        name: 'snapPoints',
        type: 'number[]',
        defaultValue: '[]',
        possibleValues: 'Percentages from 0 to 100. Example: [25, 50, 75].',
        description: 'Divider snaps near these sizes.'
      },
      {
        name: 'snapThreshold',
        type: 'number',
        defaultValue: '4',
        possibleValues: 'Any non-negative percent distance.',
        description: 'How close the divider must be to snap.'
      },
      {
        name: 'resetSize',
        type: 'number',
        defaultValue: 'defaultSize ?? initialSize',
        possibleValues: 'Percentage from 0 to 100.',
        description: 'Double-click or Enter on the divider resets to this size.'
      },
      {
        name: 'collapsed',
        type: '"first" | "second" | null',
        defaultValue: 'null',
        possibleValues: 'first, second, or null.',
        description: 'Controlled collapsed panel. Home toggles first, End toggles second.'
      },
      {
        name: 'defaultCollapsed',
        type: '"first" | "second" | null',
        defaultValue: 'null',
        possibleValues: 'first, second, or null.',
        description: 'Uncontrolled starting collapsed panel.'
      },
      {
        name: 'collapsedSize',
        type: 'number',
        defaultValue: '0',
        possibleValues: 'Percentage from 0 to 100.',
        description: 'Visible size of collapsed panel.'
      },
      {
        name: 'persistKey',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any localStorage key.',
        description: 'Stores the panel size in localStorage.'
      },
      {
        name: 'keyboardStep',
        type: 'number',
        defaultValue: '5',
        possibleValues: 'Any positive percent step.',
        description: 'Arrow key resize amount.'
      },
      {
        name: 'onSizeChange',
        type: '(size: number) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving first panel percent size.',
        description: 'Called when divider moves.'
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: "first" | "second" | null) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving first, second, or null.',
        description: 'Called when keyboard collapse state changes.'
      },
      {
        name: 'onDraggingChange',
        type: '(dragging: boolean) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving true or false.',
        description: 'Called when resize drag starts or stops.'
      },
      {
        name: 'dividerLabel',
        type: 'string',
        defaultValue: 'Resize panels',
        possibleValues: 'Any accessible label string.',
        description: 'ARIA label for the draggable divider.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value for the root container.',
        description: 'Material UI styles for the split pane.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { SplitPane } from '@mickyballadelli/react-things'

export function Example() {
  const [size, setSize] = useState(34)
  const [collapsed, setCollapsed] = useState(null)

  return (
    <>
      <SplitPane
        size={size}
        onSizeChange={setSize}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        snapPoints={[25, 50, 75]}
        persistKey="demo-split-pane"
        first={<div>Left panel</div>}
        second={<div>Right panel</div>}
      />
      <p>First panel: {Math.round(size)}%</p>
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { SplitPane, type SplitPaneCollapse, type SplitPaneProps } from '@mickyballadelli/react-things'

export function Example() {
  const [size, setSize] = useState(34)
  const [collapsed, setCollapsed] = useState<SplitPaneCollapse>(null)

  const props: SplitPaneProps = {
    size,
    onSizeChange: setSize,
    collapsed,
    onCollapsedChange: setCollapsed,
    minSize: 18,
    maxSize: 82,
    snapPoints: [25, 50, 75],
    resetSize: 34,
    keyboardStep: 4,
    first: <div>Left panel</div>,
    second: <div>Right panel</div>
  }

  return <SplitPane {...props} />
}`
      }
    ]
  },
  {
    name: 'FloatingToolbar',
    summary: 'Toolbar that anchors to selected text or an element.',
    description: 'FloatingToolbar is a contextual tool strip that appears near selected text, a button, or any measured element.',
    props: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: '-',
        possibleValues: 'true or false.',
        description: 'Controls whether the toolbar is visible.'
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Buttons, icons, segmented controls, or any React renderable content.',
        description: 'Toolbar controls.'
      },
      {
        name: 'anchorEl',
        type: 'HTMLElement | null',
        defaultValue: '-',
        possibleValues: 'Any DOM element.',
        description: 'Element used as the toolbar anchor.'
      },
      {
        name: 'anchorRect',
        type: 'DOMRect | null',
        defaultValue: '-',
        possibleValues: 'Any DOMRect, often from selection.getRangeAt(0).getBoundingClientRect().',
        description: 'Rectangle used as the toolbar anchor. Useful for selected text.'
      },
      {
        name: 'containerRef',
        type: 'RefObject<HTMLElement | null>',
        defaultValue: '-',
        possibleValues: 'A React ref to a positioned container.',
        description: 'Makes toolbar position absolute inside a container instead of fixed to viewport.'
      },
      {
        name: 'placement',
        type: '"top" | "bottom"',
        defaultValue: 'top',
        possibleValues: 'top or bottom.',
        description: 'Where toolbar appears relative to the anchor.'
      },
      {
        name: 'offset',
        type: 'number',
        defaultValue: '8',
        possibleValues: 'Any pixel number.',
        description: 'Distance from anchor.'
      },
      {
        name: 'boundaryPadding',
        type: 'number',
        defaultValue: '8',
        possibleValues: 'Any pixel number.',
        description: 'Keeps toolbar away from viewport or container edges.'
      },
      {
        name: 'autoUpdate',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Repositions toolbar on scroll and resize.'
      },
      {
        name: 'arrow',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows a small pointer arrow toward the anchor.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value.',
        description: 'Material UI styles for toolbar shell.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useRef, useState } from 'react'
import { FloatingToolbar } from '@mickyballadelli/react-things'

export function Example() {
  const containerRef = useRef(null)
  const [anchorRect, setAnchorRect] = useState(null)

  function updateSelection() {
    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    setAnchorRect(range && !selection?.isCollapsed ? range.getBoundingClientRect() : null)
  }

  function format(command) {
    document.execCommand(command)
    updateSelection()
  }

  return (
    <div ref={containerRef} onMouseUp={updateSelection} contentEditable>
      Select this text, then click a button.
      <FloatingToolbar open={Boolean(anchorRect)} anchorRect={anchorRect} containerRef={containerRef}>
        <button onMouseDown={(event) => event.preventDefault()} onClick={() => format('bold')}>Bold</button>
        <button onMouseDown={(event) => event.preventDefault()} onClick={() => format('italic')}>Italic</button>
      </FloatingToolbar>
    </div>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useRef, useState } from 'react'
import { FloatingToolbar, type FloatingToolbarProps } from '@mickyballadelli/react-things'

export function Example() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const props: Omit<FloatingToolbarProps, 'children'> = {
    open: Boolean(anchorRect),
    anchorRect,
    containerRef,
    placement: 'top',
    boundaryPadding: 12
  }

  function updateSelection() {
    const selection = window.getSelection()
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    setAnchorRect(range && !selection?.isCollapsed ? range.getBoundingClientRect() : null)
  }

  function format(command: string) {
    document.execCommand(command)
    updateSelection()
  }

  return (
    <div ref={containerRef} onMouseUp={updateSelection} contentEditable>
      Select text.
      <FloatingToolbar {...props}>
        <button onMouseDown={(event) => event.preventDefault()} onClick={() => format('bold')}>Bold</button>
      </FloatingToolbar>
    </div>
  )
}`
      }
    ]
  },
  {
    ...createBasicDoc(
      'MagneticCard',
      '3D magnetic card with cursor follow, tilt, lift, glare, and snap-back.',
      'MagneticCard is an interactive surface for feature cards, product tiles, and callouts that should respond physically to the cursor.'
    ),
    props: [
      {
        name: 'strength',
        type: 'number',
        defaultValue: '18',
        possibleValues: 'Any positive pixel amount.',
        description: 'How far the card follows the cursor.'
      },
      {
        name: 'tilt',
        type: 'number',
        defaultValue: '10',
        possibleValues: 'Degrees. Useful range: 4 to 20.',
        description: 'Maximum 3D rotateX/rotateY amount.'
      },
      {
        name: 'lift',
        type: 'number',
        defaultValue: '10',
        possibleValues: 'Any positive pixel amount.',
        description: 'Depth lift while hovering.'
      },
      {
        name: 'glare',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows moving light glare over the card.'
      },
      {
        name: 'perspective',
        type: 'number',
        defaultValue: '900',
        possibleValues: 'Any positive perspective distance.',
        description: 'Controls strength of 3D perspective.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value.',
        description: 'Material UI styles for the card.'
      }
    ]
  },
  createBasicDoc(
    'SpotlightPanel',
    'Panel with cursor spotlight reveal.',
    'SpotlightPanel is a reveal surface that darkens content and follows the cursor with a circular light window.'
  ),
  {
    ...createBasicDoc(
      'NodeCanvas',
      'Interactive node canvas with draggable nodes, selectable nodes, grid snap, and connection styles.',
      'NodeCanvas is a diagram workspace for showing connected boxes, flows, dependency maps, and lightweight node editors.'
    ),
    props: [
      {
        name: 'nodes',
        type: 'NodeCanvasNode[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, x, y, color, data }.',
        description: 'Nodes shown on the canvas.'
      },
      {
        name: 'connections',
        type: 'NodeCanvasConnection[]',
        defaultValue: '[]',
        possibleValues: 'Array of { from, to, label, color }.',
        description: 'Lines drawn between nodes.'
      },
      {
        name: 'nodeWidth',
        type: 'number',
        defaultValue: '132',
        possibleValues: 'Any positive pixel width.',
        description: 'Width of every node.'
      },
      {
        name: 'nodeHeight',
        type: 'number',
        defaultValue: '52',
        possibleValues: 'Any positive pixel height.',
        description: 'Height of every node.'
      },
      {
        name: 'mode',
        type: '"edit" | "readonly"',
        defaultValue: 'edit',
        possibleValues: 'edit or readonly.',
        description: 'Edit allows dragging and keyboard movement. Readonly allows selection only.'
      },
      {
        name: 'snapToGrid',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Snaps moved nodes to the grid.'
      },
      {
        name: 'gridSize',
        type: 'number',
        defaultValue: '24',
        possibleValues: 'Any positive pixel size.',
        description: 'Grid spacing and keyboard movement step when snapping.'
      },
      {
        name: 'showGrid',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Shows a visual grid behind nodes.'
      },
      {
        name: 'selectedNodeId',
        type: 'string | null',
        defaultValue: '-',
        possibleValues: 'Any node id or null.',
        description: 'Controlled selected node.'
      },
      {
        name: 'connectionStyle',
        type: '"line" | "curved" | "step" | "ellipse"',
        defaultValue: 'line',
        possibleValues: 'line, curved, step, or ellipse.',
        description: 'Default link shape when connection type is not set.'
      },
      {
        name: 'editableTools',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Shows built-in tools to add/remove boxes, edit label/color, and add typed links.'
      },
      {
        name: 'linkTypes',
        type: 'string[]',
        defaultValue: '["line", "curved", "step", "ellipse"]',
        possibleValues: 'line, curved, step, ellipse, or custom shape names that fall back to line.',
        description: 'Choices shown for link shape when creating a link.'
      },
      {
        name: 'renderNode',
        type: '(node, selected) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Function returning custom node content.',
        description: 'Custom node rendering.'
      },
      {
        name: 'onNodesChange',
        type: '(nodes) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving all current nodes.',
        description: 'Called when editable tools add, remove, edit, or move nodes.'
      },
      {
        name: 'onConnectionsChange',
        type: '(connections) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving all current connections.',
        description: 'Called when editable tools add typed links.'
      },
      {
        name: 'onNodeMove',
        type: '(nodeId, position) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving node id and { x, y }.',
        description: 'Called when a node moves.'
      },
      {
        name: 'onNodeSelect',
        type: '(node) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving selected node.',
        description: 'Called when a node is selected.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value.',
        description: 'Material UI styles for the canvas.'
      }
    ]
  },
  createBasicDoc(
    'BeforeAfterSlider',
    'Compare two panes with draggable slider.',
    'BeforeAfterSlider is a comparison viewer that reveals one layer over another with a draggable dividing handle.'
  ),
  {
    ...createBasicDoc(
      'InfiniteCanvas',
      'Pan and zoom canvas with draggable items, grid, selection, and minimap.',
      'InfiniteCanvas is a spatial workspace for maps, boards, planning surfaces, and draggable objects spread across a large area.'
    ),
    props: [
      {
        name: 'items',
        type: 'InfiniteCanvasItem[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, x, y, width, height, label, color, data }.',
        description: 'Items placed on the canvas.'
      },
      {
        name: 'defaultViewport',
        type: '{ x: number, y: number, zoom: number }',
        defaultValue: '{ x: 0, y: 0, zoom: 1 }',
        possibleValues: 'Any x/y pan and zoom value.',
        description: 'Initial viewport when uncontrolled.'
      },
      {
        name: 'viewport',
        type: 'InfiniteCanvasViewport',
        defaultValue: '-',
        possibleValues: 'Controlled viewport object.',
        description: 'Controls pan and zoom from parent state.'
      },
      {
        name: 'minZoom / maxZoom',
        type: 'number',
        defaultValue: '0.3 / 2.5',
        possibleValues: 'Any positive zoom bounds.',
        description: 'Zoom limits.'
      },
      {
        name: 'showGrid',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows moving grid.'
      },
      {
        name: 'showMinimap',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows lower-right minimap.'
      },
      {
        name: 'selectedItemId',
        type: 'string | null',
        defaultValue: '-',
        possibleValues: 'Any item id or null.',
        description: 'Controlled selected item.'
      },
      {
        name: 'renderItem',
        type: '(item, selected) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Function returning custom item content.',
        description: 'Custom item rendering.'
      },
      {
        name: 'onViewportChange',
        type: '(viewport) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving x, y, zoom.',
        description: 'Called when pan or zoom changes.'
      },
      {
        name: 'onItemMove',
        type: '(id, position) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving item id and x/y.',
        description: 'Called when item is dragged.'
      },
      {
        name: 'onItemSelect',
        type: '(item) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving item or null.',
        description: 'Called when selection changes.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'SmartTooltip',
      'Tooltip that can hold actions, media, copy buttons, and pin mode.',
      'SmartTooltip is a rich hover or click popover for extra context, previews, quick actions, and copyable values.'
    ),
    props: [
      {
        name: 'children',
        type: 'ReactElement',
        defaultValue: '-',
        possibleValues: 'One React element.',
        description: 'Trigger element.'
      },
      {
        name: 'title',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any React renderable.',
        description: 'Main tooltip title.'
      },
      {
        name: 'content',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any React renderable.',
        description: 'Tooltip body content.'
      },
      {
        name: 'media',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Image, video, canvas, or any React renderable.',
        description: 'Media block shown above text.'
      },
      {
        name: 'actions',
        type: 'SmartTooltipAction[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, label, icon, onClick }.',
        description: 'Action buttons shown in tooltip.'
      },
      {
        name: 'copyText',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any string.',
        description: 'Shows copy button when provided.'
      },
      {
        name: 'placement',
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: 'top',
        possibleValues: 'top, bottom, left, or right.',
        description: 'Tooltip placement.'
      },
      {
        name: 'pinMode',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Allows tooltip to stay open after click.'
      },
      {
        name: 'defaultPinned',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Starts tooltip open and pinned.'
      },
      {
        name: 'openDelay',
        type: 'number',
        defaultValue: '120',
        possibleValues: 'Any millisecond delay.',
        description: 'Hover delay before open.'
      }
    ]
  },
  createBasicDoc(
    'ResizableFrame',
    'Frame resized from bottom-right handle.',
    'ResizableFrame is a simple container whose width and height can be changed by dragging its corner handle.'
  ),
  createBasicDoc(
    'InspectorPanel',
    'Schema-driven inspector with grouped controls, reset, color/select fields, and value summary.',
    'InspectorPanel is a compact control surface for editing live component props, design tokens, tool settings, or selected-object attributes.'
  ),
  createBasicDoc(
    'ColorPicker',
    'Color picker with swatches and alpha.',
    'ColorPicker is a controlled color input with preset swatches, optional alpha control, and readable selected values.'
  ),
  {
    ...createBasicDoc(
      'TimelineScrubber',
      'Slick time scrubber with markers, hover preview thumbnails, and keyboard control.',
      'TimelineScrubber is a timeline input for audio, video, animation, or any ordered sequence that needs precise seeking.'
    ),
    props: [
      {
        name: 'duration',
        type: 'number',
        defaultValue: '-',
        possibleValues: 'Any positive number of seconds or timeline units.',
        description: 'Total timeline length.'
      },
      {
        name: 'value',
        type: 'number',
        defaultValue: '-',
        possibleValues: '0 to duration.',
        description: 'Controlled current time.'
      },
      {
        name: 'defaultValue',
        type: 'number',
        defaultValue: '0',
        possibleValues: '0 to duration.',
        description: 'Initial time when uncontrolled.'
      },
      {
        name: 'markers',
        type: 'TimelineScrubberMarker[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, time, label, color, thumbnail }.',
        description: 'Clickable timeline markers.'
      },
      {
        name: 'thumbnails',
        type: 'TimelineScrubberThumbnail[]',
        defaultValue: '[]',
        possibleValues: 'Array of { time, thumbnail }.',
        description: 'Preview thumbnails used near hover time.'
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Disables pointer and keyboard scrubbing.'
      },
      {
        name: 'showTime',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows current time and duration labels.'
      },
      {
        name: 'preview',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows hover preview card.'
      },
      {
        name: 'step',
        type: 'number',
        defaultValue: '1',
        possibleValues: 'Any positive number.',
        description: 'Snaps scrubbed values and keyboard movement.'
      },
      {
        name: 'formatTime',
        type: '(time: number) => string',
        defaultValue: 'm:ss formatter',
        possibleValues: 'Function returning display text.',
        description: 'Custom time label formatter.'
      },
      {
        name: 'onChange',
        type: '(time, reason) => void',
        defaultValue: '-',
        possibleValues: 'reason is drag, click, keyboard, or marker.',
        description: 'Called when current time changes.'
      },
      {
        name: 'sx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value.',
        description: 'Material UI styles for the wrapper.'
      }
    ]
  },
  createBasicDoc(
    'FileDropZone',
    'Drag-drop file area with state.',
    'FileDropZone is an upload target that handles drag, hover, and selected file states before handing files back to your app.'
  ),
]

const defaultGlassBoxConfig: GlassBoxConfig = {
  transparency: 0.45,
  fill: 0.62,
  liquidColor: '#38d6a5',
  glassColor: '#ffffff',
  children: 'Liquid glass content'
}

const sampleTabs = ['JavaScript', 'TypeScript']

function getComponentGroup(name: string) {
  if (['GlassBox', 'ColorPicker', 'CodeViewer', 'DockBar', 'TimelineScrubber'].includes(name)) {
    return 'Display'
  }

  if (['DraggableBox', 'SplitPane', 'ResizableFrame', 'BeforeAfterSlider', 'InfiniteCanvas'].includes(name)) {
    return 'Layout'
  }

  if (['CommandPalette', 'FloatingToolbar', 'FileDropZone', 'InspectorPanel', 'SmartTooltip'].includes(name)) {
    return 'Input'
  }

  return 'Effects'
}

function readNumberProp(code: string, name: string, fallback: number) {
  const match = code.match(new RegExp(`${name}\\s*(?:=\\{?|:)\\s*([0-9]*\\.?[0-9]+)`))

  return match ? Number(match[1]) : fallback
}

function readStringProp(code: string, name: string, fallback: string) {
  const match = code.match(new RegExp(`${name}\\s*(?:=\\{?\\s*|:\\s*)['"]([^'"]+)['"]`))

  return match ? match[1] : fallback
}

function readChildren(code: string, fallback: string) {
  const match = code.match(/<GlassBox[^>]*>([\s\S]*?)<\/GlassBox>/)
  const text = match?.[1]
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return text || fallback
}

function readGlassBoxConfig(code: string, currentConfig: GlassBoxConfig): GlassBoxConfig {
  return {
    transparency: readNumberProp(code, 'transparency', currentConfig.transparency),
    fill: readNumberProp(code, 'fill', currentConfig.fill),
    liquidColor: readStringProp(code, 'liquidColor', currentConfig.liquidColor),
    glassColor: readStringProp(code, 'glassColor', currentConfig.glassColor),
    children: readChildren(code, currentConfig.children)
  }
}

function createJavaScriptSample(config: GlassBoxConfig) {
  return `import { GlassBox } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <GlassBox
      transparency={${config.transparency}}
      fill={${config.fill}}
      liquidColor="${config.liquidColor}"
      glassColor="${config.glassColor}"
      refractionActive={false}
    >
      ${config.children}
    </GlassBox>
  )
}`
}

function createTypeScriptSample(config: GlassBoxConfig) {
  return `import { GlassBox, type GlassBoxProps } from '@mickyballadelli/react-things'

const glassBoxProps: GlassBoxProps = {
  transparency: ${config.transparency},
  fill: ${config.fill},
  liquidColor: '${config.liquidColor}',
  glassColor: '${config.glassColor}',
  refractionActive: false
}

export function Example() {
  return (
    <GlassBox {...glassBoxProps}>
      ${config.children}
    </GlassBox>
  )
}`
}

function createGlassBoxSampleCode(config: GlassBoxConfig) {
  return {
    'GlassBox:JavaScript': createJavaScriptSample(config),
    'GlassBox:TypeScript': createTypeScriptSample(config)
  }
}

function createInitialSampleCode(config: GlassBoxConfig) {
  return {
    ...createGlassBoxSampleCode(config),
    ...Object.fromEntries(componentDocs.flatMap((component) => component.samples.map((sample) => [
      `${component.name}:${sample.label}`,
      sample.initialCode
    ])))
  }
}

export function ComponentDocs() {
  const initialComponentName = new URLSearchParams(window.location.search).get('component')
  const initialComponent = componentDocs.find((component) => component.name === initialComponentName) ?? componentDocs[0]
  const [selectedComponentName, setSelectedComponentName] = useState(initialComponent.name)
  const selectedComponent = componentDocs.find((component) => component.name === selectedComponentName) ?? componentDocs[0]
  const [glassBoxConfig, setGlassBoxConfig] = useState(defaultGlassBoxConfig)
  const [sampleCode, setSampleCode] = useState<Record<string, string>>(createInitialSampleCode(defaultGlassBoxConfig))
  const [selectedSampleLabel, setSelectedSampleLabel] = useState(sampleTabs[0])
  const [commandPaletteSelectedId, setCommandPaletteSelectedId] = useState('components')
  const [pickerColor, setPickerColor] = useState('#2563eb')
  const [pickerAlpha, setPickerAlpha] = useState(0.8)
  const [splitSize, setSplitSize] = useState(34)
  const [splitCollapsed, setSplitCollapsed] = useState<'first' | 'second' | null>(null)
  const [inspectorTextTitle, setInspectorTextTitle] = useState('Demo card')
  const [inspectorNumberSize, setInspectorNumberSize] = useState(48)
  const [inspectorFields, setInspectorFields] = useState<InspectorPanelField[]>([
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      value: 'Launch card',
      defaultValue: 'Launch card',
      description: 'Text shown on the preview card.',
      group: 'Content'
    },
    {
      id: 'accent',
      label: 'Accent',
      type: 'color',
      value: '#2563eb',
      defaultValue: '#2563eb',
      description: 'Main preview color.',
      group: 'Style'
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      value: 'Calm',
      defaultValue: 'Calm',
      description: 'Changes card personality.',
      group: 'Style',
      options: [
        { label: 'Calm', value: 'Calm' },
        { label: 'Bold', value: 'Bold' },
        { label: 'Soft', value: 'Soft' }
      ]
    },
    {
      id: 'size',
      label: 'Size',
      type: 'number',
      value: 48,
      defaultValue: 48,
      description: 'Preview card title size.',
      group: 'Layout',
      min: 24,
      max: 72,
      step: 2,
      unit: 'px'
    },
    {
      id: 'enabled',
      label: 'Enabled',
      type: 'boolean',
      value: true,
      defaultValue: true,
      description: 'Toggles the active card treatment.',
      group: 'State'
    }
  ])
  const floatingToolbarContainerRef = useRef<HTMLDivElement | null>(null)
  const floatingToolbarButtonRef = useRef<HTMLButtonElement | null>(null)
  const floatingToolbarBottomButtonRef = useRef<HTMLButtonElement | null>(null)
  const [floatingToolbarRect, setFloatingToolbarRect] = useState<DOMRect | null>(null)
  const [floatingToolbarElementOpen, setFloatingToolbarElementOpen] = useState(false)
  const [floatingToolbarBottomOpen, setFloatingToolbarBottomOpen] = useState(false)
  const [nodeCanvasSelectedId, setNodeCanvasSelectedId] = useState<string | null>('a')
  const [timelineTime, setTimelineTime] = useState(34)
  const [infiniteCanvasSelectedId, setInfiniteCanvasSelectedId] = useState<string | null>('idea')

  const selectedSamples = selectedComponent.name === 'GlassBox'
    ? [
      { label: 'JavaScript', language: 'javascript', initialCode: sampleCode['GlassBox:JavaScript'] },
      { label: 'TypeScript', language: 'typescript', initialCode: sampleCode['GlassBox:TypeScript'] }
    ]
    : selectedComponent.samples

  useEffect(() => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('component', selectedComponent.name)
    window.history.replaceState(null, '', nextUrl)
  }, [selectedComponent.name])

  function updateSample(nextCode: string, sampleLabel: string) {
    const sampleKey = `${selectedComponent.name}:${sampleLabel}`

    if (selectedComponent.name !== 'GlassBox') {
      setSampleCode((currentCode) => ({
        ...currentCode,
        [sampleKey]: nextCode
      }))
      return
    }

    const nextConfig = readGlassBoxConfig(nextCode, glassBoxConfig)
    const syncedCode = createGlassBoxSampleCode(nextConfig)

    setGlassBoxConfig(nextConfig)
    setSampleCode({
      ...sampleCode,
      ...syncedCode,
      [sampleKey]: nextCode
    })
  }

  function renderPreview() {
    if (selectedComponent.name === 'MagneticCard') {
      return (
        <Box sx={{ minHeight: 340, display: 'grid', placeItems: 'center', bgcolor: '#eef2ff' }}>
          <MagneticCard
            strength={24}
            tilt={16}
            lift={16}
            glare
            sx={{
              p: 4,
              width: 300,
              border: 1,
              borderColor: 'rgba(255,255,255,0.8)',
              borderRadius: 2,
              color: '#ffffff',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed 55%, #db2777)'
            }}
          >
            <Typography variant="h5" fontWeight={900}>MagneticCard</Typography>
            <Typography sx={{ opacity: 0.86 }}>Hover corners for tilt, lift, glare, and depth.</Typography>
          </MagneticCard>
        </Box>
      )
    }

    if (selectedComponent.name === 'SpotlightPanel') {
      return <SpotlightPanel sx={{ minHeight: 300, p: 4, color: '#fff', bgcolor: '#111827' }}><Typography variant="h4" fontWeight={850}>Move mouse here</Typography><Typography>Spotlight reveals content under cursor.</Typography></SpotlightPanel>
    }

    if (selectedComponent.name === 'NodeCanvas') {
      const nodes = [
        { id: 'a', label: 'Start', x: 60, y: 80, color: '#dbeafe' },
        { id: 'b', label: 'Build', x: 280, y: 180, color: '#dcfce7' },
        { id: 'c', label: 'Review', x: 500, y: 85, color: '#fef3c7' },
        { id: 'd', label: 'Ship', x: 500, y: 265, color: '#fee2e2' }
      ]

      return (
        <Box>
          <NodeCanvas
            nodes={nodes}
            connections={[
              { from: 'a', to: 'b', color: '#2563eb' },
              { from: 'b', to: 'c', color: '#059669' },
              { from: 'b', to: 'd', color: '#db2777' }
            ]}
            selectedNodeId={nodeCanvasSelectedId}
            onNodeSelect={(node) => setNodeCanvasSelectedId(node.id)}
            connectionStyle="curved"
            editableTools
            linkTypes={['line', 'curved', 'step', 'ellipse']}
            showGrid
            snapToGrid
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'BeforeAfterSlider') {
      return <BeforeAfterSlider sx={{ minHeight: 320 }} before={<Box sx={{ height: '100%', bgcolor: '#2563eb', color: '#fff', p: 4 }}><Typography variant="h4">Before</Typography></Box>} after={<Box sx={{ height: '100%', bgcolor: '#f59e0b', color: '#111827', p: 4 }}><Typography variant="h4">After</Typography></Box>} />
    }

    if (selectedComponent.name === 'InfiniteCanvas') {
      const items = [
        { id: 'idea', label: 'Idea', x: 40, y: 80, color: '#dbeafe' },
        { id: 'design', label: 'Design', x: 320, y: 190, color: '#fef3c7' },
        { id: 'build', label: 'Build', x: 680, y: 80, color: '#dcfce7' },
        { id: 'ship', label: 'Ship', x: 980, y: 260, color: '#fee2e2' }
      ]

      return (
        <InfiniteCanvas
          items={items}
          selectedItemId={infiniteCanvasSelectedId}
          onItemSelect={(item) => setInfiniteCanvasSelectedId(item?.id ?? null)}
          defaultViewport={{ x: 80, y: 40, zoom: 0.85 }}
          sx={{ minHeight: 420 }}
        />
      )
    }

    if (selectedComponent.name === 'ResizableFrame') {
      return <Box sx={{ minHeight: 340, p: 3, bgcolor: '#f8fafc' }}><ResizableFrame><Box sx={{ p: 2 }}><Typography fontWeight={850}>Resize me</Typography><Typography color="text.secondary">Drag bottom-right corner.</Typography></Box></ResizableFrame></Box>
    }

    if (selectedComponent.name === 'InspectorPanel') {
      const inspectorValue = (id: string) => inspectorFields.find((field) => field.id === id)?.value
      const title = String(inspectorValue('title') ?? 'Launch card')
      const accent = String(inspectorValue('accent') ?? '#2563eb')
      const tone = String(inspectorValue('tone') ?? 'Calm')
      const titleSize = Number(inspectorValue('size') ?? 48)
      const enabled = Boolean(inspectorValue('enabled'))

      return (
        <Box sx={{ p: 3, minHeight: 420, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '360px 1fr' }, gap: 3, alignItems: 'start' }}>
            <InspectorPanel
              title="Card inspector"
              description="Change grouped props, reset overrides, and see values at a glance."
              fields={inspectorFields}
              onChange={(id, value) => setInspectorFields((fields) => fields.map((field) => field.id === id ? { ...field, value } : field))}
            />
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 1,
                minHeight: 300,
                display: 'grid',
                alignContent: 'center',
                color: enabled ? '#ffffff' : 'text.secondary',
                bgcolor: enabled ? accent : '#e5e7eb',
                boxShadow: enabled && tone === 'Bold' ? `0 20px 50px ${accent}55` : 'none',
                opacity: tone === 'Soft' ? 0.78 : 1
              }}
            >
              <Typography fontWeight={950} sx={{ fontSize: titleSize, lineHeight: 1 }}>
                {title}
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 420, opacity: 0.86 }}>
                {tone} mode is {enabled ? 'active' : 'disabled'}. The inspector edits actual preview props, not just form fields.
              </Typography>
            </Paper>
          </Box>
        </Box>
      )
    }

    if (selectedComponent.name === 'ColorPicker') {
      return (
        <Box sx={{ p: 3, maxWidth: 460 }}>
          <ColorPicker value={pickerColor} alpha={pickerAlpha} onChange={setPickerColor} onAlphaChange={setPickerAlpha} />
          <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" fontWeight={850}>
              Retrieved value
            </Typography>
            <Typography component="code" fontFamily="monospace">
              color: {pickerColor}, alpha: {pickerAlpha.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      )
    }

    if (selectedComponent.name === 'TimelineScrubber') {
      const markers = [
        { id: 'cold-open', time: 8, label: 'Cold open', color: '#2563eb' },
        { id: 'demo', time: 42, label: 'Demo scene', color: '#059669' },
        { id: 'climax', time: 88, label: 'Big moment', color: '#db2777' },
        { id: 'credits', time: 116, label: 'Credits', color: '#f59e0b' }
      ]
      const thumbnails = [
        {
          time: 0,
          thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'left center' }} />
        },
        {
          time: 55,
          thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        },
        {
          time: 105,
          thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'right center' }} />
        }
      ]

      return (
        <Box sx={{ p: 4, minHeight: 320, display: 'grid', alignItems: 'center', bgcolor: '#f8fafc' }}>
          <Box sx={{ maxWidth: 820, width: '100%', mx: 'auto' }}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>
              TimelineScrubber
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Drag, hover for preview, click markers, or use keyboard.
            </Typography>
            <TimelineScrubber
              duration={128}
              value={timelineTime}
              markers={markers}
              thumbnails={thumbnails}
              step={0.5}
              onChange={setTimelineTime}
            />
          </Box>
        </Box>
      )
    }

    if (selectedComponent.name === 'FileDropZone') {
      return <Box sx={{ p: 3 }}><FileDropZone onFiles={() => {}} /></Box>
    }

    if (selectedComponent.name === 'SmartTooltip') {
      return (
        <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center', bgcolor: '#f8fafc' }}>
          <SmartTooltip
            title="SmartTooltip"
            content="Hover to preview, click to pin, copy the value, or trigger actions."
            copyText="npm install @mickyballadelli/react-things"
            media={<Box sx={{ height: 120, backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />}
            actions={[{ id: 'docs', label: 'Docs' }, { id: 'use', label: 'Use' }]}
            placement="bottom"
          >
            <Button variant="contained">Hover or click</Button>
          </SmartTooltip>
        </Box>
      )
    }

    if (selectedComponent.name === 'FloatingToolbar') {
      function updateSelection() {
        const selection = window.getSelection()
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null

        setFloatingToolbarRect(range && !selection?.isCollapsed ? range.getBoundingClientRect() : null)
      }

      function applyToolbarCommand(command: string, value?: string) {
        document.execCommand(command, false, value)
        updateSelection()
      }

      return (
        <Box
          ref={floatingToolbarContainerRef}
          onMouseUp={updateSelection}
          onKeyUp={updateSelection}
          sx={{
            position: 'relative',
            minHeight: 340,
            p: 4,
            bgcolor: '#f8fafc'
          }}
        >
          <Box
            contentEditable
            suppressContentEditableWarning
            sx={{
              maxWidth: 680,
              minHeight: 180,
              p: 3,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: '#ffffff',
              lineHeight: 1.9,
              outline: 'none',
              '&:focus': {
                borderColor: 'primary.main'
              }
            }}
          >
            <Typography variant="h6" fontWeight={800} gutterBottom>
              Select and format this text
            </Typography>
            <Typography component="p">
              This toolbar now does work. Select words in this editor, then use the floating buttons
              to make text bold, italic, underlined, or blue. It stays positioned near the selection.
            </Typography>
          </Box>

          <FloatingToolbar
            open={Boolean(floatingToolbarRect)}
            anchorRect={floatingToolbarRect}
            containerRef={floatingToolbarContainerRef}
            boundaryPadding={16}
          >
            {[
              { label: 'B', command: 'bold' },
              { label: 'I', command: 'italic' },
              { label: 'U', command: 'underline' }
            ].map((action) => (
              <Button
                key={action.command}
                size="small"
                color="inherit"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => applyToolbarCommand(action.command)}
              >
                {action.label}
              </Button>
            ))}
            <Button
              size="small"
              color="inherit"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyToolbarCommand('foreColor', '#2563eb')}
            >
              Blue
            </Button>
          </FloatingToolbar>
        </Box>
      )
    }

    if (selectedComponent.name === 'SplitPane') {
      return (
        <Box sx={{ minHeight: 420, bgcolor: '#f8fafc' }}>
          <Stack direction="row" spacing={1} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }} alignItems="center">
            <Button size="small" variant="outlined" onClick={() => setSplitCollapsed(splitCollapsed === 'first' ? null : 'first')}>
              Toggle nav
            </Button>
            <Button size="small" variant="outlined" onClick={() => setSplitCollapsed(splitCollapsed === 'second' ? null : 'second')}>
              Toggle work
            </Button>
            <Button size="small" variant="outlined" onClick={() => setSplitSize(34)}>
              Reset
            </Button>
            <Typography variant="body2" color="text.secondary">
              {Math.round(splitSize)}%
            </Typography>
          </Stack>
          <SplitPane
            size={splitSize}
            onSizeChange={setSplitSize}
            collapsed={splitCollapsed}
            onCollapsedChange={setSplitCollapsed}
            minSize={18}
            maxSize={82}
            snapPoints={[25, 50, 75]}
            resetSize={34}
            persistKey="react-things-split-pane-preview"
            sx={{ minHeight: 360 }}
            first={(
              <Box sx={{ height: '100%', p: 3, bgcolor: '#e0f2fe' }}>
                <Typography variant="h6" fontWeight={800}>
                  Navigator
                </Typography>
                <Stack spacing={1.2} sx={{ mt: 2 }}>
                  {['Dashboard', 'Components', 'Samples', 'Settings'].map((item) => (
                    <Paper key={item} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1 }}>
                      {item}
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
            second={(
              <Box sx={{ height: '100%', p: 3, bgcolor: '#ffffff' }}>
                <Typography variant="h6" fontWeight={800}>
                  Workspace
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Drag divider. Double-click or press Enter to reset. Arrow keys resize. Home/End collapse.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1.5 }}>
                  {['Snap', 'Persist', 'Keyboard'].map((item) => (
                    <Paper key={item} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                      <Typography fontWeight={850}>{item}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'CommandPalette') {
      const navigationItems = [
        { id: 'components', label: 'Components', description: 'Browse reusable UI', group: 'Workspace', icon: '◇', keywords: ['library'] },
        { id: 'samples', label: 'Samples', description: 'Editable JS and TS examples', group: 'Workspace', icon: '⌕', keywords: ['code'] },
        { id: 'props', label: 'Props', description: 'Reference all accepted values', group: 'Workspace', icon: '▣', keywords: ['docs'] },
        { id: 'glass', label: 'GlassBox', description: 'Liquid glass container', group: 'Components', icon: '◌', keywords: ['visual'] },
        { id: 'dock', label: 'DockBar', description: 'Magnifying icon dock', group: 'Components', icon: '▤', keywords: ['navigation'] },
        { id: 'split', label: 'SplitPane', description: 'Resizable panel layout', group: 'Components', icon: '▥', keywords: ['layout'] }
      ]

      return (
        <Box
          sx={{
            minHeight: 360,
            p: 3,
            bgcolor: '#f8fafc'
          }}
        >
          <CommandPalette
            variant="tree"
            items={navigationItems}
            selectedId={commandPaletteSelectedId}
            defaultExpandedGroups={['Workspace', 'Components']}
            placeholder="Search navigation"
            onSelect={(item) => setCommandPaletteSelectedId(item.id)}
            sx={{ maxWidth: 420 }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'DockBar') {
      const dockItems = [
        { id: 'finder', label: 'Finder', icon: '🗂️' },
        { id: 'mail', label: 'Mail', icon: '✉️' },
        { id: 'music', label: 'Music', icon: '🎵' },
        { id: 'photos', label: 'Photos', icon: '🌄' },
        { id: 'terminal', label: 'Terminal', icon: '⌘' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
      ]

      return (
        <Box
          sx={{
            minHeight: 360,
            display: 'grid',
            placeItems: 'end center',
            p: 4,
            backgroundImage: 'url(/animals-colors.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <DockBar items={dockItems} iconSize={56} magnification={1.85} />
        </Box>
      )
    }

    if (selectedComponent.name === 'DraggableBox') {
      return (
        <DraggableBox
          initialPosition={{ x: 52, y: 56 }}
          sx={{
            minHeight: 420,
            backgroundImage: 'url(/animals-colors.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          dragSx={{
            width: { xs: '70%', sm: 260 },
            maxWidth: 'calc(100% - 32px)'
          }}
        >
          <Paper sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              Drag me
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Grab any point. Offset stays true.
            </Typography>
          </Paper>
        </DraggableBox>
      )
    }

    if (selectedComponent.name === 'CodeViewer') {
      const codeViewerPreviewKey = 'CodeViewer:JavaScript'

      return (
        <Box sx={{ p: 2 }}>
          <CodeViewer
            label="Live CodeViewer"
            language="javascript"
            value={sampleCode[codeViewerPreviewKey] ?? ''}
            onChange={(nextCode) => {
              setSampleCode((currentCode) => ({
                ...currentCode,
                [codeViewerPreviewKey]: nextCode
              }))
            }}
            minHeight={300}
          />
        </Box>
      )
    }

    return (
      <DraggableGlassBoxPreview
        transparency={glassBoxConfig.transparency}
        fill={glassBoxConfig.fill}
        liquidColor={glassBoxConfig.liquidColor}
        glassColor={glassBoxConfig.glassColor}
      >
        {glassBoxConfig.children}
      </DraggableGlassBoxPreview>
    )
  }

  function renderVariantCard(title: string, body: ReactNode) {
    return (
      <Paper key={title} variant="outlined" sx={{ p: 2, borderRadius: 1, minHeight: 180, overflow: 'hidden' }}>
        <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 1.5 }}>
          {title}
        </Typography>
        {body}
      </Paper>
    )
  }

  function renderVariants() {
    const common = {
      Simple: <Typography color="text.secondary">Smallest useful setup.</Typography>,
      Rich: <Typography color="text.secondary">More props, stronger styling.</Typography>,
      Amazing: <Typography color="text.secondary">Polished composition.</Typography>
    }
    const commandItems = [
      { id: 'overview', label: 'Overview', group: 'Docs', keywords: ['start'] },
      { id: 'samples', label: 'Samples', group: 'Docs', keywords: ['code'] },
      { id: 'props', label: 'Props', group: 'Docs', keywords: ['reference'] },
      { id: 'glassbox', label: 'GlassBox', group: 'Components', keywords: ['liquid'] },
      { id: 'splitpane', label: 'SplitPane', group: 'Components', keywords: ['layout'] },
      { id: 'dockbar', label: 'DockBar', group: 'Components', keywords: ['navigation'] }
    ]

    const variants: Record<string, ReactNode[]> = {
      GlassBox: [
        renderVariantCard('Simple', <GlassBox transparency={0.45}>Simple glass</GlassBox>),
        renderVariantCard('Colored', <GlassBox transparency={0.28} fill={0.8} liquidColor="#38d6a5">Green liquid</GlassBox>),
        renderVariantCard('Interactive', <Box sx={{ height: 220 }}><DraggableGlassBoxPreview transparency={0.42} fill={0.7} liquidColor="#39b8ff" glassColor="#ffffff">Drag liquid glass</DraggableGlassBoxPreview></Box>)
      ],
      DraggableBox: [
        renderVariantCard('Simple', <DraggableBox sx={{ minHeight: 150, bgcolor: '#f8fafc' }}><Paper sx={{ p: 1.5 }}>Drag</Paper></DraggableBox>),
        renderVariantCard('Sized Child', <DraggableBox initialPosition={{ x: 30, y: 55 }} dragSx={{ width: 140 }} sx={{ minHeight: 150, bgcolor: '#eef2ff' }}><Paper sx={{ p: 2 }}>Panel</Paper></DraggableBox>),
        renderVariantCard('Canvas', <DraggableBox initialPosition={{ x: 70, y: 45 }} sx={{ minHeight: 150, backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover' }}><Paper sx={{ p: 1.5 }}>Over image</Paper></DraggableBox>)
      ],
      CodeViewer: [
        renderVariantCard('JavaScript', <CodeViewer label="JS" language="javascript" value={'const name = "Ada"'} onChange={() => {}} minHeight={120} />),
        renderVariantCard('Rust', <CodeViewer label="Rust" language="rust" value={'fn main() {\n  println!("hello");\n}'} onChange={() => {}} minHeight={120} />),
        renderVariantCard('SQL', <CodeViewer label="SQL" language="sql" value={"select * from users\nwhere status = 'active';"} onChange={() => {}} minHeight={120} />)
      ],
      DockBar: [
        renderVariantCard('Small', <DockBar items={[{ id: 'a', label: 'A', icon: 'A' }, { id: 'b', label: 'B', icon: 'B' }]} iconSize={40} />),
        renderVariantCard('Default', <DockBar items={[{ id: 'mail', label: 'Mail', icon: '✉️' }, { id: 'music', label: 'Music', icon: '🎵' }, { id: 'photos', label: 'Photos', icon: '🌄' }]} />),
        renderVariantCard('Big', <DockBar items={[{ id: 'finder', label: 'Finder', icon: '🗂️' }, { id: 'terminal', label: 'Terminal', icon: '⌘' }, { id: 'settings', label: 'Settings', icon: '⚙️' }]} iconSize={62} magnification={2} />)
      ],
      CommandPalette: [
        renderVariantCard('List', <CommandPalette items={commandItems} selectedId={commandPaletteSelectedId} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />),
        renderVariantCard('Dense List', <CommandPalette dense items={commandItems} selectedId={commandPaletteSelectedId} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />),
        renderVariantCard('Tree', <CommandPalette variant="tree" items={commandItems} selectedId={commandPaletteSelectedId} defaultExpandedGroups={['Docs', 'Components']} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />)
      ],
      SplitPane: [
        renderVariantCard('Simple', <SplitPane sx={{ minHeight: 150 }} first={<Box sx={{ p: 2 }}>Left</Box>} second={<Box sx={{ p: 2 }}>Right</Box>} />),
        renderVariantCard('Snapping', <SplitPane initialSize={32} snapPoints={[25, 50, 75]} sx={{ minHeight: 150 }} first={<Box sx={{ p: 2, bgcolor: '#e0f2fe' }}>Snap nav</Box>} second={<Box sx={{ p: 2 }}>Drag near 25, 50, 75</Box>} />),
        renderVariantCard('Controlled', <SplitPane size={splitSize} onSizeChange={setSplitSize} collapsed={splitCollapsed} onCollapsedChange={setSplitCollapsed} resetSize={34} sx={{ minHeight: 160 }} first={<Box sx={{ p: 2, bgcolor: '#dcfce7' }}>Size {Math.round(splitSize)}%</Box>} second={<Box sx={{ p: 2 }}>Home/End collapse</Box>} />),
        renderVariantCard('Vertical', <SplitPane orientation="vertical" initialSize={35} snapPoints={[35, 65]} sx={{ minHeight: 190 }} first={<Box sx={{ p: 2, bgcolor: '#fef3c7' }}>Top</Box>} second={<Box sx={{ p: 2 }}>Bottom</Box>} />),
        renderVariantCard('Persistent', <SplitPane defaultSize={45} persistKey="react-things-split-pane-variant" sx={{ minHeight: 150 }} first={<Box sx={{ p: 2 }}>Saved size</Box>} second={<Box sx={{ p: 2 }}>Refresh keeps it</Box>} />),
        renderVariantCard('IDE Layout', <SplitPane initialSize={24} minSize={15} maxSize={45} dividerSize={10} snapPoints={[20, 33]} sx={{ minHeight: 190, bgcolor: '#0f172a', color: '#e5e7eb' }} first={<Box sx={{ p: 2 }}>Files<br />src<br />demo</Box>} second={<Box sx={{ p: 2, fontFamily: 'monospace' }}>function build() {'{'}<br />  return 'wow'<br />{'}'}</Box>} />)
      ],
      FloatingToolbar: [
        renderVariantCard('Selection', <Box sx={{ minHeight: 130, p: 2, bgcolor: '#f8fafc' }}><Typography color="text.secondary">Select text in the main preview to see it anchor to a selection rectangle.</Typography></Box>),
        renderVariantCard('Element Anchor', <Box sx={{ position: 'relative', minHeight: 130, display: 'grid', placeItems: 'center' }}><Button ref={floatingToolbarButtonRef} variant="contained" onClick={() => setFloatingToolbarElementOpen((open) => !open)}>Anchor</Button><FloatingToolbar open={floatingToolbarElementOpen} anchorEl={floatingToolbarButtonRef.current}><Button size="small" color="inherit">Edit</Button><Button size="small" color="inherit">Copy</Button></FloatingToolbar></Box>),
        renderVariantCard('Bottom Tools', <Box sx={{ position: 'relative', minHeight: 130, display: 'grid', placeItems: 'center' }}><Button variant="outlined" ref={floatingToolbarBottomButtonRef} onClick={() => setFloatingToolbarBottomOpen((open) => !open)}>Open</Button><FloatingToolbar open={floatingToolbarBottomOpen} anchorEl={floatingToolbarBottomButtonRef.current} placement="bottom" offset={10}><Button size="small" color="inherit">Pin</Button><Button size="small" color="inherit">Share</Button></FloatingToolbar></Box>)
      ],
      SmartTooltip: [
        renderVariantCard('Text', <Box sx={{ minHeight: 120, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Helpful detail" content="Extra context without leaving the flow."><Button variant="outlined">Hover</Button></SmartTooltip></Box>),
        renderVariantCard('Copy', <Box sx={{ minHeight: 120, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Install" content="Copy the package command." copyText="npm install @mickyballadelli/react-things" placement="bottom"><Button variant="outlined">Copy tooltip</Button></SmartTooltip></Box>),
        renderVariantCard('Media Actions', <Box sx={{ minHeight: 140, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Preview card" content="Media, actions, and pin mode." media={<Box sx={{ height: 90, backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />} actions={[{ id: 'open', label: 'Open' }]} defaultPinned><Button variant="contained">Pinned</Button></SmartTooltip></Box>)
      ],
      MagneticCard: [
        renderVariantCard('Soft', <MagneticCard strength={10} tilt={4} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>Soft pull</MagneticCard>),
        renderVariantCard('Tilt', <MagneticCard strength={18} tilt={12} lift={10} sx={{ p: 2, borderRadius: 2, bgcolor: '#dbeafe' }}>Tilt card</MagneticCard>),
        renderVariantCard('Glare', <MagneticCard strength={24} tilt={16} lift={16} glare sx={{ p: 3, borderRadius: 2, color: '#fff', background: 'linear-gradient(135deg,#2563eb,#db2777)' }}>Premium card</MagneticCard>)
      ],
      SpotlightPanel: [
        renderVariantCard('Small', <SpotlightPanel radius={90} sx={{ minHeight: 130, p: 2, color: '#fff', bgcolor: '#111827' }}>Small spotlight</SpotlightPanel>),
        renderVariantCard('Wide', <SpotlightPanel radius={180} dim={0.55} sx={{ minHeight: 130, p: 2, color: '#fff', bgcolor: '#172554' }}>Wide spotlight</SpotlightPanel>),
        renderVariantCard('Dark', <SpotlightPanel radius={140} dim={0.84} sx={{ minHeight: 130, p: 2, color: '#fff', bgcolor: '#020617' }}>Deep reveal</SpotlightPanel>)
      ],
      NodeCanvas: [
        renderVariantCard('Free Drag', <NodeCanvas nodes={[{ id: 'a', label: 'A', x: 24, y: 38 }, { id: 'b', label: 'B', x: 190, y: 72 }]} connections={[{ from: 'a', to: 'b' }]} sx={{ minHeight: 180 }} />),
        renderVariantCard('Grid Snap', <NodeCanvas showGrid snapToGrid gridSize={24} connectionStyle="step" nodes={[{ id: 'a', label: 'Input', x: 24, y: 48 }, { id: 'b', label: 'Output', x: 216, y: 96 }]} connections={[{ from: 'a', to: 'b', color: '#2563eb' }]} sx={{ minHeight: 180 }} />),
        renderVariantCard('Readonly Map', <NodeCanvas mode="readonly" selectedNodeId="b" connectionStyle="curved" nodes={[{ id: 'a', label: 'Plan', x: 20, y: 30, color: '#dbeafe' }, { id: 'b', label: 'Build', x: 170, y: 90, color: '#dcfce7' }, { id: 'c', label: 'Ship', x: 320, y: 35, color: '#fee2e2' }]} connections={[{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }]} sx={{ minHeight: 180 }} />),
        renderVariantCard('Compact Nodes', <NodeCanvas nodeWidth={96} nodeHeight={42} nodes={[{ id: 'a', label: 'In', x: 30, y: 50 }, { id: 'b', label: 'Out', x: 170, y: 50 }]} connections={[{ from: 'a', to: 'b' }]} sx={{ minHeight: 170 }} />),
        renderVariantCard('Custom Render', <NodeCanvas nodeWidth={150} nodeHeight={68} connectionStyle="curved" nodes={[{ id: 'a', label: 'API', x: 20, y: 40, color: '#eff6ff' }, { id: 'b', label: 'Worker', x: 220, y: 90, color: '#f0fdf4' }]} connections={[{ from: 'a', to: 'b', color: '#059669' }]} renderNode={(node, selected) => <Box sx={{ textAlign: 'center' }}><Typography fontWeight={900}>{node.label}</Typography><Typography variant="caption" color={selected ? 'primary.main' : 'text.secondary'}>{selected ? 'selected' : 'service'}</Typography></Box>} sx={{ minHeight: 190 }} />),
        renderVariantCard('Editor Tools', <NodeCanvas editableTools showGrid snapToGrid linkTypes={['line', 'curved', 'step', 'ellipse']} nodes={[{ id: 'a', label: 'Box A', x: 24, y: 44, color: '#dbeafe' }, { id: 'b', label: 'Box B', x: 196, y: 100, color: '#dcfce7' }]} connections={[{ from: 'a', to: 'b', type: 'curved', label: 'uses', color: '#2563eb' }]} sx={{ minHeight: 260 }} />)
      ],
      BeforeAfterSlider: [
        renderVariantCard('50/50', <BeforeAfterSlider sx={{ minHeight: 140 }} before={<Box sx={{ height: '100%', bgcolor: '#2563eb' }} />} after={<Box sx={{ height: '100%', bgcolor: '#f59e0b' }} />} />),
        renderVariantCard('Before Heavy', <BeforeAfterSlider initialPosition={70} sx={{ minHeight: 140 }} before={<Box sx={{ height: '100%', bgcolor: '#059669' }} />} after={<Box sx={{ height: '100%', bgcolor: '#db2777' }} />} />),
        renderVariantCard('Content', <BeforeAfterSlider initialPosition={35} sx={{ minHeight: 140 }} before={<Box sx={{ p: 2, height: '100%', bgcolor: '#dbeafe' }}>Before</Box>} after={<Box sx={{ p: 2, height: '100%', bgcolor: '#fee2e2' }}>After</Box>} />)
      ],
      InfiniteCanvas: [
        renderVariantCard('Pan Zoom', <InfiniteCanvas items={[{ id: 'a', label: 'A', x: 20, y: 40 }, { id: 'b', label: 'B', x: 240, y: 120, color: '#dcfce7' }]} sx={{ minHeight: 220 }} />),
        renderVariantCard('No Minimap', <InfiniteCanvas showMinimap={false} items={[{ id: 'a', label: 'Card', x: 40, y: 40, color: '#dbeafe' }, { id: 'b', label: 'Note', x: 260, y: 160, color: '#fef3c7' }]} sx={{ minHeight: 220 }} />),
        renderVariantCard('Custom Items', <InfiniteCanvas defaultViewport={{ x: 30, y: 30, zoom: 0.9 }} items={[{ id: 'a', label: 'API', x: 40, y: 50, color: '#eff6ff' }, { id: 'b', label: 'Worker', x: 290, y: 160, color: '#f0fdf4' }]} renderItem={(item, selected) => <Box sx={{ textAlign: 'center' }}><Typography fontWeight={900}>{item.label}</Typography><Typography variant="caption" color={selected ? 'primary.main' : 'text.secondary'}>{selected ? 'selected' : 'drag me'}</Typography></Box>} sx={{ minHeight: 240 }} />)
      ],
      ResizableFrame: [
        renderVariantCard('Small', <ResizableFrame initialWidth={180} initialHeight={120}>Small</ResizableFrame>),
        renderVariantCard('Content', <ResizableFrame initialWidth={240} initialHeight={150}><Box sx={{ p: 2 }}>Resizable content</Box></ResizableFrame>),
        renderVariantCard('Large Min', <ResizableFrame initialWidth={280} initialHeight={170} minWidth={220} minHeight={140}><Box sx={{ p: 2 }}>Min size</Box></ResizableFrame>)
      ],
      InspectorPanel: [
        renderVariantCard('Text', <Stack spacing={1.5}><InspectorPanel title="Text prop" density="compact" showValueSummary={false} fields={[{ id: 'title', label: 'Title', type: 'text', value: inspectorTextTitle, defaultValue: 'Demo card' }]} onChange={(_, value) => setInspectorTextTitle(String(value))} /><Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}><Typography fontWeight={900}>{inspectorTextTitle}</Typography></Paper></Stack>),
        renderVariantCard('Number', <Stack spacing={1.5}><InspectorPanel title="Number prop" density="compact" showValueSummary={false} fields={[{ id: 'size', label: 'Size', type: 'number', value: inspectorNumberSize, defaultValue: 48, min: 24, max: 72, step: 2, unit: 'px' }]} onChange={(_, value) => setInspectorNumberSize(Number(value))} /><Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}><Typography fontWeight={900} sx={{ fontSize: inspectorNumberSize, lineHeight: 1 }}>Aa</Typography></Paper></Stack>),
        renderVariantCard('Mixed', <InspectorPanel fields={inspectorFields} onChange={(id, value) => setInspectorFields((fields) => fields.map((field) => field.id === id ? { ...field, value } : field))} />)
      ],
      ColorPicker: [
        renderVariantCard('Simple', <ColorPicker value={pickerColor} onChange={setPickerColor} showValue={false} />),
        renderVariantCard('Alpha', <ColorPicker value={pickerColor} alpha={pickerAlpha} onChange={setPickerColor} onAlphaChange={setPickerAlpha} />),
        renderVariantCard('Swatches', <ColorPicker value={pickerColor} alpha={pickerAlpha} swatches={['#111827', '#2563eb', '#f59e0b', '#10b981']} onChange={setPickerColor} onAlphaChange={setPickerAlpha} />)
      ],
      TimelineScrubber: [
        renderVariantCard('Simple', <TimelineScrubber duration={90} defaultValue={22} preview={false} />),
        renderVariantCard('Markers', <TimelineScrubber duration={120} defaultValue={36} markers={[{ id: 'a', time: 15, label: 'Intro' }, { id: 'b', time: 58, label: 'Demo', color: '#059669' }, { id: 'c', time: 96, label: 'End', color: '#db2777' }]} />),
        renderVariantCard('Thumbnails', <TimelineScrubber duration={100} defaultValue={44} markers={[{ id: 'cut', time: 44, label: 'Cut', color: '#2563eb' }]} thumbnails={[{ time: 0, thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'left' }} /> }, { time: 50, thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} /> }, { time: 100, thumbnail: <Box sx={{ height: '100%', backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'right' }} /> }]} />),
        renderVariantCard('Custom Time', <TimelineScrubber duration={24} defaultValue={8} step={0.25} formatTime={(time) => `${time.toFixed(2)}s`} markers={[{ id: 'beat', time: 8, label: 'Beat', color: '#7c3aed' }]} />)
      ],
      FileDropZone: [
        renderVariantCard('Default', <FileDropZone />),
        renderVariantCard('Callback', <FileDropZone onFiles={() => {}} />),
        renderVariantCard('Styled', <FileDropZone sx={{ bgcolor: '#eef2ff', borderColor: '#6366f1' }} />)
      ]
    }

    return variants[selectedComponent.name] ?? Object.entries(common).map(([title, body]) => renderVariantCard(title, body))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
        bgcolor: 'background.default'
      }}
    >
      <Box
        component="aside"
        sx={{
          borderRight: { xs: 0, md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: 'divider',
          bgcolor: 'background.paper',
          p: 2
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            component="img"
            src="/react-things-icon.png"
            alt=""
            sx={{
              width: 72,
              height: 72,
              borderRadius: 1,
              objectFit: 'cover',
              border: 1,
              borderColor: 'divider'
            }}
          />
          <Typography variant="h5" component="h1" fontWeight={800}>
            React Things
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Components
        </Typography>

        <CommandPalette
          variant="tree"
          dense
          items={componentDocs.map((component) => ({
            id: component.name,
            label: component.name,
            group: getComponentGroup(component.name),
            description: component.summary,
            keywords: [component.summary, component.description]
          }))}
          selectedId={selectedComponent.name}
          placeholder="Search components"
          defaultExpandedGroups={['Display', 'Layout', 'Input', 'Effects']}
          onSelect={(item) => {
            setSelectedComponentName(item.id)
            setSelectedSampleLabel(sampleTabs[0])
          }}
        />
      </Box>

      <Box component="main" sx={{ p: { xs: 2, md: 4 }, minWidth: 0 }}>
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography variant="h3" component="h2" fontWeight={850}>
                {selectedComponent.name}
              </Typography>
              <Chip label="component" size="small" />
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {selectedComponent.summary}
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 820 }}>
              {selectedComponent.description}
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1 }}>
            {renderPreview()}
          </Paper>

          <Box>
            <Typography variant="h5" component="h3" fontWeight={800}>
              Variants
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 2,
                mt: 1.5
              }}
            >
              {renderVariants()}
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" component="h3" fontWeight={800}>
              Code Samples
            </Typography>
            <Paper variant="outlined" sx={{ mt: 1.5, borderRadius: 1, overflow: 'hidden' }}>
              <Tabs
                value={selectedSampleLabel}
                onChange={(_, nextSampleLabel: string) => setSelectedSampleLabel(nextSampleLabel)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                {selectedSamples.map((sample) => (
                  <Tab key={sample.label} label={sample.label} value={sample.label} />
                ))}
              </Tabs>

              <Box sx={{ p: 2 }}>
                {selectedSamples.map((sample) => {
                  const sampleKey = `${selectedComponent.name}:${sample.label}`

                  return (
                    <Box
                      key={sample.label}
                      role="tabpanel"
                      hidden={selectedSampleLabel !== sample.label}
                    >
                      {selectedSampleLabel === sample.label ? (
                        <CodeViewer
                          label={sample.label}
                          language={sample.language}
                          value={sampleCode[sampleKey] ?? sample.initialCode ?? ''}
                          onChange={(nextCode) => updateSample(nextCode, sample.label)}
                        />
                      ) : null}
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h5" component="h3" fontWeight={800}>
              Props
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1.5, borderRadius: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Default</TableCell>
                    <TableCell>Possible Values</TableCell>
                    <TableCell>Explanation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedComponent.props.map((prop) => (
                    <TableRow key={prop.name}>
                      <TableCell>
                        <Typography component="code" fontFamily="monospace">
                          {prop.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography component="code" fontFamily="monospace">
                          {prop.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography component="code" fontFamily="monospace">
                          {prop.defaultValue}
                        </Typography>
                      </TableCell>
                      <TableCell>{prop.possibleValues}</TableCell>
                      <TableCell>{prop.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
