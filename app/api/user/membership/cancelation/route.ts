import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Ensure you have a MongoDB connection utility
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
    const { clerkId, customerId } = await req.json();

    if (!clerkId && !customerId) {
      return NextResponse.json(
        { error: "clerkId or customerId is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user in MongoDB
    const user = await usersCollection.findOne(
      clerkId ? { clerkId } : { customerId }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "Stripe customer ID not found for user" },
        { status: 400 }
      );
    }

    // Retrieve the active subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const subscription = subscriptions.data[0];

    // Cancel the subscription at the end of the billing period
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // Update the user in MongoDB
    const cancelAt = new Date();
    await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          isMemberActive: false,
          cancelAt,
        },
      }
    );

    return NextResponse.json({
      message: "Subscription cancellation scheduled successfully",
      cancelAt,
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
