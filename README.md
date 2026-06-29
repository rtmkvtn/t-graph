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

`<MetricsChart />` takes four dedicated props — one per render type. Each prop accepts a `ChartSeriesInput`: a `label`, a `format`, an optional `color`, and a plain `data` array of `{ date, value }` points.

```tsx
import { MetricsChart } from './components/MetricsChart'
import type { ChartSeriesInput } from './lib/types'

const revenue: ChartSeriesInput = {
  label: 'Revenue',
  format: 'currency', // 'currency' | 'percent' | 'number'
  color: '#F4D35E', // optional — falls back to a palette
  data: [
    { date: '2026-06-10', value: 1240 },
    { date: '2026-06-11', value: 1580 },
    { date: '2026-06-12', value: 2100 },
    { date: '2026-06-13', value: 2450 },
  ],
}

// ... three more inputs of the same shape

;<MetricsChart area={revenue} bar={cpa} spline={roi} line={conversions} />
```

The bundled sample data lives in `src/lib/sampleData.ts` as four named exports — `costSeries`, `cpaSeries`, `roiSeries`, `conversionsSeries`. Edit those, or drop your own `ChartSeriesInput` consts in `ChartPage.tsx`.

Notes:

- All four series must use the **same dates in the same order** — `src/lib/validateChartInputs.ts` enforces this. Mismatched dates aren't supported today: ApexCharts' shared tooltip falls apart in mixed-x mode and the custom halo positioning assumes a unified point index.
- The validator also enforces a **30-date cap per series** (`MAX_DATES` in the same file). Beyond ~30 daily points the chart becomes too dense for line markers and bars to stay readable in the current layout.
- When inputs fail any validation rule (too many dates, mismatched dates, invalid date string, non-finite value, etc.), the chart is replaced by a `DataErrorPanel` showing a warning icon, what's wrong, and how to fix it. `MetricsChart` itself trusts its caller — `ChartPage` runs the validator and routes between the two.
- `color` is optional; empty / missing / whitespace falls back to a 6-colour palette indexed by series position.
- All four props (`area`, `bar`, `spline`, `line`) are required — the brief calls for exactly four series, one per render type.

### The four render slots

| Prop     | Rendering                                                    |
| -------- | ------------------------------------------------------------ |
| `area`   | Filled area with a smooth top edge                           |
| `spline` | Smooth curve, no fill, no static markers                     |
| `line`   | Straight segments with **square** markers at each data point |
| `bar`    | Vertical bars at the data point's X position                 |

### The `format` values

| `format`   | Tooltip output |
| ---------- | -------------- |
| `currency` | `$44.36`       |
| `percent`  | `161.47%`      |
| `number`   | `36`           |

Sibling series sharing a `format` share a Y-axis scale (axis labels themselves are hidden — see `apexOptions.ts`).

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
│   ├── MetricsChart.tsx      # the chart component (public surface)
│   └── DataErrorPanel.tsx    # warning card rendered when validation fails
├── helpers/
│   ├── format.ts             # y-axis and tooltip value formatters
│   └── halos.ts              # imperative SVG hover halos (line/spline only)
└── lib/
    ├── types.ts              # ChartSeriesInput, Series, ChartType, etc.
    ├── sampleData.ts         # four ChartSeriesInput consts (cost/cpa/roi/conversions)
    ├── apexOptions.ts        # buildChartOptions, TYPE_TABLE, buildYAxis
    └── validateChartInputs.ts # pure validator + ValidationResult/Error types
```

Domain glossary lives in `CONTEXT.md`. Architectural decisions in `docs/adr/`.

## Reference

- The visual target is a CleanShot recording — link in the test brief above.
- See `docs/adr/0001-charting-library-apexcharts.md` for why ApexCharts and what was rejected.
- See `docs/adr/0002-public-api-mirrors-brief-vocabulary.md` for why the public `type` field uses the brief's words (`spline`) instead of ApexCharts' internals (`line` + `curve: 'smooth'`).
