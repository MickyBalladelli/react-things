import { useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { PaperProps } from '@mui/material/Paper'

export type RuleBuilderOperator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'exists'
export type RuleBuilderCombinator = 'and' | 'or'

export type RuleBuilderField = {
  id: string
  label: string
  type?: 'text' | 'number' | 'boolean' | 'select'
  options?: Array<{ label: string, value: string | number | boolean }>
}

export type RuleBuilderCondition = {
  id: string
  fieldId: string
  operator: RuleBuilderOperator
  value?: string | number | boolean
}

export type RuleBuilderGroup = {
  id: string
  combinator: RuleBuilderCombinator
  rules: Array<RuleBuilderCondition | RuleBuilderGroup>
}

export type RuleBuilderProps = Omit<PaperProps, 'onChange'> & {
  fields: RuleBuilderField[]
  value?: RuleBuilderGroup
  defaultValue?: RuleBuilderGroup
  title?: string
  subtitle?: string
  maxDepth?: number
  onChange?: (group: RuleBuilderGroup, readable: string, errors: string[]) => void
}

const operatorLabels: Record<RuleBuilderOperator, string> = {
  equals: 'is',
  notEquals: 'is not',
  contains: 'contains',
  greaterThan: 'greater than',
  lessThan: 'less than',
  exists: 'exists'
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

function defaultCondition(fields: RuleBuilderField[]): RuleBuilderCondition {
  return {
    id: createId('condition'),
    fieldId: fields[0]?.id ?? '',
    operator: 'equals',
    value: ''
  }
}

function defaultGroup(fields: RuleBuilderField[]): RuleBuilderGroup {
  return {
    id: createId('group'),
    combinator: 'and',
    rules: [defaultCondition(fields)]
  }
}

function isGroup(rule: RuleBuilderCondition | RuleBuilderGroup): rule is RuleBuilderGroup {
  return 'rules' in rule
}

function updateRule(group: RuleBuilderGroup, ruleId: string, updater: (rule: RuleBuilderCondition | RuleBuilderGroup) => RuleBuilderCondition | RuleBuilderGroup): RuleBuilderGroup {
  if (group.id === ruleId) {
    return updater(group) as RuleBuilderGroup
  }

  return {
    ...group,
    rules: group.rules.map((rule) => {
      if (rule.id === ruleId) {
        return updater(rule)
      }

      return isGroup(rule) ? updateRule(rule, ruleId, updater) : rule
    })
  }
}

function removeRule(group: RuleBuilderGroup, ruleId: string): RuleBuilderGroup {
  return {
    ...group,
    rules: group.rules
      .filter((rule) => rule.id !== ruleId)
      .map((rule) => isGroup(rule) ? removeRule(rule, ruleId) : rule)
  }
}

function addRule(group: RuleBuilderGroup, groupId: string, rule: RuleBuilderCondition | RuleBuilderGroup): RuleBuilderGroup {
  if (group.id === groupId) {
    return {
      ...group,
      rules: [...group.rules, rule]
    }
  }

  return {
    ...group,
    rules: group.rules.map((item) => isGroup(item) ? addRule(item, groupId, rule) : item)
  }
}

function readableValue(value: unknown) {
  if (value === undefined || value === '') {
    return '...'
  }

  return String(value)
}

function getReadable(group: RuleBuilderGroup, fields: RuleBuilderField[]): string {
  const parts = group.rules.map((rule) => {
    if (isGroup(rule)) {
      return `(${getReadable(rule, fields)})`
    }

    const field = fields.find((item) => item.id === rule.fieldId)
    const operator = operatorLabels[rule.operator]

    return rule.operator === 'exists'
      ? `${field?.label ?? 'Field'} ${operator}`
      : `${field?.label ?? 'Field'} ${operator} ${readableValue(rule.value)}`
  })

  return parts.join(` ${group.combinator.toUpperCase()} `)
}

function validateGroup(group: RuleBuilderGroup, fields: RuleBuilderField[]) {
  const errors: string[] = []

  function visit(rule: RuleBuilderCondition | RuleBuilderGroup) {
    if (isGroup(rule)) {
      if (!rule.rules.length) {
        errors.push('Group is empty')
      }

      rule.rules.forEach(visit)
      return
    }

    if (!fields.some((field) => field.id === rule.fieldId)) {
      errors.push('Condition has no field')
    }

    if (rule.operator !== 'exists' && (rule.value === undefined || rule.value === '')) {
      errors.push('Condition has no value')
    }
  }

  visit(group)

  return errors
}

export function RuleBuilder({
  fields,
  value,
  defaultValue,
  title = 'Rule builder',
  subtitle = 'Compose conditions without code.',
  maxDepth = 3,
  onChange,
  sx,
  ...props
}: RuleBuilderProps) {
  const [internalGroup, setInternalGroup] = useState(defaultValue ?? defaultGroup(fields))
  const group = value ?? internalGroup
  const readable = useMemo(() => getReadable(group, fields), [fields, group])
  const errors = useMemo(() => validateGroup(group, fields), [fields, group])

  function commit(nextGroup: RuleBuilderGroup) {
    if (!value) {
      setInternalGroup(nextGroup)
    }

    onChange?.(nextGroup, getReadable(nextGroup, fields), validateGroup(nextGroup, fields))
  }

  function renderCondition(condition: RuleBuilderCondition, depth: number) {
    const field = fields.find((item) => item.id === condition.fieldId) ?? fields[0]
    const needsValue = condition.operator !== 'exists'

    return (
      <Paper key={condition.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1, bgcolor: 'background.paper' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'stretch', md: 'flex-start' }}>
          <TextField
            select
            size="small"
            label="Field"
            value={condition.fieldId}
            onChange={(event) => commit(updateRule(group, condition.id, (rule) => ({ ...rule, fieldId: event.target.value })))}
            sx={{ minWidth: 150 }}
          >
            {fields.map((item) => <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)}
          </TextField>
          <TextField
            select
            size="small"
            label="Operator"
            value={condition.operator}
            onChange={(event) => commit(updateRule(group, condition.id, (rule) => ({ ...rule, operator: event.target.value as RuleBuilderOperator })))}
            sx={{ minWidth: 150 }}
          >
            {Object.entries(operatorLabels).map(([operator, label]) => <MenuItem key={operator} value={operator}>{label}</MenuItem>)}
          </TextField>
          {needsValue ? (
            field?.type === 'select' ? (
              <TextField
                select
                fullWidth
                size="small"
                label="Value"
                value={condition.value ?? ''}
                onChange={(event) => commit(updateRule(group, condition.id, (rule) => ({ ...rule, value: event.target.value })))}
              >
                {(field.options ?? []).map((option) => <MenuItem key={String(option.value)} value={String(option.value)}>{option.label}</MenuItem>)}
              </TextField>
            ) : (
              <TextField
                fullWidth
                size="small"
                label="Value"
                type={field?.type === 'number' ? 'number' : 'text'}
                value={condition.value ?? ''}
                onChange={(event) => commit(updateRule(group, condition.id, (rule) => ({ ...rule, value: field?.type === 'number' ? Number(event.target.value) : event.target.value })))}
              />
            )
          ) : null}
          <Tooltip title="Remove condition">
            <span>
              <IconButton disabled={depth === 0 && group.rules.length === 1} onClick={() => commit(removeRule(group, condition.id))}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Paper>
    )
  }

  function renderGroup(ruleGroup: RuleBuilderGroup, depth = 0) {
    return (
      <Paper key={ruleGroup.id} variant="outlined" sx={{ p: 1.25, borderRadius: 1, bgcolor: depth === 0 ? '#f8fafc' : 'background.paper' }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={depth === 0 ? 'IF' : 'GROUP'} />
              <TextField
                select
                size="small"
                label="Match"
                value={ruleGroup.combinator}
                onChange={(event) => commit(updateRule(group, ruleGroup.id, (rule) => ({ ...rule, combinator: event.target.value as RuleBuilderCombinator })))}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="and">All</MenuItem>
                <MenuItem value="or">Any</MenuItem>
              </TextField>
            </Stack>
            {depth > 0 ? (
              <IconButton onClick={() => commit(removeRule(group, ruleGroup.id))}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : null}
          </Stack>

          <Stack spacing={1}>
            {ruleGroup.rules.map((rule) => isGroup(rule) ? renderGroup(rule, depth + 1) : renderCondition(rule, depth))}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button size="small" startIcon={<AddIcon />} onClick={() => commit(addRule(group, ruleGroup.id, defaultCondition(fields)))}>
              Condition
            </Button>
            {depth + 1 < maxDepth ? (
              <Button size="small" startIcon={<AddIcon />} onClick={() => commit(addRule(group, ruleGroup.id, defaultGroup(fields)))}>
                Group
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper variant="outlined" {...props} sx={[{ p: 1.5, borderRadius: 1 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <Stack spacing={1.5}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={950}>{title}</Typography>
            <Chip size="small" color={errors.length ? 'error' : 'success'} label={errors.length ? `${errors.length} issues` : 'Valid'} />
          </Stack>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        {renderGroup(group)}
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1, bgcolor: '#0f172a', color: '#e5e7eb' }}>
          <Typography variant="caption" color="#94a3b8" fontWeight={900}>READABLE OUTPUT</Typography>
          <Typography sx={{ mt: 0.5, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{readable}</Typography>
        </Paper>
        {errors.length ? (
          <Stack spacing={0.5}>
            {errors.map((error, index) => <Typography key={`${error}-${index}`} variant="caption" color="error">{error}</Typography>)}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  )
}
