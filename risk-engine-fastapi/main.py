from fastapi import FastAPI
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
import numpy as np

app = FastAPI()

class PortfolioItem(BaseModel):
    symbol: str
    qty: float
    avg_price: float

class PortfolioRequest(BaseModel):
    portfolio: list[PortfolioItem]

@app.post("/risk/score")
def score(req: PortfolioRequest):
    symbols = [p.symbol + ".NS" for p in req.portfolio]

    data = yf.download(symbols, period="6mo")["Close"]

    returns = data.pct_change().dropna()

    weights = np.array([p.qty for p in req.portfolio])
    weights = weights / weights.sum()

    portfolio_returns = returns.dot(weights)

    # Value at Risk (95%)
    var_95 = np.percentile(portfolio_returns, 5)

    # Volatility
    volatility = np.std(portfolio_returns)

    # Max Drawdown
    cumulative = (1 + portfolio_returns).cumprod()
    peak = cumulative.cummax()
    drawdown = (cumulative - peak) / peak
    max_drawdown = drawdown.min()

    # Risk Score (0–1)
    risk_score = min(1, abs(var_95) * 50 + volatility * 10 + abs(max_drawdown))

    return {
        "var_95": float(var_95),
        "volatility": float(volatility),
        "max_drawdown": float(max_drawdown),
        "risk_score": float(risk_score)
    }