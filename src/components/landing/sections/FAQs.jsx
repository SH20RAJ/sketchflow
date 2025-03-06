'use client'
import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQs() {
  const faqs = [
    {
      q: "How does the free trial work?",
      a: "Start with our 14-day free trial with full access to all Pro features. No credit card required.",
    },
    {
      q: "Can I collaborate with my team?",
      a: "Yes! Invite unlimited team members and collaborate in real-time on all your projects.",
    },
    {
      q: "What happens to my data?",
      a: "Your data is securely stored and backed up. We use enterprise-grade encryption to protect your information.",
    },
    {
      q: "Can I export my diagrams?",
      a: "Export your diagrams in multiple formats including PNG, SVG, and PDF. Pro users get access to additional export options.",
    },
    {
      q: "Do you offer enterprise plans?",
      a: "Yes, we offer custom enterprise plans with additional features, dedicated support, and custom integrations.",
    },
  ]

  return (
    <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about SketchFlow
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full space-y-4"
            aria-label="Frequently Asked Questions"
          >
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
                aria-labelledby={`faq-heading-${index}`}
              >
                <AccordionTrigger 
                  className="px-6 py-4 text-left text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
                  id={`faq-heading-${index}`}
                  aria-controls={`faq-content-${index}`}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent 
                  className="px-6 py-4 text-gray-600 bg-gray-50"
                  id={`faq-content-${index}`}
                  role="region"
                  aria-labelledby={`faq-heading-${index}`}
                >
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
