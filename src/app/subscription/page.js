"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PaymentGatewaySelector from "@/components/payment/PaymentGatewaySelector";
import Script from 'next/script';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState(null);

  const { data: subscriptionData, mutate } = useSWR(
    "/api/subscription",
    fetcher
  );

  const isPro = subscriptionData?.isPro;
  const currentPlan = isPro ? "pro" : "free";

  useEffect(() => {
    if (typeof window !== 'undefined' && window.paypal) {
      setPaypalLoaded(true);
    }

    // Show beta notification on component mount
    toast.warning(
      "⚠️ Beta Notice: Subscriptions are currently unavailable as we're in beta. We're working on:",
      {
        description: [
          "• Payment system security enhancements",
          "• Infrastructure scaling improvements",
          "• Feature stability testing",
          "• Integration with multiple payment providers"
        ].join('\n'),
        duration: 10000,
      }
    );
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 100 Projects",
        "Basic Templates",
        "Core Features",
        "Community Support",
        "1GB Storage"
      ]
    },
    {
      id: "pro-monthly",
      name: "Pro Monthly",
      price: "$2",
      oldPrice: "$19",
      period: "/month",
      description: "Best for professionals",
      features: [
        "Unlimited Projects",
        "Premium Templates",
        "Advanced Features",
        "Priority Support",
        "100GB Storage",
        "Team Collaboration",
        "API Access",
        "Custom Branding"
      ]
    },
    {
      id: "pro-yearly",
      name: "Pro Yearly",
      price: "$10",
      oldPrice: "$190",
      period: "/year",
      description: "Save 50% with annual billing",
      features: [
        "Everything in Pro Monthly",
        "6 Months Free",
        "Early Access to New Features",
        "Dedicated Account Manager",
        "Custom Integration Support"
      ]
    }
  ];

  const handleSubscribe = async (planType) => {
    toast.error("Subscriptions are currently unavailable during beta phase. Please check back later!");
    return;
  };

  const handlePaymentGatewaySelect = async (gatewayId) => {
    toast.error("Payment processing is temporarily disabled during our beta phase.");
    setShowPaymentSelector(false);
    setLoading(false);
  };

  const handleNavigation = () => {
    setIsNavigating(true);
    router.push('/projects');
  };

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=AaTYsKq8pPFdA83pEKOvtGjlS9_qtGA9xoI9Z9hNybDPaTc6Mk-eHbouHltIRRfLxzi0FHhnCnKO9d7S&vault=true&intent=subscription"
        data-sdk-integration-source="button-factory"
        strategy="afterInteractive"
        onLoad={() => {
          setPaypalLoaded(true);
          console.log('PayPal SDK loaded');
        }}
        onError={(e) => {
          console.error('PayPal SDK failed to load:', e);
          toast.error("Failed to load payment system. Please refresh the page.");
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Beta Notice Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
                <p className="text-base text-yellow-800 font-medium">
                  Beta Phase Notice
                </p>
              </div>
              <p className="text-yellow-700 mb-4">
                Our payment infrastructure is currently in beta. To request pro access during this phase, please fill out our request form. You can specify whether you'd like free or paid access in the form.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white w-full md:w-auto"
                asChild
              >
                <a href="https://forms.gle/2V9q1o8SZNZ5GPt47" target="_blank" rel="noopener noreferrer">
                  Request Pro Access
                </a>
              </Button>
            </div>
          </div>
        </div>

        <nav className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text mb-2">
              Subscription
            </h1>
            <p className="text-gray-600">
              Manage your subscription plan
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <Button
              onClick={handleNavigation}
              variant="outline"
              className="flex items-center"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowLeft className="mr-2 h-4 w-4" />
              )}
              {isNavigating ? "Navigating..." : "Back to Projects"}
            </Button>
          </div>
        </nav>
        <hr />
        <div className="text-center mt-10 mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
          <p className="text-md text-yellow-600 mt-4">
            ⚠️ Subscriptions will be available soon after beta testing is complete. In the meantime, you can request pro access using our form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto opacity-75">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className={cn(
                "relative overflow-hidden",
                plan.id.startsWith("pro") && "border-blue-500 border-2"
              )}>
                {plan.id === "pro-yearly" && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-baseline gap-2">
                    {plan.oldPrice && (
                      <span className="text-gray-400 line-through text-lg">{plan.oldPrice}</span>
                    )}
                    {plan.price}
                    <span className="text-gray-500 text-base font-normal">{plan.period}</span>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlan === plan.id ? (
                    <Button className="w-full bg-gray-100 text-gray-600 cursor-default" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className={cn(
                        "w-full",
                        plan.id.startsWith("pro") ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"
                      )}
                      onClick={() => handleSubscribe(plan.id.includes("yearly") ? "yearly" : "monthly")}
                      disabled={true}
                    >
                      Request via Form
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <PaymentGatewaySelector
          isOpen={showPaymentSelector}
          onClose={() => {
            setShowPaymentSelector(false);
            setLoading(false);
          }}
          onSelect={handlePaymentGatewaySelect}
          loading={loading}
        />

        {/* PayPal Button Container */}
        <div id="paypal-button-container" className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"></div>
      </div>
    </>
  );
}
