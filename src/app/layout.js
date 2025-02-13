import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SketchFlow - Collaborative Whiteboard for Creative Teams",
  description: "SketchFlow empowers teams to brainstorm, design, and collaborate in real-time on a shared digital canvas.",
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sketchflow.app',
    siteName: 'SketchFlow',
    title: 'SketchFlow - Collaborative Whiteboard for Creative Teams',
    description: 'Unleash creativity with our real-time collaborative digital whiteboard for teams.',
    images: [
      {
        url: 'https://sketchflow.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SketchFlow Collaborative Whiteboard',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SketchFlow - Collaborative Whiteboard for Creative Teams',
    description: 'Unleash creativity with our real-time collaborative digital whiteboard for teams.',
    creator: '@sketchflow',
    images: ['https://sketchflow.app/twitter-image.jpg'],
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
    canonical: 'https://sketchflow.app',
    languages: {
      'en-US': 'https://sketchflow.app',
      'es-ES': 'https://sketchflow.app/es',
    },
  },
  
  category: 'productivity',
  creator: 'SketchFlow Team',
  publisher: 'SketchFlow Inc.',
  
  keywords: [
    'collaborative whiteboard',
    'real-time collaboration',
    'team brainstorming',
    'digital canvas',
    'creative tools',
    'remote collaboration',
    'visual thinking',
    'design collaboration',
    'team productivity',
    'sketch flow'
  ],
  
  appleWebApp: {
    capable: true,
    title: 'SketchFlow',
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
    <html lang="en" className=" ">
      <head>
        <Script 
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
