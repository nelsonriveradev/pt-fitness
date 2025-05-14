import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb/mongo";
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");
    const checkinsCollection = db.collection("check-in");

    // 1. Get the user by clerkId
    const user = await usersCollection.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Check if user is an active member
    if (!user.isMemberActive) {
      return NextResponse.json(
        {
          error: "Membership inactive",
          status: "denied",
        },
        { status: 403 }
      );
    }

    // 3. Optional: Prevent duplicate check-in in the last 10 mins
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCheckIn = await checkinsCollection.findOne({
      userId,
      timestamp: { $gte: tenMinutesAgo },
    });

    if (recentCheckIn) {
      return NextResponse.json(
        {
          message: "Check-in already recorded recently.",
          status: "duplicate",
        },
        { status: 200 }
      );
    }

    // 4. Insert check-in record
    await checkinsCollection.insertOne({
      userId,
      timestamp: new Date(),
      method: "qr",
    });

    return NextResponse.json(
      {
        message: "Check-in recorded successfully.",
        status: "success",
        userResult: {
          isMemberActive: user.isMemberActive,
          name: `${user.firstName} ${user.lastName}`,
          profileImage: user.avatarUrl,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
