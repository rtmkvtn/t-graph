import ReactApexChart from 'react-apexcharts'

import type { ApexOptions } from 'apexcharts'

const options: ApexOptions = {
  chart: { id: 'smoke-test', toolbar: { show: false } },
  xaxis: { categories: ['A', 'B', 'C', 'D'] },
}

const series = [{ name: 'smoke', data: [1, 2, 3, 4] }]

export default function App() {
  return (
    <div style={{ width: 640 }}>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={320}
      />
    </div>
  )
}
