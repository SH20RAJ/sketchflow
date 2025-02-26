"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PayPalSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      {!isSubscribed ? (
        <PayPalButtons
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: "YOUR_PAYPAL_PLAN_ID", // Get this from PayPal dashboard
            });
          }}
          onApprove={(data, actions) => {
            setIsSubscribed(true);
            console.log("Subscription Approved:", data);
            // Call your backend to store the subscription data
          }}
        />
      ) : (
        <p>✅ Subscription Active</p>
      )}
    </PayPalScriptProvider>
  );
}
