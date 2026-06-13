import {
  ComponentExample,
  GlassBox,
  type ComponentExampleProps,
  type GlassBoxProps
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
