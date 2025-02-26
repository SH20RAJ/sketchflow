'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What is SketchFlow?",
      answer: "SketchFlow is a collaborative whiteboarding platform that combines drawing tools with markdown documentation. It's perfect for teams who want to brainstorm, plan, and document their ideas in one place."
    },
    {
      question: "Do I need to create an account?",
      answer: "While you can try SketchFlow without an account, creating one allows you to save your work, collaborate with others, and access additional features."
    },
    {
      question: "Is SketchFlow free to use?",
      answer: "Yes! SketchFlow offers a generous free tier with essential features. We also offer premium plans for teams needing advanced collaboration features."
    },
    {
      question: "Can I collaborate with my team in real-time?",
      answer: "Yes, SketchFlow supports real-time collaboration. Simply share your project link with team members to start working together instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get support for SketchFlow. Browse through our FAQs or reach out to our team.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Mail, title: "Email Us", desc: "support@sketchflow.space" },
            { icon: MessageCircle, title: "Live Chat", desc: "Available 9AM-5PM EST" },
            { icon: Phone, title: "Call Us", desc: "+1 (555) 123-4567" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="p-4 bg-gray-50 border-t border-gray-200"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            size="lg"
            onClick={() => window.location.href = 'mailto:support@sketchflow.space'}
          >
            Contact Support
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
