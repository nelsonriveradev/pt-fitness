import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed

export async function POST(req: Request) {
  try {
    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { clerkId: clerkId },
      { $set: { showCongratsForNewSubscription: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      console.warn(
        `[API mark-congrats-shown] User not found for clerkId: ${clerkId}`
      );
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(
      `[API mark-congrats-shown] Congrats flag updated for clerkId: ${clerkId}`
    );
    return NextResponse.json(
      { success: true, message: "Congrats flag updated." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "[API mark-congrats-shown] Error marking congrats as shown:",
      error
    );
    return NextResponse.json(
      { error: "Failed to update congrats flag", details: error.message },
      { status: 500 }
    );
  }
}
