import { render, screen } from '@testing-library/react'
import { GlassBox } from '../src'

describe('GlassBox', () => {
  it('renders children', () => {
    render(<GlassBox>content</GlassBox>)
    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
