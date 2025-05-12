import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongo"; // Adjust path as needed

export async function GET(
  req: Request,
  { params }: { params: { clerkId: string } }
) {
  try {
    const awaitedParams = await params;
    const { clerkId } = awaitedParams;

    if (!clerkId) {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users"); // Or your user collection name

    const user = await usersCollection.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optionally, remove sensitive data before sending it back
    // For example, if you store password hashes (though Clerk handles auth, so unlikely here)
    // or other internal fields.
    // delete user.passwordHash;

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user by Clerk ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    );
  }
}
