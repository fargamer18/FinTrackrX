import { NextRequest, NextResponse } from 'next/server';

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

    // Fallback basic recs
    const buildFallback = () => {
      const items: { title: string; desc: string }[] = [];
      if (financialData.savingsRate < 20) {
        const needed = Math.max(0, Math.round(financialData.monthlyIncome * 0.2 - (financialData.monthlyIncome - financialData.monthlyExpenses)));
        items.push({ title: 'Boost Savings Rate', desc: `Aim to save ₹${needed.toLocaleString()} more monthly by reducing discretionary spends and automating transfers.` });
      }
      if (financialData.expenseRatio > 70) {
        items.push({ title: 'Trim Expense Ratio', desc: 'Target expense ratio below 70% by renegotiating bills, cutting subscriptions, and setting category caps.' });
      }
      if (items.length === 0) {
        items.push({ title: 'Build Emergency Fund', desc: `Target 6 months expenses: ₹${(financialData.monthlyExpenses * 6).toLocaleString()}. Park in liquid funds.` });
        items.push({ title: 'Systematic Investing', desc: 'Start/scale a SIP in diversified index funds for long-term goals.' });
      }
      return items;
    };

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ items: buildFallback(), source: 'fallback' });
    }

    const condensedTx = financialData.transactions.slice(0, 25).map(t => `${t.type} ${t.category} ₹${t.amount}`).join('\n');
    const prompt = `You are a personal finance coach for Indian users. Based on the user's data and spending patterns, return JSON with an array "items" of 3-6 prioritized recommendations, each with {"title": string, "desc": string}. Keep advice practical and specific. No markdown.

User Data:
Income: ₹${financialData.monthlyIncome.toLocaleString()}  |  Expenses: ₹${financialData.monthlyExpenses.toLocaleString()}  |  Savings Rate: ${financialData.savingsRate.toFixed(1)}%  |  Expense Ratio: ${financialData.expenseRatio.toFixed(1)}%
Recent Transactions (up to 25):\n${condensedTx || 'None'}

Return ONLY valid JSON like {"items":[{"title":"...","desc":"..."}, ...]}.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [ { role: 'user', parts: [ { text: prompt } ] } ],
        generationConfig: { maxOutputTokens: 280, temperature: 0.5, topP: 0.9 }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini recs error:', err);
      return NextResponse.json({ items: buildFallback(), source: 'fallback' });
    }

    const result = await response.json();
    let text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    try {
      text = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed.items) ? parsed.items : [];
      if (items.length > 0) return NextResponse.json({ items, source: 'ai' });
      return NextResponse.json({ items: buildFallback(), source: 'fallback' });
    } catch (e) {
      console.warn('Failed to parse recs JSON; using fallback.', text);
      return NextResponse.json({ items: buildFallback(), source: 'fallback' });
    }
  } catch (error) {
    console.error('Recommendations endpoint error', error);
    return NextResponse.json({ items: [
      { title: 'Stabilize Finances', desc: 'Reduce high-variance expenses and set category caps to improve predictability.' },
      { title: 'Automate Savings', desc: 'Set an auto-transfer the day income arrives; start with 10–20%.' },
    ], source: 'fallback' });
  }
}