'use client'

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FAQs() {
  // Refs for animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // FAQ data
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
    <section
      id="faq"
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 px-4 py-1.5">
              Support
            </Badge>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Questions</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600"
          >
            Everything you need to know about SketchFlow
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
              aria-label="Frequently Asked Questions"
            >
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    aria-labelledby={`faq-heading-${index}`}
                  >
                    <AccordionTrigger
                      className="px-6 py-4 text-left text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 flex items-center"
                      id={`faq-heading-${index}`}
                      aria-controls={`faq-content-${index}`}
                    >
                      <HelpCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      <span>{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent
                      className="px-6 py-6 text-gray-600 bg-gray-50/50 border-t border-gray-100"
                      id={`faq-content-${index}`}
                      role="region"
                      aria-labelledby={`faq-heading-${index}`}
                    >
                      <div className="pl-8">{faq.a}</div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Additional support CTA */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-16 text-center bg-blue-50 rounded-2xl p-8 border border-blue-100"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              Still have questions?
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-8 max-w-xl mx-auto"
            >
              Can't find the answer you're looking for? Please contact our friendly support team.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
