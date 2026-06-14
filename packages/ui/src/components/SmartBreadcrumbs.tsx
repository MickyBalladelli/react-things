import { useMemo, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { FocusEvent, MouseEvent, ReactNode } from 'react'

export type SmartBreadcrumbAction = {
  id: string
  label: ReactNode
  icon?: ReactNode
  onClick?: (item: SmartBreadcrumbItem) => void
}

export type SmartBreadcrumbItem = {
  id: string
  label?: ReactNode
  children?: ReactNode
  labelText?: string
  description?: ReactNode
  href?: string
  icon?: ReactNode
  preview?: ReactNode
  actions?: SmartBreadcrumbAction[]
  keywords?: string[]
}

export type SmartBreadcrumbsProps = Omit<BoxProps, 'onSelect'> & {
  items: SmartBreadcrumbItem[]
  currentId?: string
  maxVisible?: number
  separator?: ReactNode
  searchPlaceholder?: string
  emptyText?: ReactNode
  showPreview?: boolean
  onSelect?: (item: SmartBreadcrumbItem) => void
}

function textFromNode(value: ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

function itemLabel(item: SmartBreadcrumbItem) {
  return item.labelText ?? textFromNode(item.children ?? item.label)
}

function itemContent(item: SmartBreadcrumbItem) {
  return item.children ?? item.label ?? item.id
}

function itemSearchText(item: SmartBreadcrumbItem) {
  return [
    itemLabel(item),
    textFromNode(item.description),
    ...(item.keywords ?? [])
  ].join(' ').toLowerCase().trim()
}

export function SmartBreadcrumbs({
  items,
  currentId,
  maxVisible = 4,
  separator,
  searchPlaceholder = 'Search path',
  emptyText = 'No matching path',
  showPreview = true,
  onSelect,
  sx,
  ...props
}: SmartBreadcrumbsProps) {
  const [query, setQuery] = useState('')
  const [searchAnchor, setSearchAnchor] = useState<HTMLElement | null>(null)
  const [previewAnchor, setPreviewAnchor] = useState<HTMLElement | null>(null)
  const [previewItem, setPreviewItem] = useState<SmartBreadcrumbItem | null>(null)
  const activeId = currentId ?? items.at(-1)?.id

  const visibleItems = useMemo(() => {
    if (items.length <= maxVisible) {
      return items
    }

    const tailCount = Math.max(maxVisible - 1, 1)
    return [items[0], ...items.slice(-tailCount)]
  }, [items, maxVisible])

  const hiddenItems = useMemo(() => {
    const visibleIds = new Set(visibleItems.map((item) => item.id))
    return items.filter((item) => !visibleIds.has(item.id))
  }, [items, visibleItems])

  const filteredHiddenItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) {
      return hiddenItems
    }

    return hiddenItems.filter((item) => itemSearchText(item).includes(normalizedQuery))
  }, [hiddenItems, query])

  const selectItem = (item: SmartBreadcrumbItem) => {
    item.href ? undefined : onSelect?.(item)
    setSearchAnchor(null)
    setPreviewAnchor(null)
  }

  const openPreview = (anchor: HTMLElement, item: SmartBreadcrumbItem) => {
    if (!showPreview || (!item.preview && !item.description && !item.actions?.length)) {
      return
    }

    setPreviewItem(item)
    setPreviewAnchor(anchor)
  }

  const closePreview = () => {
    setPreviewAnchor(null)
  }

  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 0,
        p: 0.75,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
        ...sx
      }}
    >
      {visibleItems.map((item, index) => {
        const isActive = item.id === activeId
        const needsCollapseButton = hiddenItems.length > 0 && index === 1

        return (
          <Stack key={item.id} direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
            {needsCollapseButton && (
              <ButtonBase
                aria-label="Search collapsed path"
                onClick={(event) => setSearchAnchor(event.currentTarget)}
                sx={(theme) => ({
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.text.primary, 0.12),
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main'
                  }
                })}
              >
                <MoreHorizIcon fontSize="small" />
              </ButtonBase>
            )}
            {index > 0 && (separator ?? <ChevronRightIcon sx={{ fontSize: 18, color: 'text.disabled' }} />)}
            <ButtonBase
              component={item.href ? 'a' : 'button'}
              href={item.href}
              onClick={() => selectItem(item)}
              onMouseEnter={(event: MouseEvent<HTMLElement>) => openPreview(event.currentTarget, item)}
              onFocus={(event: FocusEvent<HTMLElement>) => openPreview(event.currentTarget, item)}
              sx={(theme) => ({
                minWidth: 0,
                maxWidth: { xs: 128, sm: 210 },
                gap: 0.75,
                px: 1.1,
                py: 0.75,
                borderRadius: 1.5,
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                fontWeight: isActive ? 850 : 700,
                textDecoration: 'none',
                justifyContent: 'flex-start',
                '&:hover': {
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.14) : alpha(theme.palette.text.primary, 0.06),
                  color: isActive ? 'primary.main' : 'text.primary'
                }
              })}
            >
              {item.icon && <Box sx={{ display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>{item.icon}</Box>}
              <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                {typeof itemContent(item) === 'string' || typeof itemContent(item) === 'number' ? (
                  <Typography noWrap variant="body2" fontWeight="inherit">
                    {itemContent(item)}
                  </Typography>
                ) : itemContent(item)}
              </Box>
            </ButtonBase>
          </Stack>
        )
      })}

      <Popover
        open={Boolean(searchAnchor)}
        anchorEl={searchAnchor}
        onClose={() => setSearchAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { mt: 1, width: 320, borderRadius: 2, overflow: 'hidden' } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <InputBase
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Box>
        <List dense disablePadding sx={{ maxHeight: 280, overflow: 'auto' }}>
          {filteredHiddenItems.map((item) => (
            <ListItemButton key={item.id} onClick={() => selectItem(item)}>
              {item.icon && <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>}
              <ListItemText
                primary={itemContent(item)}
                secondary={item.description}
                primaryTypographyProps={{ noWrap: true, fontWeight: 800 }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          ))}
          {filteredHiddenItems.length === 0 && (
            <Box sx={{ px: 2, py: 3 }}>
              <Typography variant="body2" color="text.secondary">{emptyText}</Typography>
            </Box>
          )}
        </List>
      </Popover>

      <Popover
        open={Boolean(previewAnchor)}
        anchorEl={previewAnchor}
        onClose={closePreview}
        disableRestoreFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { onMouseLeave: closePreview, sx: { mt: 1, width: 360, borderRadius: 2, overflow: 'hidden' } } }}
      >
        {previewItem && (
          <Box>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                {previewItem.icon && <Box sx={{ display: 'grid', placeItems: 'center' }}>{previewItem.icon}</Box>}
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap fontWeight={900}>{itemLabel(previewItem) || previewItem.id}</Typography>
                  {previewItem.description && (
                    <Typography variant="body2" color="text.secondary">{previewItem.description}</Typography>
                  )}
                </Box>
              </Stack>
            </Box>
            {previewItem.preview && (
              <>
                <Divider />
                <Box sx={{ p: 1.5, bgcolor: '#f8fafc' }}>{previewItem.preview}</Box>
              </>
            )}
            {previewItem.actions?.length ? (
              <>
                <Divider />
                <Stack direction="row" spacing={1} sx={{ p: 1.25, flexWrap: 'wrap' }}>
                  {previewItem.actions.map((action) => (
                    <Button
                      key={action.id}
                      size="small"
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={() => {
                        action.onClick?.(previewItem)
                        closePreview()
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </>
            ) : null}
          </Box>
        )}
      </Popover>
    </Box>
  )
}
