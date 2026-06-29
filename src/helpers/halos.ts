const HALO_RADIUS = 14
const HALO_OPACITY = 0.25
const INNER_MARKER_HALF = 5
const INNER_MARKER_STROKE = 1.5
const FADE_DURATION_MS = 150
const HALO_LAYER_CLASS = 'apexcharts-custom-halo-layer'
const FADING_OUT_CLASS = 'fading-out'
const ACTIVE_MARKER_CLASS = 'marker-active'
const ACTIVE_INDEX_ATTR = 'data-active-index'
const FADE_TIMEOUT_ATTR = 'data-fade-timeout-id'
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

const cancelPendingRemoval = (layer: SVGGElement) => {
  const idStr = layer.getAttribute(FADE_TIMEOUT_ATTR)
  if (idStr) {
    clearTimeout(Number(idStr))
    layer.removeAttribute(FADE_TIMEOUT_ATTR)
  }
  layer.classList.remove(FADING_OUT_CLASS)
}

const fadeOutLayer = (layer: SVGGElement) => {
  if (layer.classList.contains(FADING_OUT_CLASS)) return
  if (!layer.firstChild) {
    layer.remove()
    return
  }
  layer.removeAttribute(ACTIVE_INDEX_ATTR)
  layer.classList.add(FADING_OUT_CLASS)
  const id = window.setTimeout(() => layer.remove(), FADE_DURATION_MS)
  layer.setAttribute(FADE_TIMEOUT_ATTR, String(id))
}

export const renderHalos = (
  ctx: ChartCtx,
  dataPointIndex: number,
  haloColors: Array<string | null>,
  innerMarkerColors: Array<string | null>
) => {
  const inner = ctx.el.querySelector('.apexcharts-inner') as SVGGElement | null
  if (!inner) return

  if (dataPointIndex < 0) {
    clearActiveMarkers(ctx)
    const existing = inner.querySelector(
      `.${HALO_LAYER_CLASS}`
    ) as SVGGElement | null
    if (existing) fadeOutLayer(existing)
    return
  }

  let layer = inner.querySelector(`.${HALO_LAYER_CLASS}`) as SVGGElement | null
  if (!layer) {
    layer = document.createElementNS(SVG_NS, 'g')
    layer.setAttribute('class', HALO_LAYER_CLASS)
    layer.setAttribute('pointer-events', 'none')
    inner.appendChild(layer)
  }

  cancelPendingRemoval(layer)

  if (layer.getAttribute(ACTIVE_INDEX_ATTR) === String(dataPointIndex)) return

  while (layer.firstChild) layer.removeChild(layer.firstChild)
  layer.setAttribute(ACTIVE_INDEX_ATTR, String(dataPointIndex))

  const ys = ctx.w.globals.seriesYvalues
  if (!ys?.length) return

  const pointCount = ys[0]?.length ?? 0
  if (pointCount === 0 || dataPointIndex >= pointCount) return

  const stepX = pointCount > 1 ? ctx.w.globals.gridWidth / (pointCount - 1) : 0
  const cx = dataPointIndex * stepX

  ys.forEach((yArr, sIdx) => {
    const cy = yArr?.[dataPointIndex]
    if (cy == null) return

    const haloColor = haloColors[sIdx]
    if (haloColor) {
      const halo = document.createElementNS(SVG_NS, 'circle')
      halo.setAttribute('class', 'halo')
      halo.setAttribute('cx', `${cx}`)
      halo.setAttribute('cy', `${cy}`)
      halo.setAttribute('r', `${HALO_RADIUS}`)
      halo.setAttribute('fill', haloColor)
      halo.setAttribute('fill-opacity', `${HALO_OPACITY}`)
      layer!.appendChild(halo)
    }

    const innerColor = innerMarkerColors[sIdx]
    if (innerColor) {
      const s = INNER_MARKER_HALF
      const marker = document.createElementNS(SVG_NS, 'polygon')
      marker.setAttribute('class', 'inner-marker')
      marker.setAttribute(
        'points',
        `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`
      )
      marker.setAttribute('fill', '#ffffff')
      marker.setAttribute('stroke', innerColor)
      marker.setAttribute('stroke-width', `${INNER_MARKER_STROKE}`)
      layer!.appendChild(marker)
    }
  })

  clearActiveMarkers(ctx)
  const activeMarkers = ctx.el.querySelectorAll(
    `.apexcharts-marker[rel="${dataPointIndex}"]`
  )
  activeMarkers.forEach((m) => {
    const size = Number(m.getAttribute('default-marker-size') ?? '0')
    if (size > 0) m.classList.add(ACTIVE_MARKER_CLASS)
  })
}

const clearActiveMarkers = (ctx: ChartCtx) => {
  ctx.el
    .querySelectorAll(`.apexcharts-marker.${ACTIVE_MARKER_CLASS}`)
    .forEach((m) => m.classList.remove(ACTIVE_MARKER_CLASS))
}

export const clearHalos = (ctx: ChartCtx) => {
  clearActiveMarkers(ctx)
  const layer = ctx.el.querySelector(
    `.${HALO_LAYER_CLASS}`
  ) as SVGGElement | null
  if (layer) fadeOutLayer(layer)
}
