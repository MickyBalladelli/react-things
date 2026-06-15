import { useEffect, useMemo, useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import type { ReactNode } from 'react'

export type DropComposerStatus = 'queued' | 'uploading' | 'done' | 'error'

export type DropComposerItem = {
  id: string
  name: string
  size?: number
  type?: string
  file?: File
  previewUrl?: string
  title?: string
  description?: string
  progress?: number
  status?: DropComposerStatus
  metadata?: Record<string, string>
}

export type DropComposerProps = Omit<BoxProps, 'onChange'> & {
  items?: DropComposerItem[]
  defaultItems?: DropComposerItem[]
  accept?: string
  multiple?: boolean
  title?: ReactNode
  subtitle?: ReactNode
  metadataFields?: string[]
  onItemsChange?: (items: DropComposerItem[]) => void
  onFiles?: (files: File[]) => void
  renderPreview?: (item: DropComposerItem) => ReactNode
}

function formatSize(size?: number) {
  if (!size) {
    return 'Unknown size'
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function makeItem(file: File): DropComposerItem {
  const isImage = file.type.startsWith('image/')

  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file,
    previewUrl: isImage ? URL.createObjectURL(file) : undefined,
    title: file.name.replace(/\.[^.]+$/, ''),
    description: '',
    progress: 0,
    status: 'queued',
    metadata: {}
  }
}

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items]
  const [item] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, item)
  return nextItems
}

export function DropComposer({
  items,
  defaultItems = [],
  accept,
  multiple = true,
  title = 'Drop files to compose upload',
  subtitle = 'Preview, reorder, edit metadata, then hand the list to your upload flow.',
  metadataFields = ['title', 'description'],
  onItemsChange,
  onFiles,
  renderPreview,
  sx,
  ...props
}: DropComposerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragIndexRef = useRef<number | null>(null)
  const [draggingZone, setDraggingZone] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [internalItems, setInternalItems] = useState(defaultItems)
  const currentItems = items ?? internalItems
  const completedCount = currentItems.filter((item) => (item.progress ?? 0) >= 100 || item.status === 'done').length
  const totalProgress = useMemo(() => {
    if (!currentItems.length) {
      return 0
    }

    return Math.round(currentItems.reduce((total, item) => total + (item.progress ?? 0), 0) / currentItems.length)
  }, [currentItems])

  const setItems = (nextItems: DropComposerItem[]) => {
    if (!items) {
      setInternalItems(nextItems)
    }

    onItemsChange?.(nextItems)
  }

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    const nextFiles = multiple ? files : files.slice(0, 1)
    const nextItems = [...(multiple ? currentItems : []), ...nextFiles.map(makeItem)]

    setItems(nextItems)
    onFiles?.(nextFiles)
  }

  const updateItem = (id: string, patch: Partial<DropComposerItem>) => {
    setItems(currentItems.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  const removeItem = (id: string) => {
    setItems(currentItems.filter((item) => item.id !== id))
  }

  useEffect(() => {
    if (items) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setInternalItems((nextItems) => nextItems.map((item) => {
        const progress = item.progress ?? 0

        if (progress >= 100 || item.status === 'error') {
          return item
        }

        const nextProgress = Math.min(100, progress + 7)

        return {
          ...item,
          progress: nextProgress,
          status: nextProgress >= 100 ? 'done' : 'uploading'
        }
      }))
    }, 500)

    return () => window.clearInterval(timer)
  }, [items])

  useEffect(() => () => {
    currentItems.forEach((item) => {
      if (item.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(item.previewUrl)
      }
    })
  }, [])

  return (
    <Box
      {...props}
      onDragOver={(event) => {
        event.preventDefault()
        setDraggingZone(true)
      }}
      onDragLeave={() => setDraggingZone(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDraggingZone(false)

        if (event.dataTransfer.files.length) {
          addFiles(event.dataTransfer.files)
        }
      }}
      sx={[
        (theme) => ({
          p: 1.5,
          border: '1px solid',
          borderColor: draggingZone ? 'primary.main' : 'divider',
          borderRadius: 2,
          bgcolor: draggingZone ? alpha(theme.palette.primary.main, 0.06) : 'background.paper',
          boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)'
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(event) => {
          if (event.target.files) {
            addFiles(event.target.files)
          }

          event.target.value = ''
        }}
      />

      <Box
        sx={(theme) => ({
          display: 'grid',
          placeItems: 'center',
          minHeight: 150,
          px: 2,
          py: 3,
          border: '1px dashed',
          borderColor: draggingZone ? 'primary.main' : alpha(theme.palette.text.primary, 0.18),
          borderRadius: 1.5,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.main, draggingZone ? 0.08 : 0.03)
        })}
      >
        <CloudUploadIcon color="primary" sx={{ fontSize: 42, mb: 1 }} />
        <Typography fontWeight={950}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mt: 0.5 }}>
          {subtitle}
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
      </Box>

      {currentItems.length ? (
        <Box sx={{ mt: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={900}>{currentItems.length} files</Typography>
              <Typography variant="caption" color="text.secondary">{completedCount} complete</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>{totalProgress}%</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={totalProgress} sx={{ mb: 1.5, borderRadius: 999 }} />

          <Stack spacing={1}>
            {currentItems.map((item, index) => {
              const isImage = Boolean(item.previewUrl) || item.type?.startsWith('image/')

              return (
                <Box
                  key={item.id}
                  draggable
                  onDragStart={() => {
                    dragIndexRef.current = index
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragOverIndex(index)
                  }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(event) => {
                    event.preventDefault()
                    const fromIndex = dragIndexRef.current

                    if (fromIndex !== null && fromIndex !== index) {
                      setItems(reorder(currentItems, fromIndex, index))
                    }

                    dragIndexRef.current = null
                    setDragOverIndex(null)
                  }}
                  sx={(theme) => ({
                    display: 'grid',
                    gridTemplateColumns: { xs: 'auto 64px 1fr auto', sm: 'auto 86px 1fr auto' },
                    gap: 1.25,
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid',
                    borderColor: dragOverIndex === index ? 'primary.main' : 'divider',
                    borderRadius: 1.5,
                    bgcolor: dragOverIndex === index ? alpha(theme.palette.primary.main, 0.05) : 'background.default'
                  })}
                >
                  <DragIndicatorIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />
                  <Box
                    sx={{
                      width: { xs: 64, sm: 86 },
                      aspectRatio: '4 / 3',
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: '#e5e7eb',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    {renderPreview ? renderPreview(item) : item.previewUrl ? (
                      <Box component="img" src={item.previewUrl} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : isImage ? (
                      <ImageOutlinedIcon color="action" />
                    ) : (
                      <InsertDriveFileOutlinedIcon color="action" />
                    )}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                      {metadataFields.map((field) => field === 'title' ? (
                        <TextField
                          key={field}
                          size="small"
                          label="Title"
                          value={item.title ?? ''}
                          onChange={(event) => updateItem(item.id, { title: event.target.value })}
                          sx={{ flex: 1 }}
                        />
                      ) : field === 'description' ? (
                        <TextField
                          key={field}
                          size="small"
                          label="Description"
                          value={item.description ?? ''}
                          onChange={(event) => updateItem(item.id, { description: event.target.value })}
                          sx={{ flex: 1.25 }}
                        />
                      ) : (
                        <TextField
                          key={field}
                          size="small"
                          label={field}
                          value={item.metadata?.[field] ?? ''}
                          onChange={(event) => updateItem(item.id, { metadata: { ...(item.metadata ?? {}), [field]: event.target.value } })}
                          sx={{ flex: 1 }}
                        />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography noWrap variant="caption" color="text.secondary" sx={{ minWidth: 0 }}>
                        {item.name} • {formatSize(item.size)}
                      </Typography>
                      <Typography variant="caption" color={(item.progress ?? 0) >= 100 ? 'success.main' : 'primary.main'} fontWeight={900}>
                        {item.status ?? 'queued'}
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={item.progress ?? 0} sx={{ mt: 0.75, borderRadius: 999 }} />
                  </Box>

                  <IconButton aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              )
            })}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
