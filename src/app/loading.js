'use client';

import React from 'react'
import { LoadingSpinner } from '@/components/ui/loading'
import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
          <LoadingSpinner className="relative h-12 w-12 text-blue-600 mb-4" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
          Loading...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare your content</p>
      </motion.div>
    </div>
  )
}
