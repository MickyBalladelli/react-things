# TODO

## Next Improvements (post 0.4.15)

### Demo App
- Add prop playground live editing for all documented components (ComponentDocs)
- Implement keyboard navigation & shortcuts for component gallery
- Add usage analytics / "copy import" stats
- Improve mobile touch targets and drawer navigation
- Persist playground state in URL or localStorage

### Component Library
- Add full Storybook stories + visual regression (Chromatic / Playwright)
- Implement virtualization (react-window / @tanstack/virtual) for DataLens, KanbanBoard, CommandPalette
- Standardize error/loading/empty states in DiffViewer, FlowBuilder, NodeCanvas
- Add comprehensive accessibility audit (axe, keyboard, focus trap)
- Create performance benchmarks and bundle-size CI gate
- Add React 19 `use` and `useActionState` examples where beneficial
- Implement reduced-motion respect across remaining animated components (DockTabs, ResizableDashboard, etc.)
- Add TypeScript 5.5+ template literal types for stricter prop validation
- Ensure all components expose `ref` forwarding

### Cross-cutting
- Add changesets for automated changelog & versioning
- Publish to npm with provenance + provenance attestations
- Expand README with live CodeSandbox / StackBlitz embed
- Create CONTRIBUTING.md and component contribution template
