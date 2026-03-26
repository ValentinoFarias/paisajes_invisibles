"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function Welcome() {
  const t = useTranslations("welcome");
  const locale = useLocale();
  const lettersRef = useRef([]);
  const router = useRouter();
  const text = t("title");

  useEffect(() => {
    // Wait 1 second so the title is visible before the animation starts
    const startDelay = setTimeout(() => {
      // Build a shuffled array of letter indices (skip spaces)
      const indices = [...Array(text.length).keys()].filter(
        (i) => text[i] !== " "
      );
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // Hide each letter one at a time with a stagger
      indices.forEach((charIndex, order) => {
        gsap.set(lettersRef.current[charIndex], {
          opacity: 0,
          delay: order * 0.12,
        });
      });

      // Navigate after all letters are gone
      setTimeout(() => {
        router.push(`/${locale}/home`);
      }, indices.length * 0.12 * 1000 + 200);
    }, 1000);

    // Cleanup in case the component unmounts before the timeout fires
    return () => clearTimeout(startDelay);
  }, [text, locale, router]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-black">
      <h1 className="landing-title-impact text-4xl">
        {text.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => (lettersRef.current[i] = el)}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </span>
        ))}
      </h1>
    </section>
  );
}
