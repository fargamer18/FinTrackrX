"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { getChartTokens } from './palette';
import { useAuth } from '@/components/AuthProvider';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ExpensePieChartProps {
  data: CategoryData[];
  title?: string;
}

export function ExpensePieChart({ data, title = "💰 Expenses by Category" }: ExpensePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();
  const [userPalette, setUserPalette] = useState<string[] | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains('dark'));
    });
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">₹{payload[0].value.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={isDark ? '#f9fafb' : '#111827'}
        fontSize={12}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={tokens.categorical[index % tokens.categorical.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
          <Legend iconType="circle" formatter={(value) => (
            <span style={{ color: tokens.legendText }}>{value}</span>
          )} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{total.toLocaleString()}</p>
      </div>
    </div>
  );
}
