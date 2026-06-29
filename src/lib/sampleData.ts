import { parseDataset } from './parseDataset'
import type { RawDataset, Series } from './types'

export const sampleDataset: RawDataset = {
  dates: ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'],
  series: [
    {
      name: 'Cost',
      type: 'area',
      color: '#F4D35E',
      format: 'currency',
      values: [2.04, 25.85, 44.36, 55.65],
    },
    {
      name: 'CPA',
      type: 'bar',
      color: '#4D9EE3',
      format: 'currency',
      values: [0.68, 0.86, 1.23, 0.79],
    },
    {
      name: 'ROI confirmed',
      type: 'spline',
      color: '#2BA02B',
      format: 'percent',
      values: [610.78, 180.5, 161.47, 56.33],
    },
    {
      name: 'Conversions',
      type: 'line',
      color: '#C026D3',
      format: 'number',
      values: [3, 30, 36, 70],
    },
  ],
}

export const sampleSeries: Series[] = parseDataset(sampleDataset)
