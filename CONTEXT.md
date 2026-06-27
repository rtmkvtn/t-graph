# Domain glossary

The vocabulary this repo uses. When new code touches these concepts, use the term from this glossary verbatim; don't drift to synonyms.

## Series

A named time-series passed to the chart. Each `Series` has a name, a render type, a color, an array of `{x, y}` data points, and a Y-axis spec. Defined in `src/types.ts`.

The deliverable's expected shape is **four** Series — but the component does not enforce a count.

## ChartType

The rendering idiom for a `Series`. One of `'area' | 'spline' | 'line' | 'bar'`. These four strings are the test brief's vocabulary, intentionally preserved as the public API surface (see ADR-0002).

- **area** — filled area with a smooth top edge
- **spline** — smooth curve, no fill, no markers
- **line** — straight segments with square markers at each data point
- **bar** — vertical bars at each data point's X position

## YAxisFormat

How the Y-axis labels (and the tooltip values for a series) are formatted. One of `'currency' | 'percent' | 'number'`. Currency prefixes `$`, percent suffixes `%`, number is bare.

## MetricsChart

The React component that renders an array of `Series` as a single chart. Defined in `src/MetricsChart.tsx`. Public surface; internally translates the brief's `ChartType` vocabulary into ApexCharts options.

## Translation table

The mapping inside `MetricsChart` from `ChartType` → ApexCharts series type + stroke curve + marker shape. This is the seam between the brief's vocabulary and the underlying library; a library swap (ADR-0001) would mostly mean rewriting this table. Don't call it "the type config" or "the mapping" in code or docs — it's the translation table.

## Sibling-of-format

Two or more `Series` sharing the same `yAxis.format` are "siblings of that format." The first such series in the array owns the Y-axis (`show: true`); subsequent siblings hide their axis (`show: false`) and share the owner's scale via `seriesName` linkage. The component handles this automatically; override per series with `yAxis.show` / `yAxis.opposite`.
