import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const runtime = "nodejs";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      { success: false, error: "MONGODB_URI is missing" },
      { status: 500 },
    );
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();

    const result = await client.db("admin").command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      result,
    });
  } catch (error) {
    console.error("DB CHECK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}