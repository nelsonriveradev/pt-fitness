import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed

interface UpdateUserSubscriptionParams {
  stripeCustomerId: string; // Or clerkId if you prefer to find user by clerkId
  subscriptionId: string;
  membershipType: string;
  renewalDate: Date;
  // Add other relevant fields like stripeSubscriptionStatus, etc.
}

export async function updateUserSubscription({
  stripeCustomerId,
  subscriptionId,
  membershipType,
  renewalDate,
}: UpdateUserSubscriptionParams) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const updateResult = await usersCollection.updateOne(
      { stripeCustomerId: stripeCustomerId }, // Or { clerkId: userIdFromWebhookMetadata }
      {
        $set: {
          stripeSubscriptionId: subscriptionId,
          membershipType: membershipType,
          isMemberActive: true, // Assuming successful subscription means active
          membershipRenewalDate: renewalDate,
          showCongratsForNewSubscription: true, // <-- ADD THIS LINE
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.error(
        `Failed to find user with stripeCustomerId: ${stripeCustomerId} to update subscription.`
      );
      // Potentially create the user or handle error differently
      return {
        success: false,
        message: "User not found for subscription update.",
      };
    }

    console.log(
      `User subscription updated for stripeCustomerId: ${stripeCustomerId}`
    );
    return { success: true, message: "Subscription updated successfully." };
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error; // Re-throw or handle as needed
  }
}
