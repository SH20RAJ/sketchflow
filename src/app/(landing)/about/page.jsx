'use client';

import { motion } from 'framer-motion';
import { Rocket, Users, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const values = [
    {
      icon: Rocket,
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of teamwork"
    },
    {
      icon: Sparkles,
      title: "Simplicity",
      description: "We make complex things simple"
    },
    {
      icon: Shield,
      title: "User-First",
      description: "We build for our users' needs"
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
            About SketchFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the way teams collaborate and create together, making visual communication seamless and effective.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 mb-16"
        >
          {/* <img src="/logo.png" alt="logo" /> */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to empower teams with intuitive tools that make collaboration
              seamless and effective, regardless of where team members are located. We believe
              that great ideas can come from anywhere, and our platform makes it possible for
              those ideas to be shared, refined, and brought to life.
            </p>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-2" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                {/* Replace with actual office/team image */}
                <img src="/logo.png" alt="logo" />
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Founded in 2025, SketchFlow emerged from a simple observation: teams needed
              a better way to collaborate visually. We've built a platform that combines
              the best of whiteboarding and documentation, making it easier than ever for
              teams to work together.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, thousands of teams worldwide use SketchFlow to bring their ideas to life,
              from startups to Fortune 500 companies.
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Join Us on Our Journey
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the future of collaborative design and documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl"
              asChild
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 rounded-xl"
              asChild
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
