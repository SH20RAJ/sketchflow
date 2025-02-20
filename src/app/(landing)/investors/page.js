import React from 'react'
import Image from 'next/image'

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Invest in the Future of Design
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Join us in revolutionizing the design workflow automation space
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Why Invest?</h2>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start">
                <span className="text-gray-700">• Growing market in design automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700">• Innovative AI-powered solutions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700">• Strong team with industry expertise</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-gray-700">
              Interested in learning more about investment opportunities? 
              Get in touch with our team.
            </p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Schedule a Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
