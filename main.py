from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

class PortfolioItem(BaseModel):
    symbol: str
    qty: float
    avg_price: float

class PortfolioRequest(BaseModel):
    portfolio: list[PortfolioItem]

@app.get("/")
def root():
    return {"message": "Risk engine online"}

@app.post("/risk/score")
def score(request: PortfolioRequest):
    # placeholder for now
    return {
        "risk_score": 0.0,
        "var_95": 0.0,
        "max_drawdown": 0.0,
        "volatility": 0.0
    }