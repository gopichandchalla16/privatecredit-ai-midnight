import { Link } from 'react-router-dom'

export default function Landing() {
  const faqs = [
    {
      q: 'What is PrivateCredit AI?',
      a: 'PrivateCredit AI is a privacy-first credit scoring platform for businesses. You submit your financials, our AI scores your creditworthiness, and a zero-knowledge proof is anchored on Midnight blockchain. Lenders get a pass/fail answer — your actual numbers stay completely private.'
    },
    {
      q: 'What is a ZK attestation hash?',
      a: 'A ZK (zero-knowledge) attestation hash is a cryptographic fingerprint of your credit score proof. It proves mathematically that a score was generated above or below a threshold — without revealing the score itself, your revenue, debt, or any financial detail.'
    },
    {
      q: 'Can lenders see my financial data?',
      a: 'No. Never. Lenders only receive a boolean: does this applicant qualify above the credit threshold? Your revenue, expenses, debt, and actual score are cryptographically inaccessible — even to us.'
    },
    {
      q: 'What is Midnight blockchain?',
      a: 'Midnight is a next-generation blockchain built for data protection. It combines public verifiability with programmable privacy using zero-knowledge proofs. Unlike Ethereum or Solana, Midnight lets you prove facts about private data without revealing the data itself.'
    },
    {
      q: 'How is this different from traditional credit scoring?',
      a: 'Traditional credit bureaus (CIBIL, Experian) store all your data centrally — a privacy risk. PrivateCredit AI never stores your financials. We generate a ZK proof locally and anchor only the proof hash on-chain. You own your data completely.'
    },
    {
      q: 'What is the credit threshold?',
      a: 'The default threshold is a score of 60/100. Applicants scoring 60 or above are verified as CREDITWORTHY. Lenders can request custom thresholds for their specific lending criteria.'
    },
    {
      q: 'How do I share my proof with a lender?',
      a: 'After scoring your application, click \'Submit ZK Attestation to Midnight\' then copy the 64-character hash. Send that hash to your lender. They paste it in the Lender Verification Portal — and get a pass/fail result in seconds.'
    },
    {
      q: 'Is this connected to the 1AM wallet?',
      a: 'Currently we use Midnight preprod blockchain directly. Full 1AM wallet integration is on our roadmap, which will enable gas-sponsored ZK proof generation and native shielded transactions.'
    },
  ]

  const businessModel = [
    { tier: 'Free', price: '$0', desc: 'Individual borrowers', features: ['3 credit applications/month', 'ZK attestation hash', 'Lender verification portal', 'Midnight preprod chain'], color: '#64748b', bg: 'rgba(100,116,139,0.06)' },
    { tier: 'Business', price: '$49/mo', desc: 'SMEs & startups', features: ['Unlimited applications', 'API access for integrations', 'Custom credit thresholds', 'Priority AI scoring', 'Audit trail dashboard'], color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', highlight: true },
    { tier: 'Enterprise', price: 'Custom', desc: 'Banks & lenders', features: ['White-label deployment', 'Bulk verification API', 'Compliance reporting', 'Dedicated Midnight node', 'SLA + support'], color: '#3b82f6', bg: 'rgba(59,130,246,0.06)' },
  ]

  const stats = [
    { value: '100%', label: 'Data Privacy', sub: 'Financials never stored' },
    { value: 'ZK', label: 'Proof System', sub: 'Midnight blockchain' },
    { value: '<3s', label: 'Score Time', sub: 'Groq LLaMA powered' },
    { value: '∞', label: 'Verifications', sub: 'Any lender, anywhere' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(139,92,246,0.1)', background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌙</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.3px' }}>PrivateCredit <span style={{ color: '#8b5cf6' }}>AI</span></span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#how-it-works" style={{ padding: '7px 14px', fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>How it works</a>
            <a href="#pricing" style={{ padding: '7px 14px', fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
            <a href="#faq" style={{ padding: '7px 14px', fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>FAQ</a>
            <Link to="/app" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.3)' }}>Launch App →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }}></span>
          <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>Built on Midnight · Powered by Groq LLaMA · AI Track Submission</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20 }}>
          The Credit Score That<br />
          <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proves Without Revealing</span>
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
          PrivateCredit AI uses Midnight's zero-knowledge blockchain to score your business creditworthiness.
          Lenders get a proof. <strong style={{ color: '#94a3b8' }}>Your financials stay cryptographically private. Forever.</strong>
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <Link to="/app" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', boxShadow: '0 4px 24px rgba(124,58,237,0.35)' }}>🚀 Score My Business</Link>
          <Link to="/lender" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', textDecoration: 'none', border: '1px solid rgba(59,130,246,0.3)' }}>🏦 Verify as Lender</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
          {stats.map(s => (
            <div key={s.label} className="glass" style={{ borderRadius: 12, padding: '16px 12px' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#a78bfa', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem → Solution */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass" style={{ borderRadius: 16, padding: '28px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>❌ The Old Way</div>
            {['Credit bureaus store ALL your financial data', 'Banks see everything — income, debts, history', 'Data breaches expose millions of borrowers', 'Opaque scoring algorithms, no transparency', 'Cross-border credit is nearly impossible'].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: '#94a3b8', alignItems: 'flex-start' }}>
                <span style={{ color: '#ef4444', marginTop: 1, flexShrink: 0 }}>✕</span> {item}
              </div>
            ))}
          </div>
          <div className="glass" style={{ borderRadius: 16, padding: '28px', borderColor: 'rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>✅ The PrivateCredit AI Way</div>
            {['Zero financial data ever stored or exposed', 'Lenders receive only a ZK proof hash', 'Midnight blockchain anchors tamper-proof proofs', 'AI reasoning is transparent and explainable', 'Any borrower, any lender, anywhere globally'].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: '#94a3b8', alignItems: 'flex-start' }}>
                <span style={{ color: '#10b981', marginTop: 1, flexShrink: 0 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>How It Works</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Four steps from application to verified proof on Midnight blockchain</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { step: '01', icon: '🔒', title: 'Submit Privately', desc: 'Enter business financials. Data processed locally — never sent to any server in raw form.' },
            { step: '02', icon: '🤖', title: 'AI Scores', desc: 'Groq LLaMA analyzes debt ratios, revenue, payment history and generates a credit score with reasoning.' },
            { step: '03', icon: '🌙', title: 'ZK Proof Anchored', desc: 'A cryptographic attestation hash is generated and stored on Midnight preprod blockchain immutably.' },
            { step: '04', icon: '✅', title: 'Lender Verifies', desc: 'Lender pastes the hash. Midnight returns only pass/fail. No financial data ever disclosed.' },
          ].map((s, i) => (
            <div key={i} className="glass" style={{ borderRadius: 16, padding: '24px 18px', position: 'relative' }}>
              {i < 3 && <div style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#374151', zIndex: 2 }}>→</div>}
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(79,70,229,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700, marginBottom: 6 }}>STEP {s.step}</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Midnight Tech Stack */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div className="glass" style={{ borderRadius: 20, padding: '32px', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌙</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Built on Midnight Network</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>The blockchain designed for data protection</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '🔐', title: 'Zero-Knowledge Proofs', desc: 'Compact smart contracts on Midnight generate proofs that verify facts without exposing underlying data' },
              { icon: '⚡', title: 'Groq LLaMA AI', desc: 'Sub-second credit analysis using Groq\'s LLaMA model — fastest AI inference available today' },
              { icon: '🔗', title: 'Selective Disclosure', desc: 'Following Midnight\'s core principle: prove what\'s needed, hide everything else — by design' },
            ].map(t => (
              <div key={t.title} style={{ background: 'rgba(139,92,246,0.04)', borderRadius: 12, padding: '16px', border: '1px solid rgba(139,92,246,0.08)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(10,10,20,0.6)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.1)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>🌙 Midnight Preprod: <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>mn_addr_preprod1854xsmn...q6qkl</span></span>
            <span style={{ fontSize: 12, color: '#64748b' }}>📦 Indexer: <span style={{ color: '#60a5fa', fontFamily: 'monospace' }}>indexer.preprod.midnight.network</span></span>
            <span style={{ fontSize: 12, color: '#64748b' }}>🔗 1AM Wallet: <span style={{ color: '#10b981' }}>Roadmap Q3 2026</span></span>
          </div>
        </div>
      </section>

      {/* Business Model / Pricing */}
      <section id="pricing" style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>Business Model</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Privacy is not a premium feature. It is the foundation.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {businessModel.map(plan => (
            <div key={plan.tier} className="glass" style={{
              borderRadius: 20, padding: '28px',
              border: plan.highlight ? `1px solid rgba(139,92,246,0.4)` : undefined,
              position: 'relative', transform: plan.highlight ? 'scale(1.02)' : undefined
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20 }}>MOST POPULAR</div>
              )}
              <div style={{ fontSize: 11, color: plan.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{plan.tier}</div>
              <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{plan.desc}</div>
              <div style={{ borderTop: '1px solid rgba(100,116,139,0.1)', paddingTop: 16 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>
                    <span style={{ color: plan.color, flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: '20px 24px', marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>$2.4B+</div><div style={{ fontSize: 12, color: '#64748b' }}>SME credit gap in India alone</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#8b5cf6' }}>1.7B</div><div style={{ fontSize: 12, color: '#64748b' }}>Unbanked adults globally</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#3b82f6' }}>$3.5T</div><div style={{ fontSize: 12, color: '#64748b' }}>Global SME financing market</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>0</div><div style={{ fontSize: 12, color: '#64748b' }}>Privacy-preserving credit tools today</div></div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ maxWidth: 780, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8 }}>Frequently Asked Questions</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>Everything you need to know before applying</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="glass" style={{ borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#e2e8f0' }}>Q: {faq.q}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>A: {faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div className="glass-bright" style={{ borderRadius: 24, padding: '48px 32px', border: '1px solid rgba(139,92,246,0.3)' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>Ready to score your business?</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>Takes 60 seconds. Your data never leaves your control. Powered by Midnight ZK blockchain.</p>
          <Link to="/app" style={{ display: 'inline-block', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', boxShadow: '0 4px 32px rgba(124,58,237,0.4)' }}>
            🚀 Get Your Free Credit Score
          </Link>
          <div style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>Free forever · No account needed · ZK-proof backed</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(139,92,246,0.1)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>PrivateCredit <span style={{ color: '#8b5cf6' }}>AI</span></span>
            <span style={{ fontSize: 12, color: '#374151' }}>· Built for Midnight Hackathon 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="https://docs.midnight.network" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>Midnight Docs</a>
            <a href="https://github.com/gopichandchalla16/privatecredit-ai-midnight" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>GitHub</a>
            <a href="https://1am.xyz" target="_blank" rel="noopener" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>1AM Wallet</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
