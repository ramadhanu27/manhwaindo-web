export default function ManhwaDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero banner skeleton */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] skeleton" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 sm:-mt-56 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Cover skeleton */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="w-[180px] h-[260px] sm:w-[200px] sm:h-[290px] lg:w-[220px] lg:h-[320px] rounded-2xl skeleton" />
          </div>

          {/* Info skeleton */}
          <div className="flex-1 min-w-0 pt-0 md:pt-8 space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-16 h-6 rounded-full skeleton" />
              <div className="w-20 h-6 rounded-full skeleton" />
            </div>
            <div className="h-10 skeleton w-3/4 mx-auto md:mx-0 rounded-lg" />
            <div className="h-5 skeleton w-1/2 mx-auto md:mx-0 rounded-lg" />
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="h-5 w-32 skeleton rounded-lg" />
              <div className="h-5 w-24 skeleton rounded-lg" />
              <div className="h-5 w-28 skeleton rounded-lg" />
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-7 skeleton rounded-lg" />
              ))}
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-48 h-12 skeleton rounded-xl" />
              <div className="w-44 h-12 skeleton rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Synopsis skeleton */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="h-6 w-32 skeleton rounded-lg" />
              <div className="h-4 skeleton rounded-lg" />
              <div className="h-4 skeleton w-5/6 rounded-lg" />
              <div className="h-4 skeleton w-4/6 rounded-lg" />
            </div>
            {/* Chapter list skeleton */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="h-6 w-40 skeleton rounded-lg" />
              <div className="flex gap-3">
                <div className="flex-1 h-10 skeleton rounded-xl" />
                <div className="w-24 h-10 skeleton rounded-xl" />
              </div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 skeleton rounded-lg" />
                    <div className="w-32 h-4 skeleton rounded-lg" />
                  </div>
                  <div className="w-20 h-3 skeleton rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="h-6 w-28 skeleton rounded-lg" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="w-20 h-3 skeleton rounded-lg" />
                  <div className="w-24 h-4 skeleton rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
