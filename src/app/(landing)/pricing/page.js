"use client";

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { UpgradeButton } from '@/components/UpgradeButton';

export default function PricingPage() {
  const { data: session } = useSession();

  const handleUpgrade = async () => {
    // Implement your payment logic here
    // This could integrate with Stripe or another payment processor
    console.log('Upgrade to Pro');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-6">$0/month</div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Up to 100 projects
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Basic templates
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Core features
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Community support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-500 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Limited Time Offer
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-4xl font-bold">$2/month</div>
                <div className="text-gray-500 mt-1">
                  <span className="line-through">$19/month</span>
                  <span className="ml-2 text-sm text-blue-600">Save 89%</span>
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  Or $10/year (save even more)
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited projects
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Premium templates
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Advanced features
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Team collaboration
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  API access
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <UpgradeButton className="w-full" />
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          {/* Beta Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Payment Infrastructure in Beta</h3>
            <p className="text-yellow-700 mb-4">
              Our payment system is currently in beta. To request pro access during this phase, please fill out our request form.
            </p>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              asChild
            >
              <a href="https://forms.gle/2V9q1o8SZNZ5GPt47" target="_blank" rel="noopener noreferrer">
                Request Pro Access
              </a>
            </Button>
          </div>

          <div className="text-gray-600">
            <p>All prices are in USD. Billed monthly unless otherwise noted.</p>
            <p className="mt-2">Need custom enterprise pricing? <a href="mailto:sales@sketchflow.space" className="text-blue-600 hover:underline">Contact us</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}