import { useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type TimelineScrubberMarker = {
  id: string
  time: number
  label?: string
  color?: string
  thumbnail?: ReactNode
}

export type TimelineScrubberThumbnail = {
  time: number
  thumbnail: ReactNode
}

export type TimelineScrubberChangeReason = 'drag' | 'click' | 'keyboard' | 'marker'

export type TimelineScrubberProps = Omit<BoxProps, 'onChange'> & {
  duration: number
  value?: number
  defaultValue?: number
  markers?: TimelineScrubberMarker[]
  thumbnails?: TimelineScrubberThumbnail[]
  disabled?: boolean
  showTime?: boolean
  preview?: boolean
  step?: number
  formatTime?: (time: number) => string
  onChange?: (time: number, reason: TimelineScrubberChangeReason) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function defaultFormatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function getPercent(time: number, duration: number) {
  return duration > 0 ? clamp((time / duration) * 100, 0, 100) : 0
}

function getClosestThumbnail(time: number, thumbnails: TimelineScrubberThumbnail[]) {
  return thumbnails.reduce<TimelineScrubberThumbnail | null>((closest, thumbnail) => {
    if (!closest) {
      return thumbnail
    }

    return Math.abs(thumbnail.time - time) < Math.abs(closest.time - time) ? thumbnail : closest
  }, null)
}

export function TimelineScrubber({
  duration,
  value,
  defaultValue = 0,
  markers = [],
  thumbnails = [],
  disabled = false,
  showTime = true,
  preview = true,
  step = 1,
  formatTime = defaultFormatTime,
  onChange,
  sx,
  ...props
}: TimelineScrubberProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [dragging, setDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const time = clamp(value ?? internalValue, 0, duration)
  const hover = hoverTime === null ? time : hoverTime
  const activePercent = getPercent(time, duration)
  const hoverPercent = getPercent(hover, duration)
  const sortedMarkers = useMemo(() => [...markers].sort((a, b) => a.time - b.time), [markers])
  const closestThumbnail = getClosestThumbnail(hover, thumbnails)

  function commitTime(nextTime: number, reason: TimelineScrubberChangeReason) {
    const snappedTime = step > 0 ? Math.round(nextTime / step) * step : nextTime
    const finalTime = clamp(snappedTime, 0, duration)

    if (value === undefined) {
      setInternalValue(finalTime)
    }

    onChange?.(finalTime, reason)
  }

  function timeFromClientX(clientX: number) {
    const track = trackRef.current

    if (!track) {
      return time
    }

    const bounds = track.getBoundingClientRect()
    const ratio = clamp((clientX - bounds.left) / bounds.width, 0, 1)

    return ratio * duration
  }

  function updateHover(clientX: number) {
    setHoverTime(timeFromClientX(clientX))
  }

  return (
    <Box
      {...props}
      sx={[
        {
          width: '100%',
          color: disabled ? 'text.disabled' : 'text.primary',
          userSelect: 'none'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {showTime ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" fontWeight={800}>
            {formatTime(time)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Box>
      ) : null}

      <Box
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={Math.round(time)}
        onPointerMove={(event) => {
          if (disabled) {
            return
          }

          updateHover(event.clientX)

          if (dragging) {
            commitTime(timeFromClientX(event.clientX), 'drag')
          }
        }}
        onPointerLeave={() => {
          if (!dragging) {
            setHoverTime(null)
          }
        }}
        onPointerDown={(event) => {
          if (disabled) {
            return
          }

          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
          commitTime(timeFromClientX(event.clientX), 'click')
        }}
        onPointerUp={(event) => {
          setDragging(false)
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(event) => {
          if (disabled) {
            return
          }

          if (event.key === 'ArrowLeft') {
            commitTime(time - step, 'keyboard')
            event.preventDefault()
          }

          if (event.key === 'ArrowRight') {
            commitTime(time + step, 'keyboard')
            event.preventDefault()
          }

          if (event.key === 'Home') {
            commitTime(0, 'keyboard')
            event.preventDefault()
          }

          if (event.key === 'End') {
            commitTime(duration, 'keyboard')
            event.preventDefault()
          }
        }}
        sx={{
          position: 'relative',
          height: 86,
          cursor: disabled ? 'default' : 'pointer',
          outline: 'none',
          '&:focus-visible .TimelineScrubber-track': {
            boxShadow: '0 0 0 3px rgba(37,99,235,0.28)'
          }
        }}
      >
        {preview && hoverTime !== null ? (
          <Box
            sx={{
              position: 'absolute',
              left: `${hoverPercent}%`,
              top: 0,
              transform: 'translateX(-50%)',
              width: 116,
              p: 0.75,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.paper',
              boxShadow: '0 14px 34px rgba(15,23,42,0.18)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <Box sx={{ height: 56, borderRadius: 0.75, overflow: 'hidden', bgcolor: '#e5e7eb' }}>
              {closestThumbnail?.thumbnail ?? (
                <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', bgcolor: '#0f172a', color: '#fff' }}>
                  <Typography variant="caption" fontWeight={900}>
                    {formatTime(hover)}
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="caption" fontWeight={800} sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
              {formatTime(hover)}
            </Typography>
          </Box>
        ) : null}

        <Box
          className="TimelineScrubber-track"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 18,
            height: 12,
            borderRadius: 999,
            bgcolor: '#e5e7eb',
            overflow: 'hidden',
            transition: 'box-shadow 120ms ease'
          }}
        >
          <Box
            sx={{
              width: `${activePercent}%`,
              height: '100%',
              borderRadius: 999,
              background: 'linear-gradient(90deg, #2563eb, #06b6d4)'
            }}
          />
        </Box>

        {sortedMarkers.map((marker) => {
          const markerPercent = getPercent(marker.time, duration)

          return (
            <Tooltip key={marker.id} title={marker.label ?? formatTime(marker.time)} arrow>
              <Box
                onPointerDown={(event) => {
                  event.stopPropagation()
                  commitTime(marker.time, 'marker')
                }}
                sx={{
                  position: 'absolute',
                  left: `${markerPercent}%`,
                  bottom: 11,
                  width: 12,
                  height: 26,
                  borderRadius: 999,
                  transform: 'translateX(-50%)',
                  bgcolor: marker.color ?? '#f59e0b',
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 8px 18px rgba(15,23,42,0.2)',
                  zIndex: 1
                }}
              />
            </Tooltip>
          )
        })}

        <Box
          sx={{
            position: 'absolute',
            left: `${activePercent}%`,
            bottom: 5,
            width: 28,
            height: 28,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'background.paper',
            border: 3,
            borderColor: '#2563eb',
            boxShadow: dragging ? '0 12px 30px rgba(37,99,235,0.36)' : '0 8px 20px rgba(15,23,42,0.2)'
          }}
        />
      </Box>
    </Box>
  )
}
