"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", data.username);
        router.push("/admin");
      } else {
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-dark-950)" }}>
      <div className="w-full max-w-sm">
        <div className="solid-card rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-accent-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-dark-100">Admin Panel</h1>
            <p className="text-sm text-dark-400 mt-1">ManhwaIndo CMS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm placeholder-dark-400 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="Masukkan password"
                required
              />
            </div>

            {error && <div className="px-4 py-2.5 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs font-medium">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
