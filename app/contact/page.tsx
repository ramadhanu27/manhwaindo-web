import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pasang Iklan - ManhwaIndo",
  description: "Hubungi kami untuk memasang iklan di ManhwaIndo. Dapatkan exposure maksimal untuk brand Anda.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Informasi Kontak Iklan</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Pasang Iklan di Situs ManhwaIndo</h3>
                  <p className="text-gray-700">
                    ManhwaIndo adalah platform terpercaya untuk membaca komik manhwa bahasa Indonesia dengan jutaan pengunjung setiap bulannya.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Hubungi Kami</h3>
                  <p className="text-gray-700 mb-4">
                    Untuk informasi lebih lanjut tentang paket iklan dan penawaran khusus, silakan hubungi kami melalui:
                  </p>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      <span><strong>Email:</strong> <a href="mailto:jiawialo@gmail.com" className="text-blue-600 hover:underline">jiawialo@gmail.com</a></span>
                    </p>
                    <p className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.644-.213-.658-.644.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"></path>
                      </svg>
                      <span><strong>Telegram:</strong> <a href="https://t.me/polo8758" className="text-blue-600 hover:underline">@polo8758</a></span>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-gray-800">
                    <strong>Status Slot Saat Ini:</strong> <span className="text-green-600 font-semibold">Tersedia</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Kami menerima iklan dari berbagai industri. Hubungi kami sekarang untuk mendapatkan penawaran terbaik!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Ad Showcase */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contoh Penempatan Iklan</h3>

              {/* Ad Placeholder 1 */}
              <div className="mb-6">
                <div className="w-full h-[250px] bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600 font-semibold">Banner Iklan</p>
                    <p className="text-gray-500 text-sm">300 x 250</p>
                  </div>
                </div>
              </div>

              {/* Ad Placeholder 2 */}
              <div className="mb-6">
                <div className="w-full h-[90px] bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600 font-semibold">Leaderboard</p>
                    <p className="text-gray-500 text-sm">728 x 90</p>
                  </div>
                </div>
              </div>

              {/* Paket Iklan */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">Paket Iklan Tersedia</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Banner Leaderboard (728x90)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Medium Rectangle (300x250)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Skyscraper (120x600)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Sponsored Content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Custom Campaign</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Hubungi Kami Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
