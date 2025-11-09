import { NextRequest, NextResponse } from 'next/server';

// Reuse Gemini configuration from advisor route for consistency
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_API_VERSION = (process.env.GEMINI_API_VERSION || 'v1beta').trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest').trim();
const GEMINI_API_URL = (process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${GEMINI_MODEL}:generateContent`).trim();

interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  balance: number;
  savingsRate: number;
  expenseRatio: number;
  transactions: { type: string; category: string; amount: number; date: string }[];
}

export async function POST(request: NextRequest) {
  let parsed: { financialData?: FinancialData } = {};
  try {
    parsed = await request.json();
    const { financialData } = parsed;
    if (!financialData) {
      return NextResponse.json({ error: 'financialData is required' }, { status: 400 });
    }

    // Lightweight RAG context: summarize top categories & recent transactions
    const categoryTotals: Record<string, number> = {};
    financialData.transactions.slice(0, 50).forEach(tx => {
      const key = `${tx.type}:${tx.category}`;
      categoryTotals[key] = (categoryTotals[key] || 0) + tx.amount;
    });
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k, v]) => `${k} = ₹${v.toLocaleString()}`)
      .join('\n');

    // Heuristic fallback score if AI unavailable
    const heuristicScore = (() => {
      let score = 50;
      const { savingsRate, expenseRatio } = financialData;
      if (savingsRate >= 30) score += 30; else if (savingsRate >= 20) score += 25; else if (savingsRate >= 10) score += 15; else if (savingsRate > 0) score += 5;
      if (expenseRatio <= 50) score += 20; else if (expenseRatio <= 70) score += 10;
      return Math.min(100, Math.max(0, score));
    })();

    if (!GEMINI_API_KEY) {
      return NextResponse.json({
        score: heuristicScore,
        summary: 'Heuristic score based on savings rate and expense ratio. Set GEMINI_API_KEY to enable AI analysis.',
        source: 'fallback'
      });
    }

    const prompt = `You are an expert financial analyst for Indian personal finance. Given the user's data, produce a JSON response with the following keys: score (0-100 integer), summary (1-2 sentence plain text), and rationale (concise bullet-style explanation). Score criteria: savings rate quality, expense control, balance trend potential. DO NOT wrap in markdown.

User Data:
Monthly Income: ₹${financialData.monthlyIncome.toLocaleString()}
Monthly Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}
Balance: ₹${financialData.balance.toLocaleString()}
Savings Rate: ${financialData.savingsRate.toFixed(1)}%
Expense Ratio: ${financialData.expenseRatio.toFixed(1)}%
Top Categories:\n${topCategories || 'None'}
Recent Transactions (first 10):\n${financialData.transactions.slice(0,10).map(t => `${t.type} ${t.category} ₹${t.amount}`).join('\n')}

Return ONLY valid JSON.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [ { role: 'user', parts: [ { text: prompt } ] } ],
        generationConfig: { maxOutputTokens: 220, temperature: 0.4, topP: 0.9 }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini health error:', err);
      return NextResponse.json({ score: heuristicScore, summary: 'Fallback heuristic applied due to AI error.', source: 'fallback' });
    }

    const result = await response.json();
    let text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    // Attempt to extract JSON
    let json: any = {};
    try {
      // Remove potential markdown fences
      text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      json = JSON.parse(text);
    } catch (e) {
      console.warn('Failed to parse AI JSON, using heuristic.', text);
      return NextResponse.json({ score: heuristicScore, summary: 'AI response unparsable; heuristic used.', source: 'fallback' });
    }

    const score = typeof json.score === 'number' ? Math.min(100, Math.max(0, Math.round(json.score))) : heuristicScore;
    const summary = typeof json.summary === 'string' && json.summary.length > 0 ? json.summary : 'AI generated summary unavailable.';

    return NextResponse.json({ score, summary, source: 'ai' });
  } catch (error) {
    console.error('Health endpoint error', error);
    const { financialData } = parsed;
    let fallbackScore = 50;
    if (financialData) {
      if (financialData.savingsRate >= 30) fallbackScore += 30; else if (financialData.savingsRate >= 20) fallbackScore += 25; else if (financialData.savingsRate >= 10) fallbackScore += 15; else if (financialData.savingsRate > 0) fallbackScore += 5;
      if (financialData.expenseRatio <= 50) fallbackScore += 20; else if (financialData.expenseRatio <= 70) fallbackScore += 10;
      fallbackScore = Math.min(100, Math.max(0, fallbackScore));
    }
    return NextResponse.json({ score: fallbackScore, summary: 'Unexpected error. Heuristic score provided.', source: 'fallback' });
  }
}