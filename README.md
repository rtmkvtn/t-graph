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

The chart reads its data from `src/sampleData.ts`. Replace the four series there with your own — the shape is:

```ts
import type { Series } from './types'

const mySeries: Series[] = [
  {
    name: 'Revenue',
    type: 'area', // 'area' | 'spline' | 'line' | 'bar'
    color: '#F4D35E',
    data: [
      { x: '2026-06-10', y: 1240 },
      { x: '2026-06-11', y: 1580 },
      { x: '2026-06-12', y: 2100 },
      { x: '2026-06-13', y: 2450 },
    ],
    yAxis: { format: 'currency' }, // 'currency' | 'percent' | 'number'
  },
  // ... three more series
]
```

Then pass them to `<MetricsChart series={mySeries} />` in `src/App.tsx`. Four series is the test's expected shape but the component does not enforce a count.

### The four `type` values

| `type`   | Rendering                                                    |
| -------- | ------------------------------------------------------------ |
| `area`   | Filled area with a smooth top edge                           |
| `spline` | Smooth curve, no fill, no markers                            |
| `line`   | Straight segments with **square** markers at each data point |
| `bar`    | Vertical bars at the data point's X position                 |

### The `yAxis.format` values

| `format`   | Output    |
| ---------- | --------- |
| `currency` | `$44.36`  |
| `percent`  | `161.47%` |
| `number`   | `36`      |

Sibling series sharing a `format` share a Y-axis scale; only the first-of-format series renders the axis labels by default. Override with `yAxis.show` / `yAxis.opposite` per series.

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
├── App.tsx           # demo page wiring MetricsChart with sampleData
├── MetricsChart.tsx  # the chart component (public surface)
├── types.ts          # Series, ChartType, MetricsChartProps, etc.
├── sampleData.ts     # four demo series matching the reference
├── main.tsx          # Vite entry
└── index.css         # ambient page styles
```

Domain glossary lives in `CONTEXT.md`. Architectural decisions in `docs/adr/`.

## Reference

- The visual target is a CleanShot recording — link in the test brief above.
- See `docs/adr/0001-charting-library-apexcharts.md` for why ApexCharts and what was rejected.
- See `docs/adr/0002-public-api-mirrors-brief-vocabulary.md` for why the public `type` field uses the brief's words (`spline`) instead of ApexCharts' internals (`line` + `curve: 'smooth'`).
