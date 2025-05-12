import { connectToDatabase } from "../mongodb/mongo";
import { ObjectId } from "mongodb";

export interface PaymentLog {
  userId: string;
  stripeCustomerId: string;
  subscriptionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  membershipType: string;
  status: string;
  createdAt: Date;
  renewalDate: Date;
  receiptUrl?: string;
  paymentMethod?: string;
}

export async function insertPayment(payment: PaymentLog) {
  const { db } = await connectToDatabase();
  try {
    db.collection("payments").insertOne(payment);
    console.log(
      `Payment Log of ${payment.userId} sucessfully inserted: ${payment}`
    );
  } catch (error) {
    console.log("Error inserting paymentLog into DB", error);
  }
}
