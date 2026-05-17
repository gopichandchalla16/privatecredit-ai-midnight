from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv
import os
import json
import hashlib
import time

load_dotenv()

app = FastAPI(
    title="PrivateCredit AI API",
    description="Privacy-preserving credit scoring powered by AI + Midnight ZK blockchain",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class CreditApplication(BaseModel):
    annual_revenue: float = Field(..., description="Annual revenue in USD", gt=0)
    monthly_expenses: float = Field(..., description="Monthly operating expenses in USD", gt=0)
    outstanding_debt: float = Field(..., description="Total outstanding debt in USD", ge=0)
    years_in_business: int = Field(..., description="Years in operation", ge=0)
    requested_loan_amount: float = Field(..., description="Loan amount requested in USD", gt=0)
    industry: str = Field(..., description="Business industry sector")
    payment_history_score: int = Field(..., description="Historical payment score 0-100", ge=0, le=100)


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


SYSTEM_PROMPT = """
You are an expert private credit risk analyst AI. You analyze business financial data and provide credit risk assessments.

You MUST respond with valid JSON only. No markdown, no extra text.

Analyze the financial indicators and return:
{
  "score": <integer 0-100, where 100 = lowest risk>,
  "decision": "<APPROVED | REVIEW | REJECTED>",
  "reasoning": "<2-3 sentence explanation>",
  "risk_factors": ["<factor1>", "<factor2>", "<factor3>"]
}

Scoring guide:
- APPROVED: score >= 70 (strong financials, low debt ratio, stable business)
- REVIEW: score 50-69 (moderate risk, needs human review)
- REJECTED: score < 50 (high risk, poor debt coverage, instability)

Key ratios to consider:
- Debt-to-Revenue ratio (lower = better)
- Expense-to-Revenue ratio (lower = better)
- Loan-to-Revenue ratio (lower = better)
- Years in business (more = better)
- Payment history (higher = better)
"""


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "PrivateCredit AI", "version": "1.0.0"}


@app.post("/score", response_model=CreditScore)
async def score_credit_application(application: CreditApplication):
    """
    Submit a credit application for AI-powered risk scoring.
    Financial data is processed by AI — only the score hash goes to Midnight.
    """
    debt_to_revenue = application.outstanding_debt / application.annual_revenue
    expense_ratio = (application.monthly_expenses * 12) / application.annual_revenue
    loan_to_revenue = application.requested_loan_amount / application.annual_revenue

    user_message = f"""
Credit Application Analysis:
- Annual Revenue: ${application.annual_revenue:,.2f}
- Monthly Expenses: ${application.monthly_expenses:,.2f} (Annual: ${application.monthly_expenses*12:,.2f})
- Outstanding Debt: ${application.outstanding_debt:,.2f}
- Years in Business: {application.years_in_business}
- Requested Loan: ${application.requested_loan_amount:,.2f}
- Industry: {application.industry}
- Payment History Score: {application.payment_history_score}/100

Calculated Ratios:
- Debt-to-Revenue: {debt_to_revenue:.2f}
- Expense-to-Revenue: {expense_ratio:.2f}
- Loan-to-Revenue: {loan_to_revenue:.2f}

Provide your credit risk assessment as JSON.
"""

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.1,
            max_tokens=512
        )

        ai_response = response.choices[0].message.content.strip()
        result = json.loads(ai_response)

        raw_data = f"{application.annual_revenue}{application.outstanding_debt}{result['score']}{time.time()}"
        zk_hash = hashlib.sha256(raw_data.encode()).hexdigest()

        return CreditScore(
            score=result["score"],
            decision=result["decision"],
            reasoning=result["reasoning"],
            risk_factors=result["risk_factors"],
            zk_attestation_hash=zk_hash,
            midnight_ready=True
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI response parsing failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/attest", response_model=AttestationResult)
async def create_midnight_attestation(request: AttestationRequest):
    """
    Simulates Midnight ZK attestation.
    In production: calls Midnight Compact contract to store ZK proof on-chain.
    Proves score >= threshold WITHOUT revealing the actual score.
    """
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

    return AttestationResult(
        application_id=request.application_id,
        above_threshold=above_threshold,
        zk_proof_simulated=zk_proof,
        on_chain_attestation=on_chain,
        timestamp=int(time.time())
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
