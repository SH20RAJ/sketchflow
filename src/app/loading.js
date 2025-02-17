'use client';

import React from 'react'
import { LoadingSpinner } from '@/components/ui/loading'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner className="h-8 w-8 text-gray-600 animate-spin" />
       </div>
    </div>
  )
}
