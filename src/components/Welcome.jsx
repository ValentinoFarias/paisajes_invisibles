"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function Welcome() {
  const t = useTranslations("welcome");
  const locale = useLocale();
  const lettersRef = useRef([]);
  const router = useRouter();
  const text = t("title");

  function handleClick(e) {
    e.preventDefault();

    // Build a shuffled array of indices
    const indices = [...Array(text.length).keys()].filter(
      (i) => text[i] !== " "
    );
    for (let i = indices.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Disappear each letter instantly, one at a time with a stagger
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
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-black">
      <h1
        className="landing-title-impact text-4xl font-bold cursor-pointer"
        onClick={handleClick}
      >
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
