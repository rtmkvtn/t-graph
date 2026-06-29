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

export type MetricsChartProps = {
  series: Series[]
  height?: number
}

export type RawSeries = {
  name: string
  type: ChartType
  color?: string
  format: YAxisFormat
  values: number[]
}

export type RawDataset = {
  dates: string[]
  series: RawSeries[]
}
