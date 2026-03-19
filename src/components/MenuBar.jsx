"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

function replaceLocaleInPath(pathname, locale) {
  const segments = pathname.split("/");

  if (segments.length > 1) {
    segments[1] = locale;
  }

  return segments.join("/") || `/${locale}`;
}

export default function MenuBar() {
  const locale = useLocale();
  const t = useTranslations("menu");
  const navT = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function changeLocale(nextLocale) {
    const nextPath = replaceLocaleInPath(pathname, nextLocale);
    const query =
      typeof window !== "undefined" ? window.location.search || "" : "";
    const targetHref = `${nextPath}${query}`;
    router.replace(targetHref);
  }

  function goToHome() {
    setIsOpen(false);
    router.push(`/${locale}/home`);
  }

  return (
    <>
      <button
        type="button"
        className={`menu-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className="menu-trigger-line" />
        <span className="menu-trigger-line" />
        <span className="menu-trigger-line" />
      </button>

      <div
        className={`menu-overlay ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <aside
          className={`menu-sidebar ${isOpen ? "is-open" : ""}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="menu-locale-row">
            <button
              type="button"
              className={`menu-locale-btn ${locale === "en" ? "active" : ""}`}
              onClick={() => changeLocale("en")}
            >
              {navT("en")}
            </button>
            <span className="menu-locale-separator">-</span>
            <button
              type="button"
              className={`menu-locale-btn ${locale === "es" ? "active" : ""}`}
              onClick={() => changeLocale("es")}
            >
              {navT("es")}
            </button>
          </div>

          <nav className="menu-items">
            <button type="button" className="menu-item" onClick={goToHome}>
              {t("home")}
            </button>
            <button type="button" className="menu-item">
              {t("paisajes")}
            </button>
            <button type="button" className="menu-item">
              {t("invisibles")}
            </button>
            <button type="button" className="menu-item">
              {t("about")}
            </button>
            <button type="button" className="menu-item">
              {t("contact")}
            </button>
          </nav>
        </aside>
      </div>
    </>
  );
}
