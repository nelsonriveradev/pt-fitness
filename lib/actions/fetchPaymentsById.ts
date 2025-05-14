import { connectToDatabase } from "../mongodb/mongo";
import { PaymentLog } from "./insertPayment";

export async function fetchPaymentsById(
  clerkId: string
): Promise<PaymentLog[] | undefined> {
  try {
    const { db } = await connectToDatabase();
    const paymentsCollection = db.collection<PaymentLog>("payments");

    const payments = await paymentsCollection
      .find({ userId: clerkId })
      .toArray();
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return undefined;
  }
}
