"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/pages";
import PillNav from "@/components/navbar";
import { readJsonResponse } from "@/lib/http";

export default function SiteShell({ activePublicPage = "home", children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/session", { cache: "no-store" });
        const payload = await readJsonResponse(response, "Respons session dari server tidak valid.");

        if (isMounted) {
          setIsAuthenticated(Boolean(payload.authenticated));
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(null);
        }
      }
    }

    loadSession();
    window.addEventListener("posyandu-auth-change", loadSession);

    return () => {
      isMounted = false;
      window.removeEventListener("posyandu-auth-change", loadSession);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen pb-6">
      <PillNav
        activeHref={pathname}
        baseColor="#1D9E75"
        baseGradient="linear-gradient(135deg, #1D9E75 0%, #0F766E 100%)"
        ease="power2.out"
        hoveredPillTextColor="#ffffff"
        initialLoadAnimation={false}
        activePublicPage={activePublicPage}
        isAuthenticated={isAuthenticated}
        items={navItems}
        logo="/logo.webp"
        logoAlt="Logo Posyandu Girimulyo"
        pillColor="#ffffff"
        pillTextColor="#334155"
      />

      <div className="mx-auto max-w-6xl px-3 sm:px-4">{children}</div>

      <footer className="mx-auto mt-10 max-w-6xl px-4 pb-4 pt-6 text-center text-sm text-slate-500">
        <a className="font-medium text-slate-600 no-underline transition hover:text-primary" href="https://edu.pubmedia.id/index.php/jpa/article/view/220">
          &copy; 2026 Posyandu Girimulyo KKN ITERA
        </a>
      </footer>
    </div>
  );
}
