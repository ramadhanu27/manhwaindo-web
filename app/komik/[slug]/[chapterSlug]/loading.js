export default function ChapterReaderLoading() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top nav skeleton */}
      <div className="glass border-b border-dark-700/30 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="w-12 h-3 skeleton rounded" />
            <div className="w-3 h-3 skeleton rounded" />
            <div className="w-32 h-3 skeleton rounded" />
            <div className="w-3 h-3 skeleton rounded" />
            <div className="w-20 h-3 skeleton rounded" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="w-20 h-9 skeleton rounded-xl" />
            <div className="flex-1 text-center">
              <div className="w-32 h-5 skeleton rounded mx-auto mb-1" />
              <div className="w-24 h-3 skeleton rounded mx-auto" />
            </div>
            <div className="w-20 h-9 skeleton rounded-xl" />
          </div>
        </div>
      </div>

      {/* Reader skeleton */}
      <div className="max-w-3xl mx-auto bg-dark-900 min-h-screen">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-[400px] sm:h-[600px] flex items-center justify-center bg-dark-800/30 border-b border-dark-800/20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
              <span className="text-xs text-dark-500">Memuat halaman...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
