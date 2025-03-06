"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-6">
            Why Choose SketchFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next evolution in collaborative diagramming and whiteboarding
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* SketchFlow Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                <img src="/logo.svg" alt="SketchFlow" className="w-12 h-12 relative" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600">SketchFlow</h3>
            </div>
            <ul className="space-y-4">
              {[
                { title: "Advanced AI Integration", desc: "Smart diagram suggestions and automated layouts powered by cutting-edge AI" },
                { title: "Real-time Collaboration", desc: "True real-time collaboration with cursor presence and instant updates" },
                { title: "Unlimited Projects", desc: "No restrictions on the number of projects with Pro plan" },
                { title: "Advanced Export Options", desc: "Export to multiple formats including SVG, PNG, and PDF with vector quality" },
                { title: "Smart Templates", desc: "Extensive library of smart templates with AI-powered customization" },
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{feature.title}</span>
                    <p className="text-gray-600 mt-1">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">$2</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <span className="text-sm text-blue-600 font-medium">Limited Time Offer</span>
              </div>
            </div>
          </motion.div>

          {/* Competitor Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <h3 className="text-2xl font-bold text-gray-400">Other Tools</h3>
            </div>
            <ul className="space-y-4">
              {[
                { title: "Basic Features", desc: "Limited to basic diagramming without AI assistance" },
                { title: "Basic Collaboration", desc: "Limited collaboration features with delayed updates" },
                { title: "Limited Projects", desc: "Strict limitations on project numbers and storage" },
                { title: "Basic Export", desc: "Limited export options with quality constraints" },
                { title: "Basic Templates", desc: "Limited template library without smart features" },
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{feature.title}</span>
                    <p className="text-gray-500 mt-1">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-400">$15-20</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <span className="text-sm text-gray-400 font-medium">Standard Pricing</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try SketchFlow Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}