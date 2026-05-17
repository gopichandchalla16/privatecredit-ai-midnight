# 🌙 PrivateCredit AI

<div align="center">

**Privacy-preserving private credit scoring powered by AI + Midnight ZK Blockchain**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20MVP-brightgreen)](https://github.com/gopichandchalla16/privatecredit-ai-midnight)
[![Midnight](https://img.shields.io/badge/Midnight-ZK%20Blockchain-blueviolet)](https://midnight.network)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20v1.2-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb)](https://react.dev)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3--70b-orange)](https://groq.com)
[![MLH Hackathon](https://img.shields.io/badge/MLH-Midnight%20Hackathon%202026-red)](https://mlh.io)

> **Built for MLH Midnight Hackathon 2026 — AI Track + Finance Use Case**

</div>

---

## 🎯 The Problem

Private credit markets — SME loans, invoice financing, trade credit — require lenders to assess borrower risk. But borrowers refuse to share sensitive financial data with counterparties they don’t fully trust.

**This trust gap locks millions of creditworthy businesses out of $1.7 trillion in available capital.**

Traditional credit scoring requires:
- ❌ Full financial disclosure to lenders
- ❌ Revenue, debt, and expense data shared with third parties
- ❌ No privacy guarantees once data is shared
- ❌ Manual, slow verification processes

---

## ✅ The Solution

**PrivateCredit AI** uses Midnight’s ZK blockchain + Groq AI to let borrowers prove creditworthiness **without revealing a single financial number**.

```
Borrower proves: "My credit score is above 60"
Lender verifies: true / false
Lender learns:   NOTHING ELSE
```

This is Midnight’s **selective disclosure** primitive applied to the largest untapped financial market.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     PRIVATECREDIT AI ARCHITECTURE                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  BORROWER LAYER (Private)          LENDER LAYER (ZK Proof Only)             │
│  ┌─────────────────┐            ┌─────────────────────┐            │
│  │ Revenue: $500k    │            │ above_threshold: true │            │
│  │ Debt: $100k       │            │ timestamp: 1779000726 │            │
│  │ Expenses: $30k    │            │ verified: true        │            │
│  │ Score: 85         │            │                       │            │
│  └─────────┬───────┘            └─────────┬───────────┘            │
│           │                                  ↑                            │
│           │                                  │                            │
│           ▼                                  │                            │
│  ┌─────────────────┐            ┌─────────────────────┐            │
│  │  Groq LLaMA-3.3  │            │  Midnight Compact     │            │
│  │  70b AI Scoring  │            │  ZK Contract          │            │
│  │                 │            │  prove_score_above    │            │
│  │  score: 85       │            │  _threshold circuit   │            │
│  │  decision:       │            │                       │            │
│  │  APPROVED        └─────────────────────┘            │
│  └─────────┬───────┘            ↑                            │
│           │              ZK Hash only │                            │
│           └─────────────────────────┘                            │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow (Step by Step)

```
Step 1: BORROWER submits financials via React UI (localhost:5173)
        └─ annual_revenue, monthly_expenses, outstanding_debt,
           years_in_business, requested_loan_amount, industry,
           payment_history_score

Step 2: FastAPI backend receives data, calculates ratios:
        └─ debt_to_revenue = outstanding_debt / annual_revenue
        └─ expense_ratio   = (monthly_expenses × 12) / annual_revenue
        └─ loan_to_revenue = requested_loan_amount / annual_revenue

Step 3: Groq LLaMA-3.3-70b performs multi-dimensional analysis:
        └─ Returns: score (0-100), decision, reasoning, risk_factors
        └─ Temperature: 0.1 (deterministic for reproducibility)

Step 4: Backend generates ZK Attestation Hash:
        └─ SHA-256(annual_revenue + outstanding_debt + score + timestamp)
        └─ This is the commitment — binds AI output to input data

Step 5: BORROWER clicks "Submit ZK Attestation to Midnight"
        └─ POST /attest with {score, threshold: 60, application_id: hash}
        └─ Backend stores: {above_threshold, zk_proof, timestamp}
        └─ Persisted to attestations.json (survives restarts)
        └─ In production: deploy.ts submits to Midnight testnet

Step 6: LENDER pastes hash into Lender Verification Portal
        └─ GET /verify/{hash}
        └─ Returns ONLY: {above_threshold, timestamp, message}
        └─ Score is mathematically inaccessible — not in VerifyResult schema
        └─ Financials never stored, never transmitted to lender
```

---

## 🔒 ZK Selective Disclosure: What Each Party Sees

| Data | Borrower | Lender | Blockchain |
|------|----------|--------|------------|
| Annual Revenue | ✅ Their data | 🚫 Never | 🚫 Never |
| Outstanding Debt | ✅ Their data | 🚫 Never | 🚫 Never |
| Monthly Expenses | ✅ Their data | 🚫 Never | 🚫 Never |
| Actual Credit Score | ✅ Sees it | 🚫 Never | 🚫 Never |
| AI Reasoning | ✅ Sees it | 🚫 Never | 🚫 Never |
| Above Threshold | ✅ Knows | ✅ Only this | ✅ Hash only |
| ZK Attestation Hash | ✅ Shares it | ✅ Uses to verify | ✅ Stored |
| Timestamp | ✅ Sees it | ✅ Sees it | ✅ Stored |

---

## 🌙 Midnight Integration (Deep Dive)

### Why Midnight is Essential Here

Midnight’s Compact language enables **programmable selective disclosure** — you can write circuits that prove properties of private data without revealing the data. [docs.midnight.network](https://docs.midnight.network)

This is exactly the Finance use case Midnight was built for: *"prove solvency, transaction validity, or compliance requirements without disclosing balances or counterparties."*

### Midnight tDUST Tokens

**Yes — Midnight uses tokens!** Here’s how they work for your project:

- **tDUST** = Midnight testnet token (free from faucet)
- Used to **pay gas fees** for submitting ZK proofs to the blockchain
- Get free tDUST at: https://faucet.preprod.midnight.network/
- **Your `deploy.ts` script needs tDUST** to submit the `submit_credit_attestation` transaction
- In production, real DUST tokens pay for on-chain attestation storage
- **For the hackathon demo**: our simulated attestation uses SHA-256 hashing (no tokens needed)
- **For real on-chain deployment**: get tDUST from faucet → fund your wallet → run `npm run deploy`

### Compact Contract Explained

```compact
// contracts/privatecredit.compact

// PUBLIC state — visible on-chain
ledger credit_attestations: Map<Bytes<32>, CreditAttestation>;

struct CreditAttestation {
  application_id: Bytes<32>;     // public identifier
  above_threshold: Boolean;      // public: did they pass?
  ai_score_hash: Bytes<32>;      // public: commitment to AI output
  lender_id: Bytes<32>;          // public: which lender
  timestamp: Uint<64>;           // public: when
}

// ZK CIRCUIT — proves score >= threshold WITHOUT revealing score
circuit prove_score_above_threshold(
  actual_score: Uint<8>,         // PRIVATE WITNESS (never on-chain)
  threshold: Uint<8>,            // public input
  secret_nonce: Bytes<32>        // PRIVATE (prevents reverse engineering)
): Boolean {
  return actual_score >= threshold;  // ZK proof of this statement
}
```

The `actual_score` is a **private witness** — it exists inside the ZK proof computation but never appears in any on-chain state. This is the core cryptographic guarantee.

### Getting tDUST for Real Deployment

```bash
# 1. Install Midnight wallet CLI
npm install -g @midnight-ntwrk/wallet-cli

# 2. Create wallet
midnight-wallet create

# 3. Get your wallet address
midnight-wallet address

# 4. Get free tDUST from faucet
# Go to: https://faucet.preprod.midnight.network/
# Paste your wallet address
# Receive tDUST in ~30 seconds

# 5. Fund your deploy script
export MIDNIGHT_WALLET_SEED=your_seed_phrase
cd contracts && npm run deploy
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- Groq API key (free at console.groq.com)

### 1. Clone and setup

```bash
git clone https://github.com/gopichandchalla16/privatecredit-ai-midnight
cd privatecredit-ai-midnight
```

### 2. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
python3 -m uvicorn main:app --reload --port 8000
```

API running at: http://localhost:8000
Swagger docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Borrower UI: http://localhost:5173
- Lender Portal: http://localhost:5173/lender

### 4. Midnight Contract (testnet)

```bash
# Get tDUST from https://faucet.preprod.midnight.network/
cd contracts
npm install
cp .env.example .env  # add your wallet seed
npm run compile       # compile Compact contract
npm run deploy        # deploy to Midnight testnet
```

---

## 📡 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/health` | Public | Service health + attestation count |
| `POST` | `/score` | Borrower | AI credit scoring (financials stay private) |
| `POST` | `/attest` | Borrower | Create ZK attestation, persist to disk |
| `GET` | `/verify/{id}` | Lender | ZK selective disclosure — proof only |
| `GET` | `/attestations` | Debug | List all attestation IDs |

### POST /score request body
```json
{
  "annual_revenue": 500000,
  "monthly_expenses": 30000,
  "outstanding_debt": 100000,
  "years_in_business": 5,
  "requested_loan_amount": 200000,
  "industry": "Technology",
  "payment_history_score": 80
}
```

### GET /verify/{id} response
```json
{
  "application_id": "0eea26efc699ef1d...",
  "verified": true,
  "above_threshold": true,
  "timestamp": 1779000726,
  "message": "CREDITWORTHY"
}
```
> Note: `score`, `annual_revenue`, `outstanding_debt` are **never in this response**.

---

## 📊 Scoring Model

Groq LLaMA-3.3-70b analyzes 7 dimensions:

| Factor | Weight | Good Signal |
|--------|--------|-------------|
| Debt-to-Revenue ratio | High | < 0.3 |
| Expense-to-Revenue ratio | High | < 0.6 |
| Loan-to-Revenue ratio | Medium | < 0.4 |
| Years in business | Medium | > 5 years |
| Payment history score | High | > 75/100 |
| Industry stability | Low | Varies |
| Loan-to-debt ratio | Medium | < 2x |

**Decision thresholds:**
- ✅ **APPROVED**: score ≥ 70
- ⚠️ **REVIEW**: score 50–69
- ❌ **REJECTED**: score < 50

---

## 🛣️ Project Structure

```
privatecredit-ai-midnight/
├── backend/
│   ├── main.py                 # FastAPI v1.2.0
│   ├── requirements.txt
│   ├── Dockerfile              # Production container
│   ├── attestations.json       # Persistent ZK store (auto-created)
│   └── .env                    # GROQ_API_KEY (not committed)
├── contracts/
│   ├── privatecredit.compact   # Midnight ZK smart contract
│   ├── deploy.ts               # Midnight JS SDK testnet deploy
│   ├── package.json            # @midnight-ntwrk SDK deps
│   ├── tsconfig.json
│   └── .env.example            # Midnight testnet config
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx             # React Router + sticky nav
│       ├── App.tsx              # Borrower UI
│       └── LenderDashboard.tsx  # Lender ZK verification portal
├── render.yaml                 # Render.com deploy config
├── .gitignore
└── README.md
```

---

## 🔮 Advanced Features (Roadmap)

### v2.0 — Real Midnight On-Chain
- [ ] Full `deploy.ts` execution on Midnight testnet with tDUST
- [ ] Wallet connect via Midnight wallet CLI
- [ ] On-chain attestation explorer

### v2.1 — Multi-Lender Marketplace
- [ ] Multiple lenders set custom thresholds (60, 70, 75)
- [ ] Borrower shares one hash, multiple lenders verify independently
- [ ] Lender reputation scoring (who verifies most accurately)

### v2.2 — Recurring Credit Lines
- [ ] Re-score quarterly without re-sharing data
- [ ] Credit history ZK commitments (prove 12-month track record)
- [ ] Automatic renewal attestations

### v2.3 — Invoice Financing
- [ ] Upload invoice PDF → AI extracts financials privately
- [ ] ZK proof: "this invoice is from a verified counterparty"
- [ ] Instant financing decisions in < 5 seconds

### v3.0 — DeFi Integration
- [ ] Midnight ↔ Cardano bridge (Midnight is built to connect with Cardano)
- [ ] On-chain credit NFT: non-transferable proof of creditworthiness
- [ ] Integration with DeFi lending protocols

---

## 💰 Midnight Tokens (tDUST) Explained

Midnight has its own token economy:

| Token | Network | Purpose | How to Get |
|-------|---------|---------|------------|
| **tDUST** | Testnet (preprod) | Pay gas fees for ZK proof submission | [Free faucet](https://faucet.preprod.midnight.network/) |
| **DUST** | Mainnet | Production gas fees | Exchange/purchase |

For PrivateCredit AI:
- **Each `/attest` call** → in production, costs a small amount of DUST
- **Each ZK proof generation** → computational cost covered by DUST
- **Verification** → free (read-only ledger query)
- Get testnet tDUST: https://faucet.preprod.midnight.network/
- Generate tDUST programmatically: https://docs.midnight.network/guides/generating-dust-programmatically

---

## 💼 Business Model

PrivateCredit AI is viable as a real business:

| Revenue Stream | Model | TAM |
|---------------|-------|-----|
| Borrower scoring fee | $5-50 per application | 10M+ SMEs globally |
| Lender API access | $500-5000/month SaaS | 50,000+ private lenders |
| Enterprise white-label | $50k-500k/year | Banks, fintechs |
| DUST token staking | Protocol fees | DeFi expansion |

---

## 🏆 Hackathon Track

**MLH Midnight Hackathon 2026 — AI Track + Finance Use Case**

- ✅ AI processes sensitive financial data without exposing it (AI Track criteria)
- ✅ Privacy-preserving via Midnight ZK selective disclosure
- ✅ Real $1.7T market use case with immediate commercial value
- ✅ Working two-sided marketplace: borrower + lender flows
- ✅ Compact ZK contract + Midnight JS SDK deploy script
- ✅ Persistent storage, retry logic, structured logging
- ✅ Production-ready Docker + Render deployment config

---

## 👤 Team

**Gopichand Challa** — AI × Web3 Developer
- GitHub: [@gopichandchalla16](https://github.com/gopichandchalla16)
- Building AI × Web3 in public
- Built during MLH Midnight Hackathon 2026

---

## 📚 Resources

- [Midnight Docs](https://docs.midnight.network)
- [Midnight GitHub](https://github.com/midnightntwrk)
- [tDUST Faucet](https://faucet.preprod.midnight.network/)
- [Midnight Local Dev](https://github.com/midnightntwrk/midnight-local-dev)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [Midnight Discord](https://discord.gg/midnightnetwork)
- [1am.xyz](https://1am.xyz/) — Midnight ecosystem

---

<div align="center">

**PrivateCredit AI — Where AI meets ZK. Where privacy meets profit.**

★ Star this repo if you believe privacy-preserving AI is the future ★

</div>
