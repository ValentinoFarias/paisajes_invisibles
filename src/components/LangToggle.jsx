"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();

  const targetLocale = locale === "es" ? "en" : "es";
  const nextPath = replaceLocaleInPath(pathname, targetLocale);
  const query = searchParams.toString();
  const targetHref = query ? `${nextPath}?${query}` : nextPath;

  function handleToggle() {
    router.replace(targetHref);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        targetLocale === "es" ? t("switchToSpanish") : t("switchToEnglish")
      }
      className="text-white"
    >
      {targetLocale === "es" ? t("es") : t("en")}
    </button>
  );
}
