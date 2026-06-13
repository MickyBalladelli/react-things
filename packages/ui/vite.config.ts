import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const externalPackages = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@mui/material',
  '@mui/icons-material',
  '@emotion/react',
  '@emotion/styled'
]

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactThingsUI',
      fileName: 'react-things-ui',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: (id) => externalPackages.some((packageName) => id === packageName || id.startsWith(`${packageName}/`))
    }
  }
})
