export type ChartType = 'area' | 'spline' | 'line' | 'bar'

export type YAxisFormat = 'currency' | 'percent' | 'number'

export type SeriesPoint = {
  x: string | number | Date
  y: number
}

export type Series = {
  name: string
  type: ChartType
  color: string
  data: SeriesPoint[]
  yAxis: {
    format: YAxisFormat
    show?: boolean
    opposite?: boolean
  }
}

export type ChartSeriesInput = {
  label: string
  format: YAxisFormat
  color?: string
  data: Array<{ date: string; value: number }>
}

export type MetricsChartProps = {
  area: ChartSeriesInput
  bar: ChartSeriesInput
  spline: ChartSeriesInput
  line: ChartSeriesInput
  height?: number
}
