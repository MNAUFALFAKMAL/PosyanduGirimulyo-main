import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = getAuthSession(cookies());

    return NextResponse.json({
      authenticated: Boolean(session),
      session: session
        ? {
            label: session.label,
            role: session.role,
            posyanduName: session.posyanduName,
          }
        : null,
    });
  } catch (error) {
    console.error("Gagal membaca session:", error);

    return NextResponse.json(
      { authenticated: false, error: "Session tidak dapat diverifikasi." },
      { status: 500 },
    );
  }
}
