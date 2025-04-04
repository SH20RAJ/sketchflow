'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function PremiumLoader({ message = "Loading your content..." }) {
  const [showLoader, setShowLoader] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  // Only show loader after a short delay to avoid flashing for quick loads
  useEffect(() => {
    const loaderTimer = setTimeout(() => setShowLoader(true), 300);
    const messageTimer = setTimeout(() => setShowMessage(true), 1200);
    
    return () => {
      clearTimeout(loaderTimer);
      clearTimeout(messageTimer);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="relative">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            
            {/* Logo or brand element */}
            <div className="relative bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-blue-600">
                  <motion.path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "loop",
                      repeatDelay: 0.5
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8 text-center"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {message}
                </h3>
                <p className="text-sm text-gray-500">
                  Preparing your workspace...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PremiumCardSkeleton({ count = 6, showBranding = false }) {
  // Shimmer effect animation
  const shimmer = `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `;
  
  const cards = Array(count).fill(0).map((_, i) => (
    <div
      key={i}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative"
      style={{ height: '220px' }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 border-l-4 border-l-blue-500 opacity-70"></div>
      
      {/* Card header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/5" 
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full w-16"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
          <div className="h-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full w-20"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
        </div>
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
        </div>
      </div>
      
      {/* Card footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"
               style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
        </div>
        <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
             style={{ animation: 'shimmer 2s infinite linear', backgroundSize: '1000px 100%' }}></div>
      </div>
      
      {/* SketchFlow branding watermark (optional) */}
      {showBranding && (
        <div className="absolute bottom-16 right-4 opacity-10">
          <svg width="40" height="40" viewBox="0 0 24 24" className="text-blue-900">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      )}
      
      {/* Add shimmer animation */}
      <style jsx>{shimmer}</style>
    </div>
  ));
  
  return (
    <>
      {cards}
    </>
  );
}

export function PremiumEmptyState({ message, icon, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-4 bg-gradient-to-b from-white to-blue-50 border border-blue-100 rounded-xl shadow-sm"
    >
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Get started by creating your first project or exploring templates
      </p>
      
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          onClick={onAction}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
