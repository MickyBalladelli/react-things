import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box'

export type FileDropZoneProps = BoxProps & {
  onFiles?: (files: File[]) => void
}

export function FileDropZone({ onFiles, sx, ...props }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    if (files) {
      onFiles?.(Array.from(files))
    }
  }

  return (
    <Box
      {...props}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
      sx={[
        {
          p: 4,
          border: 2,
          borderStyle: 'dashed',
          borderColor: dragging ? 'primary.main' : 'divider',
          borderRadius: 1,
          textAlign: 'center',
          bgcolor: dragging ? 'primary.50' : 'background.paper'
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
    >
      <Typography fontWeight={800}>Drop files here</Typography>
      <Typography variant="body2" color="text.secondary">Drag files into this zone</Typography>
    </Box>
  )
}
