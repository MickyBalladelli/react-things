import { ComponentExample, GlassBox } from '@mickyballadelli/react-things'

export function BasicJsExample() {
  return (
    <ComponentExample title="JavaScript example">
      This is plain JS usage.
    </ComponentExample>
  )
}

export function GlassBoxJsExample() {
  return (
    <GlassBox transparency={0.45} liquidColor="#38d6a5">
      Plain JS usage.
    </GlassBox>
  )
}
