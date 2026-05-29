"use client";

import { useState, useEffect } from "react";

export default function HitStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/hitstats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch (err) {
      console.error("Load stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReset = async () => {
    if (!confirm("Reset semua statistik? Data akan hilang permanen.")) return;
    try {
      const token = localStorage.getItem("admin_token");
      await fetch("/api/admin/hitstats", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadStats();
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Hit Statistics</h1>
          <p className="text-sm text-dark-400 mt-1">Detail statistik pengunjung website</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 border border-dark-600 text-dark-300 text-sm font-medium hover:text-dark-100 hover:border-dark-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm font-medium hover:bg-neon-red/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="solid-card rounded-xl p-5">
              <div className="h-4 skeleton rounded w-1/2 mb-3" />
              <div className="h-8 skeleton rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Page Views", value: stats.totalPageViews, color: "text-neon-blue", bg: "bg-neon-blue/10" },
              { label: "Total Visitors", value: stats.totalVisitors, color: "text-neon-green", bg: "bg-neon-green/10" },
              { label: "Hari Ini (PV)", value: stats.todayPageViews, color: "text-accent-400", bg: "bg-accent-400/10" },
              { label: "Hari Ini (Visitors)", value: stats.todayVisitors, color: "text-neon-orange", bg: "bg-neon-orange/10" },
            ].map((s, i) => (
              <div key={i} className="solid-card rounded-xl p-5">
                <span className="text-xs text-dark-400 font-medium">{s.label}</span>
                <p className={`text-3xl font-extrabold mt-2 ${s.color}`}>{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Daily Table */}
          {stats.dailyData?.length > 0 && (
            <div className="solid-card rounded-xl overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                <h2 className="text-sm font-bold text-dark-100">Data Harian</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                      <th className="text-left px-6 py-3 text-xs font-medium text-dark-400">Tanggal</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-400">Page Views</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-400">Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailyData.map((day) => (
                      <tr key={day.date} className="hover:bg-dark-800/50 transition-colors" style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                        <td className="px-6 py-3 text-dark-200">{day.date}</td>
                        <td className="px-6 py-3 text-right text-dark-100 font-bold">{day.pageViews.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right text-dark-100 font-bold">{day.visitors.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top Pages */}
          {stats.topPages?.length > 0 && (
            <div className="solid-card rounded-xl overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                <h2 className="text-sm font-bold text-dark-100">Top 20 Halaman</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                      <th className="text-left px-6 py-3 text-xs font-medium text-dark-400 w-10">#</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-dark-400">Halaman</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-dark-400">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topPages.map((p, i) => (
                      <tr key={p.path} className="hover:bg-dark-800/50 transition-colors" style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                        <td className="px-6 py-3 text-dark-500 font-medium">{i + 1}</td>
                        <td className="px-6 py-3 text-dark-200 font-mono text-xs">{p.path}</td>
                        <td className="px-6 py-3 text-right text-accent-400 font-bold">{p.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="solid-card rounded-xl p-12 text-center">
          <p className="text-dark-400">Tidak ada data statistik</p>
        </div>
      )}
    </div>
  );
}
