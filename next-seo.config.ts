const config = {
  titleTemplate: '%s | ManhwaIndo',
  defaultTitle: 'ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia',
  description: 'ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.',
  canonical: 'https://manhwaindo.web.id',
  mobileAlternate: {
    media: 'only screen and (max-width: 640px)',
    href: 'https://manhwaindo.web.id',
  },
  languageAlternates: [
    {
      hrefLang: 'id',
      href: 'https://manhwaindo.web.id',
    },
    {
      hrefLang: 'x-default',
      href: 'https://manhwaindo.web.id',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://manhwaindo.web.id',
    siteName: 'ManhwaIndo',
    title: 'ManhwaIndo - Baca Komik Manhwa Bahasa Indonesia',
    description: 'ManhwaIndo merupakan situs baca komik online dengan koleksi terupdate. Kalian bisa membaca ratusan judul komik (manhwa) yang kami update setiap hari secara gratis.',
    images: [
      {
        url: 'https://manhwaindo.web.id/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ManhwaIndo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@manhwaindo',
    site: '@manhwaindo',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'keywords',
      content: 'manhwa, komik, manga, webtoon, indonesia, baca online, gratis, manhwaindo, shinigamiid, shinigami, manhua, manga,',
    },
    {
      httpEquiv: 'x-ua-compatible',
      content: 'IE=edge',
    },
  ],
};

export default config;
