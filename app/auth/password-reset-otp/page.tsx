"use client";

import { useState } from 'react';

type Step = 'request' | 'verify';

export default function PasswordResetOtpPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-otp/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j.error || 'Failed to send code');
      }
      setMessage('If that email exists, a code was sent.');
      setStep('verify');
    } catch (err:any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMessage(null);
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password-otp/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, new_password: password })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update password');
      setMessage('Password updated. You can now log in.');
    } catch (err:any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-800 rounded-xl items-center justify-center mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Password Reset (Email Code)</h1>
          <p className="text-sm text-gray-400 mt-2">{step === 'request' ? 'Enter your account email to receive a code' : 'Enter the code we emailed and choose a new password'}</p>
        </div>

        {step === 'request' && (
          <form onSubmit={requestCode} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Email</span>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400" />
            </label>
            {message && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">✅ {message}</div>}
            {error && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">⚠️ {error}</div>}
            <button disabled={loading || !email} className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">{loading ? 'Sending…' : 'Send code'}</button>
            <div className="text-center text-sm text-gray-400"><a href="/login" className="text-white font-medium hover:underline">Back to login</a></div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyCode} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Email</span>
              <input type="email" value={email} disabled className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800/60 text-gray-400 px-4 py-2.5" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Code</span>
              <input value={code} onChange={e=>setCode(e.target.value)} required pattern="[0-9]{6}" maxLength={6} className="mt-1 tracking-widest text-center text-lg block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">New password</span>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-300">Confirm password</span>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5" />
            </label>
            {message && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">✅ {message}</div>}
            {error && <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700">⚠️ {error}</div>}
            <button disabled={loading || !code || !password || password !== confirm} className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">{loading ? 'Updating…' : 'Update password'}</button>
            <div className="text-center text-sm text-gray-400"><button type="button" onClick={()=>{setStep('request'); setMessage(null); setError(null);}} className="text-white font-medium hover:underline">Resend code</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
