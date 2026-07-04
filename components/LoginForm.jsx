"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readJsonResponse } from "@/lib/http";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await readJsonResponse(response, "Respons login dari server tidak valid.");

      if (!response.ok) {
        throw new Error(payload.error || "Login gagal.");
      }

      window.dispatchEvent(new Event("posyandu-auth-change"));
      router.refresh();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto mt-7 max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primaryLight/35 text-primary ring-1 ring-primaryLight">
          <i className="fa-solid fa-lock text-xl" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Login Kalkulator</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Masuk sesuai lokasi agar data tersimpan di tempat yang benar.
        </p>
      </div>

      {error && <div className="mb-4 rounded-xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            id="email"
            placeholder="Masukkan email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              id="password"
              placeholder="Masukkan password"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              aria-label={isPasswordVisible ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              type="button"
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              <i className={`fa-solid ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-primaryDark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
          type="submit"
        >
          <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
          {isLoading ? "Memproses..." : "Login"}
        </button>
      </form>

    </main>
  );
}
