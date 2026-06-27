import type { Series, SeriesPoint } from './types'

const dates = ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13']

const points = (values: number[]): SeriesPoint[] =>
  values.map((y, i) => ({ x: dates[i], y }))

const cost: Series = {
  name: 'Cost',
  type: 'area',
  color: '#F4D35E',
  data: points([2.04, 25.85, 44.36, 55.65]),
  yAxis: { format: 'currency' },
}

const cpa: Series = {
  name: 'CPA',
  type: 'bar',
  color: '#4D9EE3',
  data: points([0.68, 0.86, 1.23, 0.79]),
  yAxis: { format: 'currency' },
}

const roi: Series = {
  name: 'ROI confirmed',
  type: 'spline',
  color: '#2B7A4B',
  data: points([610.78, 180.5, 161.47, 56.33]),
  yAxis: { format: 'percent' },
}

const conversions: Series = {
  name: 'Conversions',
  type: 'line',
  color: '#C2356F',
  data: points([3, 30, 36, 70]),
  yAxis: { format: 'number' },
}

export const sampleSeries: Series[] = [cost, cpa, roi, conversions]
