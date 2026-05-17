import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface Block {
  application_id: string
  score: number
  above_threshold: boolean
  timestamp: number
}

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)

  const fetchBlocks = async () => {
    try {
      const res = await fetch(`${API_URL}/attestations`)
      if (res.ok) {
        const data = await res.json()
        setBlocks(data.slice(0, 6))
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchBlocks()
    const t = setInterval(fetchBlocks, 15000)
    return () => clearInterval(t)
  }, [])

  const fmt = (ts: number) => new Date(ts * 1000).toLocaleTimeString('en-IN', { timeStyle: 'short' })
  const truncate = (h: string) => h.slice(0, 8) + '...' + h.slice(-6)

  return (
    <div className="glass" style={{ borderRadius: 16, padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Live Midnight Chain</p>
          <p style={{ fontSize: 14, fontWeight: 800 }}>Recent Attestations</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: pulse ? '0 0 12px #10b981' : '0 0 4px #10b981', transition: 'box-shadow 0.3s' }} />
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Auto-refreshes every 15s</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: 13 }}>🔄 Loading chain data...</div>
      ) : blocks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: 13 }}>No attestations yet. Be the first!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {blocks.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              background: i === 0 ? 'rgba(139,92,246,0.06)' : 'rgba(15,15,26,0.5)',
              border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.15)' : 'rgba(100,116,139,0.08)'}`,
              transition: 'all 0.3s'
            }}>
              {i === 0 && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6', flexShrink: 0 }} />}
              {i > 0 && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#374151', flexShrink: 0 }} />}
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#60a5fa', flex: 1 }}>{truncate(b.application_id)}</code>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: b.above_threshold ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: b.above_threshold ? '#10b981' : '#ef4444',
                border: `1px solid ${b.above_threshold ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
              }}>{b.above_threshold ? 'PASS' : 'FAIL'}</span>
              <span style={{ fontSize: 10, color: '#475569' }}>{fmt(b.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ fontSize: 10, color: '#374151', marginTop: 12, textAlign: 'center' }}>
        Scores are hidden — only pass/fail status and timestamps are public on-chain
      </p>
    </div>
  )
}
