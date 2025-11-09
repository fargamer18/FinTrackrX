export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface FinancialData {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactions: Transaction[];
}

const defaultCategories = {
  income: ["Salary", "Freelance", "Investment", "Rental", "Business", "Other"],
  expense: [
    "Groceries",
    "Utilities",
    "Transport",
    "Rent/EMI",
    "Education",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Food & Dining",
    "Insurance",
    "Other",
  ],
};

export const categories = defaultCategories;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}
