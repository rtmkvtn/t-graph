import { useMemo } from 'react'

import ReactApexChart from 'react-apexcharts'

import { buildChartOptions } from '../lib/apexOptions'
import type { MetricsChartProps } from '../lib/types'

export function MetricsChart({ series, height = 360 }: MetricsChartProps) {
  const { apexSeries, options } = useMemo(() => {
    const haloColors = series.map((s) =>
      s.type === 'area' || s.type === 'bar' ? null : (s.color ?? '#000')
    )
    const innerMarkerColors = series.map((s) =>
      s.type === 'spline' ? (s.color ?? '#000') : null
    )
    return buildChartOptions(series, haloColors, innerMarkerColors)
  }, [series])

  return (
    <ReactApexChart
      options={options}
      series={apexSeries}
      type="line"
      height={height}
    />
  )
}
