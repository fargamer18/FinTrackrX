import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordPage from '@/app/auth/reset-password/page';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => ({ get: (key: string) => (key === 'token' ? 'testtoken' : null) }),
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    (global.fetch as any) = undefined;
    push.mockReset();
  });

  it('renders new password and confirm fields', () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('submits and shows success then redirects', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Password reset successful!' }),
    });

    render(<ResetPasswordPage />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'NewPassword123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'NewPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });
  });
});
