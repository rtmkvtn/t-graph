import { DataErrorPanel } from '../components/DataErrorPanel'
import { MetricsChart } from '../components/MetricsChart'
import {
  conversionsSeries,
  costSeries,
  cpaSeries,
  roiSeries,
} from '../lib/sampleData'
import { validateChartInputs } from '../lib/validateChartInputs'

const cardStyle = {
  width: 'min(900px, 100%)',
  background: '#ffffff',
  border: '1px solid #e6e8eb',
  borderRadius: 8,
  padding: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
} as const

export function ChartPage() {
  const result = validateChartInputs(
    costSeries,
    cpaSeries,
    roiSeries,
    conversionsSeries
  )

  if (!result.ok) return <DataErrorPanel error={result} />

  return (
    <div style={cardStyle}>
      <MetricsChart
        area={costSeries}
        bar={cpaSeries}
        spline={roiSeries}
        line={conversionsSeries}
      />
    </div>
  )
}
