"use client";

import { useFinance } from "@/components/FinanceProvider";
import { formatCurrency } from "@/lib/finance";

export default function InsightsPage() {
  const { data } = useFinance();

  // Calculate spending by category
  const categorySpending = data.transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const categoryData = Object.entries(categorySpending)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const colors = [
    "bg-blue-600 dark:bg-blue-500",
    "bg-blue-500 dark:bg-blue-400",
    "bg-blue-400 dark:bg-blue-300",
    "bg-blue-300 dark:bg-blue-200",
    "bg-blue-200 dark:bg-blue-100",
  ];

  // Calculate savings rate - ensure consistent rounding
  const savings = data.monthlyIncome - data.monthlyExpenses;
  const savingsRate = data.monthlyIncome > 0
    ? Math.round((savings / data.monthlyIncome) * 100)
    : 0;

  // Calculate average daily spend - use fixed value for hydration consistency
  const avgDailySpend = Math.round(data.monthlyExpenses / 30);

  // Calculate budget adherence (if monthly expenses are less than income, it's good)
  // Use Math.floor to ensure consistency
  const expenseRatio = data.monthlyIncome > 0 ? data.monthlyExpenses / data.monthlyIncome : 0;
  const budgetAdherence = Math.min(100, Math.floor((1 - expenseRatio) * 100));

  // Get last 6 months data (simplified - using current data as proxy)
  // Use fixed calculations to prevent hydration mismatches
  const baseValue = Math.round(data.monthlyIncome / 1000); // Round to avoid floating point issues
  const monthlyTrendData = [
    { month: "Jan", value: Math.round((baseValue * 65) / 100) },
    { month: "Feb", value: Math.round((baseValue * 78) / 100) },
    { month: "Mar", value: Math.round((baseValue * 85) / 100) },
    { month: "Apr", value: Math.round((baseValue * 72) / 100) },
    { month: "May", value: Math.round((baseValue * 90) / 100) },
    { month: "Jun", value: Math.round((baseValue * 82) / 100) },
  ];
  const maxValue = Math.max(...monthlyTrendData.map((d) => d.value), 1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Insights & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize your financial trends and patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h2>
          <div className="space-y-4">
            {categoryData.length > 0 ? (
              categoryData.map((category, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[idx] || "bg-blue-600"} rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No expense data yet
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Trend
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyTrendData.map((data, idx) => {
              // Calculate percentage height and round to 2 decimal places for consistency
              const heightPercent = Math.round((data.value / maxValue) * 10000) / 100;
              const displayAmount = Math.round(data.value * 1000);
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-t-lg relative group cursor-pointer">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
                      style={{ height: `${heightPercent}%` }}
                      suppressHydrationWarning
                    ></div>
                    <div 
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                      suppressHydrationWarning
                    >
                      {formatCurrency(displayAmount)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">📈</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings Rate</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" suppressHydrationWarning>
                {savingsRate}%
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs improvement"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Budget Adherence
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" suppressHydrationWarning>
                {budgetAdherence}%
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {budgetAdherence >= 80 ? "Excellent control" : "On track"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Daily Spend
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" suppressHydrationWarning>
                {formatCurrency(avgDailySpend)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Income vs Expenses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Income</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {formatCurrency(data.monthlyIncome)}
              </span>
            </div>
            <div className="h-4 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 dark:bg-green-500 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expenses</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatCurrency(data.monthlyExpenses)}
              </span>
            </div>
            <div className="h-4 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 dark:bg-red-500 rounded-full"
                style={{
                  width: `${
                    data.monthlyIncome > 0
                      ? Math.min(100, (data.monthlyExpenses / data.monthlyIncome) * 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">Net Savings</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {data.monthlyIncome - data.monthlyExpenses >= 0 ? "+" : ""}
              {formatCurrency(data.monthlyIncome - data.monthlyExpenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
