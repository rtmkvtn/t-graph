import { Route, Routes } from 'react-router-dom'

import { ChartPage } from './pages/ChartPage'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
