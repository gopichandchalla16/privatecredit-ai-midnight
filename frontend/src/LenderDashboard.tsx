import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface VerifyResult {
  application_id: string
  verified: boolean
  above_threshold: boolean
  timestamp: number
  message: string
}

export default function LenderDashboard() {
  const [applicationId, setApplicationId] = useState('')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'scanning' | 'result'>('form')

  const SCAN_STEPS = [
    'Locating attestation on Midnight chain...',
    'Verifying ZK proof integrity...',
    'Checking threshold without revealing score...',
    'Cryptographic verification complete.',
  ]
  const [scanStep, setScanStep] = useState(0)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicationId.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setStep('scanning')
    setScanStep(0)

    const interval = setInterval(() => setScanStep(s => s < SCAN_STEPS.length - 1 ? s + 1 : s), 500)
    await new Promise(r => setTimeout(r, 2200))

    try {
      const res = await fetch(`${API_URL}/verify/${applicationId.trim()}`)
      clearInterval(interval)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Attestation not found')
      }
      const data = await res.json()
      setResult(data)
      setStep('result')
    } catch (err: any) {
      clearInterval(interval)
      setError(err.message || 'Verification failed')
      setStep('form')
    }
    setLoading(false)
  }

  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(59,130,246,0.1)',
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(20px)',
        padding: '0 24px'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>🏦</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>PrivateCredit <span style={{ color: '#60a5fa' }}>AI</span></span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/" style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'transparent', color: '#64748b',
              border: '1px solid rgba(100,116,139,0.2)', textDecoration: 'none'
            }}>💼 Borrower</Link>
            <Link to="/lender" style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.3)', textDecoration: 'none'
            }}>🏦 Lender</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }}></span>
            <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>ZK Verification Portal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.8px', marginBottom: 16 }}>
            Verify Creditworthiness<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Without Seeing Financials</span>
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Paste the borrower's ZK hash below. Midnight's zero-knowledge layer reveals
            <strong style={{ color: '#94a3b8' }}> only whether they qualify</strong> — nothing more.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="tag tag-blue">🌙 Midnight ZK</span>
            <span className="tag tag-green">🔒 No Financial Data</span>
            <span className="tag tag-purple">✅ Proof Only</span>
          </div>
        </div>

        {/* Privacy info */}
        <div className="glass" style={{ borderRadius: 16, padding: '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '🚫', title: 'Score Hidden', desc: 'Actual credit score never revealed' },
              { icon: '🔐', title: 'Data Private', desc: 'Revenue, debt & expenses invisible' },
              { icon: '✓', title: 'Proof Verified', desc: 'Only threshold pass/fail shared' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {step === 'form' && (
          <div className="glass" style={{ borderRadius: 20, padding: '32px', animation: 'fadeInUp 0.4s ease' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Verify Attestation Hash</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Request the ZK hash from your borrower. Paste it below.</p>
            <form onSubmit={handleVerify}>
              <label style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>ATTESTATION ID (ZK HASH)</label>
              <input
                type="text"
                value={applicationId}
                onChange={e => setApplicationId(e.target.value)}
                placeholder="e.g. 40b9a054f25a384d0769c2e9db8f3a096833e15f..."
                required
                className="input-field mono"
                style={{ marginBottom: 8, fontSize: 12 }}
              />
              <p style={{ fontSize: 11, color: '#475569', marginBottom: 20 }}>64-character hex string provided by the borrower after ZK attestation</p>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#fca5a5' }}>
                  ❌ {error}
                </div>
              )}
              <button type="submit" className="btn-secondary" style={{ padding: '14px' }}>
                🔍 Verify ZK Proof on Midnight
              </button>
            </form>
          </div>
        )}

        {/* Scanning */}
        {step === 'scanning' && (
          <div className="glass-bright" style={{ borderRadius: 20, padding: '48px 32px', textAlign: 'center', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 28px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(59,130,246,0.3)', animation: 'pulse-ring 1.5s ease infinite' }} />
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(29,78,216,0.4), rgba(30,64,175,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, animation: 'float 2s ease infinite' }}>🔍</div>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Querying Midnight Chain</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 28 }}>Verifying proof without accessing private data</p>
            <div style={{ maxWidth: 340, margin: '0 auto' }}>
              {SCAN_STEPS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0',
                  borderBottom: i < SCAN_STEPS.length - 1 ? '1px solid rgba(59,130,246,0.08)' : 'none',
                  opacity: i <= scanStep ? 1 : 0.3, transition: 'opacity 0.4s'
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    background: i < scanStep ? '#10b981' : i === scanStep ? '#3b82f6' : 'rgba(100,116,139,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 800, transition: 'all 0.4s'
                  }}>{i < scanStep ? '✓' : i === scanStep ? '●' : ''}</div>
                  <span style={{ fontSize: 12, color: i <= scanStep ? '#e2e8f0' : '#475569' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {step === 'result' && result && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            <div className="glass" style={{
              borderRadius: 20, padding: '32px',
              border: `1px solid ${result.above_threshold ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              marginBottom: 16
            }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>{result.above_threshold ? '✅' : '❌'}</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: result.above_threshold ? '#10b981' : '#ef4444', marginBottom: 6 }}>
                  {result.above_threshold ? 'Borrower Qualifies' : 'Below Threshold'}
                </h2>
                <p style={{ fontSize: 14, color: '#64748b' }}>
                  {result.above_threshold
                    ? 'This borrower has passed the ZK credit threshold. Safe to proceed.'
                    : 'This borrower did not meet the minimum threshold. Review advised.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ background: result.above_threshold ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', borderRadius: 12, padding: '16px', textAlign: 'center', border: `1px solid ${result.above_threshold ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}` }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' }}>Threshold Result</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: result.above_threshold ? '#10b981' : '#ef4444' }}>
                    {result.above_threshold ? 'PASS ✓' : 'FAIL ✕'}
                  </div>
                </div>
                <div style={{ background: 'rgba(139,92,246,0.04)', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' }}>Attested At</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{formatTime(result.timestamp)}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔒 Cryptographically Inaccessible To You</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Actual Credit Score', 'Annual Revenue', 'Monthly Expenses', 'Outstanding Debt', 'Loan Amount Requested', 'Financial Ratios'].map(item => (
                    <span key={item} style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#94a3b8' }}>🚫 {item}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(10,10,20,0.8)', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(59,130,246,0.15)' }}>
                <p style={{ fontSize: 11, color: '#475569', marginBottom: 6, fontWeight: 600 }}>🌙 MIDNIGHT ATTESTATION ID</p>
                <code className="mono" style={{ fontSize: 11, color: '#60a5fa', wordBreak: 'break-all', lineHeight: 1.6 }}>{result.application_id}</code>
              </div>
            </div>

            <button onClick={() => { setStep('form'); setResult(null); setApplicationId(''); }}
              style={{ width: '100%', background: 'transparent', border: '1px solid rgba(100,116,139,0.2)', borderRadius: 12, padding: '12px', color: '#475569', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              ← Verify Another
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
