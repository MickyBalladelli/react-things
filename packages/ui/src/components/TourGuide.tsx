import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode, RefObject } from 'react'

export type TourGuidePlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export type TourGuideBranch = {
  label: ReactNode
  stepId: string
}

export type TourGuideStep = {
  id: string
  title: ReactNode
  content?: ReactNode
  target?: string | RefObject<HTMLElement | null>
  placement?: TourGuidePlacement
  branches?: TourGuideBranch[]
  nextStepId?: string
}

export type TourGuideProps = BoxProps & {
  steps: TourGuideStep[]
  open?: boolean
  defaultOpen?: boolean
  stepId?: string
  initialStepId?: string
  spotlightPadding?: number
  spotlightRadius?: number
  scrollIntoView?: boolean
  completed?: boolean
  onOpenChange?: (open: boolean) => void
  onStepChange?: (step: TourGuideStep, index: number) => void
  onComplete?: () => void
  onSkip?: () => void
}

type Rect = {
  top: number
  left: number
  width: number
  height: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getTargetElement(target: TourGuideStep['target']) {
  if (!target) {
    return null
  }

  if (typeof target === 'string') {
    return document.querySelector(target) as HTMLElement | null
  }

  return target.current
}

function getStepIndex(steps: TourGuideStep[], stepId: string | undefined) {
  const index = steps.findIndex((step) => step.id === stepId)

  return index >= 0 ? index : 0
}

function getPanelPosition(rect: Rect | null, placement: TourGuidePlacement, width: number, height: number) {
  const gap = 16
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (!rect || placement === 'center') {
    return {
      left: (viewportWidth - width) / 2,
      top: (viewportHeight - height) / 2
    }
  }

  const positions = {
    top: {
      left: rect.left + rect.width / 2 - width / 2,
      top: rect.top - height - gap
    },
    bottom: {
      left: rect.left + rect.width / 2 - width / 2,
      top: rect.top + rect.height + gap
    },
    left: {
      left: rect.left - width - gap,
      top: rect.top + rect.height / 2 - height / 2
    },
    right: {
      left: rect.left + rect.width + gap,
      top: rect.top + rect.height / 2 - height / 2
    },
    center: {
      left: (viewportWidth - width) / 2,
      top: (viewportHeight - height) / 2
    }
  }

  return {
    left: clamp(positions[placement].left, 16, Math.max(16, viewportWidth - width - 16)),
    top: clamp(positions[placement].top, 16, Math.max(16, viewportHeight - height - 16))
  }
}

export function TourGuide({
  steps,
  open: controlledOpen,
  defaultOpen = false,
  stepId: controlledStepId,
  initialStepId,
  spotlightPadding = 10,
  spotlightRadius = 12,
  scrollIntoView = true,
  completed = false,
  onOpenChange,
  onStepChange,
  onComplete,
  onSkip,
  sx,
  ...props
}: TourGuideProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [internalStepId, setInternalStepId] = useState(initialStepId ?? steps[0]?.id)
  const [targetRect, setTargetRect] = useState<Rect | null>(null)
  const [panelSize, setPanelSize] = useState({ width: 360, height: 220 })
  const open = controlledOpen ?? internalOpen
  const activeStepId = controlledStepId ?? internalStepId
  const activeIndex = getStepIndex(steps, activeStepId)
  const activeStep = steps[activeIndex]
  const progress = steps.length ? ((activeIndex + 1) / steps.length) * 100 : 0
  const paddedRect = useMemo(() => targetRect ? {
    top: targetRect.top - spotlightPadding,
    left: targetRect.left - spotlightPadding,
    width: targetRect.width + spotlightPadding * 2,
    height: targetRect.height + spotlightPadding * 2
  } : null, [spotlightPadding, targetRect])
  const panelPosition = activeStep ? getPanelPosition(paddedRect, activeStep.placement ?? 'bottom', panelSize.width, panelSize.height) : { left: 0, top: 0 }

  useEffect(() => {
    if (!open || !activeStep) {
      return
    }

    function updateRect() {
      const target = getTargetElement(activeStep.target)

      if (!target) {
        setTargetRect(null)
        return
      }

      if (scrollIntoView) {
        target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' })
      }

      const rect = target.getBoundingClientRect()
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      })
    }

    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [activeStep, open, scrollIntoView])

  useEffect(() => {
    if (open && activeStep) {
      onStepChange?.(activeStep, activeIndex)
    }
  }, [activeIndex, activeStep, onStepChange, open])

  if (!open || !activeStep || completed) {
    return null
  }

  function setOpen(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen)
    }

    onOpenChange?.(nextOpen)
  }

  function goToStep(nextStepId: string | undefined) {
    if (!nextStepId) {
      finish()
      return
    }

    if (controlledStepId === undefined) {
      setInternalStepId(nextStepId)
    }
  }

  function goNext() {
    goToStep(activeStep.nextStepId ?? steps[activeIndex + 1]?.id)
  }

  function goBack() {
    const previousStep = steps[activeIndex - 1]

    if (previousStep && controlledStepId === undefined) {
      setInternalStepId(previousStep.id)
    }
  }

  function skip() {
    setOpen(false)
    onSkip?.()
  }

  function finish() {
    setOpen(false)
    onComplete?.()
  }

  return (
    <Box
      {...props}
      sx={[
        {
          position: 'fixed',
          inset: 0,
          zIndex: 1700,
          pointerEvents: 'auto'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box
        component="svg"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <mask id="tour-guide-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {paddedRect ? (
              <rect
                x={paddedRect.left}
                y={paddedRect.top}
                width={paddedRect.width}
                height={paddedRect.height}
                rx={spotlightRadius}
                ry={spotlightRadius}
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(15,23,42,0.72)" mask="url(#tour-guide-spotlight-mask)" />
      </Box>
      {paddedRect ? (
        <Box
          sx={{
            position: 'absolute',
            left: paddedRect.left,
            top: paddedRect.top,
            width: paddedRect.width,
            height: paddedRect.height,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: spotlightRadius,
            boxShadow: '0 0 0 4px rgba(37,99,235,0.22), 0 18px 42px rgba(15,23,42,0.28)',
            pointerEvents: 'none'
          }}
        />
      ) : null}
      <Paper
        variant="outlined"
        ref={(element) => {
          if (element) {
            const rect = element.getBoundingClientRect()
            const width = Math.round(rect.width)
            const height = Math.round(rect.height)

            if (width !== panelSize.width || height !== panelSize.height) {
              setPanelSize({ width, height })
            }
          }
        }}
        sx={{
          position: 'absolute',
          left: panelPosition.left,
          top: panelPosition.top,
          width: 360,
          maxWidth: 'calc(100vw - 32px)',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 28px 80px rgba(15,23,42,0.34)'
        }}
      >
        <LinearProgress variant="determinate" value={progress} />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={850}>
              Step {activeIndex + 1} of {steps.length}
            </Typography>
            <Button size="small" color="inherit" onClick={skip}>Skip</Button>
          </Stack>
          <Typography variant="h6" fontWeight={950} sx={{ mt: 1 }}>
            {activeStep.title}
          </Typography>
          {activeStep.content ? (
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {activeStep.content}
            </Typography>
          ) : null}
          {activeStep.branches?.length ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
              {activeStep.branches.map((branch) => (
                <Button key={branch.stepId} variant="outlined" size="small" onClick={() => goToStep(branch.stepId)}>
                  {branch.label}
                </Button>
              ))}
            </Stack>
          ) : null}
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
            <Button size="small" disabled={activeIndex === 0} onClick={goBack}>Back</Button>
            <Button variant="contained" size="small" onClick={activeIndex >= steps.length - 1 && !activeStep.nextStepId ? finish : goNext}>
              {activeIndex >= steps.length - 1 && !activeStep.nextStepId ? 'Done' : 'Next'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
