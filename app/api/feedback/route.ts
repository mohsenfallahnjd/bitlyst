import { NextResponse } from "next/server";
import { Resend } from "resend";



export async function POST(req: Request) {
  const { message, email, slug } = await req.json();

  if (!message || typeof message !== "string" || message.trim().length < 3) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const from = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Bitlyst Feedback <onboarding@resend.dev>",
      to: "mohsenfallahnjd@gmail.com",
      replyTo: from ?? undefined,
      subject: `Feedback on: ${slug ?? "unknown"}`,
      text: [
        `Post: /blog/${slug ?? "unknown"}`,
        from ? `From: ${from}` : "From: anonymous",
        "",
        message.trim(),
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback send failed:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
