export const metadata = {
  title: 'SketchFlow | Split-Screen Diagram & Markdown Collaboration Platform',
  description: 'Transform your ideas into reality with SketchFlow - the developer-focused visual collaboration platform with split-screen diagram and markdown editing, real-time collaboration, and project tagging.',
  keywords: 'split-screen diagram, markdown editor, visual collaboration, real-time collaboration, developer diagrams, project tagging, role-based access, activity tracking, auto-save, import export diagrams, whiteboarding, flowcharts, team collaboration, documentation, remote teams, project planning',
  openGraph: {
    title: 'SketchFlow | Split-Screen Diagram & Markdown Collaboration Platform',
    description: 'Developer-focused visual collaboration with split-screen diagram and markdown editing, real-time collaboration, and project tagging.',
    url: 'https://sketchflow.space',
    siteName: 'SketchFlow',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SketchFlow - Visual Collaboration Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SketchFlow | Split-Screen Diagram & Markdown Collaboration Platform',
    description: 'Developer-focused visual collaboration with split-screen diagram and markdown editing, real-time collaboration, and project tagging.',
    creator: '@sketchflow',
    images: ['/og.png'],
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
  alternates: {
    canonical: 'https://sketchflow.space',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  siteLinks: {
    searchBox: {
      url: 'https://sketchflow.space/search',
      potentialActions: [
        {
          target: 'https://sketchflow.space/search?q={search_term_string}',
          queryInput: 'required name=search_term_string',
        },
      ],
    },
    searchLinks: [
      {
        name: 'Try SketchFlow',
        url: 'https://sketchflow.space/try',
      },
      {
        name: 'Features',
        url: 'https://sketchflow.space/features',
      },
      {
        name: 'Pricing',
        url: 'https://sketchflow.space/pricing',
      },
      {
        name: 'About Us',
        url: 'https://sketchflow.space/about',
      },
      {
        name: 'Blog',
        url: 'https://sketchflow.space/blog',
      },
    ],
  },
};
