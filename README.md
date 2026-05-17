# PrivateCredit AI — Midnight Hackathon

> **Privacy-preserving private credit scoring powered by AI + Midnight ZK blockchain**

[![Midnight](https://img.shields.io/badge/Midnight-ZK%20Blockchain-blueviolet)](https://midnight.network)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](https://react.dev)

---

## The Problem

In private credit markets (SME loans, invoice financing, trade credit), lenders need to assess borrower risk — but borrowers are reluctant to share sensitive financial data (bank balances, revenue, liabilities). Traditional credit scoring exposes all data. This breaks trust and excludes millions of businesses.

## The Solution

**PrivateCredit AI** lets borrowers prove their creditworthiness **without revealing their actual financial data**.

- 🤖 **AI Agent** (Groq/LLaMA) analyzes financial indicators and generates a risk score + recommendation
- 🔒 **Midnight Compact Contract** takes the AI score and stores a ZK-verified attestation on-chain — no raw data ever touches the blockchain
- ✅ **Lenders** get a verified "APPROVED / REVIEW / REJECTED" attestation they can trust
- 🏦 **Borrowers** keep their financials private

---

## Architecture

```
Borrower Input (private financials)
        ↓
  FastAPI Backend
        ↓
  Groq LLaMA AI Agent → Risk Score (0-100) + Recommendation
        ↓
  Midnight Compact Contract
        ↓
  ZK Attestation stored on-chain (score hash only, not raw data)
        ↓
  Lender sees: APPROVED / REVIEW / REJECTED
```

---

## Project Structure

```
privatecredit-ai/
├── backend/
│   ├── main.py              # FastAPI app with AI credit scoring
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GROQ_API_KEY (not committed)
├── contracts/
│   └── privatecredit.compact  # Midnight ZK smart contract
├── frontend/
│   ├── index.html
│   └── src/
│       └── App.tsx          # React UI
└── README.md
```

---

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

### 3. Midnight Contract

```bash
npx @midnight-ntwrk/compact-compiler contracts/privatecredit.compact
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/score` | Submit financials, get AI credit score |
| GET | `/health` | Health check |
| POST | `/attest` | Simulate Midnight ZK attestation |

---

## Why Midnight?

Midnight's Compact language lets us prove that *"this borrower's AI score is above threshold X"* without revealing the actual score or the underlying financials. This is the exact privacy-finance use case Midnight was built for. [See Midnight Finance use case](https://midnight.network)

---

## Hackathon Track

**AI Track** — Midnight Hackathon

This project demonstrates:
- ✅ AI model integrity proven on-chain (Midnight AI track)
- ✅ Financial privacy via ZK selective disclosure (Midnight Finance track)
- ✅ Real-world use case: private credit market is a $1.7T global industry
- ✅ Working MVP with UI, API, and contract

---

## Team

Built by **Gopichand Challa** — AI × Web3 Developer
- GitHub: [@gopichandchalla16](https://github.com/gopichandchalla16)
- X: [@gopichand_dev](https://twitter.com)
