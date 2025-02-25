'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Simple,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              <p className="text-gray-600 mt-2">
                Perfect for getting started
              </p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-bold">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                Up to 100 Projects
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                Basic Templates
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                Core Features
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                Community Support
              </li>
              <li className="flex items-center text-gray-500/50">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                AI Features (Coming Soon)
              </li>
            </ul>
            <Link href="/subscription" className="block">
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 rounded-xl">
                Get Started Free
              </Button>
            </Link>
          </div>
          <div className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-blue-200 mt-2">For power users & teams</p>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="text-5xl font-bold">$2</span>
                <span className="text-blue-200">/month</span>
              </div>
              <div className="text-blue-200 mt-1">
                <span className="line-through">$19</span>
                <span className="ml-2 text-sm">Limited time offer</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                Unlimited Projects
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                Premium Templates
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                Advanced Features
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                AI Features 🪄
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                Team Collaboration
              </li>
              <li className="flex items-center text-blue-100">
                <CheckCircle2 className="h-5 w-5 text-blue-300 mr-3" />
                Save more with yearly plan ($10/year)
              </li>
            </ul>
            <Link href="/subscription" className="block">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 py-6 rounded-xl">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
          <div className="bg-gray-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              Enterprise
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-gray-400 mt-2">For large organizations</p>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <span className="text-5xl font-bold">Custom</span>
              </div>
              <div className="text-gray-400 mt-1">
                <span className="text-sm">Contact us for pricing</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                Dedicated Support
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                Custom Integrations
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-gray-500 mr-3" />
                SLA Guarantees
              </li>
            </ul>
            <Link href="/contact" className="block">
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 py-6 rounded-xl">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}