import crypto from "node:crypto";

export const AUTH_COOKIE = "posyandu_girimulyo_auth";
export const AUTH_EMAIL = "admin@posyandu.com";
export const AUTH_MAX_AGE_SECONDS = 60 * 60 * 8;

const DEV_AUTH_SECRET = "dev-only-posyandu-girimulyo-change-in-production";

export const POSYANDU_ACCOUNTS = [
  {
    id: "admin",
    label: "Plamboyan",
    passwordHashes: [
      "scrypt:4twvQpppCukpzYhrPrC7dQ:f1Sml071A_zYw6zCGBGm4RNi0D8x6r7ypnWqE00aFBU",
    ],
    role: "admin",
    posyanduName: "Plamboyan",
  },
  ...Array.from({ length: 6 }, (_, index) => {
    const number = index + 1;
    const hashes = {
      1: [
        "scrypt:wLEo3rNswCo46kZi0O0eWQ:ArQFGjbuADBT0Aun-_F1xfKtb3YUy_PL41nYd-Pdb8M",
        "scrypt:zwfpmSN4_z0RvFSyU02KOw:LNCBaTUK9EU7q8P2WM-2m6FJyxyeHZmwOCOBk_TIf28",
      ],
      2: [
        "scrypt:GnpCVuUSfedX0sUW4uXjSw:PfhgbCa8ZHx9t4wzZxKMkftlzpIEOLu6kZafxK7gnvc",
        "scrypt:WZBKVLX_OHsyh0GuLhTV9w:uu8-MiD1YHo-e3ze_vbxVUhqX0bU44FG8Ou62wvK75w",
      ],
      3: [
        "scrypt:5J9tssSg-bAsYdwj5UqgSw:bOgdVOK5cXqLzzNPeBRHkIa-0BImqRVMDuL_AE8IGH4",
        "scrypt:uw2qAQ9UQWhiZV_bnXsRug:9KMCxJQFiBDsQ_n1QLWlt6L2Bx0KwOmGwaiQ-8GFxrQ",
      ],
      4: [
        "scrypt:EDrOA1UYAOT3fKB3QK4XFQ:6ZhXTJ8LyykUfukRKn_EWjsReQyn7yQfM7ac4sOaVH8",
        "scrypt:Q4zR6uWBgTJ1j_5Zy6flcw:FOSNZOAwftDE860t5XBr50t_0qfV1PxCUPMZFazf6v4",
      ],
      5: [
        "scrypt:mU_tWshyjxg0wJUgA0wmfw:1HWKQNkvMCM8hCpKWRl3UpgZVCpa_XBDFEjtU5hN6pw",
        "scrypt:sfTuC9rriC6_VBFj3mrHRw:GjyHC5zEqjjWN-bjMLZU9vYDprplaCy5alUkR46Qi6A",
      ],
      6: [
        "scrypt:nrbO9Le0NpfkvhYchRbFQA:ToTSA74j1yw0hzxEeqL5CSFPBmYcHnQwRpJKAG9a4c0",
        "scrypt:4ekYWG6u4Qp9gW6ZksRXnw:EF9uZDtvoMiuK-ynklzaJ91UXFgq_gYv0p3SpS6qF4Y",
      ],
    };

    return {
      id: `plamboyan-${number}`,
      label: `Plamboyan ${number}`,
      passwordHashes: hashes[number],
      role: "posyandu",
      posyanduName: `Plamboyan ${number}`,
    };
  }),
];

function getAuthSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET wajib diisi pada environment production.");
  }

  return DEV_AUTH_SECRET;
}

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload) {
  return crypto.createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  if (leftBuffer.length !== rightBuffer.length) return false;

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyPasswordHash(password, passwordHash) {
  const [algorithm, salt, expectedHash] = String(passwordHash || "").split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHash) return false;

  const actualHash = crypto.scryptSync(password, salt, 32).toString("base64url");
  return safeEqual(actualHash, expectedHash);
}

function encodeSession(account) {
  const payload = toBase64Url(JSON.stringify({
    exp: Date.now() + AUTH_MAX_AGE_SECONDS * 1000,
    id: account.id,
    label: account.label,
    role: account.role,
    posyanduName: account.posyanduName,
  }));
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

function decodeSession(value) {
  if (!value || !value.includes(".")) return null;

  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature || !safeEqual(signPayload(payload), signature)) return null;

    const session = JSON.parse(fromBase64Url(payload));
    if (!session.exp || Date.now() > session.exp) return null;

    const account = POSYANDU_ACCOUNTS.find((item) => item.id === session.id);
    if (!account) return null;

    return {
      id: account.id,
      label: account.label,
      role: account.role,
      posyanduName: account.posyanduName,
    };
  } catch {
    return null;
  }
}

export function findAccount(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim().toLowerCase();

  if (normalizedEmail !== AUTH_EMAIL) return null;

  return POSYANDU_ACCOUNTS.find((account) => (
    account.passwordHashes.some((passwordHash) => verifyPasswordHash(normalizedPassword, passwordHash))
  )) || null;
}

export function createAuthCookieValue(account) {
  return encodeSession(account);
}

export function getAuthSession(cookieStore) {
  return decodeSession(cookieStore.get(AUTH_COOKIE)?.value);
}

export function isAuthenticated(cookieStore) {
  return Boolean(getAuthSession(cookieStore));
}
