import { NextResponse } from "next/server";
import { fetchAllUsers } from "@/lib/actions/fetchAllUsers";
export async function GET() {
  try {
    const users = await fetchAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
