import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-04-30.basil", // Use the latest API version
});

interface UserCreatedEvent {
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    // Add other relevant fields from Clerk user object if needed
  };
  object: "event";
  type: "user.created";
}

export async function POST(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.error("Error: Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const wh = new Webhook(webhookSecret);
  let evt: UserCreatedEvent;

  try {
    evt = wh.verify(payloadString, {
      "svix-id": svixId,
      "svix-timestamp": svixIdTimeStamp,
      "svix-signature": svixSignature,
    }) as UserCreatedEvent;
  } catch (err: any) {
    console.error("Error verifying webhook:", err.message);
    return NextResponse.json(
      { error: "Webhook verification failed", details: err.message },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const {
      id: clerkUserId,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = evt.data;

    if (
      !email_addresses ||
      email_addresses.length === 0 ||
      !email_addresses[0].email_address
    ) {
      console.error("Error: User created event missing email address");
      return NextResponse.json(
        { error: "User email not found in webhook payload" },
        { status: 400 }
      );
    }
    const primaryEmail = email_addresses[0].email_address;
    const name =
      `${first_name || ""} ${last_name || ""}`.trim() ||
      primaryEmail.split("@")[0];

    try {
      // 1. Create a customer in Stripe
      const customer = await stripe.customers.create({
        email: primaryEmail,
        name: name,
        metadata: {
          clerkUserId: clerkUserId,
        },
      });
      console.log(
        `Stripe customer created: ${customer.id} for Clerk User ID: ${clerkUserId}`
      );

      // 2. Store user information in MongoDB
      const { db } = await connectToDatabase();
      const usersCollection = db.collection("users"); // Or your preferred collection name

      const newUserDocument = {
        clerkId: clerkUserId,
        stripeCustomerId: customer.id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        name: name, // Combined name
        avatarUrl: image_url,
        isOnboardingComplete: false,
        createdAt: new Date(),
        // Add any other fields you want to store
      };

      const result = await usersCollection.insertOne(newUserDocument);
      console.log(
        `User ${clerkUserId} (Stripe: ${customer.id}) inserted into MongoDB with _id: ${result.insertedId}`
      );

      return NextResponse.json(
        {
          success: true,
          message: "User processed successfully",
          clerkId: clerkUserId,
          stripeCustomerId: customer.id,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error processing user.created event:", error);
      let errorMessage = "Internal server error";
      if (error.type === "StripeCardError") {
        // Example of Stripe-specific error handling
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return NextResponse.json(
        { error: "Failed to process user", details: errorMessage },
        { status: 500 }
      );
    }
  } else {
    console.log(`Received unhandled event type: ${eventType}`);
    return NextResponse.json(
      { error: `Unhandled event type: ${eventType}` },
      { status: 400 }
    );
  }
}
