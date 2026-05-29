"use client";

import { useState, useEffect } from "react";

function useAdminFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}

export default function AdminDashboard() {
  const { data: stats, loading } = useAdminFetch("/api/admin/hitstats");

  const statCards = stats
    ? [
        {
          label: "Total Page Views",
          value: stats.totalPageViews.toLocaleString(),
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
          sub: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
          color: "text-neon-blue",
        },
        {
          label: "Total Visitors",
          value: stats.totalVisitors.toLocaleString(),
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          color: "text-neon-green",
        },
        { label: "Hari ini (PV)", value: stats.todayPageViews.toLocaleString(), icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-accent-400" },
        { label: "Hari ini (Visitors)", value: stats.todayVisitors.toLocaleString(), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "text-neon-orange" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-sm text-dark-400 mt-1">Ringkasan statistik website</p>
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
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="solid-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className={`w-4 h-4 ${s.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                    {s.sub && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.sub} />}
                  </svg>
                  <span className="text-xs text-dark-400 font-medium">{s.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-dark-100">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Daily Chart (simple bar) */}
          {stats?.dailyData?.length > 0 && (
            <div className="solid-card rounded-xl p-6">
              <h2 className="text-sm font-bold text-dark-100 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Statistik Harian (7 Hari Terakhir)
              </h2>
              <div className="space-y-2">
                {stats.dailyData
                  .slice(0, 7)
                  .reverse()
                  .map((day) => {
                    const maxPV = Math.max(...stats.dailyData.slice(0, 7).map((d) => d.pageViews), 1);
                    const pct = Math.max(2, (day.pageViews / maxPV) * 100);
                    return (
                      <div key={day.date} className="flex items-center gap-3">
                        <span className="text-xs text-dark-400 w-20 flex-shrink-0">{day.date}</span>
                        <div className="flex-1 h-6 rounded bg-dark-700 overflow-hidden">
                          <div className="h-full rounded bg-accent-600 flex items-center px-2 transition-all" style={{ width: `${pct}%` }}>
                            <span className="text-[10px] font-bold text-white whitespace-nowrap">{day.pageViews} PV</span>
                          </div>
                        </div>
                        <span className="text-xs text-dark-400 w-16 text-right flex-shrink-0">{day.visitors} vis</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Top Pages */}
          {stats?.topPages?.length > 0 && (
            <div className="solid-card rounded-xl p-6">
              <h2 className="text-sm font-bold text-dark-100 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Halaman Populer
              </h2>
              <div className="space-y-1">
                {stats.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--color-dark-700)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-dark-500 w-5 text-right">{i + 1}</span>
                      <span className="text-sm text-dark-200 truncate">{p.path}</span>
                    </div>
                    <span className="text-xs font-bold text-accent-400 flex-shrink-0 ml-3">{p.views.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
