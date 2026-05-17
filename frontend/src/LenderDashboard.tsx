import { useState } from 'react'

const API_URL = 'http://localhost:8000'

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
  const [scanning, setScanning] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applicationId.trim()) return
    setLoading(true)
    setScanning(true)
    setError('')
    setResult(null)

    // Simulate ZK scan animation delay
    await new Promise(r => setTimeout(r, 1800))

    try {
      const res = await fetch(`${API_URL}/verify/${applicationId.trim()}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Attestation not found')
      }
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    }
    setLoading(false)
    setScanning(false)
  }

  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>
          🏦 Lender Verification Portal
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: 14 }}>
          Verify borrower creditworthiness using ZK proof — no financial data revealed
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ background: '#1e1b4b', color: '#a78bfa', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>🌙 Midnight ZK</span>
          <span style={{ background: '#1a2e1a', color: '#00e676', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>🔒 No Financial Data</span>
          <span style={{ background: '#1a1a2e', color: '#60a5fa', padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: 12 }}>✅ Proof Only</span>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#111118', border: '1px solid #1e3a5f', borderRadius: 10, padding: '1rem', marginBottom: '1.5rem', fontSize: 13, color: '#9ca3af', lineHeight: 1.7 }}>
        <strong style={{ color: '#60a5fa' }}>How ZK Selective Disclosure works:</strong><br />
        The borrower submits their financials privately. The AI scores them and generates a ZK attestation hash.
        As a lender, you paste that hash below. You receive <em>only</em> whether the borrower crossed
        your credit threshold — nothing else. The score and financials are mathematically inaccessible.
      </div>

      {/* Verify Form */}
      <form onSubmit={handleVerify} style={{ background: '#111118', border: '1px solid #2a2a3e', borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#93c5fd', marginBottom: '1rem', fontSize: '1rem' }}>🔍 Verify Attestation</h2>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
          Paste Attestation ID (ZK Hash from borrower)
        </label>
        <input
          type="text"
          value={applicationId}
          onChange={e => setApplicationId(e.target.value)}
          placeholder="e.g. 73e3d10b16068c10..."
          required
          style={{
            width: '100%', background: '#1a1a2a', border: '1px solid #374151',
            borderRadius: 6, padding: '0.6rem 0.75rem', color: '#e0e0f0',
            fontSize: 13, fontFamily: 'monospace', marginBottom: '0.75rem'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#1e3a5f' : '#1d4ed8',
            color: 'white', border: 'none', borderRadius: 8,
            padding: '0.75rem', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Verifying ZK Proof...' : '🔍 Verify Attestation'}
        </button>
      </form>

      {/* Scanning animation */}
      {scanning && (
        <div style={{
          background: '#0a0f1e', border: '1px solid #1e40af', borderRadius: 10,
          padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌙</div>
          <div style={{ color: '#60a5fa', fontWeight: 700, marginBottom: 4 }}>Querying Midnight ZK Layer...</div>
          <div style={{ color: '#374151', fontSize: 12 }}>Verifying proof without accessing private data</div>
          <div style={{
            marginTop: 12, height: 4, background: '#1e3a5f', borderRadius: 2, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', width: '60%', background: '#3b82f6',
              borderRadius: 2, animation: 'none',
              transition: 'width 1.5s ease'
            }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: '#2d1a1a', border: '1px solid #f44336', borderRadius: 8,
          padding: '1rem', marginBottom: '1rem', color: '#f44336', fontSize: 14
        }}>
          ❌ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: '#111118',
          border: `2px solid ${result.above_threshold ? '#00e676' : '#f44336'}`,
          borderRadius: 12, padding: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: 48 }}>{result.above_threshold ? '✅' : '❌'}</div>
            <div style={{
              fontSize: '1.5rem', fontWeight: 900,
              color: result.above_threshold ? '#00e676' : '#f44336',
              marginTop: 8
            }}>
              {result.message}
            </div>
            <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
              {result.above_threshold
                ? 'This borrower has been verified above the credit threshold'
                : 'This borrower did not meet the minimum credit threshold'}
            </div>
          </div>

          {/* What lender DOES see */}
          <div style={{ background: '#0f1729', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>What you can verify</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: '#1a2a1a', borderRadius: 6, padding: '0.75rem' }}>
                <div style={{ fontSize: 11, color: '#6b7280' }}>ABOVE THRESHOLD</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: result.above_threshold ? '#00e676' : '#f44336' }}>
                  {result.above_threshold ? 'YES' : 'NO'}
                </div>
              </div>
              <div style={{ background: '#1a1a2a', borderRadius: 6, padding: '0.75rem' }}>
                <div style={{ fontSize: 11, color: '#6b7280' }}>ATTESTED AT</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#d1d5db' }}>{formatTime(result.timestamp)}</div>
              </div>
            </div>
          </div>

          {/* What lender CANNOT see */}
          <div style={{ background: '#1a0f0f', border: '1px solid #7f1d1d', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: 11, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>🔒 Cryptographically hidden from you</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {['Actual Score', 'Annual Revenue', 'Outstanding Debt', 'Monthly Expenses', 'Loan Amount', 'Financial Ratios'].map(item => (
                <div key={item} style={{
                  background: '#2d1a1a', borderRadius: 4, padding: '0.4rem 0.5rem',
                  fontSize: 11, color: '#6b7280', textAlign: 'center'
                }}>
                  🚫 {item}
                </div>
              ))}
            </div>
          </div>

          {/* ZK proof */}
          <div style={{ background: '#0f1729', border: '1px solid #1e3a5f', borderRadius: 8, padding: '0.75rem' }}>
            <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>🌙 Midnight Attestation ID</p>
            <code style={{ fontSize: 11, color: '#60a5fa', wordBreak: 'break-all' }}>{result.application_id}</code>
          </div>
        </div>
      )}
    </div>
  )
}
