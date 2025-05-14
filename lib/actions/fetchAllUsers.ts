import { connectToDatabase } from "../mongodb/mongo";

export async function fetchAllUsers() {
  const { db } = await connectToDatabase();
  try {
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    if (users.length > 0) {
      console.log("All users fetched");
    }
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
