import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed
import type { UserOnboardingData } from "@/app/onboarding/page"; // Adjust path as needed

export async function POST(req: Request) {
  try {
    const { clerkId, onboardingData } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }
    if (!onboardingData) {
      return NextResponse.json(
        { error: "Onboarding data is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users"); // Or your user collection name

    // Prepare the update object. You might want to be more specific
    // about which fields can be updated from onboarding.
    const updateData: Partial<UserOnboardingData> & { updatedAt: Date } = {
      ...onboardingData,
      isOnboardingComplete: true, // Ensure this is set
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be directly set or are immutable if necessary
    // delete updateData.firstName; // Example: if firstName is set at user creation and not updatable here

    const result = await usersCollection.updateOne(
      { clerkId: clerkId }, // Find the user by their Clerk ID
      { $set: updateData } // Set the new onboarding data
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      // This could mean the data was the same, or onboarding was already complete
      // You might want to handle this case specifically or just consider it a success
      console.log(
        `Onboarding data for user ${clerkId} was already up-to-date or no changes made.`
      );
    }

    console.log(`Onboarding data updated for user ${clerkId}`);
    return NextResponse.json(
      { success: true, message: "Onboarding completed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding", details: error.message },
      { status: 500 }
    );
  }
}
