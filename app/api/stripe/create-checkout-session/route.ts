// app/api/create-checkout-session/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, userId, customerId } = body;

    // Define your Stripe Price IDs for each plan
    const priceMap: Record<string, string> = {
      basic: "price_1RMB3OB78rrmHuTOSloxSB1E",
      standard: "price_1RMB4gB78rrmHuTOjbFlX0Ce",
      premium: "price_1RMB5PB78rrmHuTO8aerbPMI",
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/miembro/${userId}?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/miembro/${userId}?status=cancelled`,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
