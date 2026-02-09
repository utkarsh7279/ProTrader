const RISK_API_BASE_URL = process.env.NEXT_PUBLIC_RISK_API_URL || "http://localhost:8000";

export interface RiskResponse {
  portfolio_risk: number;
  var_95: number;
  var_99: number;
  max_drawdown: number;
  // Add other fields based on your Python API response
}

export async function getRiskMetrics(portfolioId: string): Promise<RiskResponse> {
  const response = await fetch(`${RISK_API_BASE_URL}/api/risk/${portfolioId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Risk API error: ${response.statusText}`);
  }

  return response.json();
}

export async function calculatePortfolioRisk(positions: unknown[]): Promise<RiskResponse> {
  const response = await fetch(`${RISK_API_BASE_URL}/api/risk/calculate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ positions }),
  });

  if (!response.ok) {
    throw new Error(`Risk calculation failed: ${response.statusText}`);
  }

  return response.json();
}
