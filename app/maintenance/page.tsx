import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Maintenance - ManhwaIndo",
  description: "Website sedang dalam maintenance",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0f1319] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Card */}
        <div className="bg-[#1a1f2e] rounded-2xl border border-gray-800 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Sedang Dalam Perbaikan</h1>

          <p className="text-gray-400 mb-6">Website sedang dalam maintenance untuk peningkatan layanan. Kami akan segera kembali!</p>

          {/* Estimated Time */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Estimasi: 1-2 jam</span>
            </div>
          </div>

          {/* Contact */}
          <p className="text-gray-500 text-sm mb-4">Ada pertanyaan? Hubungi kami:</p>

          <div className="flex justify-center gap-4">
            <a href="mailto:jiawialo@gmail.com" className="flex items-center gap-2 px-4 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-gray-300 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              Email
            </a>
            <a href="https://t.me/manhwaindo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#2a3142] hover:bg-[#3a4152] text-gray-300 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.644-.213-.658-.644.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"></path>
              </svg>
              Telegram
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-gray-600 text-sm">Terima kasih atas kesabaran Anda! 🙏</p>
      </div>
    </div>
  );
}
