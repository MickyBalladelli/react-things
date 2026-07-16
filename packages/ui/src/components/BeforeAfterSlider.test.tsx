import { render, screen } from '@testing-library/react'
import { BeforeAfterSlider } from '../src'

describe('BeforeAfterSlider', () => {
  it('renders', () => {
    render(<BeforeAfterSlider before={<div>before</div>} after={<div>after</div>} />)
    expect(screen.getByText('before')).toBeInTheDocument()
  })
})
