"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import useSWR, { mutate } from 'swr';

export default function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id');
        if (!orderId) {
          setStatus('error');
          setMessage('Invalid payment session');
          return;
        }

        // Verify payment status
        const response = await fetch(`/api/payments/verify?order_id=${orderId}`);
        const data = await response.json();

        if (response.ok) {
          if (data.status === 'PAID' || data.status === 'SUCCESS') {
            setStatus('success');
            setMessage('Payment successful! Your subscription has been activated.');
            // Refresh subscription data
            await mutate('/api/subscription');
          } else {
            setStatus('error');
            setMessage(data.message || 'Payment verification failed');
          }
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' ? 'Verifying Payment' :
               status === 'success' ? 'Payment Successful!' :
               'Payment Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' ? 'Please wait while we verify your payment...' : message}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6">
            {status === 'loading' ? (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}

            <div className="mt-8 space-y-4 w-full">
              {status !== 'loading' && (
                <Button
                  className="w-full"
                  onClick={() => router.push('/projects')}
                >
                  {status === 'success' ? 'Go to Dashboard' : 'Try Again'}
                </Button>
              )}
              {status === 'error' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/subscription')}
                >
                  Back to Plans
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 