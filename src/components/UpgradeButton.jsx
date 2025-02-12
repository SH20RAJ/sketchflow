import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import Script from 'next/script';

export function UpgradeButton({ planType = 'monthly' }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        try {
            if (!session) {
                toast.error('Please sign in to upgrade');
                return;
            }

            setLoading(true);

            // Create order
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ planType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment');
            }

            // Initialize Cashfree Payments SDK
            const cashfree = new window.Cashfree();

            const paymentConfig = {
                orderToken: data.order_token,
                orderNumber: data.order_id,
                onSuccess: function (data) {
                    toast.success('Payment successful!');
                    // Reload the page to update subscription status
                    window.location.reload();
                },
                onFailure: function (data) {
                    toast.error('Payment failed. Please try again.');
                    console.error('Payment failed:', data);
                },
                onClose: function () {
                    toast.info('Payment window closed');
                    setLoading(false);
                },
                components: ["order-details", "card", "netbanking", "app", "upi"],
                style: {
                    backgroundColor: "#ffffff",
                    color: "#11111",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    errorColor: "#ff0000",
                    theme: "light" // or dark
                }
            };

            // Render payment form
            cashfree.initialiseDropin(paymentConfig);

        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Failed to process payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleUpgrade}
            disabled={loading || !session}
            className="w-full"
            size="lg"
            variant="premium"
        >
            {loading ? 'Processing...' : `Upgrade to Pro ${planType === 'yearly' ? '(Yearly)' : '(Monthly)'}`}
        </Button>
    );
} 