import { useState } from 'react'

const API_URL = 'http://localhost:8000'

interface FormData {
  annual_revenue: string
  monthly_expenses: string
  outstanding_debt: string
  years_in_business: string
  requested_loan_amount: string
  industry: string
  payment_history_score: string
}

interface CreditResult {
  score: number
  decision: string
  reasoning: string
  risk_factors: string[]
  zk_attestation_hash: string
  midnight_ready: boolean
}

const decisionColor: Record<string, string> = {
  APPROVED: '#00e676',
  REVIEW: '#ffeb3b',
  REJECTED: '#f44336'
}

export default function App() {
  const [form, setForm] = useState<FormData>({
    annual_revenue: '',
    monthly_expenses: '',
    outstanding_debt: '',
    years_in_business: '',
    requested_loan_amount: '',
    industry: '',
    payment_history_score: ''
  })
  const [result, setResult] = useState<CreditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attested, setAttested] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    setAttested(false)
    try {
      const res = await fetch(`${API_URL}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          annual_revenue: parseFloat(form.annual_revenue),
          monthly_expenses: parseFloat(form.monthly_expenses),
          outstanding_debt: parseFloat(form.outstanding_debt),
          years_in_business: parseInt(form.years_in_business),
          requested_loan_amount: parseFloat(form.requested_loan_amount),
          industry: form.industry,
          payment_history_score: parseInt(form.payment_history_score)
        })
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Failed to connect to backend. Make sure FastAPI is running on port 8000.')
    }
    setLoading(false)
  }

  const handleAttest = async () => {
    if (!result) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/attest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score,
          threshold: 60,
          application_id: result.zk_attestation_hash.slice(0, 16)
        })
      })
      if (res.ok) setAttested(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#a78bfa' }}>
          PrivateCredit AI
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
          Privacy-preserving credit scoring · Powered by AI + Midnight ZK Blockchain
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#1e1b4b', color: '#a78bfa', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>🌙 Midnight</span>
          <span style={{ background: '#1a2e1a', color: '#00e676', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>🤖 Groq LLaMA</span>
          <span style={{ background: '#1a1a2e', color: '#61dafb', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>🔒 ZK Privacy</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ background: '#111118', border: '1px solid #2a2a3e', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#c4b5fd', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Credit Application</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { name: 'annual_revenue', label: 'Annual Revenue ($)', placeholder: '500000' },
            { name: 'monthly_expenses', label: 'Monthly Expenses ($)', placeholder: '30000' },
            { name: 'outstanding_debt', label: 'Outstanding Debt ($)', placeholder: '100000' },
            { name: 'years_in_business', label: 'Years in Business', placeholder: '5' },
            { name: 'requested_loan_amount', label: 'Loan Amount ($)', placeholder: '200000' },
            { name: 'payment_history_score', label: 'Payment History (0-100)', placeholder: '80' }
          ].map(f => (
            <div key={f.name}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>{f.label}</label>
              <input
                type="number"
                name={f.name}
                placeholder={f.placeholder}
                value={form[f.name as keyof FormData]}
                onChange={handleChange}
                required
                style={{ width: '100%', background: '#1a1a2a', border: '1px solid #374151', borderRadius: 6, padding: '0.5rem 0.75rem', color: '#e0e0f0', fontSize: 14 }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Industry</label>
          <select name="industry" value={form.industry} onChange={handleChange} required
            style={{ width: '100%', background: '#1a1a2a', border: '1px solid #374151', borderRadius: 6, padding: '0.5rem 0.75rem', color: '#e0e0f0', fontSize: 14 }}>
            <option value="">Select industry...</option>
            <option>Technology</option>
            <option>Manufacturing</option>
            <option>Retail</option>
            <option>Healthcare</option>
            <option>Construction</option>
            <option>Agriculture</option>
            <option>Finance</option>
            <option>Logistics</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
          style={{ marginTop: '1rem', width: '100%', background: loading ? '#4c1d95' : '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '0.75rem', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '🔄 Analyzing...' : '🚀 Score My Application'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{ background: '#2d1a1a', border: '1px solid #f44336', borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: '#f44336' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background: '#111118', border: `1px solid ${decisionColor[result.decision]}44`, borderRadius: 12, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: '#c4b5fd', fontSize: '1.1rem' }}>📊 AI Credit Assessment</h2>
            <span style={{ background: `${decisionColor[result.decision]}22`, color: decisionColor[result.decision], padding: '0.3rem 1rem', borderRadius: 20, fontWeight: 800, fontSize: 14 }}>
              {result.decision}
            </span>
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>Credit Score</span>
              <span style={{ fontWeight: 800, color: decisionColor[result.decision], fontSize: 18 }}>{result.score}/100</span>
            </div>
            <div style={{ height: 10, background: '#1f2937', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${result.score}%`, height: '100%', background: decisionColor[result.decision], borderRadius: 5, transition: 'width 1s ease' }} />
            </div>
          </div>

          <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6, marginBottom: '1rem' }}>{result.reasoning}</p>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: '0.5rem' }}>⚠️ Risk Factors</p>
            {result.risk_factors.map((f, i) => (
              <div key={i} style={{ background: '#1f1a2e', borderRadius: 6, padding: '0.4rem 0.75rem', marginBottom: 4, fontSize: 13, color: '#fbbf24' }}>• {f}</div>
            ))}
          </div>

          {/* ZK Hash */}
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>🔒 ZK Attestation Hash (Midnight-ready)</p>
            <code style={{ fontSize: 11, color: '#60a5fa', wordBreak: 'break-all' }}>{result.zk_attestation_hash}</code>
          </div>

          {/* Attest button */}
          {!attested ? (
            <button onClick={handleAttest} disabled={loading}
              style={{ width: '100%', background: '#1e3a5f', color: '#60a5fa', border: '1px solid #1e40af', borderRadius: 8, padding: '0.75rem', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              🌙 Submit ZK Attestation to Midnight
            </button>
          ) : (
            <div style={{ background: '#0a2a1a', border: '1px solid #00e676', borderRadius: 8, padding: '0.75rem', textAlign: 'center', color: '#00e676', fontWeight: 700 }}>
              ✅ ZK Attestation submitted to Midnight blockchain!<br/>
              <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>Lenders can now verify this credit score without seeing your financials.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
