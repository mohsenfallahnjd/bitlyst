import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? "";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!AUDIENCE_ID) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  const { error } = await resend.contacts.create({
    email,
    audienceId: AUDIENCE_ID,
    unsubscribed: false,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
