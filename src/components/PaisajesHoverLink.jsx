"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const SUFFIX_TOKEN = "AJES";

export default function PaisajesHoverLink({ href, text, className }) {
  const suffixRef = useRef(null);

  const upperText = text.toUpperCase();
  const suffixStart = upperText.lastIndexOf(SUFFIX_TOKEN);
  const hasSuffix =
    suffixStart >= 0 && suffixStart + SUFFIX_TOKEN.length === text.length;
  const prefix = hasSuffix ? text.slice(0, suffixStart) : text;
  const suffix = hasSuffix ? text.slice(suffixStart) : "";

  useEffect(() => {
    const node = suffixRef.current;
    if (!node || !suffix) return;

    gsap.set(node, {
      display: "inline-block",
      overflow: "hidden",
      whiteSpace: "pre",
      width: node.scrollWidth,
      opacity: 1,
    });

    return () => {
      gsap.killTweensOf(node);
    };
  }, [suffix]);

  function hideSuffix() {
    if (!suffixRef.current || !suffix) return;

    gsap.to(suffixRef.current, {
      width: 0,
      opacity: 0,
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
    });
  }

  function showSuffix() {
    if (!suffixRef.current || !suffix) return;

    gsap.to(suffixRef.current, {
      width: suffixRef.current.scrollWidth,
      opacity: 1,
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
    });
  }

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={hideSuffix}
      onMouseLeave={showSuffix}
      onFocus={hideSuffix}
      onBlur={showSuffix}
    >
      <span>{prefix}</span>
      {suffix ? <span ref={suffixRef}>{suffix}</span> : null}
    </Link>
  );
}
