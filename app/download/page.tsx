'use client';

import Link from 'next/link';
import DownloadFlow from '@/components/download-flow';

export default function DownloadPage() {
  return (
    <div>
      <DownloadFlow />
      
      {/* Back Link */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
