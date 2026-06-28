import { NextResponse } from "next/server";
import { listResponses } from "@/lib/responses";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password") || request.headers.get("x-admin-password");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || password !== expectedPassword) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const responses = await listResponses();
    return NextResponse.json({ responses });
  } catch {
    return NextResponse.json({ error: "Could not load results." }, { status: 500 });
  }
}
