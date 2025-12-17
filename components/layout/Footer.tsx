import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0f1319] mt-8">
      <div className="container mx-auto px-4 py-8">
        {/* A-Z Navigation */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 mb-4">Search by letter</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <Link
                key={letter}
                href={`/search?title=${letter}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a1f2e] border border-gray-700 text-sm font-semibold text-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 hover:scale-110">
                {letter}
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/favicon.ico" alt="ManhwaIndo" className="w-8 h-8 rounded-lg" />
              <span className="text-lg font-bold text-white">
                Manhwa<span className="text-purple-400">Indo</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa, manga, manhua) yang kami update setiap hari secara gratis.
            </p>

            {/* Partner Link */}
            <div className="mb-6">
              <a
                href="https://kumastream.web.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Nonton Anime di KumaStream
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <Link href="/contact" className="hover:text-green-400 transition-colors">
                Pasang Iklan
              </Link>
              <Link href="/dmca" className="hover:text-green-400 transition-colors">
                DMCA
              </Link>
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
            <p className="text-xs text-gray-600 mt-6">&copy; {new Date().getFullYear()} ManhwaIndo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
