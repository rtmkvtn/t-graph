import type { ChartSeriesInput } from './types'

const dates = [
  '2026-06-01',
  '2026-06-02',
  '2026-06-03',
  '2026-06-04',
  '2026-06-05',
  '2026-06-06',
  '2026-06-07',
  '2026-06-08',
  '2026-06-09',
  '2026-06-10',
  '2026-06-11',
  '2026-06-12',
  '2026-06-13',
  '2026-06-14',
  '2026-06-15',
  '2026-06-16',
  '2026-06-17',
  '2026-06-18',
  '2026-06-19',
  '2026-06-20',
]

const zip = (values: number[]) =>
  values.map((value, i) => ({ date: dates[i], value }))

export const costSeries: ChartSeriesInput = {
  label: 'Cost',
  format: 'currency',
  color: '#F4D35E',
  data: zip([
    1.2, 3.8, 8.5, 14.2, 21.0, 18.6, 25.85, 32.4, 41.1, 44.36, 55.65, 62.3,
    58.9, 67.4, 71.2, 80.5, 76.8, 88.3, 92.1, 99.5,
  ]),
}

export const cpaSeries: ChartSeriesInput = {
  label: 'CPA',
  format: 'currency',
  color: '#4D9EE3',
  data: zip([
    0.42, 0.55, 0.61, 0.49, 0.78, 0.86, 1.04, 0.92, 1.18, 1.23, 0.79, 1.31,
    1.05, 0.88, 1.42, 1.15, 0.97, 1.28, 1.06, 1.45,
  ]),
}

export const roiSeries: ChartSeriesInput = {
  label: 'ROI confirmed',
  format: 'percent',
  color: '#2BA02B',
  data: zip([
    820.4, 745.2, 610.78, 540.1, 412.5, 380.7, 311.2, 245.6, 198.4, 180.5,
    161.47, 145.8, 132.4, 118.9, 105.3, 96.8, 88.2, 76.5, 68.4, 56.33,
  ]),
}

export const conversionsSeries: ChartSeriesInput = {
  label: 'Conversions',
  format: 'number',
  color: '#C026D3',
  data: zip([
    2, 5, 8, 11, 16, 22, 28, 30, 34, 36, 41, 45, 48, 52, 58, 61, 65, 70, 73, 78,
  ]),
}
