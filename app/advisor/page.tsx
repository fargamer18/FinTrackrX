"use client";

import { useEffect, useMemo, useState } from "react";
import { useFinance } from "@/components/FinanceProvider";
import { formatCurrency } from "@/lib/finance";

export default function AdvisorPage() {
  const { data } = useFinance();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiSource, setAiSource] = useState<'ai' | 'fallback' | null>(null);

  // Action Plan
  type ActionItem = { id: string; text: string; due?: string; done: boolean };
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [newActionText, setNewActionText] = useState("");
  const [newActionDue, setNewActionDue] = useState("");

  // AI Health & Recs
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthSummary, setHealthSummary] = useState<string>("");
  const [healthLoading, setHealthLoading] = useState<boolean>(false);
  const [healthSource, setHealthSource] = useState<'ai' | 'fallback' | null>(null);
  const [recommendations, setRecommendations] = useState<{ title: string; desc: string }[]>([]);
  const [recsLoading, setRecsLoading] = useState<boolean>(false);
  const [recsSource, setRecsSource] = useState<'ai' | 'fallback' | null>(null);

  // Derived metrics
  const savingsRate = useMemo(() => (
    data.monthlyIncome > 0
      ? ((data.monthlyIncome - data.monthlyExpenses) / data.monthlyIncome) * 100
      : 0
  ), [data.monthlyIncome, data.monthlyExpenses]);

  const expenseRatio = useMemo(() => (
    data.monthlyIncome > 0
      ? (data.monthlyExpenses / data.monthlyIncome) * 100
      : 100
  ), [data.monthlyIncome, data.monthlyExpenses]);
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", desc: "Outstanding financial health" };
    if (score >= 60) return { text: "Good", desc: "Above average" };
    if (score >= 40) return { text: "Fair", desc: "Room for improvement" };
    return { text: "Needs Work", desc: "Requires attention" };
  };

  const status = getHealthStatus(Math.round(healthScore ?? 0));

  // Load & persist Action Plan
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('actionPlan');
      if (saved) {
        setActionItems(JSON.parse(saved));
      } else {
        setActionItems([
          { id: crypto.randomUUID(), text: 'Review recurring subscriptions', due: 'This week', done: false },
          { id: crypto.randomUUID(), text: 'Set up automatic savings (SIP)', due: 'This month', done: false },
        ]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('actionPlan', JSON.stringify(actionItems)); } catch {}
  }, [actionItems]);

  const addActionItem = () => {
    const text = newActionText.trim();
    if (!text) return;
    setActionItems(prev => [
      { id: crypto.randomUUID(), text, due: newActionDue || undefined, done: false },
      ...prev,
    ]);
    setNewActionText("");
    setNewActionDue("");
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const removeActionItem = (id: string) => {
    setActionItems(prev => prev.filter(i => i.id !== id));
  };

  // Fetch AI health & recommendations
  useEffect(() => {
    const payload = {
      monthlyIncome: data.monthlyIncome,
      monthlyExpenses: data.monthlyExpenses,
      balance: data.balance,
      savingsRate,
      expenseRatio,
      transactions: data.transactions?.slice(0, 25) || [],
    };

    const fetchHealth = async () => {
      setHealthLoading(true);
      try {
        const res = await fetch('/api/ai/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ financialData: payload }),
        });
        const json = await res.json();
        if (typeof json.score === 'number') setHealthScore(Math.round(json.score));
        if (json.summary) setHealthSummary(json.summary);
        setHealthSource(json.source || null);
      } catch (_) {
        // heuristic fallback
        let score = 50;
        if (savingsRate >= 30) score += 30;
        else if (savingsRate >= 20) score += 25;
        else if (savingsRate >= 10) score += 15;
        else if (savingsRate > 0) score += 5;
        if (expenseRatio <= 50) score += 20;
        else if (expenseRatio <= 70) score += 10;
        score = Math.min(100, Math.max(0, score));
        setHealthScore(score);
        setHealthSummary('Heuristic score based on savings rate and expense ratio.');
        setHealthSource('fallback');
      } finally {
        setHealthLoading(false);
      }
    };

    const fetchRecs = async () => {
      setRecsLoading(true);
      try {
        const res = await fetch('/api/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ financialData: payload }),
        });
        const json = await res.json();
        if (Array.isArray(json.items) && json.items.length > 0) {
          setRecommendations(json.items);
        } else {
          throw new Error('No items');
        }
        setRecsSource(json.source || null);
      } catch (_) {
        const recs: { title: string; desc: string }[] = [];
        if (savingsRate < 20) {
          recs.push({
            title: 'Boost Savings Rate',
            desc: `Aim to save ${formatCurrency(Math.max(0, Math.round(data.monthlyIncome * 0.2 - (data.monthlyIncome - data.monthlyExpenses))))} more monthly`,
          });
        }
        if (data.monthlyExpenses > data.monthlyIncome * 0.7) {
          recs.push({ title: 'Reduce Monthly Expenses', desc: 'Try to cut expenses by 10-15%' });
        }
        if (recs.length === 0) {
          recs.push({ title: 'Build Emergency Fund', desc: `Target 6 months expenses: ${formatCurrency(data.monthlyExpenses * 6)}` });
          recs.push({ title: 'Consider Investments', desc: 'Explore SIPs and mutual funds for surplus income' });
        }
        setRecommendations(recs);
        setRecsSource('fallback');
      } finally {
        setRecsLoading(false);
      }
    };

    fetchHealth();
    fetchRecs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.monthlyIncome, data.monthlyExpenses, data.balance, data.transactions]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer("");
    setAiSource(null);
    
    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          financialData: {
            monthlyIncome: data.monthlyIncome,
            monthlyExpenses: data.monthlyExpenses,
            balance: data.balance,
            savingsRate,
            transactionCount: data.transactions.length,
          },
        }),
      });

      const result = await response.json();
      
      if (result.answer) {
        setAnswer(result.answer);
        setAiSource(result.source);
      } else {
        setAnswer("Sorry, I couldn't generate a response. Please try again.");
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer("Sorry, there was an error processing your question. Please try again.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Financial Advisor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized financial insights and recommendations
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Financial Health Score
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {healthLoading || healthScore === null ? '—' : Math.round(healthScore)}
              </div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-600 dark:bg-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${healthScore ?? 0}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {healthLoading ? 'Analyzing...' : `${status.text} • ${status.desc}`}
                  {healthSource && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{healthSource === 'ai' ? 'AI' : 'Fallback'}</span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {healthLoading ? 'Generating AI summary of your financial health…' : (healthSummary || 'Summary unavailable.')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Smart Recommendations</h3>
          </div>
          {recsLoading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">Generating personalized recommendations…</div>
          ) : (
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-gray-600 dark:text-gray-400 mt-1">•</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{rec.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {recsSource && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">Source: {recsSource === 'ai' ? 'AI' : 'Fallback'}</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Action Plan</h3>
          </div>
          <div className="mb-3 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newActionText}
              onChange={(e) => setNewActionText(e.target.value)}
              placeholder="Add an action item (e.g., Review subscriptions)"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
            <input
              type="text"
              value={newActionDue}
              onChange={(e) => setNewActionDue(e.target.value)}
              placeholder="Due (e.g., This week)"
              className="sm:w-48 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
            <button
              onClick={addActionItem}
              className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium disabled:opacity-50"
              disabled={!newActionText.trim()}
            >
              Add
            </button>
          </div>
          <div className="space-y-3">
            {actionItems.length === 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">No action items yet. Add your first task above.</div>
            )}
            {actionItems.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={item.done}
                  onChange={() => toggleActionItem(item.id)}
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.text}</p>
                  {item.due && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due {item.due}</p>
                  )}
                </div>
                <button
                  onClick={() => removeActionItem(item.id)}
                  className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💬</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">Ask Your AI Advisor</h3>
          {aiSource === 'ai' && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">Powered by Gemini</span>}
        </div>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && handleAskQuestion()}
            placeholder="Ask any financial question..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳" : "Ask"}
          </button>
        </div>
        {loading && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="animate-spin text-xl">🤖</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Thinking...</p>
            </div>
          </div>
        )}
        {answer && !loading && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{answer}</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setQuestion("How much should I save every month?")}
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            💰 Savings advice
          </button>
          <button
            onClick={() => setQuestion("What investments should I consider?")}
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            📈 Investment tips
          </button>
          <button
            onClick={() => setQuestion("How to reduce my expenses?")}
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            💳 Budget help
          </button>
          <button
            onClick={() => setQuestion("How to save tax?")}
            className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            📋 Tax planning
          </button>
        </div>
      </div>
    </div>
  );
}
