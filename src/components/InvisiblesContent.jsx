"use client";
// InvisiblesContent.jsx
// Infinite-scroll grid of all cases with 3 effects:
//   1. Infinite loop  — a hidden clone below the grid triggers a seamless teleport
//   2. Image reveal   — images are hidden by default, fade in while scrolling
//   3. Hover freeze   — hovering over an entry keeps its image visible

import { useEffect, useRef, useState } from "react";
import { CASES } from "@/data/cases";


export default function InvisiblesContent() {
  const gridRef     = useRef(null); // the real grid <div>
  const clonesRef   = useRef(null); // the hidden clone <div> below
  const scrollTRef  = useRef(null); // timeout handle for image-reveal class removal

  useEffect(() => {
    // Prevent iOS/Safari rubber-band bounce which would break the seamless loop
    document.documentElement.style.setProperty("overscroll-behavior", "none");

    // Start at position 1 (not 0) so the observer doesn't fire on mount
    window.scrollTo({ top: 1, behavior: "instant" });

    // ── Effect 1: Infinite loop ─────────────────────────────────────────────
    // When the clone div enters the viewport, teleport to the equivalent
    // position in the real grid — the jump is instant so the user can't see it.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && gridRef.current) {
            // Get the navbar height so we land below it after teleporting
            const nav = document.querySelector(".navbar-responsive");
            const navHeight = nav ? nav.offsetHeight : 0;

            // How far the user has scrolled into the clone
            const overscroll = window.scrollY - gridRef.current.offsetHeight;
            // Teleport to the same offset, but never less than navHeight
            // so the navbar is already scrolled out of view on arrival
            window.scrollTo({
              top: Math.max(navHeight, overscroll),
              behavior: "instant",
            });
          }
        }
      },
      { threshold: 0 }
    );

    if (clonesRef.current) observer.observe(clonesRef.current);

    // ── Effects 2: Image reveal ──────────────────────────────────────────────
    function onScroll() {
      // Add the scrolling class so CSS makes images visible while scrolling
      if (gridRef.current) {
        gridRef.current.classList.add("inv-scrolling");
        // Remove class 200ms after the user stops scrolling → images fade out
        clearTimeout(scrollTRef.current);
        scrollTRef.current = setTimeout(() => {
          gridRef.current?.classList.remove("inv-scrolling");
        }, 200);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTRef.current);
      document.documentElement.style.removeProperty("overscroll-behavior");
    };
  }, []);

  return (
    <>
      {/* Real grid ─ the actual scrollable content */}
      <div ref={gridRef} className="inv-grid">
        {CASES.map((c) => (
          <InvEntry key={c.id} caseData={c} />
        ))}
      </div>

      {/* Clone grid ─ visually hidden (height: 100dvh, overflow: hidden).
          Only its intersection with the viewport is observed to trigger the loop. */}
      <div ref={clonesRef} className="inv-clones" aria-hidden="true">
        {CASES.map((c) => (
          <InvEntry key={`clone-${c.id}`} caseData={c} />
        ))}
      </div>
    </>
  );
}

// ── Individual entry ─────────────────────────────────────────────────────────
// Effect 4: hover keeps this entry's image visible for 1 second after mouse leaves.

function InvEntry({ caseData }) {
  const [hovered, setHovered] = useState(false);
  const hoverTRef = useRef(null);

  // First image from Cloudinary public IDs stored in cases.js (may be empty)
  const imgSrc = caseData.images?.[0] ?? null;

  function handleMouseEnter() {
    clearTimeout(hoverTRef.current);
    setHovered(true);
  }

  function handleMouseLeave() {
    // Keep image visible for 1 second after the mouse leaves
    hoverTRef.current = setTimeout(() => setHovered(false), 1000);
  }

  return (
    <div
      className={`inv-entry${hovered ? " inv-hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {imgSrc && (
        <img src={imgSrc} alt={caseData.name} />
      )}
      <span className="inv-entry-name">{caseData.name}</span>
    </div>
  );
}
