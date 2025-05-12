import { connectToDatabase } from "@/lib/mongodb/mongo";

export async function logPayment({
  clerkId,
  stripeCustomerId,
  sessionId,
  subscriptionId,
  amountTotal,
  currency,
  paymentStatus,
  membershipType,
}: {
  clerkId: string;
  stripeCustomerId: string;
  sessionId: string;
  subscriptionId: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  membershipType: string;
}) {
  const { db } = await connectToDatabase();
  const paymentsCollection = db.collection("payments");

  const result = await paymentsCollection.insertOne({
    clerkId,
    stripeCustomerId,
    sessionId,
    subscriptionId,
    amountTotal,
    currency,
    paymentStatus,
    membershipType,
    createdAt: new Date(),
  });

  return result;
}
