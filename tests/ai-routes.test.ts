import { describe, it, expect } from 'vitest';
import { POST as healthPost } from '@/app/api/ai/health/route';
import { POST as recsPost } from '@/app/api/ai/recommendations/route';

describe('AI Health & Recommendations Routes', () => {
  it('health route returns heuristic fallback score when no API key', async () => {
    process.env.GEMINI_API_KEY = '';
    const financialData = {
      monthlyIncome: 100000,
      monthlyExpenses: 50000,
      balance: 50000,
      savingsRate: 50,
      expenseRatio: 50,
      transactions: [],
    };
    const req: any = { json: async () => ({ financialData }) };
    const res = await healthPost(req);
    const data = await res.json();
    expect(data.source).toBe('fallback');
    expect(data.score).toBe(100); // 50 base + 30 savings + 20 expense ratio capped at 100
    expect(typeof data.summary).toBe('string');
  });

  it('recommendations route returns fallback items when no API key', async () => {
    process.env.GEMINI_API_KEY = '';
    const financialData = {
      monthlyIncome: 100000,
      monthlyExpenses: 90000,
      balance: 10000,
      savingsRate: 10,
      expenseRatio: 90,
      transactions: [],
    };
    const req: any = { json: async () => ({ financialData }) };
    const res = await recsPost(req);
    const data = await res.json();
    expect(data.source).toBe('fallback');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items.some((i: any) => /boost savings/i.test(i.title))).toBe(true);
  });
});
