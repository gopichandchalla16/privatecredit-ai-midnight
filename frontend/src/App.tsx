import { useState } from 'react'
import { Link } from 'react-router-dom'
import ZKVisualizer from './ZKVisualizer'
import BlockchainExplorer from './BlockchainExplorer'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

const DECISION_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string; label: string }> = {
  APPROVED: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', icon: '✓', label: 'Approved' },
  REVIEW:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)',  icon: '◎', label: 'Under Review' },
  REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',   icon: '✕', label: 'Declined' },
}

const FIELDS = [
  { name: 'annual_revenue',       label: 'Annual Revenue',        placeholder: '500,000',  suffix: 'USD', icon: '💰' },
  { name: 'monthly_expenses',     label: 'Monthly Expenses',      placeholder: '30,000',   suffix: 'USD', icon: '📊' },
  { name: 'outstanding_debt',     label: 'Outstanding Debt',      placeholder: '100,000',  suffix: 'USD', icon: '🏦' },
  { name: 'years_in_business',    label: 'Years in Business',     placeholder: '5',        suffix: 'yrs', icon: '📅' },
  { name: 'requested_loan_amount',label: 'Loan Amount Requested', placeholder: '200,000',  suffix: 'USD', icon: '💳' },
  { name: 'payment_history_score',label: 'Payment History Score', placeholder: '80',       suffix: '/100',icon: '⭐' },
]

export default function App() {
  const [form, setForm] = useState<FormData>({
    annual_revenue: '', monthly_expenses: '', outstanding_debt: '',
    years_in_business: '', requested_loan_amount: '', industry: '', payment_history_score: ''
  })
  const [result, setResult] = useState<CreditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attested, setAttested] = useState(false)
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'form' | 'analyzing' | 'result'>('form')
  const [analyzeStep, setAnalyzeStep] = useState(0)

  const ANALYZE_STEPS = [
    'Encrypting financial data locally...',
    'Running Groq LLaMA credit model...',
    'Generating ZK attestation hash...',
    'Preparing Midnight blockchain proof...',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    setAttested(false)
    setStep('analyzing')
    setAnalyzeStep(0)
    const interval = setInterval(() => setAnalyzeStep(s => s < ANALYZE_STEPS.length - 1 ? s + 1 : s), 600)
    try {
      await new Promise(r => setTimeout(r, 2400))
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
      clearInterval(interval)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch {
      clearInterval(interval)
      setError('Unable to reach backend. Please try again.')
      setStep('form')
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
        body: JSON.stringify({ score: result.score, threshold: 60, application_id: result.zk_attestation_hash })
      })
      if (res.ok) setAttested(true)
    } catch {}
    setLoading(false)
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.zk_attestation_hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dc = result ? (DECISION_CONFIG[result.decision] || DECISION_CONFIG.REVIEW) : null

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(139,92,246,0.1)', background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌙</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px', color: 'white' }}>PrivateCredit <span style={{ color: '#8b5cf6' }}>AI</span></span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/app" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', textDecoration: 'none' }}>💼 Borrower</Link>
            <Link to="/lender" style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'transparent', color: '#64748b', border: '1px solid rgba(100,116,139,0.2)', textDecoration: 'none' }}>🏦 Lender</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: step === 'result' ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
          <div>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 14 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }}></span>
                <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>Midnight Preprod · Groq LLaMA · ZK Privacy</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>Credit Application</h1>
              <p style={{ fontSize: 13, color: '#64748b' }}>Your data is processed locally. Only the ZK proof hash is submitted on-chain.</p>
            </div>

            {step === 'form' && (
              <div className="glass" style={{ borderRadius: 20, padding: '28px' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    {FIELDS.map(f => (
                      <div key={f.name}>
                        <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 5, fontWeight: 600 }}>{f.icon} {f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <input type="number" name={f.name} placeholder={f.placeholder}
                            value={form[f.name as keyof FormData]} onChange={handleChange} required
                            className="input-field" style={{ paddingRight: 44 }} />
                          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#475569', fontWeight: 600 }}>{f.suffix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 5, fontWeight: 600 }}>🏢 Industry Sector</label>
                    <select name="industry" value={form.industry} onChange={handleChange} required className="input-field">
                      <option value="">Select your industry...</option>
                      {['Technology','Manufacturing','Retail','Healthcare','Construction','Agriculture','Finance','Logistics'].map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                  {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#fca5a5' }}>⚠️ {error}</div>}
                  <button type="submit" className="btn-primary" style={{ fontSize: 15, padding: '15px' }}>🚀 Analyze & Generate ZK Proof</button>
                </form>
              </div>
            )}

            {step === 'analyzing' && (
              <div className="glass-bright" style={{ borderRadius: 20, padding: '48px 28px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 28px' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.3)', animation: 'pulse-ring 1.5s ease infinite' }} />
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, animation: 'float 2s ease infinite' }}>🌙</div>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Processing Securely</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>Zero-knowledge proof generation in progress</p>
                <div style={{ maxWidth: 320, margin: '0 auto' }}>
                  {ANALYZE_STEPS.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(139,92,246,0.08)' : 'none', opacity: i <= analyzeStep ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: i < analyzeStep ? '#10b981' : i === analyzeStep ? '#8b5cf6' : 'rgba(100,116,139,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, transition: 'all 0.4s' }}>{i < analyzeStep ? '✓' : i === analyzeStep ? '●' : ''}</div>
                      <span style={{ fontSize: 12, color: i <= analyzeStep ? '#e2e8f0' : '#475569' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'result' && result && dc && (
              <div>
                {/* Decision */}
                <div className="glass" style={{ borderRadius: 20, padding: '28px', border: `1px solid ${dc.border}`, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 900 }}>AI Assessment</h2>
                    <div style={{ padding: '7px 16px', borderRadius: 10, background: dc.bg, border: `1px solid ${dc.border}`, color: dc.color, fontWeight: 800, fontSize: 13 }}>{dc.icon} {dc.label}</div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Credit Score</span>
                      <span style={{ fontSize: 28, fontWeight: 900, color: dc.color }}>{result.score}<span style={{ fontSize: 14, color: '#475569', fontWeight: 400 }}>/100</span></span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(100,116,139,0.15)', borderRadius: 6, overflow: 'hidden' }}>
                      <div className="score-bar-fill" style={{ width: `${result.score}%`, background: `linear-gradient(90deg, ${dc.color}88, ${dc.color})` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontSize: 10, color: '#374151' }}>0</span>
                      <span style={{ fontSize: 10, color: '#f59e0b' }}>60 threshold</span>
                      <span style={{ fontSize: 10, color: '#374151' }}>100</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(139,92,246,0.04)', borderRadius: 10, padding: '14px', marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: '#8b5cf6', fontWeight: 700, marginBottom: 6 }}>🤖 AI REASONING</p>
                    <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7 }}>{result.reasoning}</p>
                  </div>
                  {result.risk_factors.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {result.risk_factors.map((f, i) => <span key={i} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>• {f}</span>)}
                    </div>
                  )}
                </div>

                {/* ZK Attestation */}
                <div className="glass" style={{ borderRadius: 20, padding: '24px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800 }}>🔒 ZK Attestation</h3>
                    {attested && <span className="tag tag-green">✓ On Midnight Chain</span>}
                  </div>
                  <div style={{ background: 'rgba(10,10,20,0.8)', borderRadius: 8, padding: '12px 14px', marginBottom: 12, border: '1px solid rgba(59,130,246,0.15)' }}>
                    <code className="mono" style={{ fontSize: 11, color: '#60a5fa', wordBreak: 'break-all', lineHeight: 1.6 }}>{result.zk_attestation_hash}</code>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button onClick={handleCopy} className="btn-secondary" style={{ padding: '11px' }}>{copied ? '✅ Copied!' : '📋 Copy Hash'}</button>
                    {!attested
                      ? <button onClick={handleAttest} disabled={loading} className="btn-primary" style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e40af)', padding: '11px' }}>{loading ? '🔄 Submitting...' : '🌙 Submit to Midnight'}</button>
                      : <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '11px', textAlign: 'center', fontSize: 13, color: '#34d399', fontWeight: 600 }}>✅ On Midnight</div>
                    }
                  </div>
                </div>

                <button onClick={() => { setStep('form'); setResult(null); setAttested(false); }}
                  style={{ width: '100%', background: 'transparent', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 10, padding: '11px', color: '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  ← New Application
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar - ZK Visualizer + Chain Explorer (only on result) */}
          {step === 'result' && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 76 }}>
              <ZKVisualizer hash={result.zk_attestation_hash} score={result.score} attested={attested} />
              <BlockchainExplorer />
            </div>
          )}
        </div>

        {/* Chain explorer on form/analyzing state */}
        {step !== 'result' && (
          <div style={{ marginTop: 32 }}>
            <BlockchainExplorer />
          </div>
        )}
      </main>
    </div>
  )
}
