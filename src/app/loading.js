'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { motion } from 'framer-motion';

export default function Loading() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-4 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
        <div className="absolute top-1/3 -right-4 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          {/* Logo and spinner container */}
          <motion.div 
            variants={itemVariants}
            className="relative mb-10"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-2xl animate-pulse" />
            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-lg flex flex-col items-center justify-center">
              <img src="/logo.png" alt="Logo" className="h-14 w-14 mb-4" />
              {/* <LoadingSpinner className="h-6 w-6 text-blue-600 mb-3" /> */}
              <h2 className="text-2xl font-semibold text-gray-800">SketchFlow</h2>
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text"
          >
            Initializing Workspace
          </motion.h2>

          {/* Loading message */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 text-lg mb-10 font-medium"
          >
            Setting up your professional environment...
          </motion.p>

          {/* Loading progress bar */}
          <motion.div 
            variants={itemVariants}
            className="w-72 h-1.5 bg-gray-100 rounded-full overflow-hidden mx-auto shadow-sm"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}