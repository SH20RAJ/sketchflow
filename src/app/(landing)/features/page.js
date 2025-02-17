'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Users,
  Zap,
  Lock,
  Palette,
  Share2,
  Code2,
  Bot,
  Layers,
  Wand2,
  ArrowRight,
  CheckCircle2,
  Infinity,
  Lightbulb,
  Rocket,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const mainFeatures = [
    {
      icon: Bot,
      title: "AI-Powered Design",
      description: "Smart diagram generation and real-time design suggestions powered by advanced AI",
      color: "from-purple-600 to-indigo-600",
      image: "/features/ai-design.png"
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team in real-time with live cursors and changes",
      color: "from-blue-600 to-cyan-600",
      image: "/features/collaboration.png"
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Blazing fast performance with optimized rendering and instant updates",
      color: "from-amber-600 to-orange-600",
      image: "/features/performance.png"
    }
  ];

  const features = [
    {
      icon: Palette,
      title: "Smart Templates",
      description: "Choose from hundreds of professionally designed templates to kickstart your projects"
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your diagrams with anyone, anywhere, with just a single click"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and SOC2 compliance"
    },
    {
      icon: Code2,
      title: "Developer API",
      description: "Integrate SketchFlow into your workflow with our powerful API"
    },
    {
      icon: Layers,
      title: "Version History",
      description: "Track changes and revert to any previous version with detailed history"
    },
    {
      icon: Wand2,
      title: "Auto Layout",
      description: "Perfect alignment and spacing with intelligent auto-layout features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[length:30px_30px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0V30M28.5 0V30M0 1.5H30M0 28.5H30' stroke='%23000' stroke-opacity='0.7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 font-medium inline-flex items-center gap-2 border border-blue-500/20">
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
            Everything You Need to Create
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SketchFlow combines powerful features with an intuitive interface to help you create beautiful diagrams and collaborate seamlessly.
          </p>
        </motion.div>

        {/* Main Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Feature Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-white shadow-lg scale-105' 
                    : 'hover:bg-white/50'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: activeFeature === index ? 1.05 : 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-2" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 animate-pulse">
                {/* Replace with actual feature preview images */}
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white text-center mb-32"
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-8">
              <Star className="h-4 w-4 text-amber-300" />
              <span className="font-medium">Pro Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Unlock Advanced Features with Pro
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Take your diagrams to the next level with our professional features designed for teams and power users.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Infinity,
                  title: "Unlimited Projects",
                  description: "Create as many projects as you need"
                },
                {
                  icon: Lightbulb,
                  title: "AI Assistant",
                  description: "Get intelligent suggestions and automation"
                },
                {
                  icon: Rocket,
                  title: "Priority Support",
                  description: "Get help when you need it most"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            <Button
              className="mt-12 bg-white text-blue-600 hover:bg-blue-50 group px-8 py-6"
              asChild
            >
              <Link href="/pricing">
                Upgrade to Pro
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust SketchFlow to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl"
              asChild
            >
              <Link href="/signup">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-xl"
              asChild
            >
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 