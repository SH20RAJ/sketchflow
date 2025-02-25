import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SketchFlow - Free Online Whiteboard & Digital Canvas | No Login Required",
  description: "Create, teach and collaborate in real-time with SketchFlow's free online whiteboard. A powerful Eraser.io alternative with no login required. Start drawing instantly!",
  keywords: "SketchFlow, Free online whiteboard for teaching, Whiteboard online free no login, free whiteboard online tool, digital canvas, Online Whiteboard for Realtime Collaboration, Erasor io alternative free",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sketchflow.space',
    siteName: 'SketchFlow',
    title: 'SketchFlow - Collaborative Whiteboard for Creative Teams',
    description: 'Unleash creativity with our real-time collaborative digital whiteboard for teams.',
    images: [
      {
        url: 'https://sketchflow.space/og.png',
        width: 1200,
        height: 630,
        alt: 'SketchFlow Collaborative Whiteboard',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SketchFlow - Professional Whiteboard for Creative Teams',
    description: 'Unleash creativity with our real-time professional digital whiteboard for teams.',
    creator: '@sketchflow',
    images: ['https://sketchflow.space/og.png'],
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
    icon: '/icons/icon-512x512.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  
  manifest: '/manifest.json',
  
  verification: {
    google: 'google-site-verification-code',
    bing: 'bing-verification-code',
  },
  
  alternates: {
    canonical: 'https://sketchflow.space',
    languages: {
      'en-US': 'https://sketchflow.space',
      'es-ES': 'https://sketchflow.space/es',
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
    statusBarStyle: 'default',
    title: 'SketchFlow'
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
  userScalable: 'no'
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ETJGGD22FR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ETJGGD22FR');
          `}
        </Script>
      </head>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
