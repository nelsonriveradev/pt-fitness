// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { insertPayment, PaymentLog } from "@/lib/actions/insertPayment";
// import { buffer } from 'micro';
import { updateUserSubscription } from "@/lib/actions/updateUserSubscription";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (userId && plan) {
      await updateUserSubscription({
        stripeCustomerId: session.customer as string,
        subscriptionId: session.subscription as string,
        membershipType: plan,
        renewalDate: new Date(subscription.billing_cycle_anchor),
      });
      const paymentLog: PaymentLog = {
        userId: userId,
        stripeCustomerId: session.customer as string,
        subscriptionId: session.subscription as string,
        paymentIntentId: session.payment_intent as string,
        amount: session.amount_total!,
        membershipType: plan,
        currency: session.currency!,
        status: session.payment_status,
        createdAt: new Date(),
        renewalDate: new Date(subscription.billing_cycle_anchor * 1000),
        receiptUrl: session.invoice! as string,
        paymentMethod: session.payment_method_types[0]! || "unknown",
      };

      await insertPayment(paymentLog);
    }
  }

  return NextResponse.json({ received: true, status: 200 });
}
