'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';

export default function Loading() {
  // Variants for staggered animation of elements
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          {/* Logo and spinner container */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl animate-pulse" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">
              <img src="/logo.svg" alt="Logo" className="h-12 w-12 mb-4" />
              {/* <LoadingSpinner className="h-8 w-8 text-blue-600" /> */}
              <h2 className="text-2xl font-bold">SketchFlow</h2>
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            Loading your workspace
          </motion.h2>

          {/* Loading message */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 text-lg mb-8"
          >
            Preparing your creative canvas...
          </motion.p>

          {/* Loading progress bar */}
          <motion.div 
            variants={itemVariants}
            className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}