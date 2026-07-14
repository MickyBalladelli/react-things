import type { Meta, StoryObj } from '@storybook/react'
import { GlassBox } from '../GlassBox'

const meta: Meta<typeof GlassBox> = {
  title: 'GlassBox',
  component: GlassBox,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof GlassBox>

export const Default: Story = {
  args: {
    children: 'Liquid glass content',
    transparency: 0.45,
    liquidColor: '#38d6a5'
  }
}
