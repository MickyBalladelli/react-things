import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'
import { forwardRef, useEffect, useMemo, useState } from 'react'

export type MobiusProgressBarTone = 'primary' | 'success' | 'warning' | 'error' | 'info'
export type MobiusProgressBarVariant = 'determinate' | 'indeterminate'

export type MobiusProgressBarProps = Omit<BoxProps, 'ref'> & {
  value?: number
  min?: number
  max?: number
  variant?: MobiusProgressBarVariant
  tone?: MobiusProgressBarTone
  label?: ReactNode
  showValue?: boolean
  size?: number
  thickness?: number
  animated?: boolean
  /** When true, the strip slowly rotates. When false, orientation is fixed by `angle`. */
  spinning?: boolean
  /** Fixed Y rotation in degrees when `spinning` is false. Default -31.5°. */
  angle?: number
}

type Vec3 = { x: number; y: number; z: number }

type Quad = {
  id: number
  points: string
  fill: string
  stroke: string
  depth: number
  lit: boolean
  highlight: number
}

type TrailSeg = {
  id: string
  points: string
  depth: number
  opacity: number
  width: number
}

const toneColors: Record<MobiusProgressBarTone, { base: string; light: string; dark: string; glow: string }> = {
  primary: { base: '#2563eb', light: '#93c5fd', dark: '#1d4ed8', glow: '#60a5fa' },
  success: { base: '#059669', light: '#6ee7b7', dark: '#047857', glow: '#34d399' },
  warning: { base: '#d97706', light: '#fcd34d', dark: '#b45309', glow: '#fbbf24' },
  error: { base: '#dc2626', light: '#fca5a5', dark: '#b91c1c', glow: '#f87171' },
  info: { base: '#0891b2', light: '#67e8f9', dark: '#0e7490', glow: '#22d3ee' }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

/** Classic Möbius strip parametric surface */
function mobiusPoint(u: number, v: number, R: number): Vec3 {
  const half = u / 2
  const cosHalf = Math.cos(half)
  const sinHalf = Math.sin(half)
  const cosU = Math.cos(u)
  const sinU = Math.sin(u)

  return {
    x: (R + v * cosHalf) * cosU,
    y: (R + v * cosHalf) * sinU,
    z: v * sinHalf
  }
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / len, y: v.y / len, z: v.z / len }
}

function dot(a: Vec3, b: Vec3) {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function rotatePoint(p: Vec3, rotY: number, rotX: number): Vec3 {
  const cy = Math.cos(rotY)
  const sy = Math.sin(rotY)
  const cx = Math.cos(rotX)
  const sx = Math.sin(rotX)

  const x1 = p.x * cy + p.z * sy
  const y1 = p.y
  const z1 = -p.x * sy + p.z * cy

  return {
    x: x1,
    y: y1 * cx - z1 * sx,
    z: y1 * sx + z1 * cx
  }
}

function project(p: Vec3, size: number, cameraZ: number) {
  const perspective = cameraZ / (cameraZ - p.z)
  return {
    x: size / 2 + p.x * perspective,
    y: size / 2 + p.y * perspective,
    z: p.z,
    scale: perspective
  }
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const num = Number.parseInt(full, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function mixColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const r = Math.round(ca.r + (cb.r - ca.r) * t)
  const g = Math.round(ca.g + (cb.g - ca.g) * t)
  const bl = Math.round(ca.b + (cb.b - ca.b) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

function shadeColor(hex: string, light: number) {
  if (light >= 0) {
    return mixColor(hex, '#ffffff', clamp(light, 0, 1) * 0.55)
  }
  return mixColor(hex, '#0f172a', clamp(-light, 0, 1) * 0.65)
}

/**
 * MobiusProgressBar — parametric 3D Möbius strip with a glowing energy wave
 * racing along the surface (no ball). Progress lights the band; a bright
 * leading pulse makes motion obvious.
 */
export const MobiusProgressBar = forwardRef<HTMLDivElement, MobiusProgressBarProps>(function MobiusProgressBar({
  value = 0,
  min = 0,
  max = 100,
  variant = 'determinate',
  tone = 'primary',
  label,
  showValue = false,
  size = 340,
  thickness = 36,
  animated = true,
  spinning = false,
  angle = -31.5,
  sx,
  ...props
}, ref) {
  const palette = toneColors[tone]
  const reduced = prefersReducedMotion()
  const shouldAnimate = animated && !reduced
  const isIndeterminate = variant === 'indeterminate'
  const fixedAngleRad = (angle * Math.PI) / 180

  const [loopAngle, setLoopAngle] = useState(0)
  const [spinAngle, setSpinAngle] = useState(fixedAngleRad)

  useEffect(() => {
    if (!spinning) {
      setSpinAngle(fixedAngleRad)
    }
  }, [fixedAngleRad, spinning])

  useEffect(() => {
    if (!shouldAnimate) return
    let raf = 0
    let start = performance.now()

    const tick = (now: number) => {
      const t = (now - start) / 1000
      // Energy wave loops the strip
      setLoopAngle((t * Math.PI * 2) / (isIndeterminate ? 2.4 : 3.6))
      if (spinning) {
        setSpinAngle(fixedAngleRad + (t * Math.PI * 2) / 16)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fixedAngleRad, isIndeterminate, shouldAnimate, spinning])

  const percent = isIndeterminate
    ? 0
    : clamp(((value - min) / (max - min)) * 100, 0, 100)

  // Leading edge of the energy pulse
  const pulseU = isIndeterminate
    ? loopAngle
    : (percent / 100) * Math.PI * 2

  // For determinate, a secondary shimmer runs along the filled region
  const shimmerU = isIndeterminate ? loopAngle : loopAngle % Math.max((percent / 100) * Math.PI * 2, 0.001)

  const R = size * 0.28
  const halfWidth = thickness * 0.55
  const uSteps = 96
  const vSteps = 8
  const cameraZ = size * 1.35
  const rotX = -0.72
  const rotY = spinning ? spinAngle : fixedAngleRad
  const lightDir = normalize({ x: 0.35, y: -0.75, z: 0.55 })

  const trailLength = isIndeterminate ? 0.55 : 0.35

  const quads = useMemo(() => {
    const faces: Quad[] = []
    let id = 0

    for (let i = 0; i < uSteps; i += 1) {
      const u0 = (i / uSteps) * Math.PI * 2
      const u1 = ((i + 1) / uSteps) * Math.PI * 2
      const uMid = (u0 + u1) / 2
      const progressAlong = (uMid / (Math.PI * 2)) * 100
      const lit = isIndeterminate || progressAlong <= percent + 0.8

      // Distance along the loop from the pulse head (0 = head, wrapping)
      let dist = (pulseU - uMid + Math.PI * 4) % (Math.PI * 2)
      if (dist > Math.PI) dist = Math.PI * 2 - dist
      // Prefer trailing side of the pulse for a comet look
      const rawTrail = (pulseU - uMid + Math.PI * 2) % (Math.PI * 2)
      const onTrail = rawTrail >= 0 && rawTrail <= trailLength
      const trailT = onTrail ? 1 - rawTrail / trailLength : 0

      // Determinate shimmer only on filled band
      let shimmerT = 0
      if (!isIndeterminate && lit) {
        const sDist = (shimmerU - uMid + Math.PI * 2) % (Math.PI * 2)
        if (sDist < 0.4) shimmerT = 1 - sDist / 0.4
      }

      const highlight = Math.max(trailT, shimmerT * 0.7)

      for (let j = 0; j < vSteps; j += 1) {
        const v0 = -halfWidth + (j / vSteps) * (halfWidth * 2)
        const v1 = -halfWidth + ((j + 1) / vSteps) * (halfWidth * 2)

        const p00 = mobiusPoint(u0, v0, R)
        const p10 = mobiusPoint(u1, v0, R)
        const p11 = mobiusPoint(u1, v1, R)
        const p01 = mobiusPoint(u0, v1, R)

        const r00 = rotatePoint(p00, rotY, rotX)
        const r10 = rotatePoint(p10, rotY, rotX)
        const r11 = rotatePoint(p11, rotY, rotX)
        const r01 = rotatePoint(p01, rotY, rotX)

        const s00 = project(r00, size, cameraZ)
        const s10 = project(r10, size, cameraZ)
        const s11 = project(r11, size, cameraZ)
        const s01 = project(r01, size, cameraZ)

        const edgeA = sub(r10, r00)
        const edgeB = sub(r01, r00)
        const normal = normalize(cross(edgeA, edgeB))
        const light = clamp(dot(normal, lightDir), -1, 1)

        let base = lit ? palette.base : '#475569'
        if (highlight > 0.05) {
          base = mixColor(base, palette.light, highlight * 0.95)
          base = mixColor(base, '#ffffff', highlight * 0.55)
        }

        const fill = shadeColor(base, light * 0.85 + (j / vSteps - 0.5) * 0.15 + highlight * 0.35)
        const stroke = highlight > 0.2
          ? mixColor(palette.light, '#ffffff', highlight * 0.5)
          : lit
            ? shadeColor(palette.dark, light * 0.4)
            : 'rgba(15, 23, 42, 0.25)'

        const depth = (s00.z + s10.z + s11.z + s01.z) / 4

        faces.push({
          id: id++,
          points: `${s00.x},${s00.y} ${s10.x},${s10.y} ${s11.x},${s11.y} ${s01.x},${s01.y}`,
          fill,
          stroke,
          depth,
          lit,
          highlight
        })
      }
    }

    faces.sort((a, b) => a.depth - b.depth)
    return faces
  }, [
    R,
    cameraZ,
    halfWidth,
    isIndeterminate,
    lightDir.x,
    lightDir.y,
    lightDir.z,
    palette.base,
    palette.dark,
    palette.light,
    percent,
    pulseU,
    rotX,
    rotY,
    shimmerU,
    size,
    trailLength
  ])

  // Bright centerline energy ribbon (only front-facing samples)
  const trail = useMemo(() => {
    const segs: TrailSeg[] = []
    const samples = 48
    const span = trailLength

    for (let i = 0; i < samples; i += 1) {
      const t0 = i / samples
      const t1 = (i + 1) / samples
      const u0 = pulseU - span * (1 - t0)
      const u1 = pulseU - span * (1 - t1)
      const opacity = t1 * t1

      // Skip back-facing bits of the ribbon
      const midU = (u0 + u1) / 2
      const mid = mobiusPoint(midU, 0, R)
      const tan = sub(mobiusPoint(midU + 0.04, 0, R), mid)
      const bin = sub(mobiusPoint(midU, 0.4, R), mid)
      const n = normalize(cross(tan, bin))
      const nRot = rotatePoint(n, rotY, rotX)
      if (nRot.z < 0.05) continue

      const half = halfWidth * 0.22 * (0.35 + opacity)
      const a0 = rotatePoint(mobiusPoint(u0, -half, R), rotY, rotX)
      const a1 = rotatePoint(mobiusPoint(u0, half, R), rotY, rotX)
      const b0 = rotatePoint(mobiusPoint(u1, -half, R), rotY, rotX)
      const b1 = rotatePoint(mobiusPoint(u1, half, R), rotY, rotX)

      const p0 = project(a0, size, cameraZ)
      const p1 = project(a1, size, cameraZ)
      const p2 = project(b1, size, cameraZ)
      const p3 = project(b0, size, cameraZ)

      segs.push({
        id: `trail-${i}`,
        points: `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`,
        depth: (p0.z + p1.z + p2.z + p3.z) / 4,
        opacity,
        width: half
      })
    }

    segs.sort((a, b) => a.depth - b.depth)
    return segs
  }, [R, cameraZ, halfWidth, pulseU, rotX, rotY, size, trailLength])

  return (
    <Box
      ref={ref}
      {...props}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {(label || showValue) ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: size }}>
          {label ? (
            <Typography variant="body2" fontWeight={700}>{label}</Typography>
          ) : <Box />}
          {showValue && !isIndeterminate ? (
            <Typography variant="body2" fontWeight={800} sx={{ color: palette.base }}>
              {Math.round(percent)}%
            </Typography>
          ) : null}
        </Box>
      ) : null}

      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: 2,
          overflow: 'visible'
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={isIndeterminate ? 'Loading' : `Progress ${Math.round(percent)} percent`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`mobius-trail-${tone}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={palette.light} stopOpacity="0" />
              <stop offset="55%" stopColor={palette.light} stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <filter id={`mobius-glow-${tone}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx={size / 2}
            cy={size * 0.86}
            rx={size * 0.28}
            ry={size * 0.06}
            fill="rgba(15, 23, 42, 0.18)"
          />

          {/* Möbius mesh with traveling highlight */}
          {quads.map((quad) => (
            <polygon
              key={quad.id}
              points={quad.points}
              fill={quad.fill}
              stroke={quad.stroke}
              strokeWidth={quad.highlight > 0.3 ? 1.1 : 0.55}
              strokeLinejoin="round"
              opacity={quad.lit ? 1 : 0.42}
            />
          ))}

          {/* Energy comet ribbon along the centerline */}
          {trail.map((seg) => (
            <polygon
              key={seg.id}
              points={seg.points}
              fill={`url(#mobius-trail-${tone})`}
              opacity={seg.opacity * 0.95}
              style={{ filter: `url(#mobius-glow-${tone})` }}
            />
          ))}
        </svg>
      </Box>
    </Box>
  )
})
