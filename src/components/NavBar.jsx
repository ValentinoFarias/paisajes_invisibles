"use client";
// NavBar.jsx
// Top navigation bar with all links and language toggle inline.
// No hamburger menu — everything is visible at once.

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

// Swaps the locale segment in the current URL path
function replaceLocaleInPath(pathname, locale) {
  const segments = pathname.split("/");
  if (segments.length > 1) segments[1] = locale;
  return segments.join("/") || `/${locale}`;
}

export default function NavBar() {
  const t       = useTranslations("nav");
  const locale  = useLocale();
  const router  = useRouter();
  const pathname = usePathname();

  function changeLocale(nextLocale) {
    const nextPath = replaceLocaleInPath(pathname, nextLocale);
    const query = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${nextPath}${query}`);
  }

  return (
    <nav className="navbar-responsive flex w-full items-center justify-center gap-200 p-4">

      {/* Language toggle — EN / ES */}
      <div className="navbar-group navbar-group-fit flex items-center gap-1">
        <button
          type="button"
          className={`navbar-lang-btn ${locale === "en" ? "active" : ""}`}
          onClick={() => changeLocale("en")}
          aria-label={t("switchToEnglish")}
        >
          {t("en")}
        </button>
        <span className="navbar-lang-sep">/</span>
        <button
          type="button"
          className={`navbar-lang-btn ${locale === "es" ? "active" : ""}`}
          onClick={() => changeLocale("es")}
          aria-label={t("switchToSpanish")}
        >
          {t("es")}
        </button>
      </div>

      {/* Inicio */}
      <div className="navbar-group navbar-group-fit flex items-center">
        <span style={{ color: "var(--color-secondary)", fontFamily: "var(--font-title-primary)" }}>
          <Link href={`/${locale}/home`} className="navbar-link navbar-link-fit">
            {t("inicio")}
          </Link>
        </span>
      </div>

      {/* Paisajes — "PAIS" stays, "AJES" greys out on hover */}
      <div className="navbar-group navbar-group-fit flex items-center">
        <span style={{ color: "var(--color-secondary)", fontFamily: "var(--font-title-primary)" }}>
          <Link href={`/${locale}/paisajes`} className="navbar-link navbar-link-fit paisajes-hover-link">
            <span>PAIS</span>
            <span className="paisajes-hover-suffix">AJES</span>
          </Link>
        </span>
      </div>

      {/* Invisibles — "IN" greys out on hover, "VISIBLES" stays */}
      <div className="navbar-group navbar-group-fit flex items-center">
        <span style={{ color: "var(--color-secondary)", fontFamily: "var(--font-title-primary)" }}>
          <Link href={`/${locale}/invisibles`} className="navbar-link navbar-link-fit invisibles-hover-link">
            <span className="invisibles-hover-prefix">IN</span>
            <span>VISIBLES</span>
          </Link>
        </span>
      </div>

      {/* Galeria */}
      <div className="navbar-group navbar-group-fit flex items-center">
        <span style={{ color: "var(--color-secondary)", fontFamily: "var(--font-title-primary)" }}>
          <Link href={`/${locale}/gallery`} className="navbar-link navbar-link-fit">
            {t("galeria")}
          </Link>
        </span>
      </div>

      {/* Contacto */}
      <div className="navbar-group navbar-group-fit flex items-center">
        <span style={{ color: "var(--color-secondary)", fontFamily: "var(--font-title-primary)" }}>
          <Link href={`/${locale}/contact`} className="navbar-link navbar-link-fit">
            {t("contacto")}
          </Link>
        </span>
      </div>

    </nav>
  );
}
