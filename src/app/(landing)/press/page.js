'use client';

import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Download, 
  Camera, 
  Mail, 
  ArrowRight, 
  Award,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function PressPage() {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "SketchFlow Raises $10M Series A to Transform Visual Collaboration",
      description: "Funding led by top-tier VCs will accelerate product development and global expansion.",
      link: "#"
    },
    {
      date: "February 28, 2024",
      title: "SketchFlow Launches Enterprise Plan with Advanced Security Features",
      description: "New enterprise-grade features include SSO, advanced permissions, and audit logs.",
      link: "#"
    },
    {
      date: "January 10, 2024",
      title: "SketchFlow Reaches 100,000 Active Users Milestone",
      description: "Rapid growth demonstrates strong market demand for collaborative design tools.",
      link: "#"
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "100K+",
      label: "Active Users"
    },
    {
      icon: Globe,
      value: "150+",
      label: "Countries"
    },
    {
      icon: TrendingUp,
      value: "2M+",
      label: "Projects Created"
    },
    {
      icon: Award,
      value: "10+",
      label: "Industry Awards"
    }
  ];

  const mediaAssets = [
    {
      title: "Brand Kit",
      description: "Logos, color palette, and brand guidelines",
      icon: Download,
      link: "#"
    },
    {
      title: "Image Library",
      description: "High-resolution product images and screenshots",
      icon: Camera,
      link: "#"
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
            Press & Media
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the latest news, assets, and information about SketchFlow's mission to transform visual collaboration.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-lg border border-white/20"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Press Releases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Latest Press Releases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pressReleases.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
              >
                <time className="text-sm text-gray-500 mb-2 block">{release.date}</time>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.description}</p>
                <Link 
                  href={release.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Assets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Media Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaAssets.map((asset, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <asset.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.title}</h3>
                    <p className="text-gray-600 mb-4">{asset.description}</p>
                    <Button
                      variant="outline"
                      className="hover:bg-blue-50"
                      asChild
                    >
                      <Link href={asset.link}>
                        Download
                        <Download className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Media Inquiries</h2>
            <p className="text-blue-100 mb-6">
              For press inquiries, interview requests, or additional information, please contact our media relations team.
            </p>
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link href="mailto:press@sketchflow.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Press Team
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 