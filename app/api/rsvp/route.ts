import { NextResponse } from "next/server";
import { saveResponse } from "@/lib/responses";

const MAX_NOTE_LENGTH = 600;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      movie?: unknown;
      note?: unknown;
    };

    const movie = typeof body.movie === "string" ? body.movie.trim() : "";
    const note = typeof body.note === "string" ? body.note.slice(0, MAX_NOTE_LENGTH) : "";

    if (!movie) {
      return NextResponse.json({ error: "Movie is required." }, { status: 400 });
    }

    await saveResponse({
      movie,
      note,
      userAgent: request.headers.get("user-agent")
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save response." }, { status: 500 });
  }
}
