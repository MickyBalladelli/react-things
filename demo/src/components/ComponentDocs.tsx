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
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import {
  BeforeAfterSlider,
  BulkActionBar,
  CodeViewer,
  ColorPicker,
  ColorStudio,
  CommandDock,
  CommandPalette,
  CommandTimeline,
  CompareStack,
  DataCardGrid,
  DataLens,
  DensityController,
  DiffViewer,
  DockBar,
  DockTabs,
  DropComposer,
  DraggableBox,
  EntityPicker,
  FileDropZone,
  FocusRing,
  FloatingToolbar,
  FlowBuilder,
  GlassBox,
  InfiniteCanvas,
  InspectorDrawer,
  InspectorPanel,
  KanbanBoard,
  LayoutSwitcher,
  MagneticCard,
  MiniMapNavigator,
  MorphMenu,
  NodeCanvas,
  PeekPanel,
  PresenceCursors,
  ResizableDashboard,
  ResizableFrame,
  SelectionBox,
  SmartBreadcrumbs,
  SmartTooltip,
  SplitPane,
  SpotlightSearch,
  StatusRail,
  SpotlightPanel,
  TimelineScrubber,
  ToastCenter,
  TourGuide
} from '@mickyballadelli/react-things'
import type { BulkActionBarAction, ColorStudioColor, CommandDockItem, DataCardGridMetric, DataLensColumn, DockTab, DropComposerItem, FlowBuilderConnection, FlowBuilderNode, InspectorDrawerFieldValue, InspectorDrawerSection, InspectorPanelField, KanbanColumn, LayoutSwitcherItem, MorphMenuItem, PresenceCursorUser, ResizableDashboardWidget, SmartBreadcrumbItem, SpotlightSearchItem, StatusRailGroup, ToastCenterToast, TourGuideStep } from '@mickyballadelli/react-things'
import { DraggableGlassBoxPreview } from './DraggableGlassBoxPreview'

declare const __REACT_THINGS_VERSION__: string

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

type FocusRingConfig = {
  pulseSize: number
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
    MorphMenu: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import Button from '@mui/material/Button'
import { MorphMenu } from '@mickyballadelli/react-things'

const items = [
  { id: 'copy', label: 'Copy', icon: 'C', onClick: () => console.log('copy') },
  { id: 'share', label: 'Share', icon: 'S', onClick: () => console.log('share') },
  { id: 'archive', label: 'Archive', icon: 'A', onClick: () => console.log('archive') }
]

export function Example() {
  return (
    <MorphMenu items={items}>
      <Button variant="contained">Open menu</Button>
    </MorphMenu>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import Button from '@mui/material/Button'
import { MorphMenu, type MorphMenuItem } from '@mickyballadelli/react-things'

const items: MorphMenuItem[] = [
  { id: 'copy', label: 'Copy', icon: 'C', onClick: () => console.log('copy') },
  { id: 'share', label: 'Share', icon: 'S', onClick: () => console.log('share') },
  { id: 'archive', label: 'Archive', icon: 'A', onClick: () => console.log('archive') }
]

export function Example() {
  return (
    <MorphMenu items={items} radius={124} startAngle={-170} endAngle={-10}>
      <Button variant="contained">Open menu</Button>
    </MorphMenu>
  )
}`
      }
    ],
    DockTabs: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { DockTabs } from '@mickyballadelli/react-things'

const initialTabs = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'docs', label: 'Docs', icon: 'D', preview: 'Documentation' },
  { id: 'settings', label: 'Settings', icon: 'S', preview: 'App settings' }
]

export function Example() {
  const [tabs, setTabs] = useState(initialTabs)
  const [activeId, setActiveId] = useState('home')

  return (
    <DockTabs
      tabs={tabs}
      activeId={activeId}
      onTabsChange={setTabs}
      onActiveChange={(tab) => setActiveId(tab.id)}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { DockTabs, type DockTab } from '@mickyballadelli/react-things'

const initialTabs: DockTab[] = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'docs', label: 'Docs', icon: 'D', preview: 'Documentation' },
  { id: 'settings', label: 'Settings', icon: 'S', preview: 'App settings' }
]

export function Example() {
  const [tabs, setTabs] = useState<DockTab[]>(initialTabs)
  const [activeId, setActiveId] = useState('home')

  return (
    <DockTabs
      tabs={tabs}
      activeId={activeId}
      onTabsChange={setTabs}
      onActiveChange={(tab) => setActiveId(tab.id)}
    />
  )
}`
      }
    ],
    CommandDock: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { CommandDock } from '@mickyballadelli/react-things'

const items = [
  { id: 'inbox', label: 'Inbox', group: 'Workspace', icon: <InboxOutlinedIcon /> },
  {
    id: 'projects',
    label: 'Projects',
    group: 'Workspace',
    icon: <FolderOutlinedIcon />,
    children: [
      { id: 'roadmap', label: 'Roadmap', icon: <FolderOutlinedIcon /> },
      { id: 'launch', label: 'Launch', icon: <FolderOutlinedIcon /> }
    ]
  },
  { id: 'settings', label: 'Settings', group: 'System', icon: <SettingsOutlinedIcon /> }
]

export function Example() {
  const [selectedId, setSelectedId] = useState('inbox')

  return (
    <CommandDock
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
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { CommandDock, type CommandDockItem } from '@mickyballadelli/react-things'

const items: CommandDockItem[] = [
  { id: 'inbox', label: 'Inbox', group: 'Workspace', icon: <InboxOutlinedIcon /> },
  {
    id: 'projects',
    label: 'Projects',
    group: 'Workspace',
    icon: <FolderOutlinedIcon />,
    children: [
      { id: 'roadmap', label: 'Roadmap', icon: <FolderOutlinedIcon /> },
      { id: 'launch', label: 'Launch', icon: <FolderOutlinedIcon /> }
    ]
  },
  { id: 'settings', label: 'Settings', group: 'System', icon: <SettingsOutlinedIcon /> }
]

export function Example() {
  const [selectedId, setSelectedId] = useState('inbox')

  return (
    <CommandDock
      items={items}
      selectedId={selectedId}
      persistKey="app-command-dock"
      onSelect={(item) => setSelectedId(item.id)}
    />
  )
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
    FlowBuilder: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { FlowBuilder } from '@mickyballadelli/react-things'

const nodes = [
  { id: 'trigger', label: 'New signup', x: 48, y: 120, outputs: [{ id: 'event', label: 'Event', type: 'event' }] },
  { id: 'enrich', label: 'Enrich user', x: 330, y: 80, inputs: [{ id: 'event', label: 'Event', type: 'event' }], outputs: [{ id: 'data', label: 'Profile', type: 'data' }] },
  { id: 'email', label: 'Send email', x: 610, y: 120, inputs: [{ id: 'profile', label: 'Profile', type: 'data' }] }
]

const connections = [
  { id: 'a', fromNodeId: 'trigger', fromPortId: 'event', toNodeId: 'enrich', toPortId: 'event', type: 'event' },
  { id: 'b', fromNodeId: 'enrich', fromPortId: 'data', toNodeId: 'email', toPortId: 'profile', type: 'data' }
]

export function Example() {
  const [flowNodes, setFlowNodes] = useState(nodes)
  const [flowConnections, setFlowConnections] = useState(connections)

  return <FlowBuilder nodes={flowNodes} connections={flowConnections} onNodesChange={setFlowNodes} onConnectionsChange={setFlowConnections} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { FlowBuilder, type FlowBuilderConnection, type FlowBuilderNode } from '@mickyballadelli/react-things'

const nodes: FlowBuilderNode[] = [
  { id: 'trigger', label: 'New signup', x: 48, y: 120, outputs: [{ id: 'event', label: 'Event', type: 'event' }] },
  { id: 'enrich', label: 'Enrich user', x: 330, y: 80, inputs: [{ id: 'event', label: 'Event', type: 'event' }], outputs: [{ id: 'data', label: 'Profile', type: 'data' }] },
  { id: 'email', label: 'Send email', x: 610, y: 120, inputs: [{ id: 'profile', label: 'Profile', type: 'data' }] }
]

const connections: FlowBuilderConnection[] = [
  { id: 'a', fromNodeId: 'trigger', fromPortId: 'event', toNodeId: 'enrich', toPortId: 'event', type: 'event' },
  { id: 'b', fromNodeId: 'enrich', fromPortId: 'data', toNodeId: 'email', toPortId: 'profile', type: 'data' }
]

export function Example() {
  const [flowNodes, setFlowNodes] = useState<FlowBuilderNode[]>(nodes)
  const [flowConnections, setFlowConnections] = useState<FlowBuilderConnection[]>(connections)

  return <FlowBuilder nodes={flowNodes} connections={flowConnections} onNodesChange={setFlowNodes} onConnectionsChange={setFlowConnections} />
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
    InspectorDrawer: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { Button } from '@mui/material'
import { InspectorDrawer } from '@mickyballadelli/react-things'

const initialSections = [
  {
    id: 'content',
    title: 'Content',
    fields: [
      { id: 'title', label: 'Title', type: 'text', value: 'Launch card', validate: (value) => String(value).length < 3 ? 'Use at least 3 characters' : null },
      { id: 'enabled', label: 'Enabled', type: 'boolean', value: true }
    ]
  },
  {
    id: 'style',
    title: 'Style',
    fields: [
      { id: 'width', label: 'Width', type: 'number', value: 320, min: 180, max: 520, unit: 'px' },
      { id: 'tone', label: 'Tone', type: 'select', value: 'Calm', options: [{ label: 'Calm', value: 'Calm' }, { label: 'Bold', value: 'Bold' }] }
    ]
  }
]

export function Example() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState(initialSections)

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>Open inspector</Button>
      <InspectorDrawer
        open={open}
        onClose={() => setOpen(false)}
        sections={sections}
        onSectionsChange={setSections}
      />
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { Button } from '@mui/material'
import { InspectorDrawer, type InspectorDrawerSection } from '@mickyballadelli/react-things'

const initialSections: InspectorDrawerSection[] = [
  {
    id: 'content',
    title: 'Content',
    fields: [
      { id: 'title', label: 'Title', type: 'text', value: 'Launch card', validate: (value) => String(value).length < 3 ? 'Use at least 3 characters' : null },
      { id: 'enabled', label: 'Enabled', type: 'boolean', value: true }
    ]
  },
  {
    id: 'style',
    title: 'Style',
    fields: [
      { id: 'width', label: 'Width', type: 'number', value: 320, min: 180, max: 520, unit: 'px' },
      { id: 'tone', label: 'Tone', type: 'select', value: 'Calm', options: [{ label: 'Calm', value: 'Calm' }, { label: 'Bold', value: 'Bold' }] }
    ]
  }
]

export function Example() {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<InspectorDrawerSection[]>(initialSections)

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>Open inspector</Button>
      <InspectorDrawer
        open={open}
        onClose={() => setOpen(false)}
        sections={sections}
        onSectionsChange={setSections}
      />
    </>
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
    ColorStudio: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { ColorStudio } from '@mickyballadelli/react-things'

const colors = [
  { id: 'brand', name: 'Brand', value: '#2563eb' },
  { id: 'accent', name: 'Accent', value: '#db2777' },
  { id: 'surface', name: 'Surface', value: '#f8fafc' }
]

export function Example() {
  return (
    <ColorStudio
      initialColors={colors}
      tokenFormat="css"
      onColorsChange={(nextColors) => console.log(nextColors)}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { ColorStudio, type ColorStudioColor } from '@mickyballadelli/react-things'

const colors: ColorStudioColor[] = [
  { id: 'brand', name: 'Brand', value: '#2563eb' },
  { id: 'accent', name: 'Accent', value: '#db2777' },
  { id: 'surface', name: 'Surface', value: '#f8fafc' }
]

export function Example() {
  return (
    <ColorStudio
      initialColors={colors}
      tokenFormat="json"
      onColorsChange={(nextColors) => console.log(nextColors)}
    />
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
    SelectionBox: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { Box } from '@mui/material'
import { SelectionBox } from '@mickyballadelli/react-things'

const files = ['Roadmap', 'Assets', 'Launch', 'Billing', 'Research', 'Support']

export function Example() {
  const [selectedIds, setSelectedIds] = useState([])

  return (
    <SelectionBox
      selectedIds={selectedIds}
      onSelectionChange={(change) => setSelectedIds(change.selectedIds)}
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, p: 2 }}
    >
      {files.map((file) => (
        <Box key={file} data-selection-id={file} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          {file}
        </Box>
      ))}
    </SelectionBox>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { Box } from '@mui/material'
import { SelectionBox, type SelectionBoxChange } from '@mickyballadelli/react-things'

const files = ['Roadmap', 'Assets', 'Launch', 'Billing', 'Research', 'Support']

export function Example() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function updateSelection(change: SelectionBoxChange) {
    setSelectedIds(change.selectedIds)
  }

  return (
    <SelectionBox
      selectedIds={selectedIds}
      onSelectionChange={updateSelection}
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, p: 2 }}
    >
      {files.map((file) => (
        <Box key={file} data-selection-id={file} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          {file}
        </Box>
      ))}
    </SelectionBox>
  )
}`
      }
    ],
    BulkActionBar: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { Box } from '@mui/material'
import { BulkActionBar, SelectionBox } from '@mickyballadelli/react-things'

const items = ['Roadmap', 'Assets', 'Launch', 'Billing']

export function Example() {
  const [selectedIds, setSelectedIds] = useState(['Roadmap'])

  return (
    <Box>
      <BulkActionBar
        selectedIds={selectedIds}
        totalCount={items.length}
        onClear={() => setSelectedIds([])}
        actions={[{ id: 'archive', label: 'Archive' }, { id: 'delete', label: 'Delete', tone: 'danger' }]}
      />
      <SelectionBox selectedIds={selectedIds} onSelectionChange={(change) => setSelectedIds(change.selectedIds)}>
        {items.map((item) => <Box key={item} data-selection-id={item}>{item}</Box>)}
      </SelectionBox>
    </Box>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { Box } from '@mui/material'
import { BulkActionBar, SelectionBox, type BulkActionBarAction } from '@mickyballadelli/react-things'

const items = ['Roadmap', 'Assets', 'Launch', 'Billing']

export function Example() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['Roadmap'])
  const actions: BulkActionBarAction[] = [
    { id: 'archive', label: 'Archive' },
    { id: 'delete', label: 'Delete', tone: 'danger' }
  ]

  return (
    <Box>
      <BulkActionBar selectedIds={selectedIds} totalCount={items.length} actions={actions} onClear={() => setSelectedIds([])} />
      <SelectionBox selectedIds={selectedIds} onSelectionChange={(change) => setSelectedIds(change.selectedIds)}>
        {items.map((item) => <Box key={item} data-selection-id={item}>{item}</Box>)}
      </SelectionBox>
    </Box>
  )
}`
      }
    ],
    PresenceCursors: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { Box } from '@mui/material'
import { PresenceCursors } from '@mickyballadelli/react-things'

const users = [
  { id: 'ada', name: 'Ada', x: 24, y: 34, color: '#2563eb', selection: { x: 16, y: 24, width: 28, height: 22, label: 'Editing' } },
  { id: 'lin', name: 'Lin', x: 68, y: 58, color: '#db2777', status: 'idle' }
]

export function Example() {
  return (
    <PresenceCursors users={users} sx={{ minHeight: 280, bgcolor: '#f8fafc' }}>
      <Box sx={{ p: 3 }}>Shared canvas content</Box>
    </PresenceCursors>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { Box } from '@mui/material'
import { PresenceCursors, type PresenceCursorUser } from '@mickyballadelli/react-things'

const users: PresenceCursorUser[] = [
  { id: 'ada', name: 'Ada', x: 24, y: 34, color: '#2563eb', selection: { x: 16, y: 24, width: 28, height: 22, label: 'Editing' } },
  { id: 'lin', name: 'Lin', x: 68, y: 58, color: '#db2777', status: 'idle' }
]

export function Example() {
  return (
    <PresenceCursors users={users} sx={{ minHeight: 280, bgcolor: '#f8fafc' }}>
      <Box sx={{ p: 3 }}>Shared canvas content</Box>
    </PresenceCursors>
  )
}`
      }
    ],
    StatusRail: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { StatusRail } from '@mickyballadelli/react-things'

const groups = [
  { id: 'api', label: 'API', status: 'operational', uptime: 99.99, latency: 142 },
  {
    id: 'jobs',
    label: 'Workers',
    status: 'incident',
    uptime: 98.72,
    latency: 410,
    incidents: [{ id: 'queue', title: 'Queue delay', message: 'Backlog above threshold' }]
  }
]

export function Example() {
  return <StatusRail title="Production" groups={groups} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { StatusRail, type StatusRailGroup } from '@mickyballadelli/react-things'

const groups: StatusRailGroup[] = [
  { id: 'api', label: 'API', status: 'operational', uptime: 99.99, latency: 142 },
  {
    id: 'jobs',
    label: 'Workers',
    status: 'incident',
    uptime: 98.72,
    latency: 410,
    incidents: [{ id: 'queue', title: 'Queue delay', message: 'Backlog above threshold' }]
  }
]

export function Example() {
  return <StatusRail title="Production" groups={groups} compact />
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
    ToastCenter: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import Button from '@mui/material/Button'
import { ToastCenter } from '@mickyballadelli/react-things'

export function Example() {
  const [toasts, setToasts] = useState([
    { id: 'deploy', title: 'Deploy complete', message: 'Production is live.', tone: 'success', group: 'deploys' }
  ])

  return (
    <>
      <Button onClick={() => setToasts([{ id: crypto.randomUUID(), title: 'Build queued', tone: 'info', group: 'builds' }, ...toasts])}>
        Add toast
      </Button>
      <ToastCenter toasts={toasts} onToastsChange={setToasts} />
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import Button from '@mui/material/Button'
import { ToastCenter, type ToastCenterToast } from '@mickyballadelli/react-things'

export function Example() {
  const [toasts, setToasts] = useState<ToastCenterToast[]>([
    { id: 'deploy', title: 'Deploy complete', message: 'Production is live.', tone: 'success', group: 'deploys' }
  ])

  return (
    <>
      <Button onClick={() => setToasts([{ id: crypto.randomUUID(), title: 'Build queued', tone: 'info', group: 'builds' }, ...toasts])}>
        Add toast
      </Button>
      <ToastCenter toasts={toasts} onToastsChange={setToasts} />
    </>
  )
}`
      }
    ],
    TourGuide: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import Button from '@mui/material/Button'
import { TourGuide } from '@mickyballadelli/react-things'

const steps = [
  { id: 'start', title: 'Start here', content: 'This is the first action.', target: '#tour-start' },
  { id: 'branch', title: 'Choose path', content: 'Branch to the next useful step.', target: '#tour-branch', branches: [{ label: 'Settings', stepId: 'settings' }] },
  { id: 'settings', title: 'Settings', content: 'Tune the experience here.', target: '#tour-settings' }
]

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button id="tour-start" onClick={() => setOpen(true)}>Start tour</Button>
      <Button id="tour-branch">Branch target</Button>
      <Button id="tour-settings">Settings</Button>
      <TourGuide steps={steps} open={open} onOpenChange={setOpen} onComplete={() => setOpen(false)} />
    </>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import Button from '@mui/material/Button'
import { TourGuide, type TourGuideStep } from '@mickyballadelli/react-things'

const steps: TourGuideStep[] = [
  { id: 'start', title: 'Start here', content: 'This is the first action.', target: '#tour-start' },
  { id: 'branch', title: 'Choose path', content: 'Branch to the next useful step.', target: '#tour-branch', branches: [{ label: 'Settings', stepId: 'settings' }] },
  { id: 'settings', title: 'Settings', content: 'Tune the experience here.', target: '#tour-settings' }
]

export function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button id="tour-start" onClick={() => setOpen(true)}>Start tour</Button>
      <Button id="tour-branch">Branch target</Button>
      <Button id="tour-settings">Settings</Button>
      <TourGuide steps={steps} open={open} onOpenChange={setOpen} onComplete={() => setOpen(false)} />
    </>
  )
}`
      }
    ],
    FocusRing: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import Button from '@mui/material/Button'
import { FocusRing } from '@mickyballadelli/react-things'

export function Example() {
  return (
      <FocusRing tone="error" active pulseSize={22}>
      <Button variant="outlined">Needs attention</Button>
    </FocusRing>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import Button from '@mui/material/Button'
import { FocusRing, type FocusRingProps } from '@mickyballadelli/react-things'

const ringProps: FocusRingProps = {
  tone: 'warning',
  pulse: true,
  pulseSize: 22,
  active: true
}

export function Example() {
  return (
    <FocusRing {...ringProps}>
      <Button variant="outlined">Check this</Button>
    </FocusRing>
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
    ],
    ResizableDashboard: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { ResizableDashboard } from '@mickyballadelli/react-things'

const widgets = [
  { id: 'revenue', title: 'Revenue', layout: { x: 0, y: 0, w: 4, h: 2 }, children: <strong>€128K</strong> },
  { id: 'traffic', title: 'Traffic', layout: { x: 4, y: 0, w: 4, h: 3 }, children: <div>Live visits</div> },
  { id: 'tasks', title: 'Tasks', layout: { x: 8, y: 0, w: 4, h: 3 }, children: <div>9 open</div> }
]

export function Example() {
  return (
    <ResizableDashboard
      widgets={widgets}
      persistKey="my-dashboard"
      sx={{ minHeight: 420 }}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { ResizableDashboard, type ResizableDashboardWidget } from '@mickyballadelli/react-things'

const widgets: ResizableDashboardWidget[] = [
  { id: 'revenue', title: 'Revenue', layout: { x: 0, y: 0, w: 4, h: 2 }, children: <strong>€128K</strong> },
  { id: 'traffic', title: 'Traffic', layout: { x: 4, y: 0, w: 4, h: 3 }, children: <div>Live visits</div> },
  { id: 'tasks', title: 'Tasks', layout: { x: 8, y: 0, w: 4, h: 3 }, children: <div>9 open</div> }
]

export function Example() {
  return (
    <ResizableDashboard
      widgets={widgets}
      persistKey="my-dashboard"
      onLayoutsChange={(layouts, breakpoint) => console.log(breakpoint, layouts)}
      sx={{ minHeight: 420 }}
    />
  )
}`
      }
    ],
    DataCardGrid: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DataCardGrid } from '@mickyballadelli/react-things'

const metrics = [
  { id: 'revenue', label: 'Revenue', value: 128400, previousValue: 118000, unit: 'EUR', status: 'good', progress: 78, trend: [40, 46, 44, 58, 64, 72, 78] },
  { id: 'orders', label: 'Orders', value: 842, previousValue: 910, status: 'danger', progress: 58, trend: [80, 76, 72, 70, 68, 62, 58] },
  { id: 'conversion', label: 'Conversion', value: 6.8, previousValue: 6.1, unit: '%', status: 'good', progress: 68, trend: [4.8, 5.2, 5.1, 5.8, 6.2, 6.5, 6.8] }
]

export function Example() {
  return <DataCardGrid title="Store pulse" subtitle="Live commercial metrics" metrics={metrics} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DataCardGrid, type DataCardGridMetric } from '@mickyballadelli/react-things'

const metrics: DataCardGridMetric[] = [
  { id: 'revenue', label: 'Revenue', value: 128400, previousValue: 118000, formatter: (value) => \`€\${Number(value).toLocaleString()}\`, status: 'good', progress: 78, trend: [40, 46, 44, 58, 64, 72, 78] },
  { id: 'orders', label: 'Orders', value: 842, previousValue: 910, status: 'danger', progress: 58, trend: [80, 76, 72, 70, 68, 62, 58] },
  { id: 'conversion', label: 'Conversion', value: 6.8, previousValue: 6.1, unit: '%', status: 'good', progress: 68, trend: [4.8, 5.2, 5.1, 5.8, 6.2, 6.5, 6.8] }
]

export function Example() {
  return <DataCardGrid title="Store pulse" subtitle="Live commercial metrics" metrics={metrics} columns={3} />
}`
      }
    ],
    DataLens: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DataLens } from '@mickyballadelli/react-things'

const rows = [
  { id: 'api', name: 'API', owner: 'Platform', status: 'Healthy', load: 72, trend: [40, 48, 55, 61, 72] },
  { id: 'web', name: 'Web', owner: 'Growth', status: 'Watch', load: 58, trend: [64, 62, 61, 59, 58] },
  { id: 'billing', name: 'Billing', owner: 'Core', status: 'Healthy', load: 81, trend: [55, 60, 68, 73, 81] }
]

const columns = [
  { id: 'name', label: 'Service', sortable: true },
  { id: 'owner', label: 'Owner', filterable: true, options: ['Platform', 'Growth', 'Core'] },
  { id: 'status', label: 'Status', filterable: true, options: ['Healthy', 'Watch'] },
  { id: 'load', label: 'Load', sortable: true, chart: 'bar' },
  { id: 'trend', label: 'Trend', chart: 'sparkline' }
]

export function Example() {
  return <DataLens title="Service health" rows={rows} columns={columns} initialSort={{ columnId: 'load', direction: 'desc' }} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DataLens, type DataLensColumn } from '@mickyballadelli/react-things'

type Service = {
  id: string
  name: string
  owner: string
  status: string
  load: number
  trend: number[]
}

const rows: Service[] = [
  { id: 'api', name: 'API', owner: 'Platform', status: 'Healthy', load: 72, trend: [40, 48, 55, 61, 72] },
  { id: 'web', name: 'Web', owner: 'Growth', status: 'Watch', load: 58, trend: [64, 62, 61, 59, 58] },
  { id: 'billing', name: 'Billing', owner: 'Core', status: 'Healthy', load: 81, trend: [55, 60, 68, 73, 81] }
]

const columns: DataLensColumn<Service>[] = [
  { id: 'name', label: 'Service', sortable: true },
  { id: 'owner', label: 'Owner', filterable: true, options: ['Platform', 'Growth', 'Core'] },
  { id: 'status', label: 'Status', filterable: true, options: ['Healthy', 'Watch'] },
  { id: 'load', label: 'Load', sortable: true, chart: 'bar' },
  { id: 'trend', label: 'Trend', chart: 'sparkline' }
]

export function Example() {
  return <DataLens<Service> title="Service health" rows={rows} columns={columns} defaultView="cards" />
}`
      }
    ],
    LayoutSwitcher: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { LayoutSwitcher } from '@mickyballadelli/react-things'

const items = [
  { id: 'brief', title: 'Write brief', status: 'Todo', group: 'Todo', date: new Date(), color: '#dbeafe' },
  { id: 'design', title: 'Design flow', status: 'Doing', group: 'Doing', date: new Date(), color: '#fef3c7' },
  { id: 'ship', title: 'Ship demo', status: 'Done', group: 'Done', date: new Date(), color: '#dcfce7' }
]

export function Example() {
  return <LayoutSwitcher title="Roadmap" items={items} defaultView="cards" />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { LayoutSwitcher, type LayoutSwitcherItem } from '@mickyballadelli/react-things'

const items: LayoutSwitcherItem[] = [
  { id: 'brief', title: 'Write brief', status: 'Todo', group: 'Todo', date: new Date(), color: '#dbeafe' },
  { id: 'design', title: 'Design flow', status: 'Doing', group: 'Doing', date: new Date(), color: '#fef3c7' },
  { id: 'ship', title: 'Ship demo', status: 'Done', group: 'Done', date: new Date(), color: '#dcfce7' }
]

export function Example() {
  return <LayoutSwitcher items={items} views={['table', 'cards', 'kanban', 'calendar', 'list']} />
}`
      }
    ],
    KanbanBoard: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useState } from 'react'
import { KanbanBoard } from '@mickyballadelli/react-things'

const initialColumns = [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'a', title: 'Write brief', description: 'Frame the work.', tags: ['Planning'] }
    ]
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'b', title: 'Build board', description: 'Drag, edit, and ship.', tags: ['UI'] }
    ]
  }
]

export function Example() {
  const [columns, setColumns] = useState(initialColumns)

  return <KanbanBoard title="Roadmap" columns={columns} onChange={setColumns} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useState } from 'react'
import { KanbanBoard, type KanbanColumn } from '@mickyballadelli/react-things'

const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'a', title: 'Write brief', description: 'Frame the work.', tags: ['Planning'] }
    ]
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'b', title: 'Build board', description: 'Drag, edit, and ship.', tags: ['UI'] }
    ]
  }
]

export function Example() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)

  return <KanbanBoard title="Roadmap" columns={columns} onChange={setColumns} />
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
    name: 'DiffViewer',
    summary: 'Beautiful text and object diff with inline comments and accept/reject.',
    description: 'DiffViewer compares plain text or sorted object JSON, groups changes into hunks, supports inline comments, and lets reviewers accept or reject each hunk.',
    props: [
      {
        name: 'before',
        type: 'string | unknown',
        defaultValue: '-',
        possibleValues: 'Text for text mode, any JSON-like value for object mode.',
        description: 'Original value.'
      },
      {
        name: 'after',
        type: 'string | unknown',
        defaultValue: '-',
        possibleValues: 'Text for text mode, any JSON-like value for object mode.',
        description: 'Next value.'
      },
      {
        name: 'mode',
        type: '"text" | "object"',
        defaultValue: '"text"',
        possibleValues: 'text or object.',
        description: 'Chooses raw text diff or stable sorted JSON diff.'
      },
      {
        name: 'comments / defaultComments',
        type: 'DiffViewerComment[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, hunkId, author, body }.',
        description: 'Controlled or uncontrolled inline comments.'
      },
      {
        name: 'decisions / defaultDecisions',
        type: 'Record<string, DiffViewerDecision>',
        defaultValue: '{}',
        possibleValues: 'Map hunk id to accepted or rejected.',
        description: 'Controlled or uncontrolled hunk decisions.'
      },
      {
        name: 'onCommentAdd / onDecisionChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks for reviewer actions.',
        description: 'Receive inline comments and accept/reject actions.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DiffViewer } from '@mickyballadelli/react-things'

const before = 'export const status = "draft"\\nexport const retries = 2'
const after = 'export const status = "ready"\\nexport const retries = 3'

export function Example() {
  return <DiffViewer before={before} after={after} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DiffViewer, type DiffViewerComment } from '@mickyballadelli/react-things'

const comments: DiffViewerComment[] = [
  { id: 'c1', hunkId: 'hunk-1-2-2', author: 'Micky', body: 'Check retry change.' }
]

export function Example() {
  return (
    <DiffViewer
      mode="object"
      before={{ status: 'draft', retries: 2 }}
      after={{ status: 'ready', retries: 3 }}
      defaultComments={comments}
    />
  )
}`
      }
    ]
  },
  {
    name: 'DensityController',
    summary: 'User-facing compact, cozy, and spacious layout controller with persistence.',
    description: 'DensityController lets users choose how dense a layout feels, persists the choice with localStorage, and passes spacing tokens to child content.',
    props: [
      {
        name: 'value / defaultValue',
        type: '"compact" | "cozy" | "spacious"',
        defaultValue: '"cozy"',
        possibleValues: 'compact, cozy, or spacious.',
        description: 'Controlled or initial density value.'
      },
      {
        name: 'persistKey',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any stable localStorage key.',
        description: 'Saves the selected density between visits.'
      },
      {
        name: 'children',
        type: 'ReactNode | (state) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Static content or a render function receiving density, spacing, padding, radius, and rowHeight.',
        description: 'Content wrapped in density CSS variables and optional render state.'
      },
      {
        name: 'onChange',
        type: '(density, state) => void',
        defaultValue: '-',
        possibleValues: 'Function called after a density selection.',
        description: 'Receives the selected density and derived layout tokens.'
      },
      {
        name: 'showSummary / showReset',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Toggles the active-density chip and reset button.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DensityController } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <DensityController persistKey="demo-density">
      {({ spacing, padding, rowHeight }) => (
        <div style={{ display: 'grid', gap: spacing }}>
          <div style={{ padding, minHeight: rowHeight }}>Inbox</div>
          <div style={{ padding, minHeight: rowHeight }}>Roadmap</div>
        </div>
      )}
    </DensityController>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DensityController, type DensityControllerValue } from '@mickyballadelli/react-things'

export function Example() {
  function saveDensity(density: DensityControllerValue) {
    console.log(density)
  }

  return (
    <DensityController
      defaultValue="cozy"
      persistKey="workspace-density"
      onChange={saveDensity}
    />
  )
}`
      }
    ]
  },
  {
    name: 'MiniMapNavigator',
    summary: 'Overview minimap for long pages, canvases, dashboards, and docs.',
    description: 'MiniMapNavigator renders a compact overview of measured sections, shows the current viewport, and lets users click or drag to jump through long content.',
    props: [
      {
        name: 'items',
        type: 'MiniMapNavigatorItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, description, targetId, top, height, color }.',
        description: 'Sections or regions shown in the minimap.'
      },
      {
        name: 'containerRef',
        type: 'RefObject<HTMLElement | null>',
        defaultValue: 'document',
        possibleValues: 'A scroll container ref, or omit for page scrolling.',
        description: 'Element whose scroll position and target sections are measured.'
      },
      {
        name: 'activeId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any item id.',
        description: 'Optional controlled active section.'
      },
      {
        name: 'height',
        type: 'number',
        defaultValue: '280',
        possibleValues: 'Any positive pixel height.',
        description: 'Height of the minimap track.'
      },
      {
        name: 'showLabels / showProgress / sticky',
        type: 'boolean',
        defaultValue: 'true / true / false',
        possibleValues: 'true or false.',
        description: 'Controls labels, progress chip, and sticky positioning.'
      },
      {
        name: 'onActiveChange / onNavigate / onMeasureChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks for section changes, jumps, and scroll measurements.',
        description: 'Receive minimap events.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { useRef } from 'react'
import { MiniMapNavigator } from '@mickyballadelli/react-things'

const items = [
  { id: 'intro', label: 'Intro', targetId: 'intro' },
  { id: 'api', label: 'API', targetId: 'api' },
  { id: 'examples', label: 'Examples', targetId: 'examples' }
]

export function Example() {
  const containerRef = useRef(null)

  return <MiniMapNavigator items={items} containerRef={containerRef} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { useRef } from 'react'
import { MiniMapNavigator, type MiniMapNavigatorItem } from '@mickyballadelli/react-things'

const items: MiniMapNavigatorItem[] = [
  { id: 'overview', label: 'Overview', top: 0, height: 280, color: '#2563eb' },
  { id: 'canvas', label: 'Canvas', top: 320, height: 420, color: '#059669' }
]

export function Example() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  return <MiniMapNavigator items={items} containerRef={containerRef} showLabels={false} />
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
    ...createBasicDoc(
      'DockTabs',
      'Browser-like tabs with drag reorder, left dock drop, overflow, and hover previews.',
      'DockTabs is a compact workspace tab surface where users can drag to reorder in the top dock or drop tabs into a left vertical dock.'
    ),
    props: [
      {
        name: 'tabs',
        type: 'DockTab[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, icon, preview, disabled, dock }.',
        description: 'Tabs shown in the strip.'
      },
      {
        name: 'activeId / defaultActiveId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any tab id.',
        description: 'Controlled or initial active tab.'
      },
      {
        name: 'maxVisible',
        type: 'number',
        defaultValue: '7',
        possibleValues: 'Any positive count.',
        description: 'Visible tab count before tabs move to overflow menu.'
      },
      {
        name: 'allowDrag',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Enables drag reorder.'
      },
      {
        name: 'onTabsChange',
        type: '(tabs: DockTab[]) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving reordered or re-docked tabs.',
        description: 'Called when tab collection changes.'
      },
      {
        name: 'onActiveChange / onDockChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks for tab activity.',
        description: 'Called when users select or move tabs between docks.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'CommandDock',
      'Persistent left command navigation like Linear or Raycast.',
      'CommandDock is a grouped command sidebar with search, tree branches, collapse, active item state, badges, optional footer, and persisted collapse state.'
    ),
    props: [
      {
        name: 'items',
        type: 'CommandDockItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, description, group, icon, badge, keywords, children, onSelect }.',
        description: 'Navigation commands shown in the dock.'
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any item id.',
        description: 'Marks the active command.'
      },
      {
        name: 'title / logo / footer',
        type: 'ReactNode',
        defaultValue: 'CommandDock / C / -',
        possibleValues: 'Any React renderable.',
        description: 'Header title, app icon, and optional footer content.'
      },
      {
        name: 'expandedIds / defaultExpandedIds',
        type: 'string[]',
        defaultValue: '- / all parents',
        possibleValues: 'Any item ids with children.',
        description: 'Controls open tree branches.'
      },
      {
        name: 'collapsed / defaultCollapsed',
        type: 'boolean',
        defaultValue: '- / false',
        possibleValues: 'true or false.',
        description: 'Controlled or initial collapsed state.'
      },
      {
        name: 'width / collapsedWidth',
        type: 'number',
        defaultValue: '280 / 64',
        possibleValues: 'Any positive pixel widths.',
        description: 'Expanded and collapsed sidebar width.'
      },
      {
        name: 'persistKey',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any localStorage key.',
        description: 'Saves collapsed state.'
      },
      {
        name: 'onSelect / onCollapsedChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks for selection and collapse.',
        description: 'Called when users select commands or toggle the dock.'
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
    name: 'CommandTimeline',
    summary: 'Undo and redo history as a visual timeline with jump-to-state.',
    description: 'CommandTimeline shows past, current, and future command states so users can undo, redo, or jump directly to any saved point in history.',
    props: [
      {
        name: 'entries',
        type: 'CommandTimelineEntry[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, description, timestamp, actor, group, icon, color, data }.',
        description: 'History states shown in the timeline.'
      },
      {
        name: 'currentId / defaultCurrentId',
        type: 'string',
        defaultValue: 'last entry',
        possibleValues: 'Any entry id.',
        description: 'Controlled or initial current state.'
      },
      {
        name: 'orientation',
        type: '"vertical" | "horizontal"',
        defaultValue: '"vertical"',
        possibleValues: 'vertical or horizontal.',
        description: 'Timeline layout direction.'
      },
      {
        name: 'showControls / showMetadata',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows undo/redo controls and actor/time metadata.'
      },
      {
        name: 'onChange',
        type: '(entry, reason) => void',
        defaultValue: '-',
        possibleValues: 'Reason is undo, redo, jump, or reset.',
        description: 'Called when the current state changes.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { CommandTimeline } from '@mickyballadelli/react-things'

const entries = [
  { id: 'start', label: 'Created board' },
  { id: 'rename', label: 'Renamed column' },
  { id: 'move', label: 'Moved card' }
]

export function Example() {
  return <CommandTimeline entries={entries} defaultCurrentId="rename" />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { CommandTimeline, type CommandTimelineEntry } from '@mickyballadelli/react-things'

const entries: CommandTimelineEntry[] = [
  { id: 'one', label: 'Import file', group: 'Setup' },
  { id: 'two', label: 'Map columns', group: 'Setup' }
]

export function Example() {
  return <CommandTimeline entries={entries} orientation="horizontal" />
}`
      }
    ]
  },
  {
    ...createBasicDoc(
      'SpotlightSearch',
      'Search box with grouped results, previews, fuzzy matching, and inline actions.',
      'SpotlightSearch is a command-search surface with fuzzy scoring, grouped results, keyboard navigation, a preview pane, and inline item actions for fast navigation or operations.'
    ),
    props: [
      {
        name: 'items',
        type: 'SpotlightSearchItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, description, group, icon, keywords, preview, actions, data }.',
        description: 'Searchable results.'
      },
      {
        name: 'selectedId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any item id.',
        description: 'Controlled active result.'
      },
      {
        name: 'placeholder / emptyText',
        type: 'ReactNode',
        defaultValue: 'Search anything / No results',
        possibleValues: 'Any text or renderable empty state.',
        description: 'Search input placeholder and empty state.'
      },
      {
        name: 'maxResults',
        type: 'number',
        defaultValue: '8',
        possibleValues: 'Any positive result count.',
        description: 'Limits shown results.'
      },
      {
        name: 'fuzzy',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Enables fuzzy character matching.'
      },
      {
        name: 'onSelect / onQueryChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving selected item or query.',
        description: 'Reports selection and query changes.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { SpotlightSearch } from '@mickyballadelli/react-things'

const items = [
  { id: 'dashboard', label: 'Dashboard', group: 'Navigation', description: 'Open team dashboard', keywords: ['home', 'metrics'] },
  { id: 'deploy', label: 'Deploy production', group: 'Actions', description: 'Ship latest build', keywords: ['release'] },
  { id: 'docs', label: 'Docs', group: 'Resources', description: 'Read component docs' }
]

export function Example() {
  return <SpotlightSearch items={items} placeholder="Search commands" />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { SpotlightSearch, type SpotlightSearchItem } from '@mickyballadelli/react-things'

const items: SpotlightSearchItem[] = [
  { id: 'dashboard', label: 'Dashboard', group: 'Navigation', description: 'Open team dashboard', keywords: ['home', 'metrics'] },
  { id: 'deploy', label: 'Deploy production', group: 'Actions', description: 'Ship latest build', actions: [{ id: 'run', label: 'Run' }] },
  { id: 'docs', label: 'Docs', group: 'Resources', description: 'Read component docs' }
]

export function Example() {
  return <SpotlightSearch items={items} maxResults={6} />
}`
      }
    ]
  },
  {
    ...createBasicDoc(
      'SmartBreadcrumbs',
      'Breadcrumbs with previews, command actions, and collapsible path search.',
      'SmartBreadcrumbs turns long paths into an interactive navigation trail with hover previews, action buttons, and searchable collapsed crumbs.'
    ),
    props: [
      {
        name: 'items',
        type: 'SmartBreadcrumbItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, children, labelText, description, href, icon, preview, actions, keywords }.',
        description: 'Path items to render.'
      },
      {
        name: 'currentId',
        type: 'string',
        defaultValue: 'last item id',
        possibleValues: 'Any item id.',
        description: 'Marks the active crumb.'
      },
      {
        name: 'maxVisible',
        type: 'number',
        defaultValue: '4',
        possibleValues: 'Any positive count.',
        description: 'Collapses middle crumbs when the path is longer.'
      },
      {
        name: 'showPreview',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Enables hover and focus preview popovers.'
      },
      {
        name: 'searchPlaceholder / emptyText',
        type: 'ReactNode',
        defaultValue: 'Search path / No matching path',
        possibleValues: 'Any renderable content.',
        description: 'Text for collapsed-path search.'
      },
      {
        name: 'onSelect',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Function receiving selected item.',
        description: 'Called when a breadcrumb or collapsed item is selected.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { Box, Chip, Typography } from '@mui/material'
import { SmartBreadcrumbs } from '@mickyballadelli/react-things'

const items = [
  { id: 'workspace', label: 'Workspace', description: 'Team home' },
  { id: 'product', label: 'Product', description: 'Product area' },
  { id: 'roadmap', label: 'Roadmap', description: 'Planning board' },
  {
    id: 'release',
    children: (
      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
        Release 2.4
        <Chip size="small" label="live" color="success" />
      </Box>
    ),
    labelText: 'Release 2.4 live',
    description: 'Active release train',
    preview: <Typography color="text.secondary">Ship checklist and rollout health.</Typography>,
    actions: [{ id: 'brief', label: 'Open brief' }]
  },
  {
    id: 'assets',
    label: 'Design assets',
    description: 'Images, tokens, and handoff notes',
    preview: <Typography color="text.secondary">Brand colors, mockups, and export tokens.</Typography>,
    actions: [{ id: 'copy', label: 'Copy link' }]
  }
]

export function Example() {
  return <SmartBreadcrumbs items={items} maxVisible={3} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { Box, Chip, Typography } from '@mui/material'
import { SmartBreadcrumbs, type SmartBreadcrumbItem } from '@mickyballadelli/react-things'

const items: SmartBreadcrumbItem[] = [
  { id: 'org', label: 'Acme', description: 'Workspace root', keywords: ['team'] },
  { id: 'product', label: 'Product', description: 'Product area' },
  { id: 'roadmap', label: 'Roadmap', description: 'Planning board' },
  {
    id: 'release',
    children: (
      <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
        Release <strong>2.4</strong>
        <Chip size="small" label="live" color="success" />
      </Box>
    ),
    labelText: 'Release 2.4 live',
    description: 'Active release',
    preview: <Typography color="text.secondary">Rollout checklist and launch owners.</Typography>,
    actions: [{ id: 'copy', label: 'Copy link' }]
  },
  {
    id: 'assets',
    label: 'Design assets',
    description: 'Images, tokens, and handoff notes',
    preview: <Typography color="text.secondary">Brand colors, mockups, and export tokens.</Typography>,
    actions: [{ id: 'open', label: 'Open assets' }]
  }
]

export function Example() {
  return <SmartBreadcrumbs items={items} currentId="assets" maxVisible={3} />
}`
      }
    ]
  },
  {
    ...createBasicDoc(
      'PeekPanel',
      'Hover or click preview panel like IDE peek definition.',
      'PeekPanel anchors a rich preview to any element so users can inspect definitions, files, records, or references without leaving context.'
    ),
    props: [
      {
        name: 'children',
        type: 'ReactElement',
        defaultValue: '-',
        possibleValues: 'Any single focusable or inline React element.',
        description: 'Element that opens the peek panel.'
      },
      {
        name: 'title / subtitle',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any renderable heading content.',
        description: 'Header text for the panel.'
      },
      {
        name: 'content / preview / footer',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any renderable panel content.',
        description: 'Body, preview region, and footer content.'
      },
      {
        name: 'actions',
        type: 'PeekPanelAction[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, label, icon, onClick }.',
        description: 'Command buttons shown in the footer.'
      },
      {
        name: 'trigger',
        type: '"hover" | "click" | "both"',
        defaultValue: 'both',
        possibleValues: 'hover, click, or both.',
        description: 'Controls how the panel opens.'
      },
      {
        name: 'placement',
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: 'bottom',
        possibleValues: 'top, bottom, left, or right.',
        description: 'Preferred panel position.'
      },
      {
        name: 'open / defaultOpen / onOpenChange',
        type: 'boolean / function',
        defaultValue: '-',
        possibleValues: 'Controlled or uncontrolled open state.',
        description: 'Lets parent code control the panel.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { Button, Typography } from '@mui/material'
import { PeekPanel } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <PeekPanel
      title="useProjectStatus"
      subtitle="hooks/useProjectStatus.ts:18"
      content="Peek into a symbol without navigating away."
      preview={<pre>{'export function useProjectStatus(id) {\\n  return queryClient.getQueryData([\\'project\\', id])\\n}'}</pre>}
      actions={[{ id: 'open', label: 'Open file' }]}
    >
      <Button variant="outlined">Peek definition</Button>
    </PeekPanel>
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { Button, Typography } from '@mui/material'
import { PeekPanel, type PeekPanelAction } from '@mickyballadelli/react-things'

const actions: PeekPanelAction[] = [
  { id: 'open', label: 'Open file' },
  { id: 'copy', label: 'Copy path' }
]

export function Example() {
  return (
    <PeekPanel
      trigger="click"
      placement="right"
      title="StatusRail"
      subtitle="components/StatusRail.tsx"
      content={<Typography variant="body2">Operational health rail with live pulse.</Typography>}
      preview={<pre>{'<StatusRail groups={groups} compact />'}</pre>}
      actions={actions}
    >
      <Button variant="contained">Inspect component</Button>
    </PeekPanel>
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
      'FocusRing',
      'Animated focus and validation highlight for any target.',
      'FocusRing gives focused, guided, or invalid elements a stronger visual highlight than the browser outline, with pulse animation and validation tones.'
    ),
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '-',
        possibleValues: 'Any focusable element or wrapped content.',
        description: 'Content wrapped by the animated ring.'
      },
      {
        name: 'target',
        type: 'string | RefObject<HTMLElement | null>',
        defaultValue: '-',
        possibleValues: 'CSS selector or React ref.',
        description: 'Optional external target to follow instead of wrapping children.'
      },
      {
        name: 'active',
        type: 'boolean',
        defaultValue: '-',
        possibleValues: 'true or false.',
        description: 'Forces ring visible. Without active, wrapped mode reacts to focus.'
      },
      {
        name: 'tone',
        type: '"primary" | "success" | "warning" | "error"',
        defaultValue: 'primary',
        possibleValues: 'primary, success, warning, or error.',
        description: 'Color tone for tutorial, success, warning, or validation states.'
      },
      {
        name: 'pulse',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Animates the outer ring.'
      },
      {
        name: 'padding / radius / thickness / pulseSize',
        type: 'number',
        defaultValue: '6 / 10 / 2 / 10',
        possibleValues: 'Any positive pixel values.',
        description: 'Controls ring spacing, corners, stroke width, and heartbeat width.'
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
  {
    ...createBasicDoc(
      'MorphMenu',
      'Radial context menu that morphs out from its trigger.',
      'MorphMenu is a radial action menu for compact tool clusters, context actions, and creative surfaces with smooth trigger-origin motion and keyboard navigation.'
    ),
    props: [
      {
        name: 'children',
        type: 'ReactElement',
        defaultValue: '-',
        possibleValues: 'One trigger element.',
        description: 'Element that opens the radial menu.'
      },
      {
        name: 'items',
        type: 'MorphMenuItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, icon, disabled, onClick }.',
        description: 'Menu actions shown around the trigger.'
      },
      {
        name: 'open / defaultOpen',
        type: 'boolean',
        defaultValue: '- / false',
        possibleValues: 'true or false.',
        description: 'Controlled or uncontrolled open state.'
      },
      {
        name: 'radius',
        type: 'number',
        defaultValue: '112',
        possibleValues: 'Any positive pixel radius.',
        description: 'Distance from trigger center to each item.'
      },
      {
        name: 'startAngle / endAngle',
        type: 'number',
        defaultValue: '-160 / -20',
        possibleValues: 'Degrees. 0 points right, 90 points down.',
        description: 'Arc used to place radial menu items.'
      },
      {
        name: 'itemSize',
        type: 'number',
        defaultValue: '52',
        possibleValues: 'Any positive pixel size.',
        description: 'Circular item button size.'
      },
      {
        name: 'showLabels',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows labels below radial buttons.'
      },
      {
        name: 'onSelect',
        type: '(item: MorphMenuItem) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving selected item.',
        description: 'Called when a menu action is selected.'
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
  {
    ...createBasicDoc(
      'FlowBuilder',
      'Workflow editor with ports, typed edges, validation, and auto-layout.',
      'FlowBuilder is a workflow surface for connecting typed ports between nodes, spotting invalid edges, arranging graphs automatically, and editing node positions.'
    ),
    props: [
      {
        name: 'nodes',
        type: 'FlowBuilderNode[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, x, y, inputs, outputs, tone, data }.',
        description: 'Workflow nodes and typed ports.'
      },
      {
        name: 'connections',
        type: 'FlowBuilderConnection[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, fromNodeId, fromPortId, toNodeId, toPortId, type, label }.',
        description: 'Typed edges between output and input ports.'
      },
      {
        name: 'portTypes',
        type: 'string[]',
        defaultValue: 'event/data/success/error',
        possibleValues: 'Any list of type names.',
        description: 'Types available in the connection helper.'
      },
      {
        name: 'validate',
        type: '(nodes, connections) => FlowBuilderValidation[]',
        defaultValue: 'built-in typed validation',
        possibleValues: 'Function returning validation issues.',
        description: 'Checks missing inputs, invalid ports, or custom workflow rules.'
      },
      {
        name: 'snapToGrid / gridSize',
        type: 'boolean / number',
        defaultValue: 'true / 24',
        possibleValues: 'true or false, and any positive grid size.',
        description: 'Snaps drag and auto-layout positions.'
      },
      {
        name: 'onNodesChange / onConnectionsChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving updated graph arrays.',
        description: 'Use for controlled workflow editing.'
      }
    ]
  },
  createBasicDoc(
    'BeforeAfterSlider',
    'Compare two panes with draggable slider.',
    'BeforeAfterSlider is a comparison viewer that reveals one layer over another with a draggable dividing handle.'
  ),
  {
    name: 'CompareStack',
    summary: 'Multi-layer before and after viewer with opacity sliders.',
    description: 'CompareStack stacks visual layers for before/after reviews, design overlays, map states, or dashboard comparisons, with per-layer opacity and visibility controls.',
    props: [
      {
        name: 'layers',
        type: 'CompareStackLayer[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, content, description, opacity, visible, color, blendMode }.',
        description: 'Visual layers rendered in stack order.'
      },
      {
        name: 'opacities / defaultOpacities',
        type: 'Record<string, number>',
        defaultValue: '-',
        possibleValues: 'Map layer id to opacity from 0 to 100.',
        description: 'Controlled or initial opacity values.'
      },
      {
        name: 'visibleLayers / defaultVisibleLayers',
        type: 'Record<string, boolean>',
        defaultValue: '-',
        possibleValues: 'Map layer id to true or false.',
        description: 'Controlled or initial layer visibility.'
      },
      {
        name: 'minHeight',
        type: 'number',
        defaultValue: '340',
        possibleValues: 'Any positive pixel height.',
        description: 'Minimum viewer height.'
      },
      {
        name: 'showControls / showLegend',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows sliders and layer badges.'
      },
      {
        name: 'onChange',
        type: '(change, state) => void',
        defaultValue: '-',
        possibleValues: 'Callback receiving changed layer and full state.',
        description: 'Reports opacity and visibility changes.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { CompareStack } from '@mickyballadelli/react-things'

const layers = [
  { id: 'before', label: 'Before', content: <img src="/before.png" /> },
  { id: 'after', label: 'After', opacity: 70, content: <img src="/after.png" /> }
]

export function Example() {
  return <CompareStack layers={layers} />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { CompareStack, type CompareStackLayer } from '@mickyballadelli/react-things'

const layers: CompareStackLayer[] = [
  { id: 'base', label: 'Base', content: <div>Base map</div>, opacity: 100 },
  { id: 'changes', label: 'Changes', content: <div>New state</div>, opacity: 64 }
]

export function Example() {
  return <CompareStack layers={layers} minHeight={420} />
}`
      }
    ]
  },
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
      'SelectionBox',
      'Drag selection for grids, lists, and canvases.',
      'SelectionBox lets users drag a rectangle over any descendants with data-selection-id, supports click selection, modifier-key multi-select, custom visuals, and controlled selection state.'
    ),
    props: [
      {
        name: 'children',
        type: 'ReactNode | render function',
        defaultValue: '-',
        possibleValues: 'Any content. Selectable descendants need data-selection-id.',
        description: 'Grid, list, canvas, or render function receiving selectedIds.'
      },
      {
        name: 'selectedIds / defaultSelectedIds',
        type: 'string[]',
        defaultValue: '- / []',
        possibleValues: 'Ids matching data-selection-id.',
        description: 'Controlled or uncontrolled selected ids.'
      },
      {
        name: 'itemSelector',
        type: 'string',
        defaultValue: '[data-selection-id]',
        possibleValues: 'Any selector for selectable descendants.',
        description: 'Elements tested against the drag rectangle.'
      },
      {
        name: 'selectionColor',
        type: 'string',
        defaultValue: '#2563eb',
        possibleValues: 'Any CSS color.',
        description: 'Color for selected outlines and drag rectangle.'
      },
      {
        name: 'selectionRectSx',
        type: 'BoxProps["sx"]',
        defaultValue: '-',
        possibleValues: 'Any MUI sx value.',
        description: 'Overrides drag rectangle visuals.'
      },
      {
        name: 'onSelectionChange',
        type: '(change: SelectionBoxChange) => void',
        defaultValue: '-',
        possibleValues: 'Callback receiving selectedIds, addedIds, removedIds, and reason.',
        description: 'Called after click, drag, or clear.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'BulkActionBar',
      'Selection-aware action bar for tables, grids, and cards.',
      'BulkActionBar appears when items are selected and gives users fast primary actions, overflow actions, selected counts, clear selection, and inline, sticky, or floating placement.'
    ),
    props: [
      {
        name: 'selectedIds',
        type: 'string[]',
        defaultValue: '-',
        possibleValues: 'Selected item ids.',
        description: 'Controls visibility and count.'
      },
      {
        name: 'actions',
        type: 'BulkActionBarAction[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, icon, tone, disabled, hidden, overflow, onClick }.',
        description: 'Primary and overflow bulk actions.'
      },
      {
        name: 'totalCount / label',
        type: 'number / ReactNode',
        defaultValue: '-',
        possibleValues: 'Any item count and label.',
        description: 'Optional context next to selected count.'
      },
      {
        name: 'position',
        type: '"inline" | "sticky" | "floating"',
        defaultValue: 'inline',
        possibleValues: 'inline, sticky, or floating.',
        description: 'Action bar placement.'
      },
      {
        name: 'maxPrimaryActions',
        type: 'number',
        defaultValue: '3',
        possibleValues: 'Any positive count.',
        description: 'Actions beyond this move to the overflow menu.'
      },
      {
        name: 'onClear',
        type: '() => void',
        defaultValue: '-',
        possibleValues: 'Clear selection callback.',
        description: 'Called by the clear selection button.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'PresenceCursors',
      'Collaborative cursors, selections, names, and idle states.',
      'PresenceCursors overlays multi-user cursor positions, labeled selections, participant chips, and active or idle states over any shared surface. It is the visual layer only: connect people through your realtime backend, such as WebSocket. Send each local user position and selection to that realtime layer, receive the remote users array, then pass it into users.'
    ),
    props: [
      {
        name: 'users',
        type: 'PresenceCursorUser[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, name, x, y, color, status, selection, updatedAt }.',
        description: 'Remote collaborator positions and selections.'
      },
      {
        name: 'coordinateMode',
        type: '"percent" | "pixel"',
        defaultValue: 'percent',
        possibleValues: 'percent or pixel.',
        description: 'Interprets cursor and selection coordinates.'
      },
      {
        name: 'showNames / showSelections / showPresenceList',
        type: 'boolean',
        defaultValue: 'true / true / true',
        possibleValues: 'true or false.',
        description: 'Controls cursor labels, selection boxes, and participant list.'
      },
      {
        name: 'idleAfterMs',
        type: 'number',
        defaultValue: '30000',
        possibleValues: 'Any millisecond delay.',
        description: 'Marks users idle when updatedAt gets stale.'
      },
      {
        name: 'renderCursor',
        type: '(user, status) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Function returning custom cursor visuals.',
        description: 'Overrides default pointer shape.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'StatusRail',
      'Vertical operational health rail with grouped incidents and live pulse.',
      'StatusRail shows service groups, health tones, grouped incident cards, uptime and latency metrics, and pulsing live alerts for operational dashboards.'
    ),
    props: [
      {
        name: 'groups',
        type: 'StatusRailGroup[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, status, uptime, latency, incidents }.',
        description: 'Operational groups shown in the rail.'
      },
      {
        name: 'title / subtitle',
        type: 'ReactNode',
        defaultValue: 'Status / generated summary',
        possibleValues: 'Any React renderable.',
        description: 'Header content.'
      },
      {
        name: 'pulse',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Animates non-operational status dots.'
      },
      {
        name: 'compact',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Uses narrower width and tighter spacing.'
      },
      {
        name: 'maxIncidents / showMetrics',
        type: 'number / boolean',
        defaultValue: '3 / true',
        possibleValues: 'Any count, true or false.',
        description: 'Controls visible incident count and metric blocks.'
      },
      {
        name: 'onGroupSelect / onIncidentSelect',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving selected group or incident.',
        description: 'Called when users pick groups or incidents.'
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
        defaultValue: '500',
        possibleValues: 'Any millisecond delay.',
        description: 'Hover delay before open.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'ToastCenter',
      'Notification stack with grouped toasts and history drawer.',
      'ToastCenter is a controlled or uncontrolled toast system for active notifications, grouped repeats, actions, auto-dismiss, and a right-side history drawer.'
    ),
    props: [
      {
        name: 'toasts',
        type: 'ToastCenterToast[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, title, message, tone, group, timestamp, actions, autoHideDuration }.',
        description: 'Controlled active notifications.'
      },
      {
        name: 'defaultToasts',
        type: 'ToastCenterToast[]',
        defaultValue: '[]',
        possibleValues: 'Any toast array.',
        description: 'Initial notifications when uncontrolled.'
      },
      {
        name: 'maxVisible',
        type: 'number',
        defaultValue: '4',
        possibleValues: 'Any positive count.',
        description: 'Maximum visible toast cards before showing more count.'
      },
      {
        name: 'groupToasts',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Groups toasts by group key or title.'
      },
      {
        name: 'historyTitle',
        type: 'ReactNode',
        defaultValue: 'Notification history',
        possibleValues: 'Any React renderable.',
        description: 'Drawer heading.'
      },
      {
        name: 'onToastsChange',
        type: '(toasts: ToastCenterToast[]) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving active notifications.',
        description: 'Called when a toast or group is dismissed.'
      },
      {
        name: 'onDismiss',
        type: '(toast: ToastCenterToast) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving dismissed toast.',
        description: 'Called for every dismissed notification.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'TourGuide',
      'Interactive walkthrough with spotlight mask, branching steps, and progress.',
      'TourGuide walks users through an interface by highlighting targets, showing step cards, supporting branching choices, tracking progress, and reporting completion.'
    ),
    props: [
      {
        name: 'steps',
        type: 'TourGuideStep[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, title, content, target, placement, branches, nextStepId }.',
        description: 'Ordered walkthrough steps.'
      },
      {
        name: 'open / defaultOpen',
        type: 'boolean',
        defaultValue: '- / false',
        possibleValues: 'true or false.',
        description: 'Controlled or uncontrolled tour visibility.'
      },
      {
        name: 'stepId / initialStepId',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any step id.',
        description: 'Controlled or initial active step.'
      },
      {
        name: 'spotlightPadding / spotlightRadius',
        type: 'number',
        defaultValue: '10 / 12',
        possibleValues: 'Any positive pixel values.',
        description: 'Spotlight size and corner shape around target.'
      },
      {
        name: 'scrollIntoView',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Scrolls target into view when the step changes.'
      },
      {
        name: 'completed',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Hides the tour after external completion state is set.'
      },
      {
        name: 'onStepChange / onComplete / onSkip',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks for progress, completion, and skip.',
        description: 'Lifecycle callbacks for tour state.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'DataCardGrid',
      'Metric dashboard cards with deltas, sparklines, progress, and status color.',
      'DataCardGrid turns arrays of business, product, or system metrics into scan-friendly data cards for dashboards and reports.'
    ),
    props: [
      {
        name: 'metrics',
        type: 'DataCardGridMetric[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, value, previousValue, delta, helper, unit, color, status, progress, trend, icon, formatter }.',
        description: 'Metric cards rendered in the grid.'
      },
      {
        name: 'title / subtitle',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any string.',
        description: 'Optional heading text shown above the grid.'
      },
      {
        name: 'columns',
        type: 'number',
        defaultValue: '3',
        possibleValues: 'Any positive column count.',
        description: 'Desktop column count. Mobile stays one column.'
      },
      {
        name: 'density',
        type: '"comfortable" | "compact"',
        defaultValue: 'comfortable',
        possibleValues: 'comfortable or compact.',
        description: 'Controls card spacing and value size.'
      },
      {
        name: 'showSparklines / showProgress',
        type: 'boolean',
        defaultValue: 'true / true',
        possibleValues: 'true or false.',
        description: 'Shows or hides trend charts and progress bars.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'DataLens',
      'Tiny table and card viewer with filters, sorting, and inline charts.',
      'DataLens turns small operational datasets into a searchable table or card grid with column filters, sortable headers, and tiny bar or sparkline cells.'
    ),
    props: [
      {
        name: 'rows',
        type: 'Row[]',
        defaultValue: '-',
        possibleValues: 'Any array of objects.',
        description: 'Data objects shown in table or cards.'
      },
      {
        name: 'columns',
        type: 'DataLensColumn<Row>[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, label, accessor, sortable, filterable, options, chart, render }.',
        description: 'Column definitions, filters, sorting, rendering, and chart cells.'
      },
      {
        name: 'defaultView',
        type: '"table" | "cards"',
        defaultValue: 'table',
        possibleValues: 'table or cards.',
        description: 'Initial display mode.'
      },
      {
        name: 'initialSort',
        type: 'DataLensSort',
        defaultValue: '-',
        possibleValues: '{ columnId, direction }.',
        description: 'Initial sorted column and direction.'
      },
      {
        name: 'dense',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Uses tighter spacing.'
      },
      {
        name: 'onRowSelect',
        type: '(row: Row) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving the clicked row.',
        description: 'Called when a row or card is selected.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'LayoutSwitcher',
      'Animated view switcher for table, cards, kanban, calendar, and list layouts.',
      'LayoutSwitcher lets one collection move between multiple task and data views with a segmented control, animated transitions, grouping, calendar bucketing, and custom item rendering.'
    ),
    props: [
      {
        name: 'items',
        type: 'LayoutSwitcherItem[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, title, subtitle, description, status, group, date, color, data }.',
        description: 'Items rendered across every layout.'
      },
      {
        name: 'views',
        type: 'LayoutSwitcherView[]',
        defaultValue: 'table/cards/kanban/calendar/list',
        possibleValues: 'Any subset of table, cards, kanban, calendar, list.',
        description: 'Views available in the switcher.'
      },
      {
        name: 'view / defaultView',
        type: 'LayoutSwitcherView',
        defaultValue: '- / cards',
        possibleValues: 'table, cards, kanban, calendar, or list.',
        description: 'Controlled or initial active view.'
      },
      {
        name: 'columns',
        type: 'LayoutSwitcherColumn[]',
        defaultValue: 'generated',
        possibleValues: 'Array of { id, label, render }.',
        description: 'Table columns.'
      },
      {
        name: 'groupOrder / calendarDays',
        type: 'string[] / number',
        defaultValue: '- / 7',
        possibleValues: 'Group labels and any day count.',
        description: 'Kanban group ordering and calendar range.'
      },
      {
        name: 'renderItem',
        type: '(item, view) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Custom item renderer.',
        description: 'Overrides card rendering in cards, kanban, and calendar views.'
      }
    ]
  },
  {
    ...createBasicDoc(
      'KanbanBoard',
      'Fully editable Kanban board with columns, cards, drag and drop, and card editing.',
      'KanbanBoard is a project workflow surface where users can create columns, add cards, drag cards between stacks, reorder vertically, edit details, and delete work items.'
    ),
    props: [
      {
        name: 'columns',
        type: 'KanbanColumn[]',
        defaultValue: '-',
        possibleValues: 'Controlled array of { id, title, cards, color }. Each card has { id, title, description, tags, color, data }.',
        description: 'Controlled board state. Use with onChange.'
      },
      {
        name: 'defaultColumns',
        type: 'KanbanColumn[]',
        defaultValue: 'Demo board',
        possibleValues: 'Any KanbanColumn array.',
        description: 'Initial board when uncontrolled.'
      },
      {
        name: 'title / subtitle',
        type: 'string',
        defaultValue: 'Kanban / generated count text',
        possibleValues: 'Any string.',
        description: 'Heading shown above the board.'
      },
      {
        name: 'density',
        type: '"comfortable" | "compact"',
        defaultValue: 'comfortable',
        possibleValues: 'comfortable or compact.',
        description: 'Controls column and card spacing.'
      },
      {
        name: 'allowColumnDrag',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Allows columns to be reordered horizontally.'
      },
      {
        name: 'onChange',
        type: '(columns: KanbanColumn[]) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving next board state.',
        description: 'Called when cards or columns are added, edited, moved, or deleted.'
      },
      {
        name: 'onCardSelect',
        type: '(card, column) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving clicked card and its column.',
        description: 'Called when a card is selected.'
      }
    ]
  },
  createBasicDoc(
    'ResizableFrame',
    'Frame resized from bottom-right handle.',
    'ResizableFrame is a simple container whose width and height can be changed by dragging its corner handle.'
  ),
  {
    ...createBasicDoc(
      'ResizableDashboard',
      'Widget dashboard with draggable, resizable, persistent grid layouts.',
      'ResizableDashboard is a responsive widget surface with snap-to-grid movement, resize handles, alignment guides, saved layouts, and breakpoint-specific columns.'
    ),
    props: [
      {
        name: 'widgets',
        type: 'ResizableDashboardWidget[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, title, children, layout, layouts }. layout uses x, y, w, h grid units.',
        description: 'Dashboard widgets and their default grid positions.'
      },
      {
        name: 'layouts / defaultLayouts',
        type: 'Record<string, ResizableDashboardLayoutItem[]>',
        defaultValue: '{}',
        possibleValues: 'Object keyed by breakpoint name. Each item uses { id, x, y, w, h, minW, minH, maxW, maxH }.',
        description: 'Controlled or uncontrolled saved layout state for each breakpoint.'
      },
      {
        name: 'breakpoints',
        type: 'ResizableDashboardBreakpoint[]',
        defaultValue: 'lg/md/sm',
        possibleValues: 'Array of { name, minWidth, columns }.',
        description: 'Responsive column rules selected from the dashboard width.'
      },
      {
        name: 'rowHeight / gap',
        type: 'number',
        defaultValue: '88 / 12',
        possibleValues: 'Any positive pixel values.',
        description: 'Grid unit height and space between widgets.'
      },
      {
        name: 'persistKey',
        type: 'string',
        defaultValue: '-',
        possibleValues: 'Any localStorage key.',
        description: 'Saves uncontrolled layouts in localStorage.'
      },
      {
        name: 'showGuides',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows grid lines and active placement guide while moving or resizing.'
      },
      {
        name: 'onLayoutsChange',
        type: '(layouts, breakpoint) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving all layouts and active breakpoint name.',
        description: 'Called whenever drag or resize updates layout.'
      }
    ]
  },
  createBasicDoc(
    'InspectorPanel',
    'Schema-driven inspector with grouped controls, reset, color/select fields, and value summary.',
    'InspectorPanel is a compact control surface for editing live component props, design tokens, tool settings, or selected-object attributes.'
  ),
  {
    ...createBasicDoc(
      'InspectorDrawer',
      'Beautiful property drawer with sections, live validation, and undo.',
      'InspectorDrawer is a right-side property editor for selected objects with sectioned fields, inline validation, controlled updates, and local undo history.'
    ),
    props: [
      {
        name: 'open / onClose',
        type: 'boolean / function',
        defaultValue: '-',
        possibleValues: 'MUI Drawer open and close props.',
        description: 'Controls drawer visibility.'
      },
      {
        name: 'sections',
        type: 'InspectorDrawerSection[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, title, description, fields }. Fields support text, number, boolean, select, and color.',
        description: 'Sectioned field schema and current values.'
      },
      {
        name: 'width',
        type: 'number',
        defaultValue: '380',
        possibleValues: 'Any positive pixel width.',
        description: 'Drawer width above mobile.'
      },
      {
        name: 'density',
        type: '"comfortable" | "compact"',
        defaultValue: 'comfortable',
        possibleValues: 'comfortable or compact.',
        description: 'Controls spacing and field size.'
      },
      {
        name: 'showUndo',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows undo controls and keeps local edit history.'
      },
      {
        name: 'onSectionsChange / onFieldChange',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving next sections or field change details.',
        description: 'Reports edits and undo changes.'
      }
    ]
  },
  createBasicDoc(
    'ColorPicker',
    'Color picker with swatches and alpha.',
    'ColorPicker is a controlled color input with preset swatches, optional alpha control, and readable selected values.'
  ),
  {
    ...createBasicDoc(
      'ColorStudio',
      'Palette builder with contrast checks, gradients, and token export.',
      'ColorStudio is a design-token workbench for building palettes, checking WCAG contrast, composing gradients, and exporting CSS, JSON, or MUI tokens.'
    ),
    props: [
      {
        name: 'initialColors',
        type: 'ColorStudioColor[]',
        defaultValue: 'Brand palette',
        possibleValues: 'Array of { id, name, value }. value should be a 6-digit hex color.',
        description: 'Initial editable palette.'
      },
      {
        name: 'initialGradientStops',
        type: 'ColorStudioGradientStop[]',
        defaultValue: 'Two stops',
        possibleValues: 'Array of { id, color, position }. position is 0 to 100.',
        description: 'Initial gradient stops.'
      },
      {
        name: 'tokenFormat',
        type: '"css" | "json" | "mui"',
        defaultValue: 'css',
        possibleValues: 'css, json, or mui.',
        description: 'Initial export token format.'
      },
      {
        name: 'onColorsChange',
        type: '(colors: ColorStudioColor[]) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving next palette.',
        description: 'Called when palette colors change.'
      },
      {
        name: 'onGradientChange',
        type: '(stops, gradient) => void',
        defaultValue: '-',
        possibleValues: 'Function receiving stops and CSS gradient.',
        description: 'Called when gradient stops change.'
      }
    ]
  },
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
  {
    ...createBasicDoc(
      'DropComposer',
      'Upload dropzone with previews, reorder, metadata edit, and progress.',
      'DropComposer is a composed upload staging area where files can be dropped, previewed, reordered, annotated, and tracked before the real upload happens.'
    ),
    props: [
      {
        name: 'items / defaultItems',
        type: 'DropComposerItem[]',
        defaultValue: '[]',
        possibleValues: 'Array of { id, name, size, type, previewUrl, title, description, progress, status, metadata }.',
        description: 'Controlled or uncontrolled upload queue.'
      },
      {
        name: 'accept / multiple',
        type: 'string / boolean',
        defaultValue: '- / true',
        possibleValues: 'Any file input accept string and true or false.',
        description: 'Controls file picker limits.'
      },
      {
        name: 'metadataFields',
        type: 'string[]',
        defaultValue: '["title", "description"]',
        possibleValues: 'title, description, or custom field names.',
        description: 'Metadata fields shown for each file.'
      },
      {
        name: 'renderPreview',
        type: '(item) => ReactNode',
        defaultValue: '-',
        possibleValues: 'Custom renderer for file thumbnails.',
        description: 'Overrides default image/file preview.'
      },
      {
        name: 'onItemsChange / onFiles',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving queue or new files.',
        description: 'Reports queue changes and dropped files.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { DropComposer } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <DropComposer
      accept="image/*,.pdf"
      onItemsChange={(items) => console.log(items)}
      onFiles={(files) => console.log(files)}
    />
  )
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { DropComposer, type DropComposerItem } from '@mickyballadelli/react-things'

const items: DropComposerItem[] = [
  {
    id: 'hero',
    name: 'hero-image.png',
    size: 428000,
    type: 'image/png',
    previewUrl: '/animals-colors.svg',
    title: 'Hero image',
    description: 'Landing page visual',
    progress: 100,
    status: 'done'
  }
]

export function Example() {
  return (
    <DropComposer
      defaultItems={items}
      metadataFields={['title', 'description']}
    />
  )
}`
      }
    ]
  },
  {
    name: 'EntityPicker',
    summary: 'Rich picker for users, files, and projects with avatars, recent, pinned, and groups.',
    description: 'EntityPicker is a searchable selection surface for mixed workspace entities, with avatars, group headings, pinned and recent filters, single or multi-select, and selected chips.',
    props: [
      {
        name: 'entities',
        type: 'EntityPickerEntity[]',
        defaultValue: '-',
        possibleValues: 'Array of { id, type, label, description, group, avatarUrl, avatarText, color, status, recent, pinned, keywords, meta }.',
        description: 'Entities shown in the picker.'
      },
      {
        name: 'value / defaultValue',
        type: 'string | string[] | null',
        defaultValue: 'null',
        possibleValues: 'Entity id for single select, array of ids for multiple.',
        description: 'Controlled or uncontrolled selected entities.'
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        possibleValues: 'true or false.',
        description: 'Enables checkbox multi-select.'
      },
      {
        name: 'showFilters / showSelected',
        type: 'boolean',
        defaultValue: 'true',
        possibleValues: 'true or false.',
        description: 'Shows recent/pinned filters and selected chips.'
      },
      {
        name: 'onChange / onSelect',
        type: 'function',
        defaultValue: '-',
        possibleValues: 'Callbacks receiving value, selected entities, or clicked entity.',
        description: 'Reports selection changes.'
      }
    ],
    samples: [
      {
        label: 'JavaScript',
        language: 'javascript',
        initialCode: `import { EntityPicker } from '@mickyballadelli/react-things'

const entities = [
  { id: 'ada', type: 'user', label: 'Ada Lovelace', group: 'People', pinned: true },
  { id: 'brief', type: 'file', label: 'Launch brief.pdf', group: 'Files', recent: true },
  { id: 'atlas', type: 'project', label: 'Atlas', group: 'Projects' }
]

export function Example() {
  return <EntityPicker entities={entities} multiple />
}`
      },
      {
        label: 'TypeScript',
        language: 'typescript',
        initialCode: `import { EntityPicker, type EntityPickerEntity } from '@mickyballadelli/react-things'

const entities: EntityPickerEntity[] = [
  { id: 'micky', type: 'user', label: 'Micky', status: 'online', recent: true },
  { id: 'tokens', type: 'file', label: 'tokens.json', pinned: true }
]

export function Example() {
  return <EntityPicker entities={entities} defaultValue="micky" />
}`
      }
    ]
  },
]

const defaultGlassBoxConfig: GlassBoxConfig = {
  transparency: 0.45,
  fill: 0.62,
  liquidColor: '#38d6a5',
  glassColor: '#ffffff',
  children: 'Liquid glass content'
}

const defaultDropComposerItems: DropComposerItem[] = [
  {
    id: 'launch-hero',
    name: 'launch-hero.png',
    size: 428000,
    type: 'image/png',
    previewUrl: '/animals-colors.svg',
    title: 'Launch hero',
    description: 'Main campaign visual',
    progress: 100,
    status: 'done'
  },
  {
    id: 'release-notes',
    name: 'release-notes.pdf',
    size: 218000,
    type: 'application/pdf',
    title: 'Release notes',
    description: 'Customer-facing PDF',
    progress: 66,
    status: 'uploading'
  },
  {
    id: 'token-export',
    name: 'tokens.json',
    size: 42000,
    type: 'application/json',
    title: 'Design tokens',
    description: 'Theme handoff',
    progress: 32,
    status: 'queued'
  }
]

const entityPickerEntities = [
  {
    id: 'micky',
    type: 'user' as const,
    label: 'Micky Balladelli',
    description: 'Product engineering',
    group: 'People',
    avatarText: 'MB',
    color: '#2563eb',
    status: 'online',
    pinned: true,
    recent: true,
    keywords: ['owner', 'frontend']
  },
  {
    id: 'ada',
    type: 'user' as const,
    label: 'Ada Lovelace',
    description: 'Systems and analytics',
    group: 'People',
    avatarText: 'AL',
    color: '#7c3aed',
    recent: true
  },
  {
    id: 'launch-brief',
    type: 'file' as const,
    label: 'launch-brief.pdf',
    description: 'Customer launch narrative',
    group: 'Files',
    color: '#059669',
    status: 'PDF',
    pinned: true,
    recent: true
  },
  {
    id: 'tokens',
    type: 'file' as const,
    label: 'design-tokens.json',
    description: 'Theme colors and spacing',
    group: 'Files',
    color: '#0ea5e9',
    status: 'JSON'
  },
  {
    id: 'atlas',
    type: 'project' as const,
    label: 'Atlas workspace',
    description: 'Core planning and dashboards',
    group: 'Projects',
    color: '#f59e0b',
    pinned: true
  },
  {
    id: 'vela',
    type: 'project' as const,
    label: 'Vela client',
    description: 'Interactive canvas workstream',
    group: 'Projects',
    color: '#db2777',
    recent: true
  }
]

const commandTimelineEntries = [
  {
    id: 'created',
    label: 'Created workspace',
    description: 'Started from the default launch template.',
    group: 'Setup',
    actor: 'Micky',
    timestamp: Date.now() - 1000 * 60 * 38,
    color: '#2563eb'
  },
  {
    id: 'imported',
    label: 'Imported assets',
    description: 'Added hero image, release notes, and design tokens.',
    group: 'Setup',
    actor: 'Ada',
    timestamp: Date.now() - 1000 * 60 * 32,
    color: '#059669'
  },
  {
    id: 'assigned',
    label: 'Assigned owners',
    description: 'Mapped owners to launch checklist sections.',
    group: 'Planning',
    actor: 'Micky',
    timestamp: Date.now() - 1000 * 60 * 20,
    color: '#7c3aed'
  },
  {
    id: 'moved',
    label: 'Moved launch card',
    description: 'Card moved from Review to Ready.',
    group: 'Planning',
    actor: 'Ada',
    timestamp: Date.now() - 1000 * 60 * 12,
    color: '#f59e0b'
  },
  {
    id: 'published',
    label: 'Published draft',
    description: 'Shared current draft with stakeholders.',
    group: 'Release',
    actor: 'Micky',
    timestamp: Date.now() - 1000 * 60 * 4,
    color: '#db2777'
  }
]

const compareStackLayers = [
  {
    id: 'before',
    label: 'Before',
    description: 'Original campaign surface',
    color: '#2563eb',
    opacity: 100,
    content: (
      <Box sx={{ height: '100%', p: 4, color: '#ffffff', bgcolor: '#2563eb', backgroundImage: 'linear-gradient(135deg, #2563eb, #0f172a)' }}>
        <Typography variant="h3" fontWeight={950}>Launch plan</Typography>
        <Typography sx={{ maxWidth: 420, mt: 1 }}>Original layout with strong hero and wide empty space.</Typography>
        <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
          {[1, 2, 3].map((item) => <Box key={item} sx={{ height: 96, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.18)' }} />)}
        </Box>
      </Box>
    )
  },
  {
    id: 'after',
    label: 'After',
    description: 'Reworked hierarchy',
    color: '#059669',
    opacity: 72,
    content: (
      <Box sx={{ height: '100%', p: 4, color: '#052e16', bgcolor: '#bbf7d0', backgroundImage: 'linear-gradient(135deg, #bbf7d0, #fef3c7)' }}>
        <Typography variant="h3" fontWeight={950}>Launch plan</Typography>
        <Typography sx={{ maxWidth: 420, mt: 1 }}>Updated structure with denser cards and clearer status.</Typography>
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.5 }}>
          {[1, 2, 3, 4].map((item) => <Box key={item} sx={{ height: 70, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.72)', border: 1, borderColor: 'rgba(5,46,22,0.12)' }} />)}
        </Box>
      </Box>
    )
  },
  {
    id: 'notes',
    label: 'Review notes',
    description: 'Annotation overlay',
    color: '#db2777',
    opacity: 58,
    content: (
      <Box sx={{ height: '100%', position: 'relative' }}>
        {[
          { left: '58%', top: '22%', text: 'Tighter headline' },
          { left: '18%', top: '62%', text: 'Cards need status' },
          { left: '72%', top: '70%', text: 'Ready' }
        ].map((note) => (
          <Chip
            key={note.text}
            label={note.text}
            sx={{
              position: 'absolute',
              left: note.left,
              top: note.top,
              bgcolor: '#db2777',
              color: '#ffffff',
              fontWeight: 900
            }}
          />
        ))}
      </Box>
    )
  }
]

const dataCardGridMetrics: DataCardGridMetric[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: 128400,
    previousValue: 118000,
    formatter: (value) => `€${Number(value).toLocaleString()}`,
    status: 'good',
    progress: 78,
    helper: 'Month to date',
    trend: [40, 46, 44, 58, 64, 72, 78]
  },
  {
    id: 'orders',
    label: 'Orders',
    value: 842,
    previousValue: 910,
    status: 'danger',
    progress: 58,
    helper: 'Needs attention',
    trend: [80, 76, 72, 70, 68, 62, 58]
  },
  {
    id: 'conversion',
    label: 'Conversion',
    value: 6.8,
    previousValue: 6.1,
    unit: '%',
    status: 'good',
    progress: 68,
    helper: 'Checkout funnel',
    trend: [4.8, 5.2, 5.1, 5.8, 6.2, 6.5, 6.8]
  },
  {
    id: 'latency',
    label: 'API latency',
    value: 184,
    previousValue: 142,
    unit: 'ms',
    status: 'warning',
    progress: 42,
    helper: 'p95 response',
    trend: [120, 128, 136, 142, 151, 170, 184]
  }
]

type DataLensService = {
  id: string
  name: string
  owner: string
  status: 'Healthy' | 'Watch' | 'Down'
  load: number
  requests: number
  trend: number[]
}

const dataLensRows: DataLensService[] = [
  { id: 'api', name: 'API Gateway', owner: 'Platform', status: 'Healthy', load: 72, requests: 128400, trend: [42, 46, 51, 58, 64, 72] },
  { id: 'web', name: 'Web App', owner: 'Growth', status: 'Watch', load: 58, requests: 84200, trend: [68, 64, 62, 60, 59, 58] },
  { id: 'billing', name: 'Billing', owner: 'Core', status: 'Healthy', load: 81, requests: 31200, trend: [55, 59, 63, 70, 76, 81] },
  { id: 'search', name: 'Search', owner: 'Platform', status: 'Healthy', load: 64, requests: 56600, trend: [38, 44, 49, 55, 61, 64] },
  { id: 'mailer', name: 'Mailer', owner: 'Core', status: 'Down', load: 18, requests: 9200, trend: [70, 62, 48, 35, 22, 18] }
]

const dataLensColumns: DataLensColumn<DataLensService>[] = [
  { id: 'name', label: 'Service', sortable: true },
  { id: 'owner', label: 'Owner', filterable: true, options: ['Platform', 'Growth', 'Core'] },
  {
    id: 'status',
    label: 'Status',
    filterable: true,
    options: ['Healthy', 'Watch', 'Down'],
    render: (value) => (
      <Chip
        size="small"
        label={String(value)}
        color={value === 'Healthy' ? 'success' : value === 'Watch' ? 'warning' : 'error'}
      />
    )
  },
  { id: 'load', label: 'Load', sortable: true, chart: 'bar' },
  { id: 'requests', label: 'Requests', sortable: true, align: 'right', render: (value) => Number(value).toLocaleString() },
  { id: 'trend', label: 'Trend', chart: 'sparkline' }
]

const layoutSwitcherItems: LayoutSwitcherItem[] = [
  { id: 'brief', title: 'Write brief', subtitle: 'Frame launch story', status: 'Todo', group: 'Todo', date: new Date(), color: '#dbeafe' },
  { id: 'design', title: 'Design flow', subtitle: 'Polish key screens', status: 'Doing', group: 'Doing', date: new Date(Date.now() + 86400000), color: '#fef3c7' },
  { id: 'prototype', title: 'Prototype demo', subtitle: 'Clickable path', status: 'Doing', group: 'Doing', date: new Date(Date.now() + 86400000 * 2), color: '#e0e7ff' },
  { id: 'review', title: 'Stakeholder review', subtitle: 'Collect notes', status: 'Review', group: 'Review', date: new Date(Date.now() + 86400000 * 3), color: '#fce7f3' },
  { id: 'ship', title: 'Ship demo', subtitle: 'Publish release', status: 'Done', group: 'Done', date: new Date(Date.now() + 86400000 * 4), color: '#dcfce7' },
  { id: 'retro', title: 'Retro notes', subtitle: 'Close the loop', status: 'Done', group: 'Done', date: new Date(Date.now() + 86400000 * 5), color: '#ccfbf1' }
]

const colorStudioColors: ColorStudioColor[] = [
  { id: 'brand', name: 'Brand', value: '#2563eb' },
  { id: 'accent', name: 'Accent', value: '#db2777' },
  { id: 'success', name: 'Success', value: '#059669' },
  { id: 'surface', name: 'Surface', value: '#f8fafc' }
]

const morphMenuItems: MorphMenuItem[] = [
  { id: 'copy', label: 'Copy', icon: 'C' },
  { id: 'share', label: 'Share', icon: 'S' },
  { id: 'pin', label: 'Pin', icon: 'P' },
  { id: 'archive', label: 'Archive', icon: 'A' }
]

const defaultDockTabs: DockTab[] = [
  { id: 'home', label: 'Home', icon: 'H', preview: 'Home workspace' },
  { id: 'docs', label: 'Docs', icon: 'D', preview: 'Documentation and examples' },
  { id: 'search', label: 'Search', icon: 'F', preview: 'Search panel', dock: 'left' },
  { id: 'theme', label: 'Theme', icon: 'T', preview: 'Design tokens and colors' },
  { id: 'board', label: 'Board', icon: 'B', preview: 'Planning board' },
  { id: 'console', label: 'Console', icon: 'C', preview: 'Runtime logs' },
  { id: 'settings', label: 'Settings', icon: 'S', preview: 'Workspace settings' },
  { id: 'deploys', label: 'Deploys', icon: 'P', preview: 'Deployment history' },
  { id: 'profile', label: 'Profile', icon: 'U', preview: 'User profile' }
]

const commandDockItems: CommandDockItem[] = [
  { id: 'inbox', label: 'Inbox', description: 'Messages and updates', group: 'Workspace', icon: <InboxOutlinedIcon fontSize="small" />, badge: <Chip label="4" size="small" /> },
  { id: 'search', label: 'Search', description: 'Find anything', group: 'Workspace', icon: <SearchOutlinedIcon fontSize="small" /> },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Active work',
    group: 'Workspace',
    icon: <FolderOutlinedIcon fontSize="small" />,
    children: [
      { id: 'roadmap', label: 'Roadmap', description: 'Milestones and bets', icon: <AccountTreeOutlinedIcon fontSize="small" /> },
      { id: 'launch', label: 'Launch', description: 'Release checklist', icon: <RocketLaunchOutlinedIcon fontSize="small" /> }
    ]
  },
  {
    id: 'automations',
    label: 'Automations',
    description: 'Rules and triggers',
    group: 'Tools',
    icon: <BoltOutlinedIcon fontSize="small" />,
    children: [
      { id: 'rules', label: 'Rules', description: 'Routing logic', icon: <BoltOutlinedIcon fontSize="small" /> },
      { id: 'webhooks', label: 'Webhooks', description: 'External events', icon: <AccountTreeOutlinedIcon fontSize="small" /> }
    ]
  },
  { id: 'tokens', label: 'Tokens', description: 'Design system values', group: 'Tools', icon: <PaletteOutlinedIcon fontSize="small" /> },
  { id: 'settings', label: 'Settings', description: 'Account and app prefs', group: 'System', icon: <SettingsOutlinedIcon fontSize="small" /> }
]

function findCommandDockItem(items: CommandDockItem[], itemId: string): CommandDockItem | undefined {
  for (const item of items) {
    if (item.id === itemId) {
      return item
    }

    const child = findCommandDockItem(item.children ?? [], itemId)

    if (child) {
      return child
    }
  }

  return undefined
}

const defaultToastCenterToasts: ToastCenterToast[] = [
  {
    id: 'deploy-live',
    title: 'Deploy complete',
    message: 'Production is live.',
    tone: 'success',
    group: 'deploys'
  },
  {
    id: 'queue-live',
    title: 'Build queued',
    message: 'Runner starts soon.',
    tone: 'info',
    group: 'builds'
  },
  {
    id: 'queue-live-2',
    title: 'Build queued',
    message: 'Docs job added.',
    tone: 'info',
    group: 'builds'
  }
]

const tourGuideSteps: TourGuideStep[] = [
  {
    id: 'start',
    title: 'Start the work',
    content: 'This button begins the main workflow. The spotlight follows its target.',
    target: '#tour-guide-start',
    placement: 'bottom'
  },
  {
    id: 'branch',
    title: 'Pick a path',
    content: 'Branches can send users to different steps based on what they need.',
    target: '#tour-guide-branch',
    placement: 'right',
    branches: [
      { label: 'Settings', stepId: 'settings' },
      { label: 'Report', stepId: 'report' }
    ]
  },
  {
    id: 'settings',
    title: 'Tune settings',
    content: 'This branch highlights controls for configuration.',
    target: '#tour-guide-settings',
    placement: 'top'
  },
  {
    id: 'report',
    title: 'Review report',
    content: 'This branch points to the output users should inspect.',
    target: '#tour-guide-report',
    placement: 'left'
  }
]

const dashboardWidgets: ResizableDashboardWidget[] = [
  {
    id: 'revenue',
    title: 'Revenue',
    layout: { x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
    children: (
      <Box>
        <Typography variant="h4" fontWeight={950}>€128K</Typography>
        <Typography color="text.secondary">+8.8% from last week</Typography>
      </Box>
    )
  },
  {
    id: 'traffic',
    title: 'Traffic',
    layout: { x: 4, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
    children: (
      <Stack spacing={1}>
        {[68, 44, 82, 56, 74].map((value, index) => (
          <Box key={index} sx={{ height: 10, borderRadius: 1, bgcolor: '#dbeafe', overflow: 'hidden' }}>
            <Box sx={{ width: `${value}%`, height: '100%', bgcolor: '#2563eb' }} />
          </Box>
        ))}
      </Stack>
    )
  },
  {
    id: 'tasks',
    title: 'Tasks',
    layout: { x: 8, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
    children: (
      <Stack spacing={1}>
        {['Review props', 'Ship docs', 'Polish examples'].map((task) => (
          <Paper key={task} variant="outlined" sx={{ px: 1.25, py: 0.75, borderRadius: 1 }}>
            <Typography variant="body2" fontWeight={750}>{task}</Typography>
          </Paper>
        ))}
      </Stack>
    )
  },
  {
    id: 'health',
    title: 'System health',
    layout: { x: 0, y: 3, w: 5, h: 3, minW: 3, minH: 2 },
    children: (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        {[
          ['API', '99.9%'],
          ['Queue', '12ms'],
          ['Build', 'green']
        ].map(([label, value]) => (
          <Paper key={label} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography fontWeight={900}>{value}</Typography>
          </Paper>
        ))}
      </Box>
    )
  },
  {
    id: 'notes',
    title: 'Notes',
    layout: { x: 5, y: 3, w: 7, h: 3, minW: 3, minH: 2 },
    children: (
      <Typography color="text.secondary">
        Drag widget headers. Pull bottom-right handles. Layout snaps, avoids overlap, and remembers positions.
      </Typography>
    )
  }
]

const defaultKanbanColumns: KanbanColumn[] = [
  {
    id: 'ideas',
    title: 'Ideas',
    color: '#2563eb',
    cards: [
      { id: 'k-1', title: 'Customer interviews', description: 'Talk to five active users.', tags: ['Research'], color: '#dbeafe' },
      { id: 'k-2', title: 'Metric cards', description: 'Show data at a glance.', tags: ['Data'] }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    color: '#d97706',
    cards: [
      { id: 'k-3', title: 'Kanban interactions', description: 'Create, drag, edit, and delete.', tags: ['UI'], color: '#fef3c7' }
    ]
  },
  {
    id: 'ship',
    title: 'Ship',
    color: '#059669',
    cards: [
      { id: 'k-4', title: 'Docs and examples', description: 'Make the component easy to try.', tags: ['Docs'], color: '#dcfce7' }
    ]
  }
]

const defaultFlowBuilderNodes: FlowBuilderNode[] = [
  {
    id: 'trigger',
    label: 'New signup',
    x: 48,
    y: 128,
    tone: '#eff6ff',
    outputs: [{ id: 'event', label: 'Event', type: 'event' }]
  },
  {
    id: 'enrich',
    label: 'Enrich user',
    x: 330,
    y: 78,
    tone: '#f0fdf4',
    inputs: [{ id: 'event', label: 'Event', type: 'event' }],
    outputs: [{ id: 'profile', label: 'Profile', type: 'data' }, { id: 'failed', label: 'Failed', type: 'error' }]
  },
  {
    id: 'email',
    label: 'Send email',
    x: 620,
    y: 110,
    tone: '#fdf2f8',
    inputs: [{ id: 'profile', label: 'Profile', type: 'data' }],
    outputs: [{ id: 'sent', label: 'Sent', type: 'success' }]
  },
  {
    id: 'slack',
    label: 'Alert team',
    x: 620,
    y: 260,
    tone: '#fef3c7',
    inputs: [{ id: 'error', label: 'Error', type: 'error' }]
  }
]

const defaultFlowBuilderConnections: FlowBuilderConnection[] = [
  { id: 'signup-enrich', fromNodeId: 'trigger', fromPortId: 'event', toNodeId: 'enrich', toPortId: 'event', type: 'event', label: 'signup' },
  { id: 'enrich-email', fromNodeId: 'enrich', fromPortId: 'profile', toNodeId: 'email', toPortId: 'profile', type: 'data', label: 'profile' },
  { id: 'enrich-slack', fromNodeId: 'enrich', fromPortId: 'failed', toNodeId: 'slack', toPortId: 'error', type: 'error', label: 'failure' }
]

const selectionBoxItems = [
  { id: 'roadmap', label: 'Roadmap', type: 'Doc', color: '#dbeafe' },
  { id: 'assets', label: 'Assets', type: 'Folder', color: '#dcfce7' },
  { id: 'launch', label: 'Launch', type: 'Board', color: '#fef3c7' },
  { id: 'billing', label: 'Billing', type: 'Sheet', color: '#fee2e2' },
  { id: 'research', label: 'Research', type: 'Doc', color: '#e0e7ff' },
  { id: 'support', label: 'Support', type: 'Inbox', color: '#fce7f3' },
  { id: 'qa', label: 'QA notes', type: 'Doc', color: '#ccfbf1' },
  { id: 'metrics', label: 'Metrics', type: 'Chart', color: '#ffedd5' }
]

const bulkActionBarActions: BulkActionBarAction[] = [
  { id: 'archive', label: 'Archive' },
  { id: 'assign', label: 'Assign', tone: 'primary' },
  { id: 'export', label: 'Export', overflow: true },
  { id: 'delete', label: 'Delete', tone: 'danger', overflow: true }
]

const presenceCursorUsers: PresenceCursorUser[] = [
  { id: 'ada', name: 'Ada', x: 22, y: 30, color: '#2563eb', selection: { x: 12, y: 18, width: 26, height: 18, label: 'Editing header' } },
  { id: 'lin', name: 'Lin', x: 68, y: 52, color: '#db2777', status: 'idle', selection: { x: 58, y: 44, width: 22, height: 24, label: 'Reviewing' } },
  { id: 'mika', name: 'Mika', x: 44, y: 76, color: '#059669', status: 'active' }
]

const statusRailGroups: StatusRailGroup[] = [
  { id: 'api', label: 'API Gateway', status: 'operational', uptime: 99.99, latency: 142 },
  {
    id: 'jobs',
    label: 'Workers',
    status: 'incident',
    uptime: 98.72,
    latency: 410,
    incidents: [
      { id: 'queue', title: 'Queue delay', message: 'Backlog above threshold', severity: 'incident', timestamp: Date.now() - 1000 * 60 * 7 },
      { id: 'retry', title: 'Retry spike', message: 'Payment retries elevated', severity: 'degraded', timestamp: Date.now() - 1000 * 60 * 18 }
    ]
  },
  {
    id: 'search',
    label: 'Search',
    status: 'degraded',
    uptime: 99.31,
    latency: 260,
    incidents: [
      { id: 'index', title: 'Index lag', message: 'Fresh results delayed', severity: 'degraded', timestamp: Date.now() - 1000 * 60 * 24 }
    ]
  },
  { id: 'deploys', label: 'Deploys', status: 'maintenance', uptime: 99.9, latency: 188, incidents: [{ id: 'window', title: 'Maintenance window', message: 'Deploy lock active', severity: 'maintenance' }] }
]

const spotlightSearchItems: SpotlightSearchItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Open live product metrics',
    group: 'Navigation',
    keywords: ['home', 'metrics', 'overview'],
    preview: <DataCardGrid metrics={dataCardGridMetrics.slice(0, 3)} columns={3} density="compact" />,
    actions: [{ id: 'open', label: 'Open' }, { id: 'pin', label: 'Pin' }]
  },
  {
    id: 'deploy',
    label: 'Deploy production',
    description: 'Release the latest build',
    group: 'Actions',
    keywords: ['ship', 'release'],
    preview: <StatusRail groups={statusRailGroups.slice(0, 3)} title="Deploy health" compact />,
    actions: [{ id: 'run', label: 'Run deploy' }, { id: 'dry', label: 'Dry run' }]
  },
  {
    id: 'workflow',
    label: 'Workflow builder',
    description: 'Edit automation graph',
    group: 'Components',
    keywords: ['flow', 'automation'],
    preview: <FlowBuilder nodes={defaultFlowBuilderNodes.slice(0, 3)} connections={defaultFlowBuilderConnections.slice(0, 2)} sx={{ minHeight: 220 }} />
  },
  {
    id: 'docs',
    label: 'Docs',
    description: 'Read component reference',
    group: 'Resources',
    keywords: ['help', 'guide'],
    preview: <Typography color="text.secondary">Jump into API docs, examples, and props.</Typography>,
    actions: [{ id: 'copy', label: 'Copy link' }]
  }
]

const smartBreadcrumbItems: SmartBreadcrumbItem[] = [
  {
    id: 'workspace',
    label: 'Acme',
    description: 'Workspace root and team overview',
    icon: <InboxOutlinedIcon fontSize="small" />,
    keywords: ['team', 'root'],
    preview: <DataCardGrid metrics={dataCardGridMetrics.slice(0, 3)} columns={3} density="compact" />,
    actions: [{ id: 'open', label: 'Open workspace' }, { id: 'copy', label: 'Copy link' }]
  },
  {
    id: 'product',
    label: 'Product',
    description: 'Product operations and planning',
    icon: <FolderOutlinedIcon fontSize="small" />,
    keywords: ['area', 'planning'],
    preview: <Typography color="text.secondary">Product area contains roadmaps, releases, and customer signals.</Typography>,
    actions: [{ id: 'pin', label: 'Pin' }]
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    description: 'Quarterly priorities and milestones',
    icon: <AccountTreeOutlinedIcon fontSize="small" />,
    keywords: ['plan', 'milestones'],
    preview: <LayoutSwitcher items={layoutSwitcherItems.slice(0, 4)} defaultView="kanban" dense sx={{ minHeight: 240 }} />
  },
  {
    id: 'release',
    children: (
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
        <span>Release 2.4</span>
        <Chip size="small" label="live" color="success" sx={{ height: 18, fontSize: 11, fontWeight: 900 }} />
      </Stack>
    ),
    labelText: 'Release 2.4 live',
    description: 'Active launch train',
    icon: <RocketLaunchOutlinedIcon fontSize="small" />,
    keywords: ['launch', 'ship'],
    preview: <StatusRail groups={statusRailGroups.slice(0, 3)} title="Release health" compact />,
    actions: [{ id: 'brief', label: 'Open brief' }, { id: 'status', label: 'Copy status' }]
  },
  {
    id: 'assets',
    label: 'Design assets',
    description: 'Images, tokens, and handoff notes',
    icon: <PaletteOutlinedIcon fontSize="small" />,
    keywords: ['figma', 'tokens'],
    preview: <ColorStudio initialColors={colorStudioColors.slice(0, 3)} />
  },
  {
    id: 'handoff',
    label: 'Engineering handoff',
    description: 'Current implementation checklist',
    icon: <BoltOutlinedIcon fontSize="small" />,
    keywords: ['dev', 'implementation'],
    preview: <Typography color="text.secondary">Ready for implementation with owners, risks, and linked specs.</Typography>,
    actions: [{ id: 'assign', label: 'Assign owner' }]
  }
]

const defaultInspectorDrawerSections: InspectorDrawerSection[] = [
  {
    id: 'content',
    title: 'Content',
    description: 'Main copy and visibility',
    fields: [
      {
        id: 'title',
        label: 'Title',
        type: 'text',
        value: 'Launch report',
        description: 'Shown in the preview card',
        validate: (value) => String(value).trim().length < 3 ? 'Use at least 3 characters' : null
      },
      { id: 'enabled', label: 'Enabled', type: 'boolean', value: true, description: 'Controls active state' }
    ]
  },
  {
    id: 'layout',
    title: 'Layout',
    description: 'Size and visual weight',
    fields: [
      { id: 'width', label: 'Width', type: 'number', value: 320, min: 180, max: 520, step: 10, unit: 'px', description: 'Card width' },
      { id: 'radius', label: 'Radius', type: 'number', value: 8, min: 0, max: 32, step: 1, unit: 'px', description: 'Corner radius' }
    ]
  },
  {
    id: 'style',
    title: 'Style',
    description: 'Presentation controls',
    fields: [
      { id: 'tone', label: 'Tone', type: 'select', value: 'Calm', options: [{ label: 'Calm', value: 'Calm' }, { label: 'Bold', value: 'Bold' }, { label: 'Urgent', value: 'Urgent' }] },
      { id: 'accent', label: 'Accent', type: 'color', value: '#2563eb', validate: (value) => /^#[0-9a-f]{6}$/i.test(String(value)) ? null : 'Use a 6 digit hex color' }
    ]
  }
]

const sampleTabs = ['JavaScript', 'TypeScript']

function getInspectorDrawerValue(sections: InspectorDrawerSection[], fieldId: string, fallback: InspectorDrawerFieldValue) {
  return sections.flatMap((section) => section.fields).find((field) => field.id === fieldId)?.value ?? fallback
}

function getComponentGroup(name: string) {
  if (['GlassBox', 'ColorPicker', 'ColorStudio', 'CodeViewer', 'CompareStack', 'DataCardGrid', 'DataLens', 'DensityController', 'LayoutSwitcher', 'MiniMapNavigator', 'DockBar', 'TimelineScrubber'].includes(name)) {
    return 'Display'
  }

  if (['DraggableBox', 'SplitPane', 'ResizableFrame', 'ResizableDashboard', 'BeforeAfterSlider', 'InfiniteCanvas', 'SelectionBox', 'PresenceCursors'].includes(name)) {
    return 'Layout'
  }

  if (['BulkActionBar'].includes(name)) {
    return 'Input'
  }

  if (['StatusRail', 'PeekPanel'].includes(name)) {
    return 'Display'
  }

  if (['FlowBuilder'].includes(name)) {
    return 'Input'
  }

  if (['CommandPalette', 'CommandTimeline', 'SpotlightSearch', 'FloatingToolbar', 'FileDropZone', 'DropComposer', 'EntityPicker', 'InspectorDrawer', 'InspectorPanel', 'KanbanBoard', 'SmartTooltip', 'ToastCenter', 'TourGuide'].includes(name)) {
    return 'Input'
  }

  if (['CommandDock', 'DockTabs', 'MorphMenu', 'SmartBreadcrumbs'].includes(name)) {
    return 'Navigation'
  }

  if (['FocusRing'].includes(name)) {
    return 'Effects'
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

function createFocusRingJavaScriptSample(config: FocusRingConfig) {
  return `import Button from '@mui/material/Button'
import { FocusRing } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <FocusRing tone="error" active pulseSize={${config.pulseSize}}>
      <Button variant="outlined">Needs attention</Button>
    </FocusRing>
  )
}`
}

function createFocusRingTypeScriptSample(config: FocusRingConfig) {
  return `import Button from '@mui/material/Button'
import { FocusRing, type FocusRingProps } from '@mickyballadelli/react-things'

const ringProps: FocusRingProps = {
  tone: 'warning',
  pulse: true,
  pulseSize: ${config.pulseSize},
  active: true
}

export function Example() {
  return (
    <FocusRing {...ringProps}>
      <Button variant="outlined">Check this</Button>
    </FocusRing>
  )
}`
}

function createFocusRingSampleCode(config: FocusRingConfig) {
  return {
    'FocusRing:JavaScript': createFocusRingJavaScriptSample(config),
    'FocusRing:TypeScript': createFocusRingTypeScriptSample(config)
  }
}

function readFocusRingConfig(code: string, currentConfig: FocusRingConfig): FocusRingConfig {
  return {
    pulseSize: readNumberProp(code, 'pulseSize', currentConfig.pulseSize)
  }
}

function createInitialSampleCode(glassConfig: GlassBoxConfig, focusRingConfig: FocusRingConfig) {
  return {
    ...Object.fromEntries(componentDocs.flatMap((component) => component.samples.map((sample) => [
      `${component.name}:${sample.label}`,
      sample.initialCode
    ]))),
    ...createGlassBoxSampleCode(glassConfig),
    ...createFocusRingSampleCode(focusRingConfig)
  }
}

export function ComponentDocs() {
  const initialComponentName = new URLSearchParams(window.location.search).get('component')
  const initialComponent = componentDocs.find((component) => component.name === initialComponentName) ?? componentDocs[0]
  const [selectedComponentName, setSelectedComponentName] = useState(initialComponent.name)
  const selectedComponent = componentDocs.find((component) => component.name === selectedComponentName) ?? componentDocs[0]
  const [glassBoxConfig, setGlassBoxConfig] = useState(defaultGlassBoxConfig)
  const [focusRingConfig, setFocusRingConfig] = useState<FocusRingConfig>({ pulseSize: 34 })
  const [sampleCode, setSampleCode] = useState<Record<string, string>>(createInitialSampleCode(defaultGlassBoxConfig, { pulseSize: 34 }))
  const [selectedSampleLabel, setSelectedSampleLabel] = useState(sampleTabs[0])
  const [commandDockSelectedId, setCommandDockSelectedId] = useState('inbox')
  const [commandPaletteSelectedId, setCommandPaletteSelectedId] = useState('components')
  const [pickerColor, setPickerColor] = useState('#2563eb')
  const [pickerAlpha, setPickerAlpha] = useState(0.8)
  const [splitSize, setSplitSize] = useState(34)
  const [splitCollapsed, setSplitCollapsed] = useState<'first' | 'second' | null>(null)
  const [selectionBoxSelectedIds, setSelectionBoxSelectedIds] = useState<string[]>(['roadmap', 'assets'])
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
  const [inspectorDrawerOpen, setInspectorDrawerOpen] = useState(false)
  const [inspectorDrawerSections, setInspectorDrawerSections] = useState<InspectorDrawerSection[]>(defaultInspectorDrawerSections)
  const floatingToolbarContainerRef = useRef<HTMLDivElement | null>(null)
  const floatingToolbarButtonRef = useRef<HTMLButtonElement | null>(null)
  const floatingToolbarBottomButtonRef = useRef<HTMLButtonElement | null>(null)
  const miniMapPreviewRef = useRef<HTMLDivElement | null>(null)
  const [floatingToolbarRect, setFloatingToolbarRect] = useState<DOMRect | null>(null)
  const [floatingToolbarElementOpen, setFloatingToolbarElementOpen] = useState(false)
  const [floatingToolbarBottomOpen, setFloatingToolbarBottomOpen] = useState(false)
  const [nodeCanvasSelectedId, setNodeCanvasSelectedId] = useState<string | null>('a')
  const [flowBuilderNodes, setFlowBuilderNodes] = useState<FlowBuilderNode[]>(defaultFlowBuilderNodes)
  const [flowBuilderConnections, setFlowBuilderConnections] = useState<FlowBuilderConnection[]>(defaultFlowBuilderConnections)
  const [timelineTime, setTimelineTime] = useState(34)
  const [infiniteCanvasSelectedId, setInfiniteCanvasSelectedId] = useState<string | null>('idea')
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(defaultKanbanColumns)
  const [dockTabs, setDockTabs] = useState<DockTab[]>(defaultDockTabs)
  const [activeDockTabId, setActiveDockTabId] = useState('home')
  const [toastCenterToasts, setToastCenterToasts] = useState<ToastCenterToast[]>(defaultToastCenterToasts)
  const [tourGuideOpen, setTourGuideOpen] = useState(false)
  const [tourGuideDone, setTourGuideDone] = useState(false)

  const selectedSamples = selectedComponent.name === 'GlassBox'
    ? [
      { label: 'JavaScript', language: 'javascript', initialCode: sampleCode['GlassBox:JavaScript'] },
      { label: 'TypeScript', language: 'typescript', initialCode: sampleCode['GlassBox:TypeScript'] }
    ]
    : selectedComponent.name === 'FocusRing'
      ? [
        { label: 'JavaScript', language: 'javascript', initialCode: sampleCode['FocusRing:JavaScript'] },
        { label: 'TypeScript', language: 'typescript', initialCode: sampleCode['FocusRing:TypeScript'] }
      ]
    : selectedComponent.samples

  useEffect(() => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('component', selectedComponent.name)
    window.history.replaceState(null, '', nextUrl)
  }, [selectedComponent.name])

  function updateSample(nextCode: string, sampleLabel: string) {
    const sampleKey = `${selectedComponent.name}:${sampleLabel}`

    if (selectedComponent.name === 'FocusRing') {
      const nextConfig = readFocusRingConfig(nextCode, focusRingConfig)
      const syncedCode = createFocusRingSampleCode(nextConfig)

      setFocusRingConfig(nextConfig)
      setSampleCode({
        ...sampleCode,
        ...syncedCode,
        [sampleKey]: nextCode
      })
      return
    }

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

    if (selectedComponent.name === 'MorphMenu') {
      return (
        <Box sx={{ minHeight: 380, display: 'grid', placeItems: 'center', bgcolor: '#f8fafc', overflow: 'hidden' }}>
          <MorphMenu items={morphMenuItems} radius={126} startAngle={-170} endAngle={-10}>
            <Button variant="contained" size="large">Open radial menu</Button>
          </MorphMenu>
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

    if (selectedComponent.name === 'FlowBuilder') {
      return (
        <Box sx={{ minHeight: 540, p: 3, bgcolor: '#f8fafc' }}>
          <FlowBuilder
            nodes={flowBuilderNodes}
            connections={flowBuilderConnections}
            onNodesChange={setFlowBuilderNodes}
            onConnectionsChange={setFlowBuilderConnections}
            sx={{ minHeight: 500, border: 1, borderColor: 'divider', borderRadius: 1 }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'BeforeAfterSlider') {
      return <BeforeAfterSlider sx={{ minHeight: 320 }} before={<Box sx={{ height: '100%', bgcolor: '#2563eb', color: '#fff', p: 4 }}><Typography variant="h4">Before</Typography></Box>} after={<Box sx={{ height: '100%', bgcolor: '#f59e0b', color: '#111827', p: 4 }}><Typography variant="h4">After</Typography></Box>} />
    }

    if (selectedComponent.name === 'CompareStack') {
      return (
        <Box sx={{ minHeight: 560, p: 3, bgcolor: '#f8fafc' }}>
          <CompareStack
            title="Campaign comparison"
            subtitle="Blend before, after, and annotation layers."
            layers={compareStackLayers}
            minHeight={420}
          />
        </Box>
      )
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

    if (selectedComponent.name === 'SelectionBox') {
      return (
        <Box sx={{ minHeight: 430, p: 3, bgcolor: '#f8fafc' }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography color="text.secondary">
                Drag across items. Cmd/Ctrl-click toggles. Shift-click adds.
              </Typography>
              <Chip label={`${selectionBoxSelectedIds.length} selected`} />
            </Stack>
            <SelectionBox
              selectedIds={selectionBoxSelectedIds}
              onSelectionChange={(change) => setSelectionBoxSelectedIds(change.selectedIds)}
              selectionColor="#db2777"
              sx={{
                minHeight: 320,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                gap: 1.5,
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              {selectionBoxItems.map((item) => (
                <Paper
                  key={item.id}
                  data-selection-id={item.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: item.color,
                    minHeight: 96,
                    display: 'grid',
                    alignContent: 'space-between'
                  }}
                >
                  <Typography fontWeight={950}>{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.type}</Typography>
                </Paper>
              ))}
            </SelectionBox>
          </Stack>
        </Box>
      )
    }

    if (selectedComponent.name === 'BulkActionBar') {
      return (
        <Box sx={{ minHeight: 430, p: 3, bgcolor: '#f8fafc' }}>
          <Stack spacing={1.5}>
            <BulkActionBar
              selectedIds={selectionBoxSelectedIds}
              totalCount={selectionBoxItems.length}
              actions={bulkActionBarActions}
              onClear={() => setSelectionBoxSelectedIds([])}
            />
            <SelectionBox
              selectedIds={selectionBoxSelectedIds}
              onSelectionChange={(change) => setSelectionBoxSelectedIds(change.selectedIds)}
              selectionColor="#2563eb"
              sx={{
                minHeight: 300,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                gap: 1.5,
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            >
              {selectionBoxItems.map((item) => (
                <Paper key={item.id} data-selection-id={item.id} variant="outlined" sx={{ p: 2, borderRadius: 1, bgcolor: item.color, minHeight: 90 }}>
                  <Typography fontWeight={950}>{item.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.type}</Typography>
                </Paper>
              ))}
            </SelectionBox>
          </Stack>
        </Box>
      )
    }

    if (selectedComponent.name === 'PresenceCursors') {
      return (
        <Box sx={{ minHeight: 430, p: 3, bgcolor: '#f8fafc' }}>
          <PresenceCursors
            users={presenceCursorUsers}
            sx={{
              minHeight: 360,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              backgroundImage: 'linear-gradient(rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.18) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, p: 4, pt: 7 }}>
              {['Overview', 'Metrics', 'Roadmap', 'Feedback', 'Launch', 'Settings'].map((item) => (
                <Paper key={item} variant="outlined" sx={{ p: 2, borderRadius: 1, minHeight: 86 }}>
                  <Typography fontWeight={950}>{item}</Typography>
                  <Typography variant="body2" color="text.secondary">Shared workspace</Typography>
                </Paper>
              ))}
            </Box>
          </PresenceCursors>
        </Box>
      )
    }

    if (selectedComponent.name === 'StatusRail') {
      return (
        <Box sx={{ minHeight: 500, p: 3, bgcolor: '#f8fafc', display: 'grid', placeItems: 'start center' }}>
          <StatusRail
            title="Production health"
            subtitle="Live operational pulse"
            groups={statusRailGroups}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'ResizableFrame') {
      return <Box sx={{ minHeight: 340, p: 3, bgcolor: '#f8fafc' }}><ResizableFrame><Box sx={{ p: 2 }}><Typography fontWeight={850}>Resize me</Typography><Typography color="text.secondary">Drag bottom-right corner.</Typography></Box></ResizableFrame></Box>
    }

    if (selectedComponent.name === 'ResizableDashboard') {
      return (
        <Box sx={{ minHeight: 560, p: 3, bgcolor: '#f8fafc' }}>
          <ResizableDashboard
            widgets={dashboardWidgets}
            persistKey="react-things-resizable-dashboard-preview"
            sx={{ minHeight: 500 }}
          />
        </Box>
      )
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

    if (selectedComponent.name === 'InspectorDrawer') {
      const title = String(getInspectorDrawerValue(inspectorDrawerSections, 'title', 'Launch report'))
      const accent = String(getInspectorDrawerValue(inspectorDrawerSections, 'accent', '#2563eb'))
      const tone = String(getInspectorDrawerValue(inspectorDrawerSections, 'tone', 'Calm'))
      const width = Number(getInspectorDrawerValue(inspectorDrawerSections, 'width', 320))
      const radius = Number(getInspectorDrawerValue(inspectorDrawerSections, 'radius', 8))
      const enabled = Boolean(getInspectorDrawerValue(inspectorDrawerSections, 'enabled', true))

      return (
        <Box sx={{ p: 3, minHeight: 420, bgcolor: '#f8fafc' }}>
          <Stack spacing={2} alignItems="flex-start">
            <Button variant="contained" onClick={() => setInspectorDrawerOpen(true)}>Open inspector</Button>
            <Paper
              variant="outlined"
              sx={{
                width,
                maxWidth: '100%',
                p: 3,
                borderRadius: `${radius}px`,
                borderColor: accent,
                bgcolor: enabled ? 'background.paper' : '#e5e7eb',
                boxShadow: tone === 'Bold' ? `0 18px 45px ${accent}44` : 'none'
              }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight={900}>{tone}</Typography>
              <Typography variant="h4" fontWeight={950} sx={{ color: accent }}>{title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Drawer edits this card, validates title and color, and can undo changes.
              </Typography>
            </Paper>
          </Stack>
          <InspectorDrawer
            open={inspectorDrawerOpen}
            onClose={() => setInspectorDrawerOpen(false)}
            title="Card properties"
            subtitle="Sectioned fields with live validation"
            sections={inspectorDrawerSections}
            onSectionsChange={setInspectorDrawerSections}
          />
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

    if (selectedComponent.name === 'ColorStudio') {
      return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <ColorStudio initialColors={colorStudioColors} sx={{ minHeight: 560 }} />
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

    if (selectedComponent.name === 'DropComposer') {
      return (
        <Box sx={{ minHeight: 620, p: 3, bgcolor: '#f8fafc' }}>
          <DropComposer
            defaultItems={defaultDropComposerItems}
            accept="image/*,.pdf,.json"
            title="Compose launch upload"
            subtitle="Drop assets, reorder the queue, edit names, and watch upload progress."
            sx={{ maxWidth: 920, mx: 'auto' }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'EntityPicker') {
      return (
        <Box sx={{ minHeight: 560, p: 3, bgcolor: '#f8fafc' }}>
          <EntityPicker
            title="Add to workspace"
            subtitle="Pick people, files, and projects from one surface."
            entities={entityPickerEntities}
            defaultValue={['micky', 'launch-brief']}
            multiple
            sx={{ maxWidth: 720, mx: 'auto' }}
          />
        </Box>
      )
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

    if (selectedComponent.name === 'ToastCenter') {
      function addToast(tone: ToastCenterToast['tone'], group: string, title: string) {
        setToastCenterToasts((currentToasts) => [
          {
            id: `${group}-${Date.now()}`,
            title,
            message: group === 'builds' ? 'Grouped with related build notifications.' : 'Stored in history when dismissed.',
            tone,
            group,
            actions: [{ id: 'view', label: 'View' }]
          },
          ...currentToasts
        ])
      }

      return (
        <Box sx={{ position: 'relative', minHeight: 520, p: 3, bgcolor: '#f8fafc', overflow: 'hidden' }}>
          <Stack spacing={2} sx={{ maxWidth: 520 }}>
            <Typography variant="h5" fontWeight={900}>ToastCenter</Typography>
            <Typography color="text.secondary">
              Add repeated build messages to see grouping. Dismiss toasts, then open history.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="contained" onClick={() => addToast('info', 'builds', 'Build queued')}>Build</Button>
              <Button variant="contained" color="success" onClick={() => addToast('success', 'deploys', 'Deploy complete')}>Deploy</Button>
              <Button variant="contained" color="warning" onClick={() => addToast('warning', 'alerts', 'Usage spike')}>Warn</Button>
              <Button variant="outlined" onClick={() => setToastCenterToasts(defaultToastCenterToasts)}>Reset</Button>
            </Stack>
          </Stack>
          <ToastCenter
            toasts={toastCenterToasts}
            onToastsChange={setToastCenterToasts}
            sx={{ position: 'absolute', right: 16, bottom: 16 }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'TourGuide') {
      return (
        <Box sx={{ position: 'relative', minHeight: 520, p: 3, bgcolor: '#f8fafc', overflow: 'hidden' }}>
          <Stack spacing={2} sx={{ maxWidth: 680 }}>
            <Typography variant="h5" fontWeight={900}>TourGuide</Typography>
            <Typography color="text.secondary">
              Start a walkthrough, branch to a path, and finish to mark completion.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button id="tour-guide-start" variant="contained" onClick={() => {
                setTourGuideDone(false)
                setTourGuideOpen(true)
              }}>Start tour</Button>
              <Button id="tour-guide-branch" variant="outlined">Branch choice</Button>
              <Button id="tour-guide-settings" variant="outlined">Settings</Button>
              <Button id="tour-guide-report" variant="outlined">Report</Button>
              <Chip label={tourGuideDone ? 'complete' : 'not complete'} color={tourGuideDone ? 'success' : 'default'} />
            </Stack>
          </Stack>
          <TourGuide
            steps={tourGuideSteps}
            open={tourGuideOpen}
            completed={tourGuideDone}
            onOpenChange={setTourGuideOpen}
            onComplete={() => {
              setTourGuideDone(true)
              setTourGuideOpen(false)
            }}
            onSkip={() => setTourGuideOpen(false)}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'DataCardGrid') {
      return (
        <Box sx={{ minHeight: 420, p: 3, bgcolor: '#f8fafc' }}>
          <DataCardGrid
            title="Store pulse"
            subtitle="Revenue, demand, conversion, and system health in one glance."
            metrics={dataCardGridMetrics}
            columns={4}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'DataLens') {
      return (
        <Box sx={{ minHeight: 460, p: 3, bgcolor: '#f8fafc' }}>
          <DataLens<DataLensService>
            title="Service lens"
            subtitle="Filter owners and status, sort load or requests, switch table/card view."
            rows={dataLensRows}
            columns={dataLensColumns}
            initialSort={{ columnId: 'load', direction: 'desc' }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'LayoutSwitcher') {
      return (
        <Box sx={{ minHeight: 520, p: 3, bgcolor: '#f8fafc' }}>
          <LayoutSwitcher
            title="Launch work"
            subtitle="Same items, animated through table, cards, kanban, calendar, and list."
            items={layoutSwitcherItems}
            groupOrder={['Todo', 'Doing', 'Review', 'Done']}
            defaultView="cards"
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'KanbanBoard') {
      return (
        <Box sx={{ minHeight: 520, p: 3, bgcolor: '#f8fafc' }}>
          <KanbanBoard
            title="Launch board"
            subtitle="Create columns, add cards, edit details, drag cards, and reorder columns."
            columns={kanbanColumns}
            onChange={setKanbanColumns}
          />
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

    if (selectedComponent.name === 'FocusRing') {
      return (
        <Box sx={{ minHeight: 340, display: 'grid', placeItems: 'center', bgcolor: '#f8fafc' }}>
          <Stack spacing={3} alignItems="center">
            <FocusRing tone="error" active padding={8} radius={12} pulseSize={focusRingConfig.pulseSize}>
              <Button variant="outlined" color="error">Invalid field</Button>
            </FocusRing>
            <FocusRing tone="primary">
              <Button variant="contained">Focus me</Button>
            </FocusRing>
            <Typography color="text.secondary">Second ring appears when button receives focus.</Typography>
          </Stack>
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

    if (selectedComponent.name === 'CommandTimeline') {
      return (
        <Box sx={{ minHeight: 560, p: 3, bgcolor: '#f8fafc' }}>
          <Box sx={{ maxWidth: 820, mx: 'auto' }}>
            <CommandTimeline
              title="Editor history"
              subtitle="Undo, redo, or jump straight to a previous command state."
              entries={commandTimelineEntries}
              defaultCurrentId="moved"
            />
          </Box>
        </Box>
      )
    }

    if (selectedComponent.name === 'SpotlightSearch') {
      return (
        <Box sx={{ minHeight: 560, p: 3, bgcolor: '#f8fafc' }}>
          <SpotlightSearch
            items={spotlightSearchItems}
            placeholder="Search commands, components, docs"
            previewTitle="Live preview"
            sx={{ maxWidth: 920, mx: 'auto' }}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'SmartBreadcrumbs') {
      return (
        <Box sx={{ minHeight: 420, p: 3, bgcolor: '#f8fafc' }}>
          <Stack spacing={3}>
            <SmartBreadcrumbs
              items={smartBreadcrumbItems}
              maxVisible={3}
              sx={{ maxWidth: 760 }}
            />
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 1 }}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                Collapsed path search
              </Typography>
              <Typography variant="h4" fontWeight={950}>
                Long trails stay usable
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
                Hover crumbs to peek. Click the dots to search hidden path segments and jump there.
              </Typography>
            </Paper>
          </Stack>
        </Box>
      )
    }

    if (selectedComponent.name === 'PeekPanel') {
      return (
        <Box sx={{ minHeight: 420, p: 3, bgcolor: '#f8fafc' }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, maxWidth: 760 }}>
            <Typography variant="overline" color="text.secondary" fontWeight={900}>
              Editor preview
            </Typography>
            <Typography variant="h4" fontWeight={950}>
              Inspect without leaving place
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 620 }}>
              Hover or click the symbol below to peek at a definition, then jump or copy path from actions.
            </Typography>
            <Box sx={{ mt: 3, fontFamily: 'monospace', fontSize: 15, color: '#0f172a' }}>
              const rail ={' '}
              <PeekPanel
                title="StatusRail"
                subtitle="packages/ui/src/components/StatusRail.tsx"
                content="Vertical operational health rail with grouped incidents and live pulse."
                preview={(
                  <CodeViewer
                    label="tsx"
                    language="tsx"
                    value={'export function StatusRail({ groups, compact }) {\\n  return <Box>{groups.map(renderGroup)}</Box>\\n}'}
                    onChange={() => {}}
                    minHeight={150}
                  />
                )}
                footer={<Typography variant="caption" color="text.secondary">Definition preview</Typography>}
                actions={[{ id: 'open', label: 'Open file' }, { id: 'copy', label: 'Copy path' }]}
              >
                <Button size="small" variant="text" sx={{ fontFamily: 'monospace', fontWeight: 900 }}>
                  StatusRail
                </Button>
              </PeekPanel>
            </Box>
          </Paper>
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

    if (selectedComponent.name === 'CommandDock') {
      const activeItem = findCommandDockItem(commandDockItems, commandDockSelectedId) ?? commandDockItems[0]

      return (
        <Box sx={{ minHeight: 420, display: 'flex', bgcolor: '#f8fafc' }}>
          <CommandDock
            items={commandDockItems}
            selectedId={commandDockSelectedId}
            title="Launch"
            persistKey="react-things-command-dock-preview"
            onSelect={(item) => setCommandDockSelectedId(item.id)}
            footer={(
              <Typography variant="caption" color="text.secondary">
                Persistent command rail
              </Typography>
            )}
          />
          <Box sx={{ flex: 1, minWidth: 0, p: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, minHeight: 300 }}>
              <Typography variant="overline" color="text.secondary" fontWeight={900}>
                {activeItem?.group}
              </Typography>
              <Typography variant="h4" fontWeight={950}>
                {activeItem?.label}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
                {activeItem?.description}. Use the dock to jump between command areas. Collapse state saves in the browser.
              </Typography>
              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 1.5 }}>
                {['Recent', 'Pinned', 'Shared'].map((label) => (
                  <Paper key={label} variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                    <Typography fontWeight={850}>{label}</Typography>
                    <Typography variant="body2" color="text.secondary">Workspace item</Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      )
    }

    if (selectedComponent.name === 'DockTabs') {
      const activeTab = dockTabs.find((tab) => tab.id === activeDockTabId) ?? dockTabs[0]

      return (
        <Box sx={{ minHeight: 380, bgcolor: '#f8fafc' }}>
          <Box sx={{ minHeight: 360 }}>
          <DockTabs
            tabs={dockTabs}
            activeId={activeDockTabId}
            maxVisible={5}
            onTabsChange={setDockTabs}
            onActiveChange={(tab) => setActiveDockTabId(tab.id)}
          />
          <Box sx={{ p: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 1, minHeight: 220 }}>
              <Typography variant="h5" fontWeight={900}>{activeTab?.label}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Drag tabs along the top to reorder. Drag one to the left side to dock it vertically.
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
                setDockTabs(defaultDockTabs)
                setActiveDockTabId('home')
              }}>
                Reset tabs
              </Button>
            </Paper>
          </Box>
          </Box>
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

    if (selectedComponent.name === 'DiffViewer') {
      return (
        <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
          <DiffViewer
            mode="object"
            title="Plan review"
            subtitle="Object keys are sorted, changes are grouped, and reviewers can leave notes."
            beforeLabel="Current"
            afterLabel="Proposed"
            before={{
              project: 'Atlas',
              status: 'draft',
              owners: ['Micky', 'Design'],
              limits: {
                retries: 2,
                timeout: 800
              },
              flags: {
                comments: false,
                approvals: false
              }
            }}
            after={{
              project: 'Atlas',
              status: 'ready',
              owners: ['Micky', 'Design', 'QA'],
              limits: {
                retries: 3,
                timeout: 1200
              },
              flags: {
                comments: true,
                approvals: true
              }
            }}
            defaultComments={[
              {
                id: 'diff-comment-1',
                hunkId: 'hunk-1-3-3',
                author: 'Reviewer',
                body: 'Timeout and approval flag move together.'
              }
            ]}
          />
        </Box>
      )
    }

    if (selectedComponent.name === 'DensityController') {
      return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <DensityController
            title="Workspace density"
            subtitle="Pick the layout feel once. The value persists in localStorage."
            persistKey="react-things-density-preview"
          >
            {({ density, spacing, padding, rowHeight, radius }) => (
              <Box sx={{ display: 'grid', gap: `${spacing}px` }}>
                {[
                  { title: 'Inbox triage', meta: '12 items', color: '#dbeafe' },
                  { title: 'Roadmap review', meta: '4 owners', color: '#dcfce7' },
                  { title: 'Launch checklist', meta: density, color: '#fef3c7' }
                ].map((item) => (
                  <Paper
                    key={item.title}
                    variant="outlined"
                    sx={{
                      p: `${padding}px`,
                      minHeight: `${rowHeight}px`,
                      borderRadius: `${radius}px`,
                      bgcolor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5
                    }}
                  >
                    <Typography fontWeight={950}>{item.title}</Typography>
                    <Chip size="small" label={item.meta} />
                  </Paper>
                ))}
              </Box>
            )}
          </DensityController>
        </Box>
      )
    }

    if (selectedComponent.name === 'MiniMapNavigator') {
      const sections = [
        { id: 'brief', label: 'Brief', targetId: 'mini-map-brief', color: '#2563eb', description: 'Opening context and goals' },
        { id: 'metrics', label: 'Metrics', targetId: 'mini-map-metrics', color: '#059669', description: 'Dashboard style section' },
        { id: 'canvas', label: 'Canvas', targetId: 'mini-map-canvas', color: '#7c3aed', description: 'Large visual workspace' },
        { id: 'notes', label: 'Notes', targetId: 'mini-map-notes', color: '#f59e0b', description: 'Long docs and decisions' }
      ]

      return (
        <Box sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 260px' }, gap: 2, alignItems: 'start' }}>
            <Paper
              ref={miniMapPreviewRef}
              variant="outlined"
              sx={{
                height: 520,
                overflow: 'auto',
                borderRadius: 1,
                bgcolor: '#ffffff'
              }}
            >
              {sections.map((section, index) => (
                <Box
                  key={section.id}
                  id={section.targetId}
                  sx={{
                    minHeight: index === 2 ? 520 : 360,
                    p: 3,
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <Typography variant="overline" color="text.secondary" fontWeight={900}>
                    {section.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={950} sx={{ color: section.color }}>
                    {section.description}
                  </Typography>
                  <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
                    {Array.from({ length: index === 2 ? 6 : 4 }, (_, cardIndex) => (
                      <Paper key={cardIndex} variant="outlined" sx={{ p: 2, borderRadius: 1, minHeight: 96 }}>
                        <Typography fontWeight={900}>Block {cardIndex + 1}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click the minimap or drag its viewport to move through this long surface.
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>

            <MiniMapNavigator
              title="Document map"
              subtitle="Click bars or drag viewport"
              items={sections}
              containerRef={miniMapPreviewRef}
              sticky
            />
          </Box>
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
      DensityController: [
        renderVariantCard('Compact', <DensityController defaultValue="compact" showReset={false}><Typography>Dense rows for high-volume tools.</Typography></DensityController>),
        renderVariantCard('Cozy', <DensityController defaultValue="cozy" showReset={false}><Typography>Balanced default for daily work.</Typography></DensityController>),
        renderVariantCard('Spacious', <DensityController defaultValue="spacious" showReset={false}><Typography>Touch-friendly breathing room.</Typography></DensityController>)
      ],
      MiniMapNavigator: [
        renderVariantCard('Page', <MiniMapNavigator height={170} showLabels={false} items={[{ id: 'a', label: 'Intro', top: 0, height: 240, color: '#2563eb' }, { id: 'b', label: 'API', top: 280, height: 360, color: '#059669' }, { id: 'c', label: 'Examples', top: 720, height: 300, color: '#f59e0b' }]} />),
        renderVariantCard('Labels', <MiniMapNavigator height={150} items={[{ id: 'a', label: 'Overview', top: 0, height: 160 }, { id: 'b', label: 'Canvas', top: 220, height: 380 }, { id: 'c', label: 'Notes', top: 660, height: 220 }]} />),
        renderVariantCard('Dashboard', <MiniMapNavigator height={180} showProgress={false} items={[{ id: 'kpi', label: 'KPIs', top: 0, height: 180, color: '#dbeafe' }, { id: 'table', label: 'Table', top: 220, height: 420, color: '#dcfce7' }, { id: 'logs', label: 'Logs', top: 700, height: 260, color: '#fee2e2' }]} />)
      ],
      DockBar: [
        renderVariantCard('Small', <DockBar items={[{ id: 'a', label: 'A', icon: 'A' }, { id: 'b', label: 'B', icon: 'B' }]} iconSize={40} />),
        renderVariantCard('Default', <DockBar items={[{ id: 'mail', label: 'Mail', icon: '✉️' }, { id: 'music', label: 'Music', icon: '🎵' }, { id: 'photos', label: 'Photos', icon: '🌄' }]} />),
        renderVariantCard('Big', <DockBar items={[{ id: 'finder', label: 'Finder', icon: '🗂️' }, { id: 'terminal', label: 'Terminal', icon: '⌘' }, { id: 'settings', label: 'Settings', icon: '⚙️' }]} iconSize={62} magnification={2} />)
      ],
      DockTabs: [
        renderVariantCard('Overflow', <DockTabs tabs={defaultDockTabs} maxVisible={4} />),
        renderVariantCard('Left Dock', <DockTabs tabs={defaultDockTabs.map((tab, index) => index < 2 ? { ...tab, dock: 'left' } : tab)} activeId="home" />),
        renderVariantCard('Drag Only', <DockTabs tabs={defaultDockTabs.slice(0, 5)} activeId="home" />),
        renderVariantCard('Static', <DockTabs tabs={defaultDockTabs.slice(1, 5)} allowDrag={false} maxVisible={3} />)
      ],
      CommandDock: [
        renderVariantCard('Expanded', <Box sx={{ height: 300, display: 'flex' }}><CommandDock items={commandDockItems} selectedId={commandDockSelectedId} onSelect={(item) => setCommandDockSelectedId(item.id)} /></Box>),
        renderVariantCard('Collapsed', <Box sx={{ height: 300, display: 'flex' }}><CommandDock items={commandDockItems} selectedId={commandDockSelectedId} defaultCollapsed onSelect={(item) => setCommandDockSelectedId(item.id)} /></Box>),
        renderVariantCard('Narrow', <Box sx={{ height: 300, display: 'flex' }}><CommandDock items={commandDockItems.slice(0, 4)} selectedId="projects" width={220} title="Ops" /></Box>)
      ],
      CommandPalette: [
        renderVariantCard('List', <CommandPalette items={commandItems} selectedId={commandPaletteSelectedId} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />),
        renderVariantCard('Dense List', <CommandPalette dense items={commandItems} selectedId={commandPaletteSelectedId} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />),
        renderVariantCard('Tree', <CommandPalette variant="tree" items={commandItems} selectedId={commandPaletteSelectedId} defaultExpandedGroups={['Docs', 'Components']} onSelect={(item) => setCommandPaletteSelectedId(item.id)} sx={{ minHeight: 220 }} />)
      ],
      CommandTimeline: [
        renderVariantCard('Vertical', <CommandTimeline entries={commandTimelineEntries.slice(0, 4)} defaultCurrentId="assigned" />),
        renderVariantCard('Horizontal', <CommandTimeline entries={commandTimelineEntries.slice(0, 4)} defaultCurrentId="moved" orientation="horizontal" />),
        renderVariantCard('No Controls', <CommandTimeline entries={commandTimelineEntries.slice(0, 3)} showControls={false} showMetadata={false} />)
      ],
      SpotlightSearch: [
        renderVariantCard('Grouped', <SpotlightSearch items={spotlightSearchItems} maxResults={4} sx={{ minHeight: 260 }} />),
        renderVariantCard('Exact', <SpotlightSearch items={spotlightSearchItems} fuzzy={false} sx={{ minHeight: 260 }} />),
        renderVariantCard('Actions', <SpotlightSearch items={spotlightSearchItems.slice(0, 2)} previewTitle="Action preview" sx={{ minHeight: 260 }} />)
      ],
      SmartBreadcrumbs: [
        renderVariantCard('Collapsed', <SmartBreadcrumbs items={smartBreadcrumbItems} maxVisible={3} />),
        renderVariantCard('Full Path', <SmartBreadcrumbs items={smartBreadcrumbItems.slice(0, 4)} maxVisible={6} />),
        renderVariantCard('No Preview', <SmartBreadcrumbs items={smartBreadcrumbItems} maxVisible={3} showPreview={false} />)
      ],
      PeekPanel: [
        renderVariantCard('Hover', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><PeekPanel trigger="hover" title="Hover peek" content="Opens after a short delay." preview={<Box sx={{ p: 2, fontFamily: 'monospace' }}>const value = read()</Box>}><Button variant="outlined">Hover symbol</Button></PeekPanel></Box>),
        renderVariantCard('Click', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><PeekPanel trigger="click" title="Click peek" subtitle="Pinned until closed" content="Useful on touch and dense tools." actions={[{ id: 'open', label: 'Open' }]}><Button variant="contained">Click target</Button></PeekPanel></Box>),
        renderVariantCard('Right Side', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><PeekPanel placement="right" title="Side peek" preview={<Box sx={{ p: 2, fontFamily: 'monospace' }}>{'<PeekPanel placement="right" />'}</Box>}><Button variant="outlined">Right peek</Button></PeekPanel></Box>)
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
      FocusRing: [
        renderVariantCard('Focus', <Box sx={{ minHeight: 130, display: 'grid', placeItems: 'center' }}><FocusRing><Button variant="contained">Tab here</Button></FocusRing></Box>),
        renderVariantCard('Error', <Box sx={{ minHeight: 130, display: 'grid', placeItems: 'center' }}><FocusRing tone="error" active pulseSize={34}><Button variant="outlined" color="error">Fix me</Button></FocusRing></Box>),
        renderVariantCard('No Pulse', <Box sx={{ minHeight: 130, display: 'grid', placeItems: 'center' }}><FocusRing tone="warning" active pulse={false}><Button variant="outlined" color="warning">Warning</Button></FocusRing></Box>)
      ],
      SmartTooltip: [
        renderVariantCard('Text', <Box sx={{ minHeight: 120, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Helpful detail" content="Extra context without leaving the flow."><Button variant="outlined">Hover</Button></SmartTooltip></Box>),
        renderVariantCard('Copy', <Box sx={{ minHeight: 120, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Install" content="Copy the package command." copyText="npm install @mickyballadelli/react-things" placement="bottom"><Button variant="outlined">Copy tooltip</Button></SmartTooltip></Box>),
        renderVariantCard('Media Actions', <Box sx={{ minHeight: 140, display: 'grid', placeItems: 'center' }}><SmartTooltip title="Preview card" content="Media, actions, and pin mode." media={<Box sx={{ height: 90, backgroundImage: 'url(/animals-colors.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />} actions={[{ id: 'open', label: 'Open' }]}><Button variant="contained">Preview</Button></SmartTooltip></Box>)
      ],
      ToastCenter: [
        renderVariantCard('Grouped', <Box sx={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}><ToastCenter defaultToasts={defaultToastCenterToasts} sx={{ position: 'absolute', right: 12, bottom: 12 }} /></Box>),
        renderVariantCard('Ungrouped', <Box sx={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}><ToastCenter defaultToasts={defaultToastCenterToasts} groupToasts={false} sx={{ position: 'absolute', right: 12, bottom: 12 }} /></Box>),
        renderVariantCard('Limited', <Box sx={{ position: 'relative', minHeight: 260, overflow: 'hidden' }}><ToastCenter defaultToasts={defaultToastCenterToasts} maxVisible={2} sx={{ position: 'absolute', right: 12, bottom: 12 }} /></Box>)
      ],
      TourGuide: [
        renderVariantCard('Closed', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><Button variant="contained">Tour target</Button></Box>),
        renderVariantCard('Branch Steps', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><Chip label={`${tourGuideSteps.length} steps with branches`} /></Box>),
        renderVariantCard('Completed', <Box sx={{ minHeight: 170, display: 'grid', placeItems: 'center' }}><TourGuide defaultOpen completed steps={tourGuideSteps} /><Chip label="Tour complete" color="success" /></Box>)
      ],
      MagneticCard: [
        renderVariantCard('Soft', <MagneticCard strength={10} tilt={4} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>Soft pull</MagneticCard>),
        renderVariantCard('Tilt', <MagneticCard strength={18} tilt={12} lift={10} sx={{ p: 2, borderRadius: 2, bgcolor: '#dbeafe' }}>Tilt card</MagneticCard>),
        renderVariantCard('Glare', <MagneticCard strength={24} tilt={16} lift={16} glare sx={{ p: 3, borderRadius: 2, color: '#fff', background: 'linear-gradient(135deg,#2563eb,#db2777)' }}>Premium card</MagneticCard>)
      ],
      MorphMenu: [
        renderVariantCard('Top Arc', <Box sx={{ minHeight: 180, display: 'grid', placeItems: 'center', overflow: 'hidden' }}><MorphMenu items={morphMenuItems} radius={90} startAngle={-160} endAngle={-20}><Button variant="contained">Open</Button></MorphMenu></Box>),
        renderVariantCard('Bottom Arc', <Box sx={{ minHeight: 180, display: 'grid', placeItems: 'center', overflow: 'hidden' }}><MorphMenu items={morphMenuItems.slice(0, 3)} radius={82} startAngle={30} endAngle={150}><Button variant="outlined">Open</Button></MorphMenu></Box>),
        renderVariantCard('No Labels', <Box sx={{ minHeight: 180, display: 'grid', placeItems: 'center', overflow: 'hidden' }}><MorphMenu items={morphMenuItems} showLabels={false} itemSize={44}><Button variant="contained">Tools</Button></MorphMenu></Box>)
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
      FlowBuilder: [
        renderVariantCard('Typed Flow', <FlowBuilder nodes={defaultFlowBuilderNodes.slice(0, 3)} connections={defaultFlowBuilderConnections.slice(0, 2)} sx={{ minHeight: 260 }} />),
        renderVariantCard('Invalid Edge', <FlowBuilder nodes={defaultFlowBuilderNodes.slice(0, 3)} connections={[...defaultFlowBuilderConnections.slice(0, 1), { id: 'bad', fromNodeId: 'trigger', fromPortId: 'event', toNodeId: 'email', toPortId: 'profile', type: 'event' }]} sx={{ minHeight: 260 }} />),
        renderVariantCard('No Grid', <FlowBuilder showGrid={false} nodes={defaultFlowBuilderNodes} connections={defaultFlowBuilderConnections} sx={{ minHeight: 260 }} />)
      ],
      BeforeAfterSlider: [
        renderVariantCard('50/50', <BeforeAfterSlider sx={{ minHeight: 140 }} before={<Box sx={{ height: '100%', bgcolor: '#2563eb' }} />} after={<Box sx={{ height: '100%', bgcolor: '#f59e0b' }} />} />),
        renderVariantCard('Before Heavy', <BeforeAfterSlider initialPosition={70} sx={{ minHeight: 140 }} before={<Box sx={{ height: '100%', bgcolor: '#059669' }} />} after={<Box sx={{ height: '100%', bgcolor: '#db2777' }} />} />),
        renderVariantCard('Content', <BeforeAfterSlider initialPosition={35} sx={{ minHeight: 140 }} before={<Box sx={{ p: 2, height: '100%', bgcolor: '#dbeafe' }}>Before</Box>} after={<Box sx={{ p: 2, height: '100%', bgcolor: '#fee2e2' }}>After</Box>} />)
      ],
      CompareStack: [
        renderVariantCard('Layers', <CompareStack layers={compareStackLayers.slice(0, 2)} minHeight={180} showLegend={false} />),
        renderVariantCard('Notes', <CompareStack layers={compareStackLayers} minHeight={180} showLegend={false} />),
        renderVariantCard('Preview Only', <CompareStack layers={compareStackLayers.slice(0, 2)} minHeight={180} showControls={false} />)
      ],
      InfiniteCanvas: [
        renderVariantCard('Pan Zoom', <InfiniteCanvas items={[{ id: 'a', label: 'A', x: 20, y: 40 }, { id: 'b', label: 'B', x: 240, y: 120, color: '#dcfce7' }]} sx={{ minHeight: 220 }} />),
        renderVariantCard('No Minimap', <InfiniteCanvas showMinimap={false} items={[{ id: 'a', label: 'Card', x: 40, y: 40, color: '#dbeafe' }, { id: 'b', label: 'Note', x: 260, y: 160, color: '#fef3c7' }]} sx={{ minHeight: 220 }} />),
        renderVariantCard('Custom Items', <InfiniteCanvas defaultViewport={{ x: 30, y: 30, zoom: 0.9 }} items={[{ id: 'a', label: 'API', x: 40, y: 50, color: '#eff6ff' }, { id: 'b', label: 'Worker', x: 290, y: 160, color: '#f0fdf4' }]} renderItem={(item, selected) => <Box sx={{ textAlign: 'center' }}><Typography fontWeight={900}>{item.label}</Typography><Typography variant="caption" color={selected ? 'primary.main' : 'text.secondary'}>{selected ? 'selected' : 'drag me'}</Typography></Box>} sx={{ minHeight: 240 }} />)
      ],
      SelectionBox: [
        renderVariantCard('Grid', <SelectionBox defaultSelectedIds={['roadmap']} sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, p: 1 }} selectionColor="#2563eb">{selectionBoxItems.slice(0, 4).map((item) => <Paper key={item.id} data-selection-id={item.id} variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>{item.label}</Paper>)}</SelectionBox>),
        renderVariantCard('List', <SelectionBox defaultSelectedIds={['support']} selectionColor="#059669" sx={{ display: 'grid', gap: 1, p: 1 }}>{selectionBoxItems.slice(4).map((item) => <Paper key={item.id} data-selection-id={item.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1 }}>{item.label}</Paper>)}</SelectionBox>),
        renderVariantCard('Custom Box', <SelectionBox selectionColor="#db2777" selectionRectSx={{ borderStyle: 'dashed', bgcolor: '#db277733' }} sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, p: 1 }}>{selectionBoxItems.slice(0, 6).map((item) => <Paper key={item.id} data-selection-id={item.id} variant="outlined" sx={{ p: 1, borderRadius: 1 }}>{item.label}</Paper>)}</SelectionBox>)
      ],
      BulkActionBar: [
        renderVariantCard('Inline', <BulkActionBar selectedIds={['a', 'b']} totalCount={8} actions={bulkActionBarActions} onClear={() => {}} />),
        renderVariantCard('Sticky', <BulkActionBar selectedIds={['a', 'b', 'c']} position="sticky" actions={bulkActionBarActions} onClear={() => {}} />),
        renderVariantCard('Overflow', <BulkActionBar selectedIds={['a']} maxPrimaryActions={1} actions={bulkActionBarActions} onClear={() => {}} />)
      ],
      PresenceCursors: [
        renderVariantCard('Canvas', <PresenceCursors users={presenceCursorUsers.slice(0, 2)} sx={{ minHeight: 170, bgcolor: '#f8fafc', borderRadius: 1 }}><Box sx={{ p: 2 }}>Canvas</Box></PresenceCursors>),
        renderVariantCard('No Names', <PresenceCursors users={presenceCursorUsers} showNames={false} sx={{ minHeight: 170, bgcolor: '#f8fafc', borderRadius: 1 }} />),
        renderVariantCard('Pixels', <PresenceCursors coordinateMode="pixel" users={[{ id: 'px', name: 'Pixel', x: 80, y: 64, color: '#7c3aed', selection: { x: 42, y: 90, width: 130, height: 46, label: 'Pixel rect' } }]} sx={{ minHeight: 170, bgcolor: '#f8fafc', borderRadius: 1 }} />)
      ],
      StatusRail: [
        renderVariantCard('Live Pulse', <StatusRail groups={statusRailGroups} title="Ops" compact />),
        renderVariantCard('No Pulse', <StatusRail groups={statusRailGroups.slice(0, 3)} pulse={false} title="Quiet" compact />),
        renderVariantCard('Metrics Off', <StatusRail groups={statusRailGroups} showMetrics={false} title="Incidents" compact />)
      ],
      ResizableFrame: [
        renderVariantCard('Small', <ResizableFrame initialWidth={180} initialHeight={120}>Small</ResizableFrame>),
        renderVariantCard('Content', <ResizableFrame initialWidth={240} initialHeight={150}><Box sx={{ p: 2 }}>Resizable content</Box></ResizableFrame>),
        renderVariantCard('Large Min', <ResizableFrame initialWidth={280} initialHeight={170} minWidth={220} minHeight={140}><Box sx={{ p: 2 }}>Min size</Box></ResizableFrame>)
      ],
      ResizableDashboard: [
        renderVariantCard('Compact', <ResizableDashboard widgets={dashboardWidgets.slice(0, 3)} rowHeight={72} sx={{ minHeight: 300 }} />),
        renderVariantCard('No Guides', <ResizableDashboard widgets={dashboardWidgets.slice(0, 4)} showGuides={false} sx={{ minHeight: 360 }} />),
        renderVariantCard('Persistent', <ResizableDashboard widgets={dashboardWidgets} persistKey="react-things-resizable-dashboard-variant" sx={{ minHeight: 420 }} />)
      ],
      InspectorPanel: [
        renderVariantCard('Text', <Stack spacing={1.5}><InspectorPanel title="Text prop" density="compact" showValueSummary={false} fields={[{ id: 'title', label: 'Title', type: 'text', value: inspectorTextTitle, defaultValue: 'Demo card' }]} onChange={(_, value) => setInspectorTextTitle(String(value))} /><Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}><Typography fontWeight={900}>{inspectorTextTitle}</Typography></Paper></Stack>),
        renderVariantCard('Number', <Stack spacing={1.5}><InspectorPanel title="Number prop" density="compact" showValueSummary={false} fields={[{ id: 'size', label: 'Size', type: 'number', value: inspectorNumberSize, defaultValue: 48, min: 24, max: 72, step: 2, unit: 'px' }]} onChange={(_, value) => setInspectorNumberSize(Number(value))} /><Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}><Typography fontWeight={900} sx={{ fontSize: inspectorNumberSize, lineHeight: 1 }}>Aa</Typography></Paper></Stack>),
        renderVariantCard('Mixed', <InspectorPanel fields={inspectorFields} onChange={(id, value) => setInspectorFields((fields) => fields.map((field) => field.id === id ? { ...field, value } : field))} />)
      ],
      InspectorDrawer: [
        renderVariantCard('Sections', <Stack spacing={1.5}><Typography color="text.secondary">Content, layout, and style fields.</Typography><Button variant="contained" onClick={() => setInspectorDrawerOpen(true)}>Open drawer</Button></Stack>),
        renderVariantCard('Validation', <Stack spacing={1.5}><Typography color="text.secondary">Title and color validate live.</Typography><Button variant="outlined" onClick={() => setInspectorDrawerOpen(true)}>Edit values</Button></Stack>),
        renderVariantCard('Undo', <Stack spacing={1.5}><Typography color="text.secondary">Changes can be undone from header or footer.</Typography><Button variant="outlined" onClick={() => setInspectorDrawerOpen(true)}>Try undo</Button></Stack>)
      ],
      ColorPicker: [
        renderVariantCard('Simple', <ColorPicker value={pickerColor} onChange={setPickerColor} showValue={false} />),
        renderVariantCard('Alpha', <ColorPicker value={pickerColor} alpha={pickerAlpha} onChange={setPickerColor} onAlphaChange={setPickerAlpha} />),
        renderVariantCard('Swatches', <ColorPicker value={pickerColor} alpha={pickerAlpha} swatches={['#111827', '#2563eb', '#f59e0b', '#10b981']} onChange={setPickerColor} onAlphaChange={setPickerAlpha} />)
      ],
      ColorStudio: [
        renderVariantCard('CSS Tokens', <ColorStudio initialColors={colorStudioColors} tokenFormat="css" />),
        renderVariantCard('JSON Tokens', <ColorStudio initialColors={colorStudioColors.slice(0, 3)} tokenFormat="json" />),
        renderVariantCard('MUI Tokens', <ColorStudio initialColors={colorStudioColors} tokenFormat="mui" />)
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
      ],
      DropComposer: [
        renderVariantCard('Queue', <DropComposer defaultItems={defaultDropComposerItems.slice(0, 2)} title="Upload queue" sx={{ minHeight: 360 }} />),
        renderVariantCard('Images Only', <DropComposer defaultItems={defaultDropComposerItems.slice(0, 1)} accept="image/*" title="Image assets" sx={{ minHeight: 320 }} />),
        renderVariantCard('Custom Preview', <DropComposer defaultItems={defaultDropComposerItems.slice(1)} renderPreview={(item) => <Box sx={{ p: 1, textAlign: 'center' }}><Typography fontWeight={900}>{item.name.split('.').pop()?.toUpperCase()}</Typography></Box>} sx={{ minHeight: 320 }} />)
      ],
      EntityPicker: [
        renderVariantCard('Mixed', <EntityPicker entities={entityPickerEntities} defaultValue="micky" maxHeight={220} />),
        renderVariantCard('Multiple', <EntityPicker entities={entityPickerEntities} multiple defaultValue={['micky', 'atlas']} maxHeight={220} />),
        renderVariantCard('Pinned', <EntityPicker entities={entityPickerEntities} defaultValue="atlas" showSelected={false} maxHeight={220} />)
      ],
      DataCardGrid: [
        renderVariantCard('Revenue', <DataCardGrid metrics={[dataCardGridMetrics[0]]} showProgress={false} />),
        renderVariantCard('Compact', <DataCardGrid metrics={dataCardGridMetrics.slice(0, 2)} density="compact" columns={2} />),
        renderVariantCard('No Charts', <DataCardGrid title="Snapshot" metrics={dataCardGridMetrics.slice(0, 3)} showSparklines={false} columns={3} />)
      ],
      DataLens: [
        renderVariantCard('Table', <DataLens<DataLensService> rows={dataLensRows.slice(0, 4)} columns={dataLensColumns} dense />),
        renderVariantCard('Cards', <DataLens<DataLensService> rows={dataLensRows.slice(0, 4)} columns={dataLensColumns.slice(0, 4)} defaultView="cards" />),
        renderVariantCard('Sorted', <DataLens<DataLensService> rows={dataLensRows} columns={dataLensColumns} initialSort={{ columnId: 'requests', direction: 'desc' }} />)
      ],
      LayoutSwitcher: [
        renderVariantCard('Cards', <LayoutSwitcher items={layoutSwitcherItems.slice(0, 4)} defaultView="cards" views={['cards', 'list']} dense />),
        renderVariantCard('Kanban', <LayoutSwitcher items={layoutSwitcherItems} defaultView="kanban" views={['kanban', 'table']} groupOrder={['Todo', 'Doing', 'Review', 'Done']} dense />),
        renderVariantCard('Calendar', <LayoutSwitcher items={layoutSwitcherItems} defaultView="calendar" views={['calendar', 'list']} calendarDays={6} dense />)
      ],
      KanbanBoard: [
        renderVariantCard('Compact', <KanbanBoard title="Sprint" columns={kanbanColumns.slice(0, 2)} onChange={(nextColumns) => setKanbanColumns([...nextColumns, ...kanbanColumns.slice(2)])} density="compact" />),
        renderVariantCard('No Column Drag', <KanbanBoard title="Fixed lanes" defaultColumns={defaultKanbanColumns.slice(0, 2)} allowColumnDrag={false} />),
        renderVariantCard('Full Board', <KanbanBoard title="Editable workflow" columns={kanbanColumns} onChange={setKanbanColumns} />)
      ]
    }

    return variants[selectedComponent.name] ?? Object.entries(common).map(([title, body]) => renderVariantCard(title, body))
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '310px 1fr' },
        gridTemplateRows: { xs: 'auto 1fr', md: '1fr' },
        overflow: 'hidden',
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
          p: 2,
          minHeight: 0,
          overflow: 'auto'
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
          <Typography variant="h6" component="h1" fontWeight={850} sx={{ whiteSpace: 'nowrap', fontSize: 18 }}>
            React Things
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: -0.75, ml: '85px', mb: 1.25, whiteSpace: 'nowrap', fontSize: 11 }}
        >
          v{__REACT_THINGS_VERSION__}
        </Typography>
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
          defaultExpandedGroups={['Display', 'Layout', 'Input', 'Navigation', 'Effects']}
          descriptionDisplay="tooltip"
          sx={{ gap: 1.25 }}
          onSelect={(item) => {
            setSelectedComponentName(item.id)
            setSelectedSampleLabel(sampleTabs[0])
          }}
        />
      </Box>

      <Box component="main" sx={{ p: { xs: 2, md: 4 }, minWidth: 0, minHeight: 0, overflow: 'auto' }}>
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
