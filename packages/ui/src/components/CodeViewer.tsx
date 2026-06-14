import { useLayoutEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import type { ClipboardEvent, KeyboardEvent } from 'react'

export type CodeViewerProps = {
  label: string
  language: string
  value: string
  onChange: (value: string) => void
  minHeight?: number
}

const codeFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
const codePadding = 12

const languageColors: Record<string, string> = {
  c: '#659ad2',
  cpp: '#00599c',
  cplusplus: '#00599c',
  'c++': '#00599c',
  typescript: '#3178c6',
  ts: '#3178c6',
  tsx: '#3178c6',
  javascript: '#f7df1e',
  js: '#f7df1e',
  jsx: '#f7df1e',
  java: '#e76f00',
  powershell: '#5391fe',
  ps1: '#5391fe',
  rust: '#dea584',
  rs: '#dea584',
  go: '#00add8',
  golang: '#00add8',
  shell: '#89e051',
  sh: '#89e051',
  bash: '#89e051',
  zsh: '#89e051',
  python: '#3776ab',
  py: '#3776ab',
  csharp: '#9b4f96',
  'c#': '#9b4f96',
  cs: '#9b4f96',
  php: '#777bb4',
  ruby: '#cc342d',
  rb: '#cc342d',
  swift: '#f05138',
  kotlin: '#a97bff',
  kt: '#a97bff',
  sql: '#336791',
  html: '#e34f26',
  css: '#1572b6',
  dart: '#0175c2'
}

function normalizeLanguage(language: string) {
  return language
    .trim()
    .replace(/^\./, '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

function getLanguageColor(language: string) {
  return languageColors[normalizeLanguage(language)] ?? '#93c5fd'
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function colorToken(token: string) {
  const escapedToken = escapeHtml(token)
  const keywordPattern = /^(import|from|export|function|return|const|let|var|type|interface|class|extends|new|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|fn|pub|use|mod|impl|trait|struct|enum|match|mut|let|where|package|func|defer|go|select|range|map|chan|SELECT|FROM|WHERE|AS|AND|OR|INSERT|UPDATE|DELETE|CREATE|TABLE|ORDER|BY|GROUP|LIMIT|select|from|where|as|and|or|insert|update|delete|create|table|order|by|group|limit)\b/

  if (/^['"`]/.test(token)) {
    return `<span style="color:#86efac">${escapedToken}</span>`
  }

  if (/^\d/.test(token)) {
    return `<span style="color:#fbbf24">${escapedToken}</span>`
  }

  if (/^<\/?[A-Z][\w.]*/.test(token)) {
    return `<span style="color:#67e8f9">${escapedToken}</span>`
  }

  if (keywordPattern.test(token)) {
    return `<span style="color:#c084fc">${escapedToken}</span>`
  }

  if (/^[$#][\w-]+$|^\.[\w-]+$/.test(token)) {
    return `<span style="color:#f9a8d4">${escapedToken}</span>`
  }

  if (/^[A-Z][\w.]*$/.test(token)) {
    return `<span style="color:#93c5fd">${escapedToken}</span>`
  }

  if (/^[a-z][\w-]*(?==|:)/.test(token)) {
    return `<span style="color:#f9a8d4">${escapedToken}</span>`
  }

  if (/^[{}()[\].,:;=<>/]+$/.test(token)) {
    return `<span style="color:#94a3b8">${escapedToken}</span>`
  }

  return escapedToken
}

function highlightCode(value: string) {
  return value
    .split(/(\s+|<\/?[A-Z][\w.]*|['"`][^'"`]*['"`]|\d*\.?\d+|[A-Za-z_$][\w$-]*|[{}()[\].,:;=<>/]+)/g)
    .map((token) => colorToken(token))
    .join('')
}

function getCaretOffset(element: HTMLElement | null) {
  const selection = window.getSelection()

  if (!element || !selection?.rangeCount) {
    return 0
  }

  const range = selection.getRangeAt(0)

  if (!element.contains(range.endContainer)) {
    return 0
  }

  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)

  return preCaretRange.toString().length
}

function setCaretOffset(element: HTMLElement | null, offset: number) {
  if (!element) {
    return
  }

  const selection = window.getSelection()
  const range = document.createRange()
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let currentOffset = 0
  let currentNode = walker.nextNode()

  while (currentNode) {
    const nextOffset = currentOffset + (currentNode.textContent?.length ?? 0)

    if (offset <= nextOffset) {
      range.setStart(currentNode, Math.max(0, offset - currentOffset))
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
      return
    }

    currentOffset = nextOffset
    currentNode = walker.nextNode()
  }

  range.selectNodeContents(element)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function CodeViewer({ label, language, value, onChange, minHeight = 360 }: CodeViewerProps) {
  const editorRef = useRef<HTMLElement | null>(null)
  const caretOffsetRef = useRef<number | null>(null)
  const safeValue = value ?? ''
  const lineCount = Math.max(safeValue.split('\n').length, 1)
  const lineNumbers = Array.from({ length: lineCount }, (_, index) => index + 1).join('\n')
  const highlightedCode = highlightCode(safeValue)
  const languageColor = getLanguageColor(language)

  useLayoutEffect(() => {
    if (caretOffsetRef.current !== null && document.activeElement === editorRef.current) {
      setCaretOffset(editorRef.current, caretOffsetRef.current)
      caretOffsetRef.current = null
    }
  }, [safeValue])

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') {
      return
    }

    event.preventDefault()
    document.execCommand('insertText', false, '  ')
    caretOffsetRef.current = getCaretOffset(editorRef.current)
    onChange(editorRef.current?.textContent ?? '')
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    event.preventDefault()
    document.execCommand('insertText', false, event.clipboardData.getData('text/plain'))
    caretOffsetRef.current = getCaretOffset(editorRef.current)
    onChange(editorRef.current?.textContent ?? '')
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 1,
          bgcolor: '#111827',
          color: '#d1d5db',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4
        }}
      >
        <Typography variant="caption" fontWeight={800}>
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            color: languageColor,
            textTransform: 'lowercase'
          }}
        >
          {language}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '48px 1fr',
          minHeight,
          bgcolor: '#0f172a',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          overflow: 'hidden'
        }}
      >
        <Box
          component="pre"
          aria-hidden="true"
          sx={{
            m: 0,
            px: 1.5,
            py: 1.5,
            color: '#64748b',
            bgcolor: '#111827',
            fontFamily: codeFont,
            fontSize: 14,
            lineHeight: 1.6,
            textAlign: 'right',
            userSelect: 'none'
          }}
        >
          {lineNumbers}
        </Box>

        <Box
          sx={{
            position: 'relative',
            minHeight,
            bgcolor: '#0f172a',
            overflow: 'auto'
          }}
        >
          <Box
            ref={editorRef}
            component="pre"
            contentEditable
            role="textbox"
            tabIndex={0}
            aria-multiline="true"
            aria-label={`${label} code editor`}
            spellCheck={false}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            onInput={(event) => {
              caretOffsetRef.current = getCaretOffset(event.currentTarget)
              onChange(event.currentTarget.textContent ?? '')
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            sx={{
              position: 'relative',
              width: '100%',
              minWidth: 0,
              minHeight,
              m: 0,
              border: 0,
              outline: 0,
              p: `${codePadding}px`,
              boxSizing: 'border-box',
              color: '#e5e7eb',
              bgcolor: 'transparent',
              caretColor: '#60a5fa',
              fontFamily: codeFont,
              fontVariantLigatures: 'none',
              fontSize: 14,
              lineHeight: 1.6,
              tabSize: 2,
              whiteSpace: 'pre-wrap',
              overflowWrap: 'normal',
              overflow: 'visible',
              textShadow: 'none',
              MozOsxFontSmoothing: 'auto',
              '&::selection': {
                color: '#ffffff',
                bgcolor: 'rgba(96, 165, 250, 0.35)'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
