"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

function isDarkCreditTheme(pathname) {
  return /^\/(es|en)\/?$/.test(pathname) || /^\/(es|en)\/paisajes(\/|$)/.test(pathname);
}

function getLocaleFromPath(pathname) {
  const match = pathname.match(/^\/(es|en)(\/|$)/);
  return match?.[1] ?? "es";
}

export default function SiteCredit() {
  const pathname = usePathname() || "";

  // No credit on the paisajes page — the 3D canvas fills the screen
  if (/^\/(es|en)\/paisajes(\/|$)/.test(pathname)) return null;

  const isDarkTheme = isDarkCreditTheme(pathname);
  const locale = getLocaleFromPath(pathname);
  const logoSrc = isDarkTheme
    ? "/assets/images/koyko/LogoKoykoWhite.png"
    : "/assets/images/koyko/LogoKoykoBlack.png";
  const creditText = locale === "en" ? "2026 Javier Alvarez site by Koyko Design" : "2026 Javier Alvarez sitio por Koyko Design";

  return (
    <footer
      className={`site-credit ${isDarkTheme ? "site-credit--light" : "site-credit--dark"}`}
      aria-label="Site credit"
    >
      <p className="site-credit-line">
        <span className="site-credit-mark">©</span>
        <span>{creditText}</span>
        <Image
          src={logoSrc}
          alt="Koyko logo"
          width={12}
          height={16}
          className="site-credit-logo"
        />
      </p>
    </footer>
  );
}
