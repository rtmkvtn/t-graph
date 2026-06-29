import type { ApexOptions } from 'apexcharts'

import { formatTooltipValue, formatValue } from '../helpers/format'
import { type ChartCtx, clearHalos, renderHalos } from '../helpers/halos'
import type { ChartType, Series, YAxisFormat } from './types'

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
    markerSize: 5,
    markerShape: 'square',
  },
  bar: { apexType: 'column', markerSize: 0 },
}

const strokeWidthFor = (type: ChartType): number => {
  if (type === 'spline') return 4
  if (type === 'line') return 2
  return 0
}

const buildYAxis = (series: Series[]): ApexOptions['yaxis'] => {
  const firstOfFormat = new Map<YAxisFormat, string>()
  for (const s of series) {
    if (!firstOfFormat.has(s.yAxis.format)) {
      firstOfFormat.set(s.yAxis.format, s.name)
    }
  }
  return series.map((s) => {
    const owner = firstOfFormat.get(s.yAxis.format)!
    return {
      seriesName: owner,
      show: false,
      opposite: s.yAxis.opposite ?? false,
      labels: {
        formatter: (value: number) => formatValue(value, s.yAxis.format),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    }
  })
}

type ApexSeries = {
  name: string
  type: ApexSeriesType
  data: Series['data']
  color: string
}

export type BuiltChartOptions = {
  apexSeries: ApexSeries[]
  options: ApexOptions
}

export const buildChartOptions = (
  series: Series[],
  haloColors: Array<string | null>,
  innerMarkerColors: Array<string | null>
): BuiltChartOptions => {
  const apexSeries: ApexSeries[] = series.map((s) => ({
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
      events: {
        mouseMove: (_event, ctx, opts) => {
          renderHalos(
            ctx as unknown as ChartCtx,
            opts.dataPointIndex,
            haloColors,
            innerMarkerColors
          )
        },
        mouseLeave: (_event, ctx) => {
          clearHalos(ctx as unknown as ChartCtx)
        },
      },
    },
    stroke: {
      curve: series.map((s) => TYPE_TABLE[s.type].curve ?? 'straight'),
      width: series.map((s) => strokeWidthFor(s.type)),
    },
    fill: {
      type: series.map(() => 'solid'),
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
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false },
      tooltip: { enabled: false },
    },
    yaxis: buildYAxis(series),
    legend: { show: false },
    dataLabels: { enabled: false },
    grid: { borderColor: '#eef0f2' },
    tooltip: {
      shared: true,
      intersect: false,
      followCursor: true,
      x: { format: 'dd.MM.yyyy' },
      y: {
        formatter: (value) => formatTooltipValue(value),
      },
    },
  }

  return { apexSeries, options }
}
