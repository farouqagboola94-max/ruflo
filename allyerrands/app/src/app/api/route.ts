import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Database connectivity check
    let dbStatus: string;
    try {
      await db.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch {
      dbStatus = "disconnected";
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "3.0.0",
      uptime: process.uptime(),
      database: dbStatus,
      endpoints: [
        { method: "GET", path: "/api" },
        { method: "GET", path: "/api/health" },
      ],
      environment: process.env.NODE_ENV ?? "unknown",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}