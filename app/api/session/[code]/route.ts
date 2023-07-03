import { fetchConfirmedSubmissions } from "@/lib/pretalx";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const sessions = await fetchConfirmedSubmissions();

  const session = sessions.find((session) => session.code === params.code);

  if (!session) {
    throw notFound();
  }

  return NextResponse.json({ session });
}
