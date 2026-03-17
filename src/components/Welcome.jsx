"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const TEXT = "Paisajes Invisibles";

export default function Welcome() {
  const lettersRef = useRef([]);
  const router = useRouter();

  function handleClick(e) {
    e.preventDefault();

    // Build a shuffled array of indices
    const indices = [...Array(TEXT.length).keys()].filter(
      (i) => TEXT[i] !== " "
    );
    for (let i = indices.length - 1; i > 0; i--) {
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
      router.push("/home");
    }, indices.length * 0.12 * 1000 + 200);
  }

  return (
    <section className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold cursor-pointer" onClick={handleClick}>
        {TEXT.split("").map((char, i) => (
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
