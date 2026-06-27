# ADR 0002: Public API uses the brief's vocabulary, not the library's

**Status:** accepted
**Date:** 2026-06-27

## Context

The test brief names four chart-type values: `area`, `spline`, `line`, `bar`. ApexCharts (per ADR-0001) names them differently internally:

| Brief term | ApexCharts equivalent                                |
| ---------- | ---------------------------------------------------- |
| `area`     | `series[].type: 'area'`                              |
| `spline`   | `series[].type: 'line'` + `stroke.curve: 'smooth'`   |
| `line`     | `series[].type: 'line'` + `stroke.curve: 'straight'` |
| `bar`      | `series[].type: 'column'`                            |

Two reasonable public APIs:

1. Expose ApexCharts' vocabulary directly. The user writes `{ type: 'line', curve: 'smooth' }` to get a spline.
2. Expose the brief's vocabulary. The user writes `{ type: 'spline' }` and the component translates internally.

## Decision

Use the brief's vocabulary. `ChartType = 'area' | 'spline' | 'line' | 'bar'`.

## Reasoning

**The brief asks for these four words, named explicitly.** Renaming them in the public API would force the reviewer to translate brief-vocabulary → API-vocabulary on every call site. That friction adds nothing.

**`spline` and `line` are semantically distinct entities to the consumer**, even if they share an underlying renderer in ApexCharts. Collapsing them into `type: 'line'` with a separate `curve` field leaks the implementation. The brief treats them as siblings, so the API should too.

**The library is an implementation detail.** If ADR-0001 is ever revisited and we swap to Highcharts or build a custom renderer, the public surface shouldn't change. Today's translation table moves; the consumer's call sites don't.

## Consequences

**Positive**

- API mirrors the brief 1:1. Reviewer can paste the brief's terms straight into the type system.
- The translation table is one localized concern (`TYPE_TABLE` in `MetricsChart.tsx`). Adding a new render type is one table row.
- Library swap is bounded — only the translation table and the `useMemo` builder need to change.

**Negative**

- One extra layer of indirection: the consumer who already knows ApexCharts can't write `curve: 'stepline'` to get a step chart, because the public `ChartType` union doesn't expose it. Adding new render types means extending the union and the translation table together.
- The component's behavior diverges from raw `react-apexcharts` in subtle ways that may surprise a maintainer who knows ApexCharts but not this component (e.g. `markers.shape` is set per-series automatically, not by the consumer).
