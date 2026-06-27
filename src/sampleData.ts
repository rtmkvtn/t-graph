import type { Series } from './types'

const dates = ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13']

const cost: Series = {
  name: 'Cost',
  type: 'area',
  color: '#F4D35E',
  data: dates.map((x, i) => ({ x, y: [2.04, 25.85, 44.36, 55.65][i] })),
  yAxis: { format: 'currency' },
}

export const sampleSeries: Series[] = [cost]
