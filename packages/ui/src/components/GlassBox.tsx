import Box from '@mui/material/Box'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import { useId } from 'react'

export type GlassBoxProps = BoxProps & {
  transparency?: number
  fill?: number
  liquidColor?: string
  glassColor?: string
  motion?: number
  refractionActive?: boolean
}

function clampTransparency(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

export function GlassBox({
  transparency = 0.36,
  fill = 0.72,
  liquidColor = '#39b8ff',
  glassColor = '#ffffff',
  motion = 0,
  refractionActive = true,
  children,
  sx,
  ...props
}: GlassBoxProps) {
  const rawFilterId = useId()
  const filterId = `glass-liquid-${rawFilterId.replace(/:/g, '')}`
  const liquidAlpha = 1 - clampTransparency(transparency)
  const glassAlpha = clampTransparency(transparency)
  const fillLevel = Math.min(Math.max(fill, 0), 1)
  const liquidTop = `${(1 - fillLevel) * 100}%`
  const turbulenceSeed = Math.abs(Math.round(motion * 8)) + 1
  const turbulenceFrequency = 0.012 + Math.abs(Math.sin(motion / 17)) * 0.012
  const displacementScale = 18 + liquidAlpha * 18
  const showRefraction = refractionActive

  return (
    <Box
      {...props}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          border: 1,
          borderColor: alpha(glassColor, 0.48),
          borderRadius: 2,
          minHeight: 160,
          p: 3,
          color: 'common.white',
          bgcolor: alpha(glassColor, 0.08 + glassAlpha * 0.18),
          boxShadow: `
            inset 0 1px 0 ${alpha(glassColor, 0.68)},
            inset 14px 0 34px ${alpha(glassColor, 0.12)},
            inset -18px 0 32px ${alpha(liquidColor, liquidAlpha * 0.2)},
            0 18px 48px ${alpha('#0b2030', 0.18)}
          `,
          backdropFilter: 'blur(12px) saturate(170%) contrast(108%)',
          WebkitBackdropFilter: 'blur(12px) saturate(170%) contrast(108%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            top: liquidTop,
            bottom: 0,
            background: `
              linear-gradient(160deg, ${alpha(glassColor, liquidAlpha * 0.16)} 0%, ${alpha(liquidColor, liquidAlpha * 0.28)} 42%, ${alpha('#063451', liquidAlpha * 0.2)} 100%)
            `,
            opacity: 0.95,
            boxShadow: `
              inset 0 18px 28px ${alpha(glassColor, 0.12 + liquidAlpha * 0.16)},
              inset 0 -34px 44px ${alpha('#032536', liquidAlpha * 0.22)}
            `
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(105deg, ${alpha(glassColor, 0.34)} 0%, ${alpha(glassColor, 0.08)} 18%, ${alpha(glassColor, 0)} 34%),
              radial-gradient(circle at 18% 18%, ${alpha(glassColor, 0.38)} 0 3%, ${alpha(glassColor, 0)} 18%)
            `,
            pointerEvents: 'none'
          },
          '& .GlassBox-liquidLens': {
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            backgroundImage: 'var(--glassbox-refraction-background, none)',
            backgroundSize: 'var(--glassbox-refraction-background-size, cover)',
            backgroundPosition: 'var(--glassbox-refraction-background-position, center)',
            backgroundRepeat: 'no-repeat',
            filter: `url(#${filterId}) saturate(150%) contrast(112%)`,
            opacity: showRefraction ? 0.72 : 0,
            transition: 'opacity 120ms ease-out',
            maskImage: `linear-gradient(to bottom, transparent 0, transparent calc(${liquidTop} + 10px), black calc(${liquidTop} + 28px), black 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0, transparent calc(${liquidTop} + 10px), black calc(${liquidTop} + 28px), black 100%)`
          },
          '& .GlassBox-refractionOffset': {
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            opacity: showRefraction ? 0.16 + glassAlpha * 0.16 : 0,
            backdropFilter: 'blur(3px) saturate(190%)',
            WebkitBackdropFilter: 'blur(3px) saturate(190%)',
            background: `
              linear-gradient(180deg, ${alpha(glassColor, 0.2)} 0, ${alpha(glassColor, 0)} 20%),
              linear-gradient(90deg, ${alpha(glassColor, 0)} 0 18%, ${alpha(glassColor, 0.14)} 26%, ${alpha(glassColor, 0)} 34% 58%, ${alpha(glassColor, 0.1)} 68%, ${alpha(glassColor, 0)} 76% 100%)
            `,
            transition: 'opacity 120ms ease-out',
            maskImage: `linear-gradient(to bottom, transparent 0, transparent ${liquidTop}, black calc(${liquidTop} + 18px), black 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0, transparent ${liquidTop}, black calc(${liquidTop} + 18px), black 100%)`
          },
          '& .GlassBox-content': {
            position: 'relative',
            zIndex: 3,
            textShadow: `0 1px 10px ${alpha('#00121d', 0.36)}`
          },
          '& > *': {
            position: 'relative',
            zIndex: 3
          }
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        component="svg"
        aria-hidden="true"
        focusable="false"
        sx={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${turbulenceFrequency} ${turbulenceFrequency * 2.6}`}
            numOctaves="2"
            seed={turbulenceSeed}
            result="liquidNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="liquidNoise"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </Box>
      <Box className="GlassBox-liquidLens" />
      <Box className="GlassBox-refractionOffset" />
      <Box className="GlassBox-content">
        {children}
      </Box>
    </Box>
  )
}
