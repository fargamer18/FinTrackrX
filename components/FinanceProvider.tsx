"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, FinancialData } from "@/lib/finance";

interface FinanceContextType {
  data: FinancialData;
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  deleteTransaction: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialData: FinancialData = {
  balance: 125000,
  monthlyIncome: 75000,
  monthlyExpenses: 45000,
  transactions: [
    {
      id: "1",
      type: "income",
      category: "Salary",
      amount: 75000,
      description: "Monthly Salary",
      date: new Date().toISOString(),
    },
    {
      id: "2",
      type: "expense",
      category: "Rent/EMI",
      amount: 25000,
      description: "House Rent",
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      type: "expense",
      category: "Groceries",
      amount: 8000,
      description: "Monthly Groceries",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: "4",
      type: "expense",
      category: "Utilities",
      amount: 5000,
      description: "Electricity & Water Bill",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "5",
      type: "expense",
      category: "Transport",
      amount: 4000,
      description: "Fuel & Commute",
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: "6",
      type: "expense",
      category: "Healthcare",
      amount: 3000,
      description: "Medical Expenses",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // Always start with initialData to ensure server/client consistency
  const [data, setData] = useState<FinancialData>(initialData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage after mount (client-side only)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("financeData");
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setData(parsedData);
        } catch {
          // If parsing fails, keep initialData
        }
      }
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("financeData", JSON.stringify(data));
    }
  }, [data]);

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    setData((prev) => {
      const updated = {
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
      };

      // Recalculate totals
      const { income, expenses } = updated.transactions.reduce(
        (acc, t) => {
          if (t.type === "income") {
            acc.income += t.amount;
          } else {
            acc.expenses += t.amount;
          }
          return acc;
        },
        { income: 0, expenses: 0 }
      );

      // Calculate monthly totals (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyTransactions = updated.transactions.filter(
        (t) => new Date(t.date) >= thirtyDaysAgo
      );

      const monthlyIncome = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...updated,
        balance: income - expenses,
        monthlyIncome,
        monthlyExpenses,
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => {
      const updated = {
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      };

      // Recalculate totals
      const { income, expenses } = updated.transactions.reduce(
        (acc, t) => {
          if (t.type === "income") {
            acc.income += t.amount;
          } else {
            acc.expenses += t.amount;
          }
          return acc;
        },
        { income: 0, expenses: 0 }
      );

      // Calculate monthly totals
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyTransactions = updated.transactions.filter(
        (t) => new Date(t.date) >= thirtyDaysAgo
      );

      const monthlyIncome = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...updated,
        balance: income - expenses,
        monthlyIncome,
        monthlyExpenses,
      };
    });
  };

  return (
    <FinanceContext.Provider value={{ data, addTransaction, deleteTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
