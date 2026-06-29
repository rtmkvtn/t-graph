import { MetricsChart } from '../components/MetricsChart'
import { sampleSeries } from '../lib/sampleData'

const cardStyle = {
  width: 'min(900px, 100%)',
  background: '#ffffff',
  border: '1px solid #e6e8eb',
  borderRadius: 8,
  padding: 16,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
} as const

export function ChartPage() {
  return (
    <div style={cardStyle}>
      <MetricsChart series={sampleSeries} />
    </div>
  )
}
