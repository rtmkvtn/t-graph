import { MetricsChart } from './MetricsChart'
import { sampleSeries } from './sampleData'

export default function App() {
  return (
    <div
      style={{
        width: 'min(900px, 100%)',
        background: '#ffffff',
        border: '1px solid #e6e8eb',
        borderRadius: 8,
        padding: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <MetricsChart series={sampleSeries} />
    </div>
  )
}
