import { render, screen } from '@testing-library/react'
import { ActionInspector } from '../src'

describe('ActionInspector', () => {
  it('renders title', () => {
    render(<ActionInspector title="Inspect" />)
    expect(screen.getByText('Inspect')).toBeInTheDocument()
  })
})
