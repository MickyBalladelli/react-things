import {
  ComponentExample,
  KanbanBoard,
  DataLens,
  DiffViewer,
  type ComponentExampleProps,
  type KanbanColumn,
  type DataLensColumn,
  type DataLensProps
} from '@mickyballadelli/react-things'
import { use, useActionState } from 'react'

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

// React 19 use + useActionState example (demo only)
async function fetchData() {
  return { message: 'React 19 data loaded' }
}

function submitAction(prev: string, formData: FormData) {
  return `Submitted: ${formData.get('name')}`
}

export function React19Demo() {
  const data = use(fetchData())
  const [result, formAction] = useActionState(submitAction, '')
  return (
    <div>
      <p>{data.message}</p>
      <form action={formAction}>
        <input name="name" />
        <button type="submit">Submit</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  )
}
