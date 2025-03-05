"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  X,
  CheckCircle2,
  Play,
  Users,
  Star,
  Shield,
  Zap,
  Rocket,
  Lightbulb,
  Cpu,
  PieChart,
  TrendingUp,
  Check,
} from "lucide-react";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import PricingSection from "./sections/PricingSection";
import Testimonials from "./sections/Testimonials";
import FAQs from "./sections/FAQs";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";


  // Add new stats data
  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "1M+", label: "Diagrams Created" },
    { number: "150+", label: "Countries" },
    { number: "99.9%", label: "Uptime" },
  ];

  // Add integration logos
  const integrations = [
    "https://www.svgrepo.com/show/512317/github-142.svg",
    "https://www.svgrepo.com/show/448248/slack.svg",
    "https://www.svgrepo.com/show/452076/notion.svg",
    "https://www.svgrepo.com/show/452202/figma.svg",
    "https://www.svgrepo.com/show/452241/jira.svg",
    "https://www.svgrepo.com/show/526412/video-library.svg",
    "https://www.svgrepo.com/show/475688/trello-color.svg",
    "https://www.svgrepo.com/show/125087/yoga.svg",
  ];

  // Add comparison data
  const comparisonFeatures = [
    { name: "Real-time Collaboration", sketchflow: true, others: false },
    { name: "AI-Powered Suggestions", sketchflow: true, others: false },
    { name: "Smart Templates", sketchflow: true, others: false },
    { name: "Export Options", sketchflow: true, others: true },
    { name: "Team Management", sketchflow: true, others: false },
  ];

  // Add use cases
  const useCases = [
    {
      icon: Lightbulb,
      title: "Brainstorming",
      description: "Capture and organize ideas in real-time with your team.",
    },
    {
      icon: Cpu,
      title: "System Design",
      description: "Create detailed system architecture diagrams with ease.",
    },
    {
      icon: Users,
      title: "Team Planning",
      description: "Plan projects and workflows collaboratively.",
    },
    {
      icon: PieChart,
      title: "Data Visualization",
      description: "Transform complex data into clear visual representations.",
    },
  ];

  return (
    <>
      {/* Announcement Banner */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center text-center">
            <div className="animate-pulse mr-3">🎉</div>
            <p className="text-sm md:text-base font-medium">
              Special Offer: Get 1 Month FREE Pro Membership! Valid until March 27, 2025.{" "}
              <Link
                href="https://forms.gle/jExHz49gSyo3Hn2y7"
                className="underline font-semibold hover:text-blue-100 transition-colors ml-1"
              >
                Claim Now →
              </Link>
            </p>
          </div>
        </div>
      </div> */}

      <main className="overflow-hidden  ">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* <PricingSection /> */}
 

        {/* Hero CTA Section with Glassmorphism */}
        <section className="py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl"
              >
                <h2 className="text-5xl font-bold text-white mb-6 text-center leading-tight">
                  Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Workflow</span> with
                  <br />Next-Gen Design Tools
                </h2>
                <p className="text-xl text-blue-50 mb-12 text-center max-w-2xl mx-auto leading-relaxed">
                  Join the design revolution with thousands of forward-thinking teams already using SketchFlow to create, collaborate, and innovate.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {isAuthenticated ? (
                    <Link href="/projects">
                      <Button
                        size="lg"
                        className="group bg-white hover:bg-blue-50 text-blue-600 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Open Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button
                        size="lg"
                        className="group bg-white hover:bg-blue-50 text-blue-600 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* New Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* New How It Works Section */}
        <section className="py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  SketchFlow
                </span>{" "}
                Works
              </h2>
              <p className="text-xl text-gray-600">
                Get started in minutes with our intuitive workflow
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 hidden md:block" />
              {[
                {
                  icon: Rocket,
                  title: "Create Project",
                  description:
                    "Start with a blank canvas or choose from templates",
                },
                {
                  icon: Users,
                  title: "Collaborate",
                  description:
                    "Invite team members and work together in real-time",
                },
                {
                  icon: TrendingUp,
                  title: "Ship Faster",
                  description: "Export, share, and implement your designs",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 relative z-10"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="text-center">
                    <step.icon className="h-12 w-12 mx-auto text-blue-600 mb-6" />
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Use Cases Section */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Perfect for Every{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  Use Case
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Discover how teams use SketchFlow to solve different challenges
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                >
                  <useCase.icon className="h-12 w-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-semibold mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Social Proof Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600">Trusted by teams at</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-50">
              {integrations.map((logo, index) => (
                <motion.img
                  key={index}
                  src={`${logo}`}
                  alt="Company Logo"
                  className="h-8 w-auto mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
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
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Advanced AI Integration</span>
                      <p className="text-gray-600 mt-1">Smart diagram suggestions and automated layouts powered by cutting-edge AI</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Real-time Collaboration</span>
                      <p className="text-gray-600 mt-1">True real-time collaboration with cursor presence and instant updates</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Unlimited Projects</span>
                      <p className="text-gray-600 mt-1">No restrictions on the number of projects with Pro plan</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Advanced Export Options</span>
                      <p className="text-gray-600 mt-1">Export to multiple formats including SVG, PNG, and PDF with vector quality</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Smart Templates</span>
                      <p className="text-gray-600 mt-1">Extensive library of smart templates with AI-powered customization</p>
                    </div>
                  </li>
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
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Basic Features</span>
                      <p className="text-gray-500 mt-1">Limited to basic diagramming without AI assistance</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Basic Collaboration</span>
                      <p className="text-gray-500 mt-1">Limited collaboration features with delayed updates</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Limited Projects</span>
                      <p className="text-gray-500 mt-1">Strict limitations on project numbers and storage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Basic Export</span>
                      <p className="text-gray-500 mt-1">Limited export options with quality constraints</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-1">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Basic Templates</span>
                      <p className="text-gray-500 mt-1">Limited template library without smart features</p>
                    </div>
                  </li>
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

        <Testimonials />


        {/* New FAQ Section */}
        <FAQs />
      </main>
    </>
  );
}
