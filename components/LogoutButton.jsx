"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await fetch("/api/logout", { method: "POST" });
    window.dispatchEvent(new Event("posyandu-auth-change"));
    router.refresh();
  }

  return (
    <button
      className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-70"
      disabled={isLoading}
      type="button"
      onClick={handleLogout}
    >
      <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
      {isLoading ? "Keluar..." : "Logout"}
    </button>
  );
}
