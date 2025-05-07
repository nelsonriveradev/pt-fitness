import { MongoClient, Db, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cachedClient && cachedDb) {
    // Return cached connection if available
    return { client: cachedClient, db: cachedDb };
  }

  // Create a new MongoClient instance with Server API options
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    const db = client.db(dbName);

    // Cache the client and db connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // Ensure the client will close when you finish/error
    await client.close();
    throw error; // Re-throw the error after logging and cleanup
  }
}

// Optional helper function to quickly get the DB instance
export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
