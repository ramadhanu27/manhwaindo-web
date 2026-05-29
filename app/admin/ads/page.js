"use client";

import { useState, useEffect } from "react";

const POSITIONS = [
  { value: "header", label: "Header" },
  { value: "sidebar", label: "Sidebar" },
  { value: "content", label: "Di Antara Konten" },
  { value: "footer", label: "Footer" },
  { value: "popup", label: "Popup" },
];

const AD_TYPES = [
  { value: "image", label: "Gambar/Banner" },
  { value: "script", label: "Script/HTML (AdSense dll)" },
];

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("admin_token");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export default function AdsManager() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/admin/ads");
      const json = await res.json();
      if (json.success) setAds(json.data);
    } catch (err) {
      console.error("Load ads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  const handleSave = async (adData) => {
    setSaving(true);
    try {
      if (adData.id) {
        // Update existing
        await fetchWithAuth("/api/admin/ads", {
          method: "PUT",
          body: JSON.stringify(adData),
        });
      } else {
        // Create new
        await fetchWithAuth("/api/admin/ads", {
          method: "POST",
          body: JSON.stringify(adData),
        });
      }
      await loadAds();
      setShowForm(false);
      setEditingAd(null);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus ad ini?")) return;
    try {
      await fetchWithAuth(`/api/admin/ads?id=${id}`, { method: "DELETE" });
      await loadAds();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggle = async (ad) => {
    await fetchWithAuth("/api/admin/ads", {
      method: "PUT",
      body: JSON.stringify({ ...ad, isActive: !ad.isActive }),
    });
    await loadAds();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Ads Manager</h1>
          <p className="text-sm text-dark-400 mt-1">Kelola iklan dan banner website</p>
        </div>
        <button
          onClick={() => {
            setEditingAd(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Ad
        </button>
      </div>

      {/* Ad Form Modal */}
      {showForm && (
        <AdForm
          ad={editingAd}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAd(null);
          }}
          saving={saving}
        />
      )}

      {/* Ads List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="solid-card rounded-xl p-5">
              <div className="flex gap-4">
                <div className="h-5 skeleton rounded w-1/4" />
                <div className="h-5 skeleton rounded w-1/6" />
              </div>
            </div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="solid-card rounded-xl p-12 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <p className="text-dark-400 font-medium">Belum ada iklan</p>
          <p className="text-xs text-dark-500 mt-1">Klik "Tambah Ad" untuk membuat iklan baru</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="solid-card rounded-xl p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold text-dark-100">{ad.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${ad.isActive ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-dark-700 text-dark-400 border border-dark-600"}`}>
                      {ad.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark-400">
                    <span>📍 {POSITIONS.find((p) => p.value === ad.position)?.label || ad.position}</span>
                    <span>📋 {AD_TYPES.find((t) => t.value === ad.type)?.label || ad.type}</span>
                    <span>👁 {ad.impressions || 0} views</span>
                    <span>🖱 {ad.clicks || 0} clicks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle */}
                  <button onClick={() => handleToggle(ad)} className={`relative w-10 h-5 rounded-full transition-colors ${ad.isActive ? "bg-neon-green" : "bg-dark-600"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${ad.isActive ? "left-5.5 translate-x-0" : "left-0.5"}`} style={{ left: ad.isActive ? "22px" : "2px" }} />
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingAd(ad);
                      setShowForm(true);
                    }}
                    className="w-8 h-8 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-dark-300 hover:text-accent-400 hover:border-dark-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {/* Delete */}
                  <button onClick={() => handleDelete(ad.id)} className="w-8 h-8 rounded-lg bg-dark-700 border border-dark-600 flex items-center justify-center text-dark-300 hover:text-neon-red hover:border-neon-red/30 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Ad Edit/Create Form ── */
function AdForm({ ad, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    id: ad?.id || "",
    name: ad?.name || "",
    position: ad?.position || "content",
    type: ad?.type || "image",
    content: ad?.content || "",
    imageUrl: ad?.imageUrl || "",
    targetUrl: ad?.targetUrl || "",
    isActive: ad?.isActive || false,
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="solid-card rounded-xl p-6">
      <h2 className="text-lg font-bold text-dark-100 mb-5">{ad ? "Edit Iklan" : "Tambah Iklan Baru"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Nama Iklan</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm focus:outline-none focus:border-accent-500"
            placeholder="Contoh: Header Banner"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Posisi</label>
          <select value={form.position} onChange={(e) => update("position", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm focus:outline-none focus:border-accent-500">
            {POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Tipe</label>
          <select value={form.type} onChange={(e) => update("type", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm focus:outline-none focus:border-accent-500">
            {AD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-dark-300">Status</label>
          <button type="button" onClick={() => update("isActive", !form.isActive)} className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-neon-green" : "bg-dark-600"}`}>
            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.isActive ? "22px" : "2px" }} />
          </button>
          <span className="text-xs text-dark-400">{form.isActive ? "Aktif" : "Nonaktif"}</span>
        </div>
      </div>

      {/* Type-specific fields */}
      {form.type === "image" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">URL Gambar</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm focus:outline-none focus:border-accent-500"
              placeholder="https://example.com/banner.jpg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">URL Target (klik)</label>
            <input
              type="url"
              value={form.targetUrl}
              onChange={(e) => update("targetUrl", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm focus:outline-none focus:border-accent-500"
              placeholder="https://example.com/landing-page"
            />
          </div>
          {form.imageUrl && (
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Preview</label>
              <div className="rounded-lg border border-dark-600 overflow-hidden bg-dark-700 p-2">
                <img src={form.imageUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4">
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Kode Script / HTML</label>
          <textarea
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={6}
            className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-100 text-sm font-mono focus:outline-none focus:border-accent-500 resize-y"
            placeholder="Paste kode AdSense atau HTML iklan di sini..."
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: "1px solid var(--color-dark-700)" }}>
        <button onClick={() => onSave(form)} disabled={saving || !form.name} className="px-5 py-2 rounded-lg bg-accent-600 text-white text-sm font-semibold hover:bg-accent-500 transition-colors disabled:opacity-50">
          {saving ? "Menyimpan..." : ad ? "Update" : "Simpan"}
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-lg bg-dark-700 border border-dark-600 text-dark-300 text-sm font-medium hover:text-dark-100 transition-colors">
          Batal
        </button>
      </div>
    </div>
  );
}
