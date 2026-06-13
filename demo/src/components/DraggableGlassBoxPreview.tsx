import { useEffect, useState, type CSSProperties } from 'react'
import { Typography } from '@mui/material'
import { DraggableBox, GlassBox, type DraggableBoxMetrics } from '@react-things/ui'

type DraggableGlassBoxPreviewProps = {
  transparency: number
  fill: number
  liquidColor: string
  glassColor: string
  children: string
}

export function DraggableGlassBoxPreview({
  transparency,
  fill,
  liquidColor,
  glassColor,
  children
}: DraggableGlassBoxPreviewProps) {
  const [motion, setMotion] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [metrics, setMetrics] = useState<DraggableBoxMetrics | null>(null)
  const refractionStyle = {
    '--glassbox-refraction-background': metrics?.containerBackgroundImage === 'none'
      ? 'none'
      : metrics?.containerBackgroundImage,
    '--glassbox-refraction-background-size': metrics
      ? `${metrics.containerWidth}px ${metrics.containerHeight}px`
      : 'cover',
    '--glassbox-refraction-background-position': metrics
      ? `${-metrics.draggableLeft}px ${-metrics.draggableTop}px`
      : 'center'
  } as CSSProperties

  useEffect(() => {
    if (!dragging) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setMotion((currentMotion) => currentMotion + 4)
    }, 80)

    return () => window.clearInterval(timer)
  }, [dragging])

  return (
    <DraggableBox
      initialPosition={{ x: 50, y: 72 }}
      onPositionChange={(position, nextMetrics) => {
        setMotion(position.x * 2 + position.y * 3)
        if (nextMetrics) {
          setMetrics(nextMetrics)
        }
      }}
      onDraggingChange={(nextDragging) => {
        setDragging(nextDragging)
        if (!nextDragging) {
          setMotion(0)
        }
      }}
      sx={{
        minHeight: 420,
        backgroundImage: 'url(/animals-colors.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      dragSx={{
          width: { xs: '78%', sm: 520 },
          maxWidth: 'calc(100% - 32px)'
      }}
    >
      <GlassBox
        transparency={transparency}
        fill={fill}
        liquidColor={liquidColor}
        glassColor={glassColor}
        motion={motion}
        refractionActive={dragging}
        style={refractionStyle}
      >
        <Typography variant="h6" fontWeight={800}>
          Live Preview
        </Typography>
        <Typography variant="body2">
          {children}
        </Typography>
      </GlassBox>
    </DraggableBox>
  )
}
