# t-graph

A React component that renders 4 time-series in a single chart using 4 different rendering idioms — **area**, **spline**, **line**, **bar** — matching [this reference](https://cleanshot.com/share/cBDRxJWM).

Built as a take-home test. Stack: React 19 + TypeScript + Vite + [ApexCharts](https://apexcharts.com/) via [`react-apexcharts`](https://github.com/apexcharts/react-apexcharts).

## Quick start

```bash
git clone git@github.com:rtmkvtn/t-graph.git
cd t-graph
nvm use         # Node 20 (or any 20.x)
npm install
npm run dev
```

Open the URL Vite prints (defaults to <http://localhost:5173/>). You should see the chart populated with sample data matching the reference.

## Use your own data

The chart reads its data from `src/lib/sampleData.ts`. Edit the single `sampleDataset` const — `dates` once at the top, then per-series `name/type/color/format/values`:

```ts
import type { RawDataset } from './types'

export const sampleDataset: RawDataset = {
  dates: ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'],
  series: [
    {
      name: 'Revenue',
      type: 'area', // 'area' | 'spline' | 'line' | 'bar'
      color: '#F4D35E', // optional — falls back to a palette
      format: 'currency', // 'currency' | 'percent' | 'number'
      values: [1240, 1580, 2100, 2450],
    },
    // ... more series
  ],
}
```

`parseDataset` (in `src/lib/parseDataset.ts`) turns this into the chart-internal `Series[]` and the result is exported as `sampleSeries`, which `ChartPage` passes to `<MetricsChart />`. No other wiring needed.

Rules the parser enforces:

- `values.length` must not exceed `dates.length` — the parser throws naming the offending series
- Fewer values than dates is valid (sparse data, fewer points rendered)
- `color` is optional; empty / missing / whitespace falls back to a 6-color palette indexed by series position
- Four series is the test's expected shape but neither the parser nor the component enforces a count

### The four `type` values

| `type`   | Rendering                                                    |
| -------- | ------------------------------------------------------------ |
| `area`   | Filled area with a smooth top edge                           |
| `spline` | Smooth curve, no fill, no markers                            |
| `line`   | Straight segments with **square** markers at each data point |
| `bar`    | Vertical bars at the data point's X position                 |

### The `format` values

| `format`   | Output    |
| ---------- | --------- |
| `currency` | `$44.36`  |
| `percent`  | `161.47%` |
| `number`   | `36`      |

Sibling series sharing a `format` share a Y-axis scale; only the first-of-format series renders the axis labels.

## Scripts

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run preview  # serve dist/
npm run lint     # eslint .
npm run format   # prettier --write ./src
```

Husky pre-commit runs lint-staged: `eslint --fix` + `prettier --write` on staged TS/JS/JSON/CSS/Markdown.

## Project layout

```
src/
├── main.tsx                  # Vite entry; wraps App in BrowserRouter
├── App.tsx                   # routes — ChartPage at /, NotFound elsewhere
├── index.css                 # ambient page styles
├── pages/
│   ├── ChartPage.tsx         # wires MetricsChart with sampleSeries
│   └── NotFound.tsx          # 404
├── components/
│   └── MetricsChart.tsx      # the chart component (public surface)
├── helpers/
│   ├── format.ts             # y-axis and tooltip value formatters
│   └── halos.ts              # imperative SVG hover halos (line/spline only)
└── lib/
    ├── types.ts              # Series, RawDataset, ChartType, etc.
    ├── sampleData.ts         # raw sampleDataset + parsed sampleSeries
    ├── parseDataset.ts       # RawDataset → Series[] with color/length guards
    └── apexOptions.ts        # buildChartOptions, TYPE_TABLE, buildYAxis
```

Domain glossary lives in `CONTEXT.md`. Architectural decisions in `docs/adr/`.

## Reference

- The visual target is a CleanShot recording — link in the test brief above.
- See `docs/adr/0001-charting-library-apexcharts.md` for why ApexCharts and what was rejected.
- See `docs/adr/0002-public-api-mirrors-brief-vocabulary.md` for why the public `type` field uses the brief's words (`spline`) instead of ApexCharts' internals (`line` + `curve: 'smooth'`).
