# Contributing to React Things

Thank you for your interest in contributing! This document outlines how to get started.

## Getting Started

1. Fork the repository and clone it locally
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the demo app
4. Make your changes in `packages/ui/src/components`

## Component Contribution Template

When adding a new component, please follow this checklist:

### Required Files
- [ ] `ComponentName.tsx` – main implementation with full TypeScript types
- [ ] `ComponentName.test.tsx` – unit tests (Vitest + React Testing Library)
- [ ] Storybook story in `src/stories/ComponentName.stories.tsx`
- [ ] Update `packages/ui/src/index.ts` exports
- [ ] Add documentation entry in `demo/src/components/ComponentDocs.tsx`

### Code Standards
- [ ] Use MUI components and theming
- [ ] Support `density`, dark mode, and `ref` forwarding
- [ ] Respect `prefers-reduced-motion`
- [ ] Include JSDoc comments with usage example
- [ ] Follow existing naming and prop patterns

### Pull Request Checklist
- [ ] All tests pass (`npm run build`)
- [ ] Lint and typecheck pass
- [ ] Bundle size impact is acceptable (`npm run size` in `packages/ui`)
- [ ] Changeset added (run `npx changeset`)
- [ ] Documentation updated

## Code of Conduct

Be respectful and inclusive. We follow the standard Contributor Covenant.
