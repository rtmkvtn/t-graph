import { useMemo } from 'react'

import ReactApexChart from 'react-apexcharts'

import { buildChartOptions } from '../lib/apexOptions'
import type {
  ChartSeriesInput,
  ChartType,
  MetricsChartProps,
  Series,
} from '../lib/types'

const DEFAULT_PALETTE = [
  '#F4D35E',
  '#4D9EE3',
  '#2BA02B',
  '#C026D3',
  '#FF8C42',
  '#7E22CE',
]

const toSeries = (
  input: ChartSeriesInput,
  type: ChartType,
  idx: number
): Series => ({
  name: input.label,
  type,
  color: input.color?.trim() || DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
  data: input.data.map(({ date, value }) => ({ x: date, y: value })),
  yAxis: { format: input.format },
})

const assertSharedDates = (
  reference: ChartSeriesInput,
  series: ChartSeriesInput,
  slot: string
) => {
  if (series.data.length !== reference.data.length) {
    throw new Error(
      `MetricsChart: all series must share the same dates. "${series.label}" (${slot}) has ${series.data.length} points, expected ${reference.data.length} (matching "${reference.label}")`
    )
  }
  for (let i = 0; i < reference.data.length; i++) {
    if (series.data[i].date !== reference.data[i].date) {
      throw new Error(
        `MetricsChart: all series must share the same dates. "${series.label}" (${slot}) has "${series.data[i].date}" at index ${i}, expected "${reference.data[i].date}" (matching "${reference.label}")`
      )
    }
  }
}

export function MetricsChart({
  area,
  bar,
  spline,
  line,
  height = 360,
}: MetricsChartProps) {
  const { apexSeries, options } = useMemo(() => {
    assertSharedDates(area, bar, 'bar')
    assertSharedDates(area, spline, 'spline')
    assertSharedDates(area, line, 'line')

    const series: Series[] = [
      toSeries(area, 'area', 0),
      toSeries(bar, 'bar', 1),
      toSeries(spline, 'spline', 2),
      toSeries(line, 'line', 3),
    ]
    const haloColors = series.map((s) =>
      s.type === 'area' || s.type === 'bar' ? null : s.color
    )
    const innerMarkerColors = series.map((s) =>
      s.type === 'spline' ? s.color : null
    )
    return buildChartOptions(series, haloColors, innerMarkerColors)
  }, [area, bar, spline, line])

  return (
    <ReactApexChart
      options={options}
      series={apexSeries}
      type="line"
      height={height}
    />
  )
}
