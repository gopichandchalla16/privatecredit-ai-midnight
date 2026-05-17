from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv
import os
import json
import hashlib
import time
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("privatecredit")

app = FastAPI(
    title="PrivateCredit AI API",
    description="Privacy-preserving credit scoring powered by AI + Midnight ZK blockchain",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_MODEL = "llama-3.3-70b-versatile"

# In-memory attestation store (replace with DB in production)
attestation_store: dict = {}


# ─── Schemas ──────────────────────────────────────────────────────────────────

class CreditApplication(BaseModel):
    annual_revenue: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., gt=0)
    outstanding_debt: float = Field(..., ge=0)
    years_in_business: int = Field(..., ge=0)
    requested_loan_amount: float = Field(..., gt=0)
    industry: str
    payment_history_score: int = Field(..., ge=0, le=100)


class CreditScore(BaseModel):
    score: int
    decision: str
    reasoning: str
    risk_factors: list[str]
    zk_attestation_hash: str
    midnight_ready: bool


class AttestationRequest(BaseModel):
    score: int
    threshold: int = 60
    application_id: str


class AttestationResult(BaseModel):
    application_id: str
    above_threshold: bool
    zk_proof_simulated: str
    on_chain_attestation: str
    timestamp: int


class VerifyResult(BaseModel):
    application_id: str
    verified: bool
    above_threshold: bool
    timestamp: int
    message: str


# ─── Prompts ──────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are an expert private credit risk analyst AI.
You MUST respond with valid JSON only. No markdown, no code blocks, no extra text.

Return exactly:
{
  "score": <integer 0-100, 100 = lowest risk>,
  "decision": "<APPROVED | REVIEW | REJECTED>",
  "reasoning": "<2-3 sentence explanation>",
  "risk_factors": ["<factor1>", "<factor2>", "<factor3>"]
}

SCORING:
- APPROVED: score >= 70
- REVIEW: 50-69
- REJECTED: < 50

KEY RATIOS:
- Debt-to-Revenue (lower = better)
- Expense-to-Revenue (lower = better)
- Loan-to-Revenue (lower = better)
- Years in business (more = better)
- Payment history (higher = better)
"""

STRICT_PROMPT = SYSTEM_PROMPT + """
CRITICAL: Output ONLY the raw JSON object. Start with { and end with }. Nothing else.
"""


def parse_ai_response(text: str) -> dict:
    """Strip markdown fences and parse JSON."""
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{"):
                text = part
                break
    return json.loads(text)


async def call_groq(messages: list, strict: bool = False) -> dict:
    """Call Groq with optional strict retry."""
    system = STRICT_PROMPT if strict else SYSTEM_PROMPT
    full_messages = [{"role": "system", "content": system}] + messages
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=full_messages,
        temperature=0.05 if strict else 0.1,
        max_tokens=512
    )
    return parse_ai_response(response.choices[0].message.content)


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "PrivateCredit AI", "version": "1.1.0", "model": GROQ_MODEL}


@app.post("/score", response_model=CreditScore)
async def score_credit_application(application: CreditApplication):
    """AI-powered credit scoring. Only the score hash touches Midnight."""
    debt_to_revenue = application.outstanding_debt / application.annual_revenue
    expense_ratio = (application.monthly_expenses * 12) / application.annual_revenue
    loan_to_revenue = application.requested_loan_amount / application.annual_revenue

    logger.info(
        f"Scoring | industry={application.industry} "
        f"dtr={debt_to_revenue:.2f} er={expense_ratio:.2f} ltr={loan_to_revenue:.2f} "
        f"yib={application.years_in_business} phs={application.payment_history_score}"
    )

    user_message = {
        "role": "user",
        "content": f"""Credit Application:
- Annual Revenue: ${application.annual_revenue:,.2f}
- Monthly Expenses: ${application.monthly_expenses:,.2f}
- Outstanding Debt: ${application.outstanding_debt:,.2f}
- Years in Business: {application.years_in_business}
- Requested Loan: ${application.requested_loan_amount:,.2f}
- Industry: {application.industry}
- Payment History: {application.payment_history_score}/100
- Debt-to-Revenue: {debt_to_revenue:.2f}
- Expense-to-Revenue: {expense_ratio:.2f}
- Loan-to-Revenue: {loan_to_revenue:.2f}

Respond with JSON only."""
    }

    try:
        result = await call_groq([user_message])
    except (json.JSONDecodeError, ValueError):
        logger.warning("First parse failed, retrying with strict prompt")
        try:
            result = await call_groq([user_message], strict=True)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI parsing failed after retry: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    raw_data = f"{application.annual_revenue}{application.outstanding_debt}{result['score']}{time.time()}"
    zk_hash = hashlib.sha256(raw_data.encode()).hexdigest()

    logger.info(f"Scored | score={result['score']} decision={result['decision']} hash={zk_hash[:12]}...")

    return CreditScore(
        score=result["score"],
        decision=result["decision"],
        reasoning=result["reasoning"],
        risk_factors=result["risk_factors"],
        zk_attestation_hash=zk_hash,
        midnight_ready=True
    )


@app.post("/attest", response_model=AttestationResult)
async def create_midnight_attestation(request: AttestationRequest):
    """Create + persist ZK attestation. Proves score >= threshold, never reveals score."""
    above_threshold = request.score >= request.threshold

    proof_input = f"{request.application_id}:{request.score}:{request.threshold}:{above_threshold}"
    zk_proof = hashlib.sha256(proof_input.encode()).hexdigest()

    attestation_data = {
        "application_id": request.application_id,
        "above_threshold": above_threshold,
        "threshold_used": request.threshold,
        "zk_proof": zk_proof
    }
    on_chain = hashlib.sha256(json.dumps(attestation_data).encode()).hexdigest()
    ts = int(time.time())

    # Persist for lender verification
    attestation_store[request.application_id] = {
        "above_threshold": above_threshold,
        "zk_proof": zk_proof,
        "on_chain": on_chain,
        "timestamp": ts
    }

    logger.info(f"Attested | id={request.application_id[:12]}... above={above_threshold}")

    return AttestationResult(
        application_id=request.application_id,
        above_threshold=above_threshold,
        zk_proof_simulated=zk_proof,
        on_chain_attestation=on_chain,
        timestamp=ts
    )


@app.get("/verify/{application_id}", response_model=VerifyResult)
def verify_attestation(application_id: str):
    """
    Lender endpoint: ZK selective disclosure.
    Returns ONLY above_threshold + timestamp.
    Score and financials are NEVER accessible here.
    """
    record = attestation_store.get(application_id)
    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No attestation found for ID: {application_id}"
        )

    return VerifyResult(
        application_id=application_id,
        verified=True,
        above_threshold=record["above_threshold"],
        timestamp=record["timestamp"],
        message="CREDITWORTHY" if record["above_threshold"] else "BELOW THRESHOLD"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
