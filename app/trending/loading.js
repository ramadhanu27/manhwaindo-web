export default function TrendingLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 skeleton rounded-xl" />
          <div>
            <div className="h-8 w-32 skeleton rounded-lg mb-1" />
            <div className="h-4 w-48 skeleton rounded-lg" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-28 h-10 skeleton rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex gap-4">
              <div className="w-12 h-12 skeleton rounded-xl flex-shrink-0" />
              <div className="w-20 h-28 skeleton rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 skeleton rounded w-2/3" />
                <div className="h-4 skeleton rounded w-1/3" />
                <div className="h-3 skeleton rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
