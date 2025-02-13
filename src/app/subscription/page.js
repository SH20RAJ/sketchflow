"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const { data: subscriptionData, mutate } = useSWR(
    "/api/subscription",
    fetcher
  );

  const isPro = subscriptionData?.isPro;
  const currentPlan = isPro ? "pro" : "free";

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
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
      price: "₹1,999",
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
      price: "₹19,999",
      period: "/year",
      description: "Save 17% with annual billing",
      features: [
        "Everything in Pro Monthly",
        "2 Months Free",
        "Early Access to New Features",
        "Dedicated Account Manager",
        "Custom Integration Support"
      ]
    }
  ];

  const handleSubscribe = async (planType) => {
    try {
      setLoading(true);
      setSelectedPlan(planType);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Payment initialization failed");

      // Initialize Cashfree Payment
      if (typeof window.Cashfree === 'undefined') {
        throw new Error('Cashfree SDK not loaded');
      }

      const cashfree = new window.Cashfree({
        mode: "sandbox" // or "production" based on environment
      });

      await cashfree.checkout({
        paymentSessionId: data.order_token,
        returnUrl: `${window.location.origin}/payment/status?order_id={order_id}`,
        onSuccess: (data) => {
          console.log("Payment success:", data);
          mutate(); // Refresh subscription data
          router.push("/projects");
        },
        onFailure: (data) => {
          console.error("Payment failed:", data);
          alert("Payment failed. Please try again.");
          setLoading(false);
          setSelectedPlan(null);
        },
        onClose: () => {
          setLoading(false);
          setSelectedPlan(null);
        },
      });

    } catch (error) {
      console.error("Subscription error:", error);
      alert(error.message || "Failed to process subscription");
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="container mx-auto px-4  py-8">

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
             onClick={() => router.push('/projects')}
             variant="outline"
             className="flex items-center"
           >
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to Projects
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                    disabled={loading && selectedPlan === plan.id}
                  >
                    {loading && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.id === "free" ? "Get Started" : "Upgrade"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          {[
            {
              q: "Can I change plans later?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit/debit cards, UPI, and net banking through our secure payment gateway."
            },
            {
              q: "Is there a refund policy?",
              a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service."
            }
          ].map(({ q, a }, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
