// app/api/demo/lead/route.ts
import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = (fwd.split(",")[0] || "").trim(); // first IP in the chain

  const { name = "", email = "", org = "", role = "", note = "", consent = false } = await req.json();

  if (!email) return new NextResponse("Email required", { status: 400 });
  if (!consent) return new NextResponse("Consent is required", { status: 400 });

  // Create table with GDPR fields if not exists
  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS demo_leads (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT, email TEXT, org TEXT, role TEXT, note TEXT,
      consent BOOLEAN DEFAULT FALSE,
      consent_at TIMESTAMPTZ,
      consent_ip TEXT,
      user_agent TEXT
    );
  `;

  await sql/* sql */`
    INSERT INTO demo_leads (name, email, org, role, note, consent, consent_at, consent_ip, user_agent)
    VALUES (${name}, ${email}, ${org}, ${role}, ${note}, ${!!consent}, NOW(), ${ip}, ${ua});
  `;

  return NextResponse.json({ ok: true });
}