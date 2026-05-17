# PrivateCredit AI — Midnight Hackathon

> **Privacy-preserving private credit scoring powered by AI + Midnight ZK blockchain**

[![Midnight](https://img.shields.io/badge/Midnight-ZK%20Blockchain-blueviolet)](https://midnight.network)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](https://react.dev)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange)](https://groq.com)

---

## The Problem

Private credit markets (SME loans, invoice financing, trade credit) require lenders to assess borrower risk — but borrowers refuse to share sensitive financial data. This trust gap **locks millions of businesses out of credit** they qualify for.

**Market size: $1.7 trillion globally.**

## The Solution

**PrivateCredit AI** lets borrowers prove their creditworthiness **without revealing their actual financial data**.

- 🤖 **Groq LLaMA-3.3-70b** analyzes financial ratios and generates a credit score + decision
- 🔒 **Midnight Compact Contract** stores a ZK-verified attestation on-chain — no raw data ever touches the blockchain
- ✅ **Lenders** get a verified `CREDITWORTHY / BELOW THRESHOLD` attestation they can trust
- 🏦 **Borrowers** keep all financials completely private

---

## Architecture

```
Borrower Input (private financials)
        ↓
  FastAPI Backend
        ↓
  Groq LLaMA-3.3-70b → Credit Score (0-100) + Decision + Risk Factors
        ↓
  ZK Hash (SHA-256 commitment)
        ↓
  Midnight Compact Contract
        ↓
  On-chain: { above_threshold, ai_score_hash, timestamp }  ← NO FINANCIALS
        ↓
  Lender calls /verify → gets CREDITWORTHY ✔️ or BELOW THRESHOLD ❌
  (score and financials are mathematically inaccessible)
```

---

## Project Structure

```
privatecredit-ai/
├── backend/
│   ├── main.py              # FastAPI v1.1.0 with /score, /attest, /verify
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GROQ_API_KEY (not committed)
├── contracts/
│   ├── privatecredit.compact  # Midnight ZK smart contract (Compact language)
│   ├── deploy.ts              # Midnight JS SDK deploy + attest script
│   ├── package.json           # Midnight SDK dependencies
│   ├── tsconfig.json
│   └── .env.example           # Midnight testnet config template
├── frontend/
│   ├── index.html
│   └── src/
│       ├── main.tsx         # React Router + sticky nav
│       ├── App.tsx          # Borrower UI
│       └── LenderDashboard.tsx  # Lender ZK verification portal
└── README.md
```

---

## Quick Start

### 1. Backend (AI scoring API)

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
python3 -m uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend (Borrower + Lender UI)

```bash
cd frontend
npm install
npm run dev
```

- Borrower flow: http://localhost:5173
- Lender portal: http://localhost:5173/lender

### 3. Midnight Contract (compile)

```bash
cd contracts
npm install
npm run compile        # compile Compact contract
npm run deploy         # deploy to Midnight testnet
```

---

## API Endpoints

| Method | Endpoint | Description | Privacy |
|--------|----------|-------------|--------|
| GET | `/health` | Health check | Public |
| POST | `/score` | AI credit scoring | Financials stay private |
| POST | `/attest` | Create ZK attestation | Score never stored raw |
| GET | `/verify/{id}` | Lender verification | Returns proof only, not score |

---

## ZK Selective Disclosure

This is the core innovation:

| Party | Can See | Cannot See |
|-------|---------|------------|
| Borrower | Everything (it's their data) | — |
| Lender | `above_threshold`, `timestamp` | Score, revenue, debt, expenses |
| Blockchain | `ai_score_hash`, `above_threshold` | All raw financial data |

The `VerifyResult` schema has **no score field** — it is architecturally impossible for a lender to retrieve the score through the API.

---

## Midnight Integration

This project uses:
- **Compact language** — ZK smart contract with `prove_score_above_threshold` circuit
- **Midnight JS SDK** — `deploy.ts` wires the contract to Midnight testnet
- **Private witnesses** — actual score and financials used only for local ZK proof generation
- **Selective disclosure** — lender receives proof, not data

Aligned with Midnight's **Finance** use case (prove solvency without disclosing balances) and **AI** use case (prove model integrity without revealing contents). [docs.midnight.network](https://docs.midnight.network)

---

## Why Midnight?

Midnight's Compact language enables us to prove that *"this borrower's AI score is above threshold X"* without revealing the actual score or financials. This is the exact privacy-finance primitive Midnight was built for.

---

## Hackathon Track

**AI Track + Finance Use Case — Midnight Hackathon (MLH)**

- ✅ AI model output integrity proven on-chain
- ✅ Financial privacy via ZK selective disclosure
- ✅ Real-world use case: $1.7T private credit market
- ✅ Two-sided marketplace: borrower UI + lender portal
- ✅ Working MVP with live API, UI, and Compact contract
- ✅ Midnight JS SDK deploy script for testnet

---

## Team

**Gopichand Challa** — AI × Web3 Developer
- GitHub: [@gopichandchalla16](https://github.com/gopichandchalla16)
- Built in public during the MLH Midnight Hackathon
