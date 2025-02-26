import { NextResponse } from "next/server";

export async function POST(req) {
  const { orderID } = await req.json();

  const res = await fetch(
    `${process.env.PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
