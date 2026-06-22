"use client";

import { useState } from "react";

export default function PasscodeGate() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/family-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: value }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("密码错误，请重试");
      setValue("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🌸</div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Chi 家庭动态站</h1>
        <p className="text-sm text-gray-400 mb-8">仅供家人阅览 · 请输入访问密码</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="请输入密码"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !value}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "验证中…" : "进入"}
          </button>
        </form>
      </div>
    </div>
  );
}
