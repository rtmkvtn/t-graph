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

const formatValue = (value: number, format: YAxisFormat): string => {
  const isInt = Number.isInteger(value)
  const body = isInt ? `${value}` : value.toFixed(2)
  if (format === 'currency') return `$${body}`
  if (format === 'percent') return `${body}%`
  return body
}

const formatTooltipValue = (value: number): string => {
  const isInt = Number.isInteger(value)
  return isInt ? `${value}` : value.toFixed(2)
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
    const isOwner = owner === s.name
    const show = s.yAxis.show ?? isOwner
    return {
      seriesName: owner,
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

const HALO_RADIUS = 14
const HALO_OPACITY = 0.25
const HALO_LAYER_CLASS = 'apexcharts-custom-halo-layer'

type ChartCtx = {
  el: HTMLElement
  w: {
    globals: {
      seriesYvalues: Array<Array<number | null> | null>
      gridWidth: number
    }
  }
}

const SVG_NS = 'http://www.w3.org/2000/svg'

const renderHalos = (
  ctx: ChartCtx,
  dataPointIndex: number,
  seriesColors: Array<string | null>
) => {
  const inner = ctx.el.querySelector('.apexcharts-inner') as SVGGElement | null
  if (!inner) return
  let layer = inner.querySelector(`.${HALO_LAYER_CLASS}`) as SVGGElement | null
  if (!layer) {
    layer = document.createElementNS(SVG_NS, 'g')
    layer.setAttribute('class', HALO_LAYER_CLASS)
    layer.setAttribute('pointer-events', 'none')
    inner.appendChild(layer)
  }
  while (layer.firstChild) layer.removeChild(layer.firstChild)
  if (dataPointIndex < 0) return

  const ys = ctx.w.globals.seriesYvalues
  if (!ys?.length) return

  const pointCount = ys[0]?.length ?? 0
  if (pointCount === 0 || dataPointIndex >= pointCount) return

  const stepX = pointCount > 1 ? ctx.w.globals.gridWidth / (pointCount - 1) : 0
  const cx = dataPointIndex * stepX

  ys.forEach((yArr, sIdx) => {
    const cy = yArr?.[dataPointIndex]
    if (cy == null) return
    const color = seriesColors[sIdx]
    if (!color) return
    const circle = document.createElementNS(SVG_NS, 'circle')
    circle.setAttribute('cx', `${cx}`)
    circle.setAttribute('cy', `${cy}`)
    circle.setAttribute('r', `${HALO_RADIUS}`)
    circle.setAttribute('fill', color)
    circle.setAttribute('fill-opacity', `${HALO_OPACITY}`)
    layer!.appendChild(circle)
  })
}

const clearHalos = (ctx: ChartCtx) => {
  const layer = ctx.el.querySelector(`.${HALO_LAYER_CLASS}`)
  if (layer) layer.remove()
}

export function MetricsChart({ series, height = 360 }: MetricsChartProps) {
  const { apexSeries, options } = useMemo(() => {
    const apexSeries = series.map((s) => ({
      name: s.name,
      type: TYPE_TABLE[s.type].apexType,
      data: s.data,
      color: s.color,
    }))

    const haloColors = series.map((s) =>
      s.type === 'area' || s.type === 'bar' ? null : (s.color ?? '#000')
    )

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
              haloColors
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
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 4,
        },
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
        x: { format: 'dd.MM.yyyy' },
        y: {
          formatter: (value) => formatTooltipValue(value),
        },
      },
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
