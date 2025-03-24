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
      q: "What makes SketchFlow unique?",
      a: "SketchFlow combines a real-time collaborative whiteboard with a powerful markdown editor, allowing you to seamlessly switch between visual diagrams and structured documentation in one workspace.",
    },
    {
      q: "How does the collaboration feature work?",
      a: "Our real-time collaboration allows multiple team members to work simultaneously on the same canvas and document. You can see live cursor movements, drawing changes, and text edits from all participants.",
    },
    {
      q: "What drawing tools are available?",
      a: "SketchFlow offers a comprehensive set of drawing tools including free-hand drawing, shapes, arrows, text annotations, and custom colors. You can also use AI-powered design suggestions to enhance your diagrams.",
    },
    {
      q: "Can I use templates?",
      a: "Yes! SketchFlow comes with a variety of pre-built templates for different use cases like brainstorming, project planning, and system design. Pro users get access to additional premium templates.",
    },
    {
      q: "How does the export feature work?",
      a: "You can export your work in multiple formats: PNG and SVG for diagrams, PDF for combined canvas and documentation, and even record your whiteboard sessions as MP4 videos. Pro users get access to additional export options and higher resolution exports.",
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use enterprise-grade encryption for all data storage and transmission. Your projects are automatically backed up, and Pro users get additional backup options and data retention controls.",
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
