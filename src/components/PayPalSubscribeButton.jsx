import { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'sonner';

export default function PayPalSubscribeButton({ planType, onSuccess }) {
    const planId = planType === 'yearly'
        ? process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID
        : process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID;

    return (
        <PayPalButtons
            createSubscription={(data, actions) => {
                return actions.subscription.create({
                    'plan_id': planId
                });
            }}
            onApprove={async (data, actions) => {
                try {
                    // Call your backend to validate and save the subscription
                    const response = await fetch('/api/payments/paypal/subscribe/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            subscriptionId: data.subscriptionID,
                            planType,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to verify subscription');
                    }

                    const result = await response.json();

                    toast.success('Subscription activated successfully!');
                    if (onSuccess) {
                        onSuccess(result);
                    }
                } catch (error) {
                    console.error('Subscription verification failed:', error);
                    toast.error('Failed to activate subscription. Please contact support.');
                }
            }}
            onError={(err) => {
                console.error('PayPal error:', err);
                toast.error('Payment failed. Please try again.');
            }}
            style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'subscribe'
            }}
        />
    );
} 