import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed
import { PaymentLog } from "@/lib/actions/insertPayment"; // Assuming PaymentLog type is here or accessible

// filepath: c:\Users\Laptop 1\Documents\Programing\pt-fitness\app\api\user\payments\[id]\route.ts
// ...existing code...
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await params;
    const { id } = awaitedParams;
    console.log("[API /user/payments/[id]] Received GET request for id:", id); // Log incoming ID

    if (!id) {
      console.log("[API /user/payments/[id]] Clerk ID is required in params.");
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    console.log("[API /user/payments/[id]] Connected to database.");
    const paymentsCollection = db.collection<PaymentLog>("payments");

    const paymentLogs = await paymentsCollection
      .find({ userId: id })
      .sort({ createdAt: -1 })
      .toArray();
    console.log(
      `[API /user/payments/[id]] Found ${paymentLogs.length} payment logs for userId: ${id}`,
      paymentLogs
    ); // Log fetched data

    // No need to check if !paymentLogs, as toArray() returns an empty array if no documents match.
    // The client will receive an empty array, which is fine.

    return NextResponse.json(paymentLogs, { status: 200 });
  } catch (error: any) {
    console.error(
      "[API /user/payments/[id]] Error fetching payment logs:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to fetch payment logs", details: error.message },
      { status: 500 }
    );
  }
}
