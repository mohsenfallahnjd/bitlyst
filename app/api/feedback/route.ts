import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, readJsonBody } from "@/lib/requestGuards";
import { SLUG_RE } from "@/lib/stats";

export async function POST(req: Request) {
  const limited = await rateLimit(req, "feedback", 5, 60 * 60);
  if (limited) {
    return limited;
  }

  const { message, email, slug } = await readJsonBody(req);

  if (typeof message !== "string" || message.trim().length < 3) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  if (message.trim().length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const from = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
  const source = typeof slug === "string" && SLUG_RE.test(slug) ? slug : "unknown";

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Bitlyst Feedback <onboarding@resend.dev>",
      to: "mohsenfallahnjd@gmail.com",
      replyTo: from ?? undefined,
      subject: `Feedback on: ${source}`,
      text: [`Post: /p/${source}`, from ? `From: ${from}` : "From: anonymous", "", message.trim()].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Feedback send failed:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
