export async function fetchUserByClerkId(clerkId: string) {
  try {
    console.log("Fetching user with Clerk ID:", clerkId);
    const response = await fetch(`/api/user/${clerkId}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from API:", errorData);
      throw new Error(errorData.error || "Failed to fetch user");
    }
    const userData = await response.json();
    console.log("Fetched user data:", userData);
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in fetchUserByClerkId:", error.message);
    }
    throw error; // Re-throw the error to be handled by the caller
  }
}
