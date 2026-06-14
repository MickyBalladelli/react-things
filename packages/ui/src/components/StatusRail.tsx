import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha, keyframes } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type StatusRailTone = 'operational' | 'degraded' | 'incident' | 'maintenance'

export type StatusRailIncident = {
  id: string
  title: ReactNode
  message?: ReactNode
  severity?: Exclude<StatusRailTone, 'operational'>
  timestamp?: number
}

export type StatusRailGroup = {
  id: string
  label: ReactNode
  status: StatusRailTone
  uptime?: number
  latency?: number
  incidents?: StatusRailIncident[]
}

export type StatusRailProps = BoxProps & {
  groups: StatusRailGroup[]
  title?: ReactNode
  subtitle?: ReactNode
  pulse?: boolean
  compact?: boolean
  maxIncidents?: number
  showMetrics?: boolean
  onGroupSelect?: (group: StatusRailGroup) => void
  onIncidentSelect?: (incident: StatusRailIncident, group: StatusRailGroup) => void
}

const pulseKeyframes = keyframes`
  0% { transform: scale(0.7); opacity: 0.8; }
  70% { transform: scale(2.2); opacity: 0; }
  100% { transform: scale(2.2); opacity: 0; }
`

const toneMeta: Record<StatusRailTone, { color: string, label: string, icon: ReactNode }> = {
  operational: { color: '#059669', label: 'Operational', icon: <CheckCircleIcon fontSize="small" /> },
  degraded: { color: '#d97706', label: 'Degraded', icon: <WarningIcon fontSize="small" /> },
  incident: { color: '#dc2626', label: 'Incident', icon: <ErrorIcon fontSize="small" /> },
  maintenance: { color: '#2563eb', label: 'Maintenance', icon: <InfoIcon fontSize="small" /> }
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(timestamp)
}

function getSummary(groups: StatusRailGroup[]) {
  const incidentCount = groups.filter((group) => group.status === 'incident').length
  const degradedCount = groups.filter((group) => group.status === 'degraded').length

  if (incidentCount) {
    return `${incidentCount} incident${incidentCount > 1 ? 's' : ''}`
  }

  if (degradedCount) {
    return `${degradedCount} degraded`
  }

  return 'All systems normal'
}

export function StatusRail({
  groups,
  title = 'Status',
  subtitle,
  pulse = true,
  compact = false,
  maxIncidents = 3,
  showMetrics = true,
  onGroupSelect,
  onIncidentSelect,
  sx,
  ...props
}: StatusRailProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          width: compact ? 280 : 340,
          maxWidth: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Box sx={{ p: compact ? 1.5 : 2 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={950}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle ?? getSummary(groups)}</Typography>
          </Box>
          <Chip size="small" label={`${groups.length} groups`} />
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ display: 'grid' }}>
        {groups.map((group, groupIndex) => {
          const meta = toneMeta[group.status]
          const incidents = (group.incidents ?? []).slice(0, maxIncidents)

          return (
            <Box key={group.id}>
              {groupIndex > 0 ? <Divider /> : null}
              <Box
                role={onGroupSelect ? 'button' : undefined}
                tabIndex={onGroupSelect ? 0 : undefined}
                onClick={() => onGroupSelect?.(group)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onGroupSelect?.(group)
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr',
                  gap: 1.25,
                  p: compact ? 1.25 : 1.5,
                  cursor: onGroupSelect ? 'pointer' : 'default',
                  '&:hover': onGroupSelect ? { bgcolor: 'action.hover' } : undefined
                }}
              >
                <Box sx={{ position: 'relative', width: 22, height: 22, mt: 0.2 }}>
                  {pulse && group.status !== 'operational' ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 4,
                        borderRadius: '50%',
                        bgcolor: meta.color,
                        animation: `${pulseKeyframes} 1500ms ease-out infinite`
                      }}
                    />
                  ) : null}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 3,
                      borderRadius: '50%',
                      bgcolor: meta.color,
                      border: '3px solid #fff',
                      boxShadow: `0 0 0 1px ${alpha(meta.color, 0.3)}`
                    }}
                  />
                </Box>

                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={900} noWrap>{group.label}</Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Box sx={{ color: meta.color, display: 'grid', placeItems: 'center' }}>{meta.icon}</Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={800}>{meta.label}</Typography>
                      </Stack>
                    </Box>
                    {group.incidents?.length ? (
                      <Chip size="small" color={group.status === 'incident' ? 'error' : 'warning'} label={group.incidents.length} />
                    ) : null}
                  </Stack>

                  {showMetrics && (group.uptime !== undefined || group.latency !== undefined) ? (
                    <Stack spacing={0.75}>
                      {group.uptime !== undefined ? (
                        <Box>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Uptime</Typography>
                            <Typography variant="caption" fontWeight={850}>{group.uptime.toFixed(2)}%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, group.uptime))} sx={{ height: 5, borderRadius: 999 }} />
                        </Box>
                      ) : null}
                      {group.latency !== undefined ? (
                        <Typography variant="caption" color="text.secondary">
                          p95 latency {group.latency}ms
                        </Typography>
                      ) : null}
                    </Stack>
                  ) : null}

                  {incidents.length ? (
                    <Stack spacing={0.75}>
                      {incidents.map((incident) => {
                        const incidentTone = toneMeta[incident.severity ?? group.status] ?? toneMeta.incident

                        return (
                          <Box
                            key={incident.id}
                            role={onIncidentSelect ? 'button' : undefined}
                            tabIndex={onIncidentSelect ? 0 : undefined}
                            onClick={(event) => {
                              event.stopPropagation()
                              onIncidentSelect?.(incident, group)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.stopPropagation()
                                onIncidentSelect?.(incident, group)
                              }
                            }}
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor: alpha(incidentTone.color, 0.08),
                              border: `1px solid ${alpha(incidentTone.color, 0.18)}`,
                              cursor: onIncidentSelect ? 'pointer' : 'default'
                            }}
                          >
                            <Typography variant="caption" fontWeight={900} sx={{ color: incidentTone.color }}>{incident.title}</Typography>
                            {incident.message ? (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{incident.message}</Typography>
                            ) : null}
                            {incident.timestamp ? (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{formatTime(incident.timestamp)}</Typography>
                            ) : null}
                          </Box>
                        )
                      })}
                    </Stack>
                  ) : null}
                </Stack>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
