import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pasang Iklan - ManhwaIndo",
  description: "Hubungi kami untuk memasang iklan di ManhwaIndo. Dapatkan exposure maksimal untuk brand Anda.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f1319]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden mb-6">
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Pasang Iklan</h1>
            <p className="text-gray-400">Hubungi kami untuk memasang iklan di ManhwaIndo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
                <h2 className="text-lg font-bold text-white">Informasi Kontak Iklan</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Pasang Iklan di Situs ManhwaIndo</h3>
                  <p className="text-gray-300">ManhwaIndo adalah platform terpercaya untuk membaca komik manhwa bahasa Indonesia.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Hubungi Kami</h3>
                  <p className="text-gray-400 mb-4">Untuk informasi lebih lanjut tentang paket iklan dan penawaran khusus, silakan hubungi kami melalui:</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#2a3142] rounded-lg">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <a href="mailto:jiawialo@gmail.com" className="text-green-400 hover:underline font-medium">
                          jiawialo@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-white">
                      <strong>Status Slot Saat Ini:</strong> <span className="text-green-400 font-semibold">Tersedia</span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 ml-6">Kami menerima iklan dari berbagai industri. Hubungi kami sekarang untuk mendapatkan penawaran terbaik!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Ad Showcase */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 overflow-hidden sticky top-6">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a]">
                <h3 className="text-lg font-bold text-white">Contoh Penempatan Iklan</h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Ad Placeholder 1 */}
                <div className="w-full h-[200px] bg-[#2a3142] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-400 font-semibold">Banner Iklan</p>
                    <p className="text-gray-500 text-sm">300 x 250</p>
                  </div>
                </div>

                {/* Ad Placeholder 2 */}
                <div className="w-full h-[80px] bg-[#2a3142] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 font-semibold">Leaderboard</p>
                    <p className="text-gray-500 text-sm">728 x 90</p>
                  </div>
                </div>

                {/* Paket Iklan */}
                <div className="bg-[#2a3142] rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Paket Iklan Tersedia
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Banner Leaderboard (728x90)
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Medium Rectangle (300x250)
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Skyscraper (120x600)
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Sponsored Content
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Custom Campaign
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <a href="mailto:jiawialo@gmail.com" className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors">
                  Hubungi Kami Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
