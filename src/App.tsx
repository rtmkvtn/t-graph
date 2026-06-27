import { Route, Routes } from 'react-router-dom'

import { ChartPage } from './ChartPage'
import { NotFound } from './NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
