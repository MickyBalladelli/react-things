import { ComponentExample, KanbanBoard, DataLens, DiffViewer } from '@mickyballadelli/react-things'

export function BasicJsExample() {
  return (
    <ComponentExample title="JavaScript example">
      This is plain JS usage.
    </ComponentExample>
  )
}


export function KanbanRealWorldJs() {
  const columns = [
    { id: 'todo', title: 'To Do', cards: [{ id: 't1', title: 'Design login' }] },
    { id: 'doing', title: 'In Progress', cards: [{ id: 'd1', title: 'API integration' }] }
  ]
  return <KanbanBoard columns={columns} onChange={() => {}} />
}

export function DataLensEdgeCaseJs() {
  return (
    <DataLens
      columns={[{ id: 'name', label: 'Name' }]}
      rows={[]}
      emptyState={<div>No results – try broadening filters</div>}
    />
  )
}

export function DiffViewerLargeChangeJs() {
  return (
    <DiffViewer
      before="function old() { return 1 }"
      after="function newFn() { return 42; /* edge case comment */ }"
    />
  )
}
