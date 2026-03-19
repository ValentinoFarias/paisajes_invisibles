"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

function replaceLocaleInPath(pathname, locale) {
  const segments = pathname.split("/");

  if (segments.length > 1) {
    segments[1] = locale;
  }

  return segments.join("/") || `/${locale}`;
}

export default function LangToggle() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = locale === "es" ? "en" : "es";

  function handleToggle() {
    const nextPath = replaceLocaleInPath(pathname, targetLocale);
    const query =
      typeof window !== "undefined" ? window.location.search || "" : "";
    const targetHref = `${nextPath}${query}`;
    router.replace(targetHref);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        targetLocale === "es" ? t("switchToSpanish") : t("switchToEnglish")
      }
      className="lang-toggle-button"
    >
      {targetLocale === "es" ? t("es") : t("en")}
    </button>
  );
}
