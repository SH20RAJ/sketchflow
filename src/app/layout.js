import "./globals.css";

export const metadata = {
  // Basic metadata
  title: "SaaS Template - Launch Your SaaS Faster",
  description: "Production-ready SaaS template with authentication, payments, email integration and more. Built with Next.js, Tailwind CSS, and Shadcn UI.",
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'SaaS Template',
    title: 'SaaS Template - Launch Your SaaS Faster',
    description: 'Production-ready SaaS template with authentication, payments, email integration and more.',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SaaS Template Preview',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Template - Launch Your SaaS Faster',
    description: 'Production-ready SaaS template with authentication, payments, email integration and more.',
    creator: '@yourtwitterhandle',
    images: ['https://your-domain.com/twitter-image.jpg'],
  },
  
  // Robots
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
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  
  // Manifest
  manifest: '/site.webmanifest',
  
  // Verification
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
    other: {
      me: ['your-email@domain.com'],
    },
  },
  
  // Alternative languages
  alternates: {
    canonical: 'https://your-domain.com',
    languages: {
      'en-US': 'https://your-domain.com',
      'es-ES': 'https://your-domain.com/es',
    },
  },
  
  // Additional metadata
  category: 'technology',
  classification: 'Software Development',
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  
  // Keywords
  keywords: [
    'saas template',
    'next.js template',
    'react template',
    'authentication',
    'payment integration',
    'email integration',
    'tailwind css',
    'shadcn ui',
    'deployment',
    'documentation'
  ],
  
  // App specific
  appleWebApp: {
    capable: true,
    title: 'SaaS Template',
    statusBarStyle: 'black-translucent',
  },
  
  // Archives and assets
  assets: ['https://your-domain.com/assets'],
  archives: ['https://your-domain.com/archives'],
  
  // Bookmarks
  bookmarks: ['https://your-domain.com/featured'],
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
