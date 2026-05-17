import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import App from './App'
import LenderDashboard from './LenderDashboard'

const navStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: '#0d0d14',
  borderBottom: '1px solid #1f1f2e',
  padding: '0.75rem 1.5rem',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center'
}

const linkStyle: React.CSSProperties = {
  color: '#9ca3af',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  padding: '0.3rem 0.75rem',
  borderRadius: 6,
  transition: 'all 0.15s'
}

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  background: '#1e1b4b',
  color: '#a78bfa'
}

function Nav() {
  return (
    <nav style={navStyle}>
      <span style={{ color: '#a78bfa', fontWeight: 800, fontSize: 15, marginRight: 8 }}>🌙 PrivateCredit AI</span>
      <NavLink
        to="/"
        end
        style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
      >
        💼 Borrower
      </NavLink>
      <NavLink
        to="/lender"
        style={({ isActive }) => isActive ? { ...activeLinkStyle, background: '#1e3a5f', color: '#60a5fa' } : linkStyle}
      >
        🏦 Lender Verify
      </NavLink>
    </nav>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e0e0f0', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
        <Nav />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/lender" element={<LenderDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)
