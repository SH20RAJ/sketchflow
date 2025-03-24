'use client';

import { Users, CheckCircle2, Shield } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-4">
            Features
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              create amazing diagrams
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features that help you bring your ideas to life,
            collaborate with your team, and deliver results faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-50" />
              <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Real-time Collaboration
              </h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-600">
              Work together seamlessly with your team in real-time. Share
              ideas instantly and boost productivity.
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-xl blur-lg opacity-50" />
              <div className="relative h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Diagrams
              </h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-600">
              Create professional diagrams with intelligent tools and
              templates. AI-powered suggestions help you design faster.
            </p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
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
          </div>
        </div>
      </div>
    </section>
  );
}