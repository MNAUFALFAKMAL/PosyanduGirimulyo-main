"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  activePublicPage = "home",
  className = "",
  ease = "power3.out",
  baseColor = "#1D9E75",
  baseGradient = "linear-gradient(135deg, #1D9E75 0%, #0F766E 100%)",
  navSurface = "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(241,239,232,0.92) 100%)",
  pillColor = "#ffffff",
  hoveredPillTextColor = "#ffffff",
  pillTextColor,
  initialLoadAnimation = true,
  isAuthenticated = false,
}) {
  const isAuthLoaded = typeof isAuthenticated === "boolean";
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const radius = ((w * w) / 4 + h * h) / (2 * h);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta = Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (w * w) / 4))) + 1;
        const originY = diameter - delta;

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.set(logoRef.current, { scale: 0.88, opacity: 0 });
        gsap.to(logoRef.current, { scale: 1, opacity: 1, duration: 0.5, ease });
      }

      if (navItemsRef.current) {
        gsap.set(navItemsRef.current, { width: 0, overflow: "hidden" });
        gsap.to(navItemsRef.current, { width: "auto", duration: 0.55, ease });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation, isAuthenticated]);

  function handleEnter(index) {
    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  }

  function handleLeave(index) {
    const tl = tlRefs.current[index];
    if (!tl) return;

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  }

  function handleLogoEnter() {
    const img = logoImgRef.current;
    if (!img) return;

    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.35,
      ease,
      overwrite: "auto",
    });
  }

  function toggleMobileMenu() {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (nextState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (nextState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.28, ease, transformOrigin: "top center" },
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: "top center",
          onComplete: () => gsap.set(menu, { visibility: "hidden" }),
        });
      }
    }
  }

  function isActiveHref(href) {
    return href === "/" ? activeHref === "/" : activeHref.startsWith(href);
  }

  function isActiveItem(item) {
    if (item.publicTab) {
      return activeHref === "/" && activePublicPage === item.pageKey;
    }

    return isActiveHref(item.href);
  }

  function handleItemClick(event, item) {
    setIsMobileMenuOpen(false);

    if (!item.publicTab) return;

    if (activeHref === "/") {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("posyandu-public-page-change", {
        detail: { pageKey: item.pageKey },
      }));
      return;
    }

    window.sessionStorage.setItem("posyandu-public-page", item.pageKey);
  }

  function handleLogoClick(event) {
    setIsMobileMenuOpen(false);

    if (activeHref === "/") {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("posyandu-public-page-change", {
        detail: { pageKey: "home" },
      }));
      return;
    }

    window.sessionStorage.setItem("posyandu-public-page", "home");
  }

  const cssVars = {
    "--base": baseColor,
    "--base-gradient": baseGradient,
    "--nav-surface": navSurface,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
    "--nav-h": "44px",
    "--logo": "38px",
    "--pill-pad-x": "18px",
    "--pill-gap": "4px",
  };
  const primaryItems = isAuthenticated ? items : items.filter((item) => item.href !== "/kalkulator");
  const loginItem = { href: "/kalkulator", label: "Login", icon: "fa-right-to-bracket" };

  return (
    <header
      className="sticky left-0 right-0 top-0 z-50 border-b border-slate-200/75 bg-white/92 px-3 py-3 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-4"
      style={cssVars}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          className="group inline-flex min-w-0 flex-none items-center gap-3 rounded-2xl pr-2 no-underline transition hover:opacity-90"
          href="/"
          ref={logoRef}
          onMouseEnter={handleLogoEnter}
          onClick={handleLogoClick}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <Image
              alt={logoAlt}
              className="block h-full w-full object-contain p-1"
              height={48}
              priority
              ref={logoImgRef}
              src={logo}
              width={48}
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold leading-tight text-ink sm:text-xl">Posyandu Girimulyo</span>
            <span className="hidden truncate text-xs font-medium leading-tight text-slate-500 sm:block">
              Kec. Marga Sekampung, Girimulyo
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigasi utama"
          className={`flex items-center justify-end md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${className}`}
          style={cssVars}
        >
          <div
            className="hidden items-center rounded-full border border-slate-200/80 p-[3px] shadow-[0_10px_26px_rgba(15,23,42,0.08)] md:flex"
            ref={navItemsRef}
            style={{ height: "var(--nav-h)", background: "var(--nav-surface)" }}
          >
            <ul className="m-0 flex h-full list-none items-stretch p-0" role="menubar" style={{ gap: "var(--pill-gap)" }}>
              {primaryItems.map((item, index) => {
                const isActive = isActiveItem(item);
                const pillStyle = {
                  background: isActive ? "var(--base-gradient)" : "transparent",
                  color: isActive ? "var(--hover-text)" : "var(--pill-text)",
                  paddingLeft: "var(--pill-pad-x)",
                  paddingRight: "var(--pill-pad-x)",
                };

                return (
                  <li className="flex h-full" key={item.pageKey ?? item.href} role="none">
                    <Link
                      aria-label={item.ariaLabel || item.label}
                      className="relative inline-flex h-full cursor-pointer items-center justify-center overflow-hidden rounded-full px-0 text-sm font-semibold leading-none no-underline outline-none transition focus:ring-4 focus:ring-primary/20"
                      href={item.href}
                      role="menuitem"
                      style={pillStyle}
                      onMouseEnter={() => handleEnter(index)}
                      onMouseLeave={() => handleLeave(index)}
                      onClick={(event) => handleItemClick(event, item)}
                    >
                      <span
                        aria-hidden="true"
                        className="hover-circle pointer-events-none absolute bottom-0 left-1/2 z-[1] block rounded-full"
                        ref={(element) => {
                          circleRefs.current[index] = element;
                        }}
                        style={{ background: "var(--base-gradient)", willChange: "transform" }}
                      />
                      <span className="label-stack relative z-[2] inline-block leading-none">
                        <span className="pill-label relative z-[2] inline-block leading-none" style={{ willChange: "transform" }}>
                          {item.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="pill-label-hover absolute left-0 top-0 z-[3] inline-block whitespace-nowrap leading-none"
                          style={{ color: "var(--hover-text)", willChange: "transform, opacity" }}
                        >
                          {item.label}
                        </span>
                      </span>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-[5px] left-1/2 z-[4] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white shadow-sm ring-2 ring-secondary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
            className="relative flex h-[var(--nav-h)] w-[var(--nav-h)] cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-0 p-0 shadow-sm md:hidden"
            ref={hamburgerRef}
            style={{ background: "var(--base-gradient)" }}
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="hamburger-line h-0.5 w-4 origin-center rounded bg-white" />
            <span className="hamburger-line h-0.5 w-4 origin-center rounded bg-white" />
          </button>
        </nav>

        {isAuthLoaded && !isAuthenticated && (
          <Link
            className={`hidden items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold no-underline shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-primary/20 lg:inline-flex ${
              isActiveHref(loginItem.href) ? "text-white" : "text-white"
            }`}
            href={loginItem.href}
            style={{
              background: isActiveHref(loginItem.href)
                ? "linear-gradient(135deg, #0F766E 0%, #1D9E75 100%)"
                : baseGradient,
            }}
          >
            <i className={`fa-solid ${loginItem.icon}`} aria-hidden="true" />
            {loginItem.label}
          </Link>
        )}
      </div>

      <div
        className="absolute left-3 right-3 top-[calc(100%+8px)] z-[998] origin-top rounded-[27px] shadow-[0_12px_34px_rgba(15,23,42,0.16)] md:hidden"
        ref={mobileMenuRef}
        style={{ ...cssVars, background: "var(--nav-surface)", border: "1px solid rgba(203, 213, 225, 0.9)" }}
      >
        <ul className="m-0 flex list-none flex-col gap-[3px] p-[3px]">
          {[...primaryItems, ...(isAuthLoaded && !isAuthenticated ? [loginItem] : [])].map((item) => {
            const isActive = isActiveItem(item);

            return (
              <li key={item.pageKey ?? item.href}>
                <Link
                  className="block rounded-[50px] px-4 py-3 text-sm font-semibold no-underline transition"
                  href={item.href}
                  style={{
                    background: isActive ? "var(--base-gradient)" : "var(--pill-bg)",
                    color: isActive ? "var(--hover-text)" : "var(--pill-text)",
                  }}
                  onClick={(event) => handleItemClick(event, item)}
                >
                  {item.icon && <i className={`fa-solid ${item.icon} mr-2`} aria-hidden="true" />}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
