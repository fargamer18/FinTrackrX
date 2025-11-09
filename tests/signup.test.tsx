import React from 'react';
import { render, screen } from '@testing-library/react';
import SignupPage from '../app/signup/page';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '@/components/AuthProvider';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/signup',
}));

describe('Signup page', () => {
  it('renders name, email and password fields and submit button', () => {
    render(
      <AuthProvider>
        <SignupPage />
      </AuthProvider>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
  });
});
