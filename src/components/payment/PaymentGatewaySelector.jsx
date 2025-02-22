"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function PaymentGatewaySelector({ isOpen, onClose, onSelect, loading }) {
  const paymentGateways = [
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/payment/paypal.svg',
      enabled: true,
      description: 'Pay securely with PayPal'
    },
    {
      id: 'cashfree',
      name: 'Cashfree',
      logo: '/payment/cashfree.png',
      enabled: false,
      description: 'Coming soon'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: '/payment/stripe.svg',
      enabled: false,
      description: 'Coming soon'
    },
    {
      id: 'lemonsqueezy',
      name: 'LemonSqueezy',
      logo: '/payment/lemonsqueezy.png',
      enabled: false,
      description: 'Coming soon'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {paymentGateways.map((gateway) => (
            <Button
              key={gateway.id}
              variant={gateway.enabled ? "outline" : "ghost"}
              className={`w-full h-auto p-4 flex items-center justify-between ${!gateway.enabled && 'opacity-50 cursor-not-allowed'}`}
              onClick={() => gateway.enabled && onSelect(gateway.id)}
              disabled={!gateway.enabled || loading}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src={gateway.logo}
                    alt={gateway.name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{gateway.name}</div>
                  <div className="text-sm text-gray-500">{gateway.description}</div>
                </div>
              </div>
              {loading && gateway.id === 'paypal' && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 