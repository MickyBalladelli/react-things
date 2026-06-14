import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type PresenceCursorStatus = 'active' | 'idle' | 'away'

export type PresenceCursorSelection = {
  x: number
  y: number
  width: number
  height: number
  label?: string
}

export type PresenceCursorUser = {
  id: string
  name: string
  x: number
  y: number
  color?: string
  status?: PresenceCursorStatus
  avatar?: ReactNode
  selection?: PresenceCursorSelection
  updatedAt?: number
}

export type PresenceCursorsProps = Omit<BoxProps, 'children'> & {
  users: PresenceCursorUser[]
  children?: ReactNode
  coordinateMode?: 'percent' | 'pixel'
  showNames?: boolean
  showSelections?: boolean
  showPresenceList?: boolean
  idleAfterMs?: number
  labelPlacement?: 'right' | 'bottom'
  cursorSize?: number
  renderCursor?: (user: PresenceCursorUser, status: PresenceCursorStatus) => ReactNode
}

function getStatus(user: PresenceCursorUser, idleAfterMs: number): PresenceCursorStatus {
  if (user.status) {
    return user.status
  }

  if (!user.updatedAt) {
    return 'active'
  }

  return Date.now() - user.updatedAt > idleAfterMs ? 'idle' : 'active'
}

function getPosition(value: number, mode: 'percent' | 'pixel') {
  return mode === 'percent' ? `${value}%` : value
}

function CursorShape({ color, size }: { color: string, size: number }) {
  return (
    <Box
      sx={{
        width: 0,
        height: 0,
        borderTop: `${size}px solid ${color}`,
        borderRight: `${Math.round(size * 0.62)}px solid transparent`,
        filter: 'drop-shadow(0 2px 4px rgba(15,23,42,0.24))'
      }}
    />
  )
}

export function PresenceCursors({
  users,
  children,
  coordinateMode = 'percent',
  showNames = true,
  showSelections = true,
  showPresenceList = true,
  idleAfterMs = 30000,
  labelPlacement = 'right',
  cursorSize = 18,
  renderCursor,
  sx,
  ...props
}: PresenceCursorsProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      {children}

      {showSelections ? users.map((user) => {
        if (!user.selection) {
          return null
        }

        const color = user.color ?? '#2563eb'
        const status = getStatus(user, idleAfterMs)

        return (
          <Box
            key={`${user.id}-selection`}
            sx={{
              position: 'absolute',
              left: getPosition(user.selection.x, coordinateMode),
              top: getPosition(user.selection.y, coordinateMode),
              width: getPosition(user.selection.width, coordinateMode),
              height: getPosition(user.selection.height, coordinateMode),
              border: `2px solid ${color}`,
              bgcolor: alpha(color, status === 'active' ? 0.12 : 0.06),
              opacity: status === 'away' ? 0.42 : 1,
              borderRadius: 1,
              pointerEvents: 'none'
            }}
          >
            {user.selection.label ? (
              <Chip
                size="small"
                label={user.selection.label}
                sx={{
                  position: 'absolute',
                  top: -28,
                  left: -2,
                  bgcolor: color,
                  color: '#fff',
                  fontWeight: 850
                }}
              />
            ) : null}
          </Box>
        )
      }) : null}

      {users.map((user) => {
        const color = user.color ?? '#2563eb'
        const status = getStatus(user, idleAfterMs)
        const inactive = status !== 'active'

        return (
          <Box
            key={user.id}
            sx={{
              position: 'absolute',
              left: getPosition(user.x, coordinateMode),
              top: getPosition(user.y, coordinateMode),
              transform: 'translate(-1px, -1px)',
              pointerEvents: 'none',
              opacity: inactive ? 0.58 : 1,
              transition: 'left 180ms ease, top 180ms ease, opacity 180ms ease',
              zIndex: 20
            }}
          >
            {renderCursor ? renderCursor(user, status) : <CursorShape color={color} size={cursorSize} />}
            {showNames ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: labelPlacement === 'right' ? cursorSize + 3 : 0,
                  top: labelPlacement === 'right' ? cursorSize - 3 : cursorSize + 4,
                  px: 0.75,
                  py: 0.35,
                  borderRadius: 1,
                  bgcolor: color,
                  color: '#fff',
                  boxShadow: '0 8px 22px rgba(15,23,42,0.18)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="caption" fontWeight={900}>
                  {user.name}{inactive ? ` · ${status}` : ''}
                </Typography>
              </Box>
            ) : null}
          </Box>
        )
      })}

      {showPresenceList ? (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            zIndex: 25
          }}
        >
          {users.map((user) => {
            const status = getStatus(user, idleAfterMs)
            const color = user.color ?? '#2563eb'

            return (
              <Chip
                key={user.id}
                size="small"
                label={user.name}
                sx={{
                  bgcolor: status === 'active' ? alpha(color, 0.14) : 'rgba(148,163,184,0.18)',
                  color: status === 'active' ? color : 'text.secondary',
                  border: `1px solid ${alpha(color, status === 'active' ? 0.35 : 0.12)}`,
                  fontWeight: 850
                }}
              />
            )
          })}
        </Stack>
      ) : null}
    </Box>
  )
}
