import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PRICING_PLANS } from "@/lib/pricingconfig";
import PayPalSubscribeButton from "@/components/PayPalSubscribeButton";

export default function PricingPage() {
    const initialPayPalOptions = {
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "subscription",
        vault: true,
    };

    return (
        <PayPalScriptProvider options={initialPayPalOptions}>
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Free Plan */}
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">{PRICING_PLANS.FREE.name}</h2>
                        <p className="text-3xl font-bold mb-6">${PRICING_PLANS.FREE.price}/mo</p>
                        <ul className="space-y-3 mb-6">
                            {PRICING_PLANS.FREE.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            disabled
                        >
                            Current Plan
                        </button>
                    </div>

                    {/* Monthly Plan */}
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">{PRICING_PLANS.PRO_MONTHLY.name}</h2>
                        <p className="text-3xl font-bold mb-6">${PRICING_PLANS.PRO_MONTHLY.price}/mo</p>
                        <ul className="space-y-3 mb-6">
                            {PRICING_PLANS.PRO_MONTHLY.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <PayPalSubscribeButton
                            planType="monthly"
                            onSuccess={() => {
                                window.location.reload();
                            }}
                        />
                    </div>

                    {/* Yearly Plan */}
                    <div className="border rounded-lg p-6 bg-white shadow-sm relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                            Best Value
                        </div>
                        <h2 className="text-xl font-semibold mb-4">{PRICING_PLANS.PRO_YEARLY.name}</h2>
                        <p className="text-3xl font-bold mb-6">${PRICING_PLANS.PRO_YEARLY.price}/yr</p>
                        <ul className="space-y-3 mb-6">
                            {PRICING_PLANS.PRO_YEARLY.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <PayPalSubscribeButton
                            planType="yearly"
                            onSuccess={() => {
                                window.location.reload();
                            }}
                        />
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}

function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );
} 