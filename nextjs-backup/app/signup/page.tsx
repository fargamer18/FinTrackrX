"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = await signup(name, email, password);
    setLoading(false);
    if (ok) {
      router.push("/dashboard");
    } else {
      setError("An account already exists with this email.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-md bg-gray-900 rounded-xl border border-gray-800 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gray-800 rounded-xl items-center justify-center mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-sm text-gray-400 mt-2">Start tracking your finances</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-300">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2.5 focus:ring-2 focus:ring-gray-600 focus:border-transparent placeholder-gray-400"
            />
          </label>

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
            {loading ? "⏳ Creating account..." : "Create account"}
          </button>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-white font-medium hover:underline">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
