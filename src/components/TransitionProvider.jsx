"use client";

import { useRef, useEffect } from "react";
import { TransitionRouter } from "next-transition-router";
import gsap from "gsap";

const BLOCK_SIZE = 60;
const LOCALES = ["es", "en"];

export default function TransitionProvider({ children }) {
  const transitionGridRef = useRef(null);
  const blocksRef = useRef([]);
  const shouldAnimateRef = useRef(false);

  const createTransitionGrid = () => {
    if (!transitionGridRef.current) return;

    const container = transitionGridRef.current;
    container.innerHTML = "";
    blocksRef.current = [];

    const gridWidth = window.innerWidth;
    const gridHeight = window.innerHeight;

    const columns = Math.ceil(gridWidth / BLOCK_SIZE);
    const rows = Math.ceil(gridHeight / BLOCK_SIZE) + 1;

    const offsetX = (gridWidth - columns * BLOCK_SIZE) / 2;
    const offsetY = (gridHeight - rows * BLOCK_SIZE) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.className = "transition-block";
        block.style.cssText = `
          position: absolute;
          width: ${BLOCK_SIZE}px;
          height: ${BLOCK_SIZE}px;
          left: ${col * BLOCK_SIZE + offsetX}px;
          top: ${row * BLOCK_SIZE + offsetY}px;
          background: #F4F4EF;
          opacity: 0;
          pointer-events: none;
        `;
        container.appendChild(block);
        blocksRef.current.push(block);
      }
    }

    gsap.set(blocksRef.current, { opacity: 0 });
  };

  useEffect(() => {
    createTransitionGrid();
    window.addEventListener("resize", createTransitionGrid);
    return () => window.removeEventListener("resize", createTransitionGrid);
  }, []);

  const getPathname = (value) => {
    if (!value) return "";

    try {
      return new URL(value, window.location.origin).pathname;
    } catch {
      return value;
    }
  };

  const shouldAnimateLandingToHome = (from, to) => {
    const fromPathname = getPathname(from);
    const toPathname = getPathname(to);

    if (fromPathname === "/" && toPathname === "/home") {
      return true;
    }

    const fromParts = fromPathname.split("/").filter(Boolean);
    const toParts = toPathname.split("/").filter(Boolean);

    if (fromParts.length !== 1 || toParts.length !== 2) {
      return false;
    }

    const [fromLocale] = fromParts;
    const [toLocale, toRoute] = toParts;

    return (
      LOCALES.includes(fromLocale) &&
      LOCALES.includes(toLocale) &&
      fromLocale === toLocale &&
      toRoute === "home"
    );
  };

  return (
    <TransitionRouter
      leave={(next, from, to) => {
        const shouldAnimate = shouldAnimateLandingToHome(from, to);
        shouldAnimateRef.current = shouldAnimate;

        if (!shouldAnimate) {
          next();
          return;
        }

        const tween = gsap.to(blocksRef.current, {
          opacity: 1,
          duration: 0.05,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: next,
        });
        return () => tween.kill();
      }}
      enter={(next) => {
        if (!shouldAnimateRef.current) {
          next();
          return;
        }

        gsap.set(blocksRef.current, { opacity: 1 });
        const tween = gsap.to(blocksRef.current, {
          opacity: 0,
          duration: 0.05,
          delay: 0.3,
          ease: "power2.inOut",
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => {
            shouldAnimateRef.current = false;
            next();
          },
        });
        return () => {
          tween.kill();
          shouldAnimateRef.current = false;
        };
      }}
    >
      <div
        ref={transitionGridRef}
        className="transition-grid"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {children}
    </TransitionRouter>
  );
}
