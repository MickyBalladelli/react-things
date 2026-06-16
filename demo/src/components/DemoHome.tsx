import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined'
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

export type DemoHomeComponent = {
  name: string
  summary: string
  description: string
  group: string
}

type DemoHomeProps = {
  components: DemoHomeComponent[]
  version: string
  onSelectComponent: (name: string) => void
}

const groupAccents: Record<string, string> = {
  Display: '#2563eb',
  Layout: '#059669',
  Input: '#db2777',
  Navigation: '#7c3aed',
  Effects: '#d97706'
}

function groupComponents(components: DemoHomeComponent[]) {
  return components.reduce<Record<string, DemoHomeComponent[]>>((groups, component) => {
    const nextGroups = groups
    nextGroups[component.group] = [...(nextGroups[component.group] ?? []), component]

    return nextGroups
  }, {})
}

export function DemoHome({ components, version, onSelectComponent }: DemoHomeProps) {
  const theme = useTheme()
  const groupedComponents = groupComponents([...components].sort((first, second) => first.name.localeCompare(second.name)))
  const groupNames = Object.keys(groupedComponents).sort()
  const featuredComponents = ['ActionInspector', 'FlowBuilder', 'DiffViewer', 'MiniMapNavigator']
    .map((name) => components.find((component) => component.name === name))
    .filter((component): component is DemoHomeComponent => Boolean(component))

  return (
    <Stack spacing={4}>
      <Paper
        variant="outlined"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          bgcolor: 'background.paper',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
            minHeight: { xs: 'auto', lg: 420 }
          }}
        >
          <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip label={`v${version}`} size="small" />
              <Chip label={`${components.length} components`} size="small" color="primary" variant="outlined" />
              <Chip label="MUI + React" size="small" variant="outlined" />
            </Stack>

            <Typography variant="h2" component="h2" fontWeight={900} sx={{ mt: 2, fontSize: { xs: 40, md: 56 }, lineHeight: 1 }}>
              React Things
            </Typography>

            <Typography variant="h5" color="text.secondary" sx={{ mt: 2, maxWidth: 760, lineHeight: 1.35 }}>
              A growing kit of polished React UI components for dense product tools, creative editors, dashboards, and workflow apps.
            </Typography>

            <Typography sx={{ mt: 2, maxWidth: 760 }}>
              The demo is both playground and catalog. Each component has a live preview, variants, code samples, and prop notes so builders can judge fit fast.
            </Typography>

          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 5 },
              borderTop: { xs: 1, lg: 0 },
              borderLeft: { xs: 0, lg: 1 },
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.05),
              display: 'grid',
              alignContent: 'center',
              gap: 1.5
            }}
          >
            {[
              { icon: <DashboardCustomizeOutlinedIcon />, label: 'Product surfaces', detail: 'Boards, inspectors, docks, panels, data cards.' },
              { icon: <LayersOutlinedIcon />, label: 'Visual editors', detail: 'Canvas, flows, diffs, compare stacks, minimaps.' },
              { icon: <SpeedOutlinedIcon />, label: 'Fast workflows', detail: 'Search, bulk actions, timeline undo, hints, gestures.' },
              { icon: <AutoAwesomeOutlinedIcon />, label: 'Demo-ready', detail: 'Dark/light theme, variants, props, and examples.' }
            ].map((item) => (
              <Paper
                key={item.label}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr',
                  gap: 1.25,
                  alignItems: 'center'
                }}
              >
                <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography fontWeight={850}>{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.detail}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Paper>

      <Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h4" component="h3" fontWeight={900}>
            Component Map
          </Typography>
          <Chip label="dense summary" size="small" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 820 }}>
          Quick scan of everything in the kit. Click a row to open its live docs.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
          gap: 2
        }}
      >
        {groupNames.map((group) => {
          const accent = groupAccents[group] ?? theme.palette.primary.main

          return (
            <Paper key={group} variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper' }}>
              <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: 999, bgcolor: accent }} />
                <Typography fontWeight={900}>{group}</Typography>
                <Chip label={groupedComponents[group].length} size="small" sx={{ ml: 'auto' }} />
              </Box>

              <Box sx={{ display: 'grid' }}>
                {groupedComponents[group].map((component) => (
                  <Box
                    key={component.name}
                    component="button"
                    type="button"
                    onClick={() => onSelectComponent(component.name)}
                    sx={{
                      width: '100%',
                      border: 0,
                      borderBottom: 1,
                      borderColor: 'divider',
                      bgcolor: 'transparent',
                      color: 'text.primary',
                      textAlign: 'left',
                      px: 2,
                      py: 1.35,
                      cursor: 'pointer',
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '170px 1fr' },
                      gap: { xs: 0.5, sm: 1.5 },
                      alignItems: 'center',
                      '&:last-of-type': {
                        borderBottom: 0
                      },
                      '&:hover': {
                        bgcolor: alpha(accent, theme.palette.mode === 'dark' ? 0.16 : 0.08)
                      }
                    }}
                  >
                    <Typography fontWeight={850} sx={{ color: accent }}>
                      {component.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {component.summary}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          )
        })}
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 1, bgcolor: 'background.paper' }}>
        <Typography variant="h5" component="h3" fontWeight={900}>
          Good First Looks
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5, mt: 2 }}>
          {featuredComponents.map((component) => (
            <Button
              key={component.name}
              variant="outlined"
              onClick={() => onSelectComponent(component.name)}
              sx={{
                minHeight: 92,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                textAlign: 'left',
                p: 1.5
              }}
            >
              <Box>
                <Typography fontWeight={900}>{component.name}</Typography>
                <Typography variant="caption" color="text.secondary">{component.summary}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Paper>
    </Stack>
  )
}
