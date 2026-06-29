import type { RawDataset, Series } from './types'

const DEFAULT_PALETTE = [
  '#F4D35E',
  '#4D9EE3',
  '#2BA02B',
  '#C026D3',
  '#FF8C42',
  '#7E22CE',
]

export const parseDataset = (raw: RawDataset): Series[] => {
  for (const s of raw.series) {
    if (s.values.length > raw.dates.length) {
      throw new Error(
        `parseDataset: series "${s.name}" has ${s.values.length} values but dataset only has ${raw.dates.length} dates`
      )
    }
  }
  return raw.series.map((s, sIdx) => ({
    name: s.name,
    type: s.type,
    color: s.color?.trim() || DEFAULT_PALETTE[sIdx % DEFAULT_PALETTE.length],
    data: s.values.map((y, pIdx) => ({ x: raw.dates[pIdx], y })),
    yAxis: { format: s.format },
  }))
}
