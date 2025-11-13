"use client";

import { useState, useMemo } from "react";
import { useFinance } from "@/components/FinanceProvider";
import { TransactionModal } from "@/components/TransactionModal";
import { FinanceBarChart } from "@/components/charts/FinanceBarChart";
import { ExpensePieChart } from "@/components/charts/ExpensePieChart";
import { formatCurrency } from "@/lib/finance";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export default function DashboardPage() {
  const { data, deleteTransaction } = useFinance();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const recentTransactions = data.transactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  // Prepare monthly data for bar chart (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthTransactions = data.transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: format(date, "MMM yyyy"),
        income,
        expense,
        net: income - expense,
      });
    }
    return months;
  }, [data.transactions]);

  // Prepare category data for pie chart (current month expenses)
  const categoryData = useMemo(() => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const expenses = data.transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        t.type === "expense" &&
        transactionDate >= currentMonthStart &&
        transactionDate <= currentMonthEnd
      );
    });

    const categoryMap: { [key: string]: number } = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const colors = [
      "#6b7280", // gray-500
      "#9ca3af", // gray-400
      "#4b5563", // gray-600
      "#d1d5db", // gray-300
      "#374151", // gray-700
      "#e5e7eb", // gray-200
      "#1f2937", // gray-800
      "#f3f4f6", // gray-100
    ];

    return Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [data.transactions]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your income, expenses, and financial health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</h3>
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(data.balance)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(data.monthlyIncome - data.monthlyExpenses)} this month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</h3>
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">�</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(data.monthlyIncome)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Expected this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</h3>
            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">�</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(data.monthlyExpenses)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data.monthlyIncome > 0
              ? `${Math.round((data.monthlyExpenses / data.monthlyIncome) * 100)}% of budget used`
              : "No income tracked"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceBarChart data={monthlyData} />
        {categoryData.length > 0 && <ExpensePieChart data={categoryData} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{transaction.type === "income" ? "💰" : "💸"}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={() => deleteTransaction(transaction.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="text-2xl mb-2">💵</div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Add Income</p>
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Add Expense</p>
            </button>
            <button
              onClick={() => window.location.href = "/insights"}
              className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">View Reports</p>
            </button>
            <button
              onClick={() => window.location.href = "/advisor"}
              className="p-4 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="text-2xl mb-2">🤖</div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">AI Advisor</p>
            </button>
          </div>
        </div>
      </div>

      <TransactionModal
        type="income"
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
      />
      <TransactionModal
        type="expense"
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
}
