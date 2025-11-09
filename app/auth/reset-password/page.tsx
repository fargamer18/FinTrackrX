"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const disabled = !token || !password || password !== confirm || loading;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) {
      setError('Reset token missing. Please use the link from your email.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to reset password');
      setMessage(json.message || 'Password reset successful!');
      setTimeout(() => router.push('/login'), 1200);
    } catch (e: any) {
      setError(e.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-800 rounded-xl items-center justify-center mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <p className="text-sm text-gray-400 mt-2">Choose a new password for your account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {!token && (
            <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">
              ⚠️ Invalid or missing reset token. Please use the link from your email.
            </div>
          )}
          <label className="block">
            <span className="text-sm font-medium text-gray-300">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
            />
          </label>

          {message && (
            <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">✅ {message}</div>
          )}
          {error && (
            <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">⚠️ {error}</div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            {loading ? '⏳ Resetting…' : 'Reset password'}
          </button>

          <div className="text-center text-sm text-gray-400">
            <a href="/login" className="text-white font-medium hover:underline">Back to login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
