import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export async function POST(req: Request) {
  const { email = "", password = "" } = await req.json();
  const expected = process.env.DEMO_PASSWORD;
  const upsilon = process.env.UPSILON_URL || "https://upsilon.statbase.eu";
  const forwardToken = process.env.DEMO_FORWARD_TOKEN || ""; // optional

  if (!email) return new NextResponse("Email required", { status: 400 });
  if (!expected) return new NextResponse("Missing DEMO_PASSWORD", { status: 500 });
  if (password !== expected) return new NextResponse("Invalid password", { status: 401 });

  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS demo_allowlist (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      email TEXT,
      domain TEXT
    );
  `;

  const domain = String(email).toLowerCase().split("@")[1] || "";
  const rows = await sql/* sql */`
    SELECT 1 FROM demo_allowlist
     WHERE (email  IS NOT NULL AND lower(email)  = ${String(email).toLowerCase()})
        OR (domain IS NOT NULL AND lower(domain) = ${domain})
     LIMIT 1;
  `;
  if (rows.length === 0) {
    return new NextResponse("Not yet approved. Please request access.", { status: 403 });
  }

  // Success → send destination URL
  const nextUrl = forwardToken ? `${upsilon}?demo=${encodeURIComponent(forwardToken)}` : upsilon;
  return NextResponse.json({ ok: true, next: nextUrl });
}