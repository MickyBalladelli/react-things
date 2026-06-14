# @mickyballadelli/react-things

Reusable React components from React Things.

## Install

```sh
npm install @mickyballadelli/react-things @mui/material @emotion/react @emotion/styled
```

React and React DOM are peer dependencies.

## Use

```tsx
import { GlassBox } from '@mickyballadelli/react-things'

export function Example() {
  return (
    <GlassBox transparency={0.45} fill={0.62} liquidColor="#38d6a5">
      Liquid glass content
    </GlassBox>
  )
}
```

## Components

- GlassBox
- DraggableBox
- CodeViewer
- DataCardGrid
- DataLens
- LayoutSwitcher
- DockBar
- DockTabs
- CommandDock
- CommandPalette
- SpotlightSearch
- SmartBreadcrumbs
- SplitPane
- FloatingToolbar
- MagneticCard
- MorphMenu
- SpotlightPanel
- NodeCanvas
- FlowBuilder
- BeforeAfterSlider
- InfiniteCanvas
- SelectionBox
- BulkActionBar
- PresenceCursors
- StatusRail
- SmartTooltip
- ToastCenter
- TourGuide
- ResizableFrame
- ResizableDashboard
- InspectorPanel
- InspectorDrawer
- KanbanBoard
- ColorPicker
- ColorStudio
- TimelineScrubber
- FileDropZone
- FocusRing

## Publish

```sh
npm publish -w @mickyballadelli/react-things
```
