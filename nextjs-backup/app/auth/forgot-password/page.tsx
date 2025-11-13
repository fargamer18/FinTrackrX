"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Request failed');
      setMessage(json.message || 'If an account exists with that email, a password reset link has been sent.');
    } catch (e: any) {
      setError(e.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-800 rounded-xl items-center justify-center mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot password</h1>
          <p className="text-sm text-gray-400 mt-2">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
          >
            {loading ? '⏳ Sending…' : 'Send reset link'}
          </button>

          <div className="text-center text-sm text-gray-400">
            Remembered your password? <a href="/login" className="text-white font-medium hover:underline">Back to login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
