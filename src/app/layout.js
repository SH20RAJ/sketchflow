import "./globals.css";

export const metadata = {
  title: "SketchyKids - Fun Interactive Learning for Children",
  description: "SketchyKids helps children learn through interactive and engaging activities, fostering creativity and knowledge.",
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sketchykids.com',
    siteName: 'SketchyKids',
    title: 'SketchyKids - Fun Interactive Learning for Children',
    description: 'Discover engaging activities that help children learn through creativity and fun.',
    images: [
      {
        url: 'https://sketchykids.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SketchyKids Learning Platform',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SketchyKids - Fun Interactive Learning for Children',
    description: 'Discover engaging activities that help children learn through creativity and fun.',
    creator: '@sketchykids',
    images: ['https://sketchykids.com/twitter-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  manifest: '/site.webmanifest',
  
  verification: {
    google: 'google-site-verification-code',
    bing: 'bing-verification-code',
  },
  
  alternates: {
    canonical: 'https://sketchykids.com',
    languages: {
      'en-US': 'https://sketchykids.com',
      'es-ES': 'https://sketchykids.com/es',
    },
  },
  
  category: 'education',
  creator: 'SketchyKids Team',
  publisher: 'SketchyKids Inc.',
  
  keywords: [
    'children learning',
    'interactive activities',
    'educational games',
    'creative learning',
    'kids education',
    'fun learning',
    'child development',
    'educational technology',
    'learning through play',
    'sketchy kids'
  ],
  
  appleWebApp: {
    capable: true,
    title: 'SketchyKids',
    statusBarStyle: 'default',
  },
  
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  { media: '(prefers-color-scheme: dark)', color: '#171717' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
