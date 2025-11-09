import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../app/login/page';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '@/components/AuthProvider';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/login',
}));

describe('Login page', () => {
  it('renders form fields and submit button', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
  });
});
