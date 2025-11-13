"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, completeTotp, startEmailOtp, completeEmailOtp, completeRecovery } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [totp, setTotp] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [mfaMethod, setMfaMethod] = useState<'totp' | 'email' | 'recovery'>('totp');
  const [emailSent, setEmailSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res === true) {
      router.push("/dashboard");
      return;
    }
    if (res && (res as any).mfa_required) {
      setMfaToken((res as any).mfa_token);
      return;
    }
    setError("Invalid credentials. Try signing up if you don't have an account.");
  }

  async function onSubmitMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!mfaToken) return;
    setError(null);
    setLoading(true);
    let ok = false;
    if (mfaMethod === 'totp') {
      ok = await completeTotp(mfaToken, totp);
      if (!ok) setError('Invalid authenticator code.');
    } else if (mfaMethod === 'email') {
      ok = await completeEmailOtp(mfaToken, emailCode);
      if (!ok) setError('Invalid email code.');
    } else if (mfaMethod === 'recovery') {
      ok = await completeRecovery(mfaToken, recoveryCode.trim());
      if (!ok) setError('Invalid recovery code.');
    }
    setLoading(false);
    if (ok) router.push('/dashboard');
  }

  async function onSendEmailCode() {
    if (!mfaToken) return;
    setError(null);
    setLoading(true);
    const ok = await startEmailOtp(mfaToken);
    setLoading(false);
    if (ok) {
      setEmailSent(true);
    } else {
      setError('Could not send email code. Try again later.');
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-800 rounded-xl items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-2">Sign in to your account</p>
        </div>
  {!mfaToken ? (
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

          <label className="block">
            <span className="text-sm font-medium text-gray-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
            />
          </label>

          {error && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">⚠️ {error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "⏳ Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-white font-medium hover:underline">
              Create account
            </a>
            <span className="mx-2 text-gray-600">•</span>
            <a href="/auth/forgot-password" className="text-gray-300 hover:text-white underline underline-offset-2">
              Forgot password?
            </a>
          </div>
        </form>
        ) : (
        <form onSubmit={onSubmitMfa} className="space-y-5">
          <div className="text-sm text-gray-300 space-y-2">
            <div>Two‑factor authentication required. Choose a method:</div>
            <div className="flex gap-2 text-xs">
              {['totp','email','recovery'].map(m => (
                <button type="button" key={m} onClick={()=>setMfaMethod(m as any)} className={`px-3 py-1.5 rounded-md border ${mfaMethod===m?'bg-gray-100 text-gray-900 border-gray-300':'bg-gray-800 text-gray-300 border-gray-700'}`}>{m==='totp'?'Authenticator': m==='email'?'Email Code':'Recovery Code'}</button>
              ))}
            </div>
          </div>
          {mfaMethod === 'totp' && (
            <label className="block">
              <span className="text-sm font-medium text-gray-300">6‑digit authenticator code</span>
              <input
                type="text"
                value={totp}
                onChange={(e) => setTotp(e.target.value)}
                required
                maxLength={6}
                className="mt-1 tracking-widest text-center block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
              />
              <p className="mt-2 text-xs text-gray-400">Open Google Authenticator / Authy – the code refreshes every 30s.</p>
            </label>
          )}
          {mfaMethod === 'email' && (
            <div className="space-y-3">
              {!emailSent && (
                <button type="button" onClick={onSendEmailCode} disabled={loading} className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50">{loading? 'Sending...' : 'Send email code'}</button>
              )}
              {emailSent && (
                <label className="block">
                  <span className="text-sm font-medium text-gray-300">Enter code sent to your email</span>
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e)=>setEmailCode(e.target.value)}
                    required
                    maxLength={6}
                    className="mt-1 tracking-widest text-center block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-400">Check your inbox (and spam). Code expires in 10 minutes.</p>
                </label>
              )}
            </div>
          )}
          {mfaMethod === 'recovery' && (
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Recovery code</span>
              <input
                type="text"
                value={recoveryCode}
                onChange={(e)=>setRecoveryCode(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
              />
              <p className="mt-2 text-xs text-amber-400">Single‑use. After login, generate new codes in Settings.</p>
            </label>
          )}

          {error && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">⚠️ {error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            disabled={loading || (mfaMethod==='email' && emailSent && emailCode.length<6) || (mfaMethod==='totp' && totp.length<6) || (mfaMethod==='recovery' && recoveryCode.length<6)}
          >
            {loading ? '⏳ Verifying...' : 'Verify & Sign in'}
          </button>
          <div className="text-center text-xs text-gray-500 space-y-1">
            <div>Need authenticator? Set up under Settings → Two‑Factor Authentication.</div>
            <div><a href="/auth/forgot-password" className="text-gray-300 hover:text-white underline underline-offset-2">Forgot password?</a></div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
