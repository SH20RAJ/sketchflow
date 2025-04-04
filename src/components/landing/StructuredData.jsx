'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Organization schema
      const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SketchFlow',
        url: 'https://sketchflow.space',
        logo: 'https://sketchflow.space/logo.svg',
        description: 'Visual collaboration and whiteboarding platform for teams',
        sameAs: [
          'https://twitter.com/sketchflow',
          'https://linkedin.com/company/sketchflow',
          'https://github.com/sketchflow'
        ]
      };

      // Software application schema
      const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'SketchFlow',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '0',
            priceCurrency: 'USD',
            unitText: 'MONTH'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1024',
          bestRating: '5',
          worstRating: '1'
        }
      };

      // FAQ schema
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What makes SketchFlow unique?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SketchFlow combines a real-time collaborative whiteboard with a powerful markdown editor, allowing you to seamlessly switch between visual diagrams and structured documentation in one workspace.'
            }
          },
          {
            '@type': 'Question',
            name: 'Can I use SketchFlow for free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, SketchFlow offers a free tier with essential features for individuals and small teams. For advanced features and higher usage limits, we offer Pro and Team plans.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is my data secure with SketchFlow?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we use enterprise-grade encryption for all data storage and transmission. Your projects are automatically backed up, and Pro users get additional backup options and data retention controls.'
            }
          }
        ]
      };

      // Add the schema to the page
      const script1 = document.createElement('script');
      script1.setAttribute('type', 'application/ld+json');
      script1.textContent = JSON.stringify(organizationSchema);
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.setAttribute('type', 'application/ld+json');
      script2.textContent = JSON.stringify(softwareSchema);
      document.head.appendChild(script2);

      const script3 = document.createElement('script');
      script3.setAttribute('type', 'application/ld+json');
      script3.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script3);

      // Cleanup function
      return () => {
        document.head.removeChild(script1);
        document.head.removeChild(script2);
        document.head.removeChild(script3);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
