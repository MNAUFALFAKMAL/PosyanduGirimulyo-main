import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_MAX_AGE_SECONDS, createAuthCookieValue, findAccount } from "@/lib/auth";

const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function getAttemptKey(request, email) {
  return `${getClientIp(request)}:${String(email || "").trim().toLowerCase()}`;
}

function isRateLimited(key) {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(key, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }

  return attempt.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return;
  }

  loginAttempts.set(key, { ...attempt, count: attempt.count + 1 });
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const attemptKey = getAttemptKey(request, email);

    if (isRateLimited(attemptKey)) {
      return NextResponse.json({ error: "Terlalu banyak percobaan login. Coba lagi beberapa menit lagi." }, { status: 429 });
    }

    const account = findAccount(email, password);

    if (!account) {
      recordFailedAttempt(attemptKey);
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    loginAttempts.delete(attemptKey);

    const response = NextResponse.json({ ok: true, account: { label: account.label, role: account.role } });
    response.cookies.set(AUTH_COOKIE, createAuthCookieValue(account), {
      httpOnly: true,
      maxAge: AUTH_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Gagal login:", error);

    return NextResponse.json(
      { error: "Login belum dapat diproses. Periksa konfigurasi server." },
      { status: 500 },
    );
  }
}
