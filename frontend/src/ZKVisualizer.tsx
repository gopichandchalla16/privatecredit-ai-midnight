import { useEffect, useState } from 'react'

interface Props {
  hash: string
  score: number
  attested: boolean
}

export default function ZKVisualizer({ hash, score, attested }: Props) {
  const [step, setStep] = useState(0)
  const [particles, setParticles] = useState<{x:number,y:number,o:number,s:number}[]>([])

  useEffect(() => {
    const ps = Array.from({length: 24}, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      o: Math.random(), s: 0.5 + Math.random()
    }))
    setParticles(ps)
    const t = setInterval(() => setStep(s => (s + 1) % 360), 50)
    return () => clearInterval(t)
  }, [])

  const hashChunks = hash.match(/.{1,8}/g) || []

  return (
    <div style={{ background: 'rgba(10,10,20,0.9)', borderRadius: 16, padding: '24px', border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', width: 3, height: 3, borderRadius: '50%',
          left: `${p.x}%`, top: `${p.y}%`,
          background: i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#3b82f6' : '#10b981',
          opacity: 0.15 + 0.15 * Math.sin((step + i * 15) * Math.PI / 180),
          transition: 'opacity 0.1s',
          pointerEvents: 'none'
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>ZK Proof Visualization</p>
            <p style={{ fontSize: 13, fontWeight: 800 }}>How Your Proof is Structured</p>
          </div>
          {attested && <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>✓ On Midnight Chain</span>}
        </div>

        {/* Hash anatomy */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>ATTESTATION HASH ANATOMY (64 hex chars = 256-bit proof)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {hashChunks.map((chunk, i) => (
              <div key={i} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                padding: '4px 6px', borderRadius: 4,
                background: i < 2 ? 'rgba(139,92,246,0.15)' : i < 4 ? 'rgba(59,130,246,0.12)' : i < 6 ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.08)',
                color: i < 2 ? '#a78bfa' : i < 4 ? '#60a5fa' : i < 6 ? '#34d399' : '#64748b',
                border: `1px solid ${i < 2 ? 'rgba(139,92,246,0.2)' : i < 4 ? 'rgba(59,130,246,0.15)' : i < 6 ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)'}`,
              }}>{chunk}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: '#a78bfa' }}>█ Score commitment</span>
            <span style={{ fontSize: 10, color: '#60a5fa' }}>█ Threshold witness</span>
            <span style={{ fontSize: 10, color: '#34d399' }}>█ Timestamp nonce</span>
            <span style={{ fontSize: 10, color: '#64748b' }}>█ Chain anchor</span>
          </div>
        </div>

        {/* ZK properties */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { prop: 'Completeness', desc: 'True claims always verify', icon: '✅', ok: true },
            { prop: 'Soundness', desc: 'False claims never pass', icon: '🔒', ok: true },
            { prop: 'Zero-Knowledge', desc: 'Nothing extra revealed', icon: '👁️', ok: true },
          ].map(p => (
            <div key={p.prop} style={{ background: 'rgba(16,185,129,0.04)', borderRadius: 8, padding: '10px', border: '1px solid rgba(16,185,129,0.1)' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{p.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 2, color: '#10b981' }}>{p.prop}</div>
              <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
