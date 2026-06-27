import { useMemo } from 'react'

import ReactApexChart from 'react-apexcharts'

import type { ApexOptions } from 'apexcharts'

import type { ChartType, MetricsChartProps, Series, YAxisFormat } from './types'

type ApexSeriesType = 'area' | 'line' | 'column'
type ApexCurve = 'smooth' | 'straight'

type TypeTranslation = {
  apexType: ApexSeriesType
  curve?: ApexCurve
  markerSize: number
  markerShape?: 'circle' | 'square'
}

const TYPE_TABLE: Record<ChartType, TypeTranslation> = {
  area: { apexType: 'area', curve: 'smooth', markerSize: 0 },
  spline: { apexType: 'line', curve: 'smooth', markerSize: 0 },
  line: {
    apexType: 'line',
    curve: 'straight',
    markerSize: 6,
    markerShape: 'square',
  },
  bar: { apexType: 'column', markerSize: 0 },
}

const formatValue = (value: number, format: YAxisFormat): string => {
  const isInt = Number.isInteger(value)
  const body = isInt ? `${value}` : value.toFixed(2)
  if (format === 'currency') return `$${body}`
  if (format === 'percent') return `${body}%`
  return body
}

const buildYAxis = (series: Series[]): ApexOptions['yaxis'] => {
  const seenFormats = new Set<YAxisFormat>()
  return series.map((s) => {
    const firstOfFormat = !seenFormats.has(s.yAxis.format)
    seenFormats.add(s.yAxis.format)
    const show = s.yAxis.show ?? firstOfFormat
    return {
      seriesName: s.name,
      show,
      opposite: s.yAxis.opposite ?? false,
      labels: {
        formatter: (value: number) => formatValue(value, s.yAxis.format),
        style: { colors: '#6b7280' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    }
  })
}

export function MetricsChart({ series, height = 360 }: MetricsChartProps) {
  const { apexSeries, options } = useMemo(() => {
    const apexSeries = series.map((s) => ({
      name: s.name,
      type: TYPE_TABLE[s.type].apexType,
      data: s.data,
      color: s.color,
    }))

    const options: ApexOptions = {
      chart: {
        type: 'line',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true },
      },
      stroke: {
        curve: series.map((s) => TYPE_TABLE[s.type].curve ?? 'straight'),
        width: series.map((s) =>
          TYPE_TABLE[s.type].apexType === 'area' ? 2 : 3
        ),
      },
      fill: {
        type: series.map((s) =>
          TYPE_TABLE[s.type].apexType === 'area' ? 'solid' : 'solid'
        ),
        opacity: series.map((s) =>
          TYPE_TABLE[s.type].apexType === 'area' ? 0.35 : 1
        ),
      },
      markers: {
        size: series.map((s) => TYPE_TABLE[s.type].markerSize),
        shape: series.map(
          (s) => TYPE_TABLE[s.type].markerShape ?? 'circle'
        ) as never,
        strokeWidth: 0,
      },
      xaxis: {
        type: 'datetime',
        labels: { datetimeUTC: false },
      },
      yaxis: buildYAxis(series),
      legend: { show: false },
      dataLabels: { enabled: false },
      grid: { borderColor: '#eef0f2' },
      tooltip: { shared: true, intersect: false },
    }

    return { apexSeries, options }
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
