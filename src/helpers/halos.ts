const HALO_RADIUS = 14
const HALO_OPACITY = 0.25
const HALO_LAYER_CLASS = 'apexcharts-custom-halo-layer'
const SVG_NS = 'http://www.w3.org/2000/svg'

export type ChartCtx = {
  el: HTMLElement
  w: {
    globals: {
      seriesYvalues: Array<Array<number | null> | null>
      gridWidth: number
    }
  }
}

export const renderHalos = (
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

export const clearHalos = (ctx: ChartCtx) => {
  const layer = ctx.el.querySelector(`.${HALO_LAYER_CLASS}`)
  if (layer) layer.remove()
}
