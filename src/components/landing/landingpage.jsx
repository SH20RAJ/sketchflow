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

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <main className="overflow-hidden  ">
        {/* Hero Section */}
        <section
          id="home"
          className="pt-32 min-h-screen flex items-center relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50 pointer-events-none" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
            <div className="absolute top-1/3 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Modern Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm"
              >
                <Star className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-blue-700 font-medium">
                  Trusted by 10,000+ teams worldwide
                </span>
              </motion.div>

              {/* Hero Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Professional{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Whiteboarding
                  </span>
                  <motion.span
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-full"
                  />
                </span>{" "}
                Made{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Simple
                  </span>
                  <motion.span
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-full"
                  />
                </span>
              </h1>

              {/* Hero Description */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into reality with our powerful
                collaborative whiteboarding platform. Perfect for teams who want
                to innovate faster.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                {isAuthenticated ? (
                  <Link href="/projects">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
                <Link
                  href={"/investors"}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl group border-2 hover:border-blue-200 transition-colors"
                  >

                    <Play className="mr-2 h-5 w-5" />
                    Be a Partner
                  </Button>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
                >
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Enterprise-grade security</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Collaborative workspace</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
                >
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Real-time sync</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-4"
              >
                Features
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold text-gray-900 mb-6"
              >
                Everything you need to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  create amazing diagrams
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600"
              >
                Powerful features that help you bring your ideas to life,
                collaborate with your team, and deliver results faster.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-50" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-600">
                  Work together seamlessly with your team in real-time. Share
                  ideas instantly and boost productivity.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-xl blur-lg opacity-50" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Smart Diagrams
                </h3>
                <p className="text-gray-600">
                  Create professional diagrams with intelligent tools and
                  templates. AI-powered suggestions help you design faster.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-100 rounded-xl blur-lg opacity-50" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Share & Clone
                </h3>
                <p className="text-gray-600">
                  Share your diagrams with anyone and let them clone and build upon
                  your work. Perfect for templates and team collaboration.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Simple,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  transparent pricing
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Choose the perfect plan for your needs. No hidden fees.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                  <p className="text-gray-600 mt-2">
                    Perfect for getting started
                  </p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Up to 100 Projects
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Basic Templates
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Core Features
                  </li>
                  <li className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    Community Support
                  </li>
                </ul>
                <Link href="/subscription" className="block">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-xl">
                    Get Started Free
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <p className="text-blue-200 mt-2">For power users & teams</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-bold">$2</span>
                    <span className="text-blue-200">/month</span>
                  </div>
                  <div className="text-blue-200 mt-1">
                    <span className="line-through">$19</span>
                    <span className="ml-2 text-sm">Limited time offer</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Unlimited Projects
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Premium Templates
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Advanced Features
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Priority Support
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Team Collaboration
                  </li>
                  <li className="flex items-center text-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                    Save more with yearly plan ($10/year)
                  </li>
                </ul>
                <Link href="/subscription" className="block">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 rounded-xl">
                    Upgrade to Pro
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Enterprise
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <p className="text-gray-400 mt-2">For large organizations</p>
                </div>
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-5xl font-bold">Custom</span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    <span className="text-sm">Contact us for pricing</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    Dedicated Support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    Custom Integrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    SLA Guarantees
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    Advanced Security
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                    Custom Contract Terms
                  </li>
                </ul>
                <Link href="/subscriptions" className="block">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 py-6 rounded-xl">
                    Contact Sales
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">TESTIMONIALS</span>
              <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Trusted by{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
                    industry leaders
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 7c20-3 40-3 60 0s40 3 60 0" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join the community of visionaries who have transformed their workflow with our platform
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl p-12 relative"
              >
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600 rounded-full opacity-10"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600 rounded-full opacity-10"></div>

                <div className="flex items-center gap-8 mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                    <img
                      src={`/logo.svg`}
                      alt="User"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                        />
                      ))}
                    </div>
                    <p className="font-bold text-2xl text-gray-900">
                      {["John Cater", "Emma Wilson", "Michael Chen"][activeTestimonial]}
                    </p>
                    <p className="text-gray-600 text-lg">
                      {["Software Engineer at Google", "Lead Designer at Apple", "Product Manager at Microsoft"][activeTestimonial]}
                    </p>
                  </div>
                </div>

                <p className="text-2xl text-gray-700 leading-relaxed italic mb-8">
                  "{[
                    "SketchFlow has revolutionized our team's brainstorming sessions. The real-time collaboration features are game-changing!",
                    "As a designer, I've tried many tools, but SketchFlow stands out. The AI-powered suggestions save me hours of work.",
                    "The collaboration features have significantly improved our remote team's productivity. Best investment we've made!"
                  ][activeTestimonial]}"
                </p>

                <div className="flex justify-center gap-4 mt-8">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

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

        {/* New FAQ Section */}
        <section className="py-32 bg-gray-50">
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
              {[
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
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 mb-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
