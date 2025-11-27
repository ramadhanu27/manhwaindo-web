'use client';

import { useEffect } from 'react';

export default function AdSection() {
  useEffect(() => {
    // Load first ad
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.innerHTML = `
      atOptions = {
        'key' : 'baf333c025010820ccafb97978a627a3',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.getElementById('ad-1')?.appendChild(script1);

    const script1Src = document.createElement('script');
    script1Src.type = 'text/javascript';
    script1Src.src = '//www.highperformanceformat.com/baf333c025010820ccafb97978a627a3/invoke.js';
    document.getElementById('ad-1')?.appendChild(script1Src);

    // Load second ad
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.innerHTML = `
      atOptions = {
        'key' : '5a89f4563ede24d6c7e045c77d636bd8',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.getElementById('ad-2')?.appendChild(script2);

    const script2Src = document.createElement('script');
    script2Src.type = 'text/javascript';
    script2Src.src = '//www.highperformanceformat.com/5a89f4563ede24d6c7e045c77d636bd8/invoke.js';
    document.getElementById('ad-2')?.appendChild(script2Src);

    // Load third ad
    const script3 = document.createElement('script');
    script3.type = 'text/javascript';
    script3.innerHTML = `
      atOptions = {
        'key' : '2f2006adf30eef02335bb7e71bd07a9d',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.getElementById('ad-3')?.appendChild(script3);

    const script3Src = document.createElement('script');
    script3Src.type = 'text/javascript';
    script3Src.src = '//www.highperformanceformat.com/2f2006adf30eef02335bb7e71bd07a9d/invoke.js';
    document.getElementById('ad-3')?.appendChild(script3Src);

    // Load additional scripts
    const additionalScript1 = document.createElement('script');
    additionalScript1.type = 'text/javascript';
    additionalScript1.src = '//pl28146074.effectivegatecpm.com/75/cc/7a/75cc7ac75f43124043e6b6b0b0a29218.js';
    document.body.appendChild(additionalScript1);

    const additionalScript2 = document.createElement('script');
    additionalScript2.type = 'text/javascript';
    additionalScript2.src = '//pl28146022.effectivegatecpm.com/7a/bf/d2/7abfd22c695cb44d4bd09dfe203c3de0.js';
    document.body.appendChild(additionalScript2);
  }, []);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* First Ad */}
        <div className="flex justify-center">
          <div id="ad-1"></div>
        </div>

        {/* Second Ad */}
        <div className="flex justify-center">
          <div id="ad-2"></div>
        </div>

        {/* Third Ad */}
        <div className="flex justify-center">
          <div id="ad-3"></div>
        </div>

        {/* Fourth Ad - Placeholder */}
        <div className="flex justify-center">
          <div className="w-full max-w-[728px] h-[90px] bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 font-semibold">Your Ad Here</p>
              <p className="text-gray-500 text-sm">728 x 90</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
