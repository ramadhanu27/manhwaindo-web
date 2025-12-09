export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1319] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-400 mb-8">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
        <a href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
