import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export type ComponentExampleProps = {
  title?: string
  children?: ReactNode
}

export function ComponentExample({ title = 'React Things', children }: ComponentExampleProps) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      {children ? (
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      ) : null}
    </Box>
  )
}
