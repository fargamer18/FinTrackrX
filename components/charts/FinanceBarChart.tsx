"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { getChartTokens } from './palette';
import { useAuth } from '@/components/AuthProvider';
import { format } from 'date-fns';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  net: number;
}

interface FinanceBarChartProps {
  data: MonthlyData[];
  title?: string;
}

export function FinanceBarChart({ data, title = "📊 Monthly Income vs Expenses" }: FinanceBarChartProps) {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();
  const [userPalette, setUserPalette] = useState<string[] | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
    const observer = new MutationObserver(() => setIsDark(html.classList.contains('dark')));
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const fetchPalette = async () => {
      try {
        if (!user) return;
        const resp = await fetch('/api/settings');
        if (!resp.ok) return;
        const data = await resp.json();
        const cat = data?.settings?.chart_palette?.categorical;
        if (Array.isArray(cat) && cat.length) setUserPalette(cat);
      } catch {}
    };
    fetchPalette();
  }, [user]);

  const tokens = getChartTokens(isDark, { categorical: userPalette || undefined });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💵 Income: ₹{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💳 Expense: ₹{payload[1].value.toLocaleString()}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-2">
            Net: ₹{(payload[0].value - payload[1].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.grid} />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fill: tokens.axisTick }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: tokens.axisTick }}
            tickFormatter={(value: number) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
          <Legend formatter={(value) => <span style={{ color: tokens.legendText }}>{value}</span>} />
          <Bar dataKey="income" fill={tokens.income} name="Income" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill={tokens.expense} name="Expense" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
