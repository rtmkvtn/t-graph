# ADR 0001: Charting library — ApexCharts via `react-apexcharts`

**Status:** accepted
**Date:** 2026-06-27

## Context

The deliverable is a React component that overlays four time-series in a single chart, each rendered with a distinct visual idiom (filled area, smooth spline, straight-line-with-square-markers, narrow bars), with multi-unit Y axes (`%`, `$`, count) and a shared crosshair tooltip. The visual target is a CleanShot recording from the test brief.

## Decision

Use **ApexCharts** via the **`react-apexcharts`** wrapper.

## Alternatives considered

### Highcharts

Capable, mature, supports mixed types and multi-Y axes cleanly. Rejected for two reasons:

1. The reference's tooltip styling and axis-label idiom looks closer to ApexCharts defaults than to Highcharts defaults. Reproducing it with Highcharts would mean fighting the framework's CSS.
2. Highcharts is not free for commercial use. Awkward signal in a take-home where the reviewer may extrapolate to "what would this person reach for in production."

### Recharts

Popular in React-land but multi-Y axis + mixed-type series + smooth splines fights the API. Lots of `<ComposedChart>` wrapper gymnastics with per-element `<YAxis yAxisId>` linkage. Brittle.

### ECharts

Capable, but the React wrapper (`echarts-for-react`) is heavier, tooltip styling diverges from the reference, and the option object is larger to maintain.

### D3 / SVG from scratch

Right tool for "build a charting engine." Wrong tool for "reproduce a specific chart in 4 days." Would burn the entire time budget on layout primitives that ApexCharts gives for free.

## Consequences

**Positive**

- Mixed series types are native: each `series[]` entry has its own `type` (`'area' | 'line' | 'column'`) and `stroke.curve` (`'smooth' | 'straight'`).
- Multi-Y axes via `yaxis: ApexYAxis[]` with `seriesName` linkage between axis and series.
- Per-series marker shape (`'square'`, etc.) via `markers.shape: string[]`.
- Tooltip with date header + per-series rows is the built-in default with `shared: true`.
- MIT licensed.

**Negative**

- The component's option object is shaped by ApexCharts' API. ADR-0002 mitigates this for the public surface, but the internal translation layer in `MetricsChart.tsx` is library-shaped. Swap cost would be moderate but bounded.
- ApexCharts' bundle is ~750KB (gzipped ~220KB). Acceptable for a single-page demo; would warrant code-splitting if embedded in a larger app.
- The library has occasional quirks with `seriesName` linkage between sibling Y axes — the first attempt at sibling axes plotted bars on the wrong scale. Fixed by pointing sibling `seriesName` at the first-of-format series instead of the sibling's own name. Captured in the implementation; future maintainers should beware.
