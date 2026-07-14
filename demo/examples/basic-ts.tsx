import {
  ComponentExample,
  GlassBox,
  KanbanBoard,
  DataLens,
  DiffViewer,
  type ComponentExampleProps,
  type GlassBoxProps,
  type KanbanColumn,
  type DataLensColumn,
  type DataLensProps
} from '@mickyballadelli/react-things'

const props: ComponentExampleProps = {
  title: 'TypeScript example'
}

export function BasicTsExample() {
  return (
    <ComponentExample {...props}>
      This is typed usage.
    </ComponentExample>
  )
}

const glassBoxProps: GlassBoxProps = {
  transparency: 0.45,
  liquidColor: '#38d6a5'
}

export function GlassBoxTsExample() {
  return (
    <GlassBox {...glassBoxProps}>
      Typed usage.
    </GlassBox>
  )
}

const kanbanColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', cards: [{ id: 't1', title: 'Design login' }] },
  { id: 'doing', title: 'In Progress', cards: [{ id: 'd1', title: 'API integration' }] }
]

export function KanbanRealWorldTs() {
  return <KanbanBoard columns={kanbanColumns} onChange={() => {}} />
}

const lensColumns: DataLensColumn[] = [{ id: 'name', label: 'Name' }]
const lensRows: Array<{ name: string }> = []

export function DataLensEdgeCaseTs() {
  return (
    <DataLens
      columns={lensColumns}
      rows={lensRows}
      emptyState={<div>No results – try broadening filters</div>}
    />
  )
}

export function DiffViewerLargeChangeTs() {
  return (
    <DiffViewer
      before="function old() { return 1 }"
      after="function newFn() { return 42; /* edge case comment */ }"
    />
  )
}
