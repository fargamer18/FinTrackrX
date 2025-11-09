import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/login/page';
import SignupPage from '../app/signup/page';
import DashboardPage from '../app/dashboard/page';
import InvestmentsPage from '../app/investments/page';
import AdvisorPage from '../app/advisor/page';
import * as advisorApi from '../app/api/ai/advisor/route';
import { AuthProvider } from '../components/AuthProvider';
import { FinanceProvider } from '../components/FinanceProvider';

// Mock next/navigation for usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Auth tests

describe('Auth Pages', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders signup form', () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});

// Dashboard

describe('Dashboard', () => {
  it('renders dashboard page', () => {
    render(
      <AuthProvider>
        <FinanceProvider>
          <DashboardPage />
        </FinanceProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});

// Investments

describe('Investments', () => {
  it('renders investments page', async () => {
    // Mock fetch for /api/investments
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ investments: [] }),
    });
    render(
      <AuthProvider>
        <FinanceProvider>
          <InvestmentsPage />
        </FinanceProvider>
      </AuthProvider>
    );
    // Wait for the page to finish loading
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /investments/i, level: 1 })).toBeInTheDocument();
    });
  });
});

// Advisor

describe('Advisor', () => {
  it('renders advisor page', () => {
    render(
      <AuthProvider>
        <FinanceProvider>
          <AdvisorPage />
        </FinanceProvider>
      </AuthProvider>
    );
    expect(screen.getByText(/ai advisor/i)).toBeInTheDocument();
  });
});

// API route fallback test

describe('AI Advisor API', () => {
  it('returns fallback if no API key', async () => {
    const req = { json: async () => ({ question: 'How to save?', financialData: { monthlyIncome: 10000, monthlyExpenses: 8000 } }) } as any;
    // Remove env key
    process.env.GEMINI_API_KEY = '';
    const res = await advisorApi.POST(req);
    const data = await res.json();
    expect(data.source).toBe('fallback');
    expect(data.answer).toMatch(/save/i);
  });
});
