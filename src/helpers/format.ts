import type { YAxisFormat } from '../lib/types'

export const formatValue = (value: number, format: YAxisFormat): string => {
  const isInt = Number.isInteger(value)
  const body = isInt ? `${value}` : value.toFixed(2)
  if (format === 'currency') return `$${body}`
  if (format === 'percent') return `${body}%`
  return body
}

export const formatTooltipValue = (value: number): string => {
  const isInt = Number.isInteger(value)
  return isInt ? `${value}` : value.toFixed(2)
}
