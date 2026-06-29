"use client";

import { useEffect, useState } from "react";
import InfoPage from "@/components/InfoPage";
import SiteShell from "@/components/SiteShell";
import { infoPages } from "@/lib/pages";

const PUBLIC_PAGE_STORAGE_KEY = "posyandu-public-page";
const publicPageKeys = new Set(["home", "penyebab", "dampak"]);

function normalizePageKey(pageKey) {
  return publicPageKeys.has(pageKey) ? pageKey : "home";
}

export default function PublicInfoApp() {
  const [activePage, setActivePage] = useState("home");

  useEffect(() => {
    const storedPage = normalizePageKey(window.sessionStorage.getItem(PUBLIC_PAGE_STORAGE_KEY));
    setActivePage(storedPage);
    window.sessionStorage.removeItem(PUBLIC_PAGE_STORAGE_KEY);

    function handlePublicPageChange(event) {
      setActivePage(normalizePageKey(event.detail?.pageKey));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    window.addEventListener("posyandu-public-page-change", handlePublicPageChange);

    return () => window.removeEventListener("posyandu-public-page-change", handlePublicPageChange);
  }, []);

  return (
    <SiteShell activePublicPage={activePage}>
      <InfoPage
        headingLevel="h1"
        heroImage={activePage === "home" ? "/page.png" : ""}
        page={infoPages[activePage]}
      />
    </SiteShell>
  );
}
