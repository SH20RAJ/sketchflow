import React from 'react'
import { LoadingSpinner } from '@/components/ui/loading'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 text-white mb-4" />
        <h2 className="text-2xl font-semibold text-white">Loading...</h2>
        <p className="text-white mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  )
}
