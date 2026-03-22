import MenuBar from "./MenuBar";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NavBar() {
  const t = await getTranslations("nav");
  const paisajesText = t("paisajes");
  const invisiblesText = t("invisibles");
  const suffixToken = "AJES";
  const suffixStart = paisajesText.toUpperCase().lastIndexOf(suffixToken);
  const hasSuffix =
    suffixStart >= 0 && suffixStart + suffixToken.length === paisajesText.length;
  const paisajesPrefix = hasSuffix ? paisajesText.slice(0, suffixStart) : paisajesText;
  const paisajesSuffix = hasSuffix ? paisajesText.slice(suffixStart) : "";
  const invisiblesPrefix = invisiblesText.slice(0, 2);
  const invisiblesSuffix = invisiblesText.slice(2);

  return (
    <nav className="navbar-responsive flex w-full items-center justify-center gap-200 p-4">
      {/* Left — Paisajes */}
      <div className="navbar-group navbar-group-fit flex items-center gap-3">
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          <Link href="/paisajes" className="navbar-link navbar-link-fit paisajes-hover-link">
            <span>{paisajesPrefix}</span>
            {paisajesSuffix ? (
              <span className="paisajes-hover-suffix">{paisajesSuffix}</span>
            ) : null}
          </Link>
        </span>
      </div>

      {/* Center — hamburger menu between the two words */}
      <MenuBar />

      {/* Right — Invisibles */}
      <div className="navbar-group navbar-group-fit flex items-center gap-3">
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          <Link
            href="/invisibles"
            className="navbar-link navbar-link-fit invisibles-hover-link"
          >
            <span className="invisibles-hover-prefix">{invisiblesPrefix}</span>
            <span>{invisiblesSuffix}</span>
          </Link>
        </span>
      </div>
    </nav>
  );
}
