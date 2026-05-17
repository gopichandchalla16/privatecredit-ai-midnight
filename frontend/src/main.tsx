import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import App from './App'
import LenderDashboard from './LenderDashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<App />} />
        <Route path="/lender" element={<LenderDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
