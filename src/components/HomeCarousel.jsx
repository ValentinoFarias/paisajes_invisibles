"use client";
// HomeCarousel.jsx
// Draggable photo carousel for the home page.
// Supports mouse wheel, click-and-drag, and touch/swipe.
// Uses a lerp-based inertia loop — no animation libraries.

import { useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_PX      = 675;   // Horizontal distance in px between each item's center
const SCALE_ACTIVE = 1.45;  // Scale of the center (active) item
const SCALE_IDLE   = 0.87;  // Scale of all off-center items
const FRICTION     = 0.90;  // Velocity multiplier each frame (lower = stops faster)
const SNAP_SPEED   = 0.10;  // Lerp factor when snapping to nearest index
const SNAP_THRESH  = 0.005; // Velocity below this triggers the snap

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Linear interpolation: moves value `a` toward `b` by factor `t` (0–1)
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeCarousel({ photos = [] }) {
  const listRef = useRef(null);

  // All mutable animation state lives in one ref so it never triggers re-renders
  // and is always fresh inside event listeners / rAF callbacks.
  const s = useRef({
    pos: 0,        // float position — e.g. 1.7 = between index 1 and 2
    vel: 0,        // velocity in index-units per frame
    raf: null,     // requestAnimationFrame handle
    lastIdx: 0,    // last integer index we told React about (avoids setState spam)
    total: photos.length,
  });

  // React state only for things that affect the rendered title
  const [activeIndex, setActiveIndex] = useState(0);
  const [titleIn, setTitleIn] = useState(true); // controls CSS slide-in/out

  // Keep total in sync if photos array changes
  useEffect(() => {
    s.current.total = photos.length;
  }, [photos.length]);

  useEffect(() => {
    const state = s.current;
    const list  = listRef.current;
    if (!list || !photos.length) return;

    // The wrapping <section> is the event target for drag and wheel
    const container = list.parentElement;

    // ── Apply transforms ─────────────────────────────────────────────────────
    // Called every rAF frame and also directly during drag/touch for zero lag.
    function applyTransforms() {
      const items = list.children;
      const total = state.total;

      // Normalize pos to [0, total) so the modulo wrapping is always positive
      const normPos = ((state.pos % total) + total) % total;

      for (let i = 0; i < items.length; i++) {
        let offset = i - normPos; // raw distance from center

        // Wrap offset to the shortest path around the ring:
        // e.g. with 5 items, offset 4 becomes -1 (go left, not right 4 steps)
        if (offset >  total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const abs   = Math.abs(offset);
        const scale = abs < 1 ? lerp(SCALE_ACTIVE, SCALE_IDLE, abs) : SCALE_IDLE;

        // translateX(-50%) cancels the left:50% offset so the item's center sits on the slot.
        // Then the slot offset (offset * STEP_PX) moves it to the right position.
        items[i].style.transform = `translateX(calc(-50% + ${offset * STEP_PX}px)) scale(${scale})`;
        items[i].style.zIndex    = Math.max(1, Math.round(20 - abs * 4));
      }

      // Active index wraps with modulo so it stays within the photos array
      const snapped = ((Math.round(state.pos) % total) + total) % total;

      // Only update React state when the snapped index changes
      if (snapped !== state.lastIdx) {
        state.lastIdx = snapped;
        // Slide the title out, swap text, slide back in
        setTitleIn(false);
        setTimeout(() => {
          setActiveIndex(snapped);
          setTitleIn(true);
        }, 200);
      }
    }

    // ── Animation loop ───────────────────────────────────────────────────────
    function tick() {
      // Slow down velocity each frame (friction/deceleration)
      state.vel *= FRICTION;
      state.pos += state.vel; // unbounded — looping handled in applyTransforms via modulo

      // Once velocity is tiny, lerp smoothly toward the nearest whole index (snap)
      if (Math.abs(state.vel) < SNAP_THRESH) {
        state.vel = 0;
        state.pos = lerp(state.pos, Math.round(state.pos), SNAP_SPEED);
      }

      applyTransforms();
      state.raf = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = requestAnimationFrame(tick);
    }

    // ── Mouse wheel ──────────────────────────────────────────────────────────
    function onWheel(e) {
      e.preventDefault(); // stops the page from scrolling
      // deltaY is in pixels; divide to convert to fractional index units
      state.vel += e.deltaY * 0.003;
      startLoop();
    }

    // ── Click-and-drag ───────────────────────────────────────────────────────
    let dragging    = false;
    let dragStartX  = 0;
    let dragStartPos = 0;
    let dragLastX   = 0;

    function onMouseDown(e) {
      dragging      = true;
      dragStartX    = e.clientX;
      dragStartPos  = state.pos;
      dragLastX     = e.clientX;
      state.vel     = 0;
      container.style.cursor = "grabbing";
    }

    function onMouseMove(e) {
      if (!dragging) return;
      const dx  = e.clientX - dragStartX;
      // Convert pixel delta to index units; negative because drag-right → go left
      state.pos = dragStartPos - dx / STEP_PX; // unbounded for looping
      // Track live velocity so release feels natural
      state.vel = -(e.clientX - dragLastX) / STEP_PX;
      dragLastX = e.clientX;
      applyTransforms(); // update instantly — don't wait for rAF
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      container.style.cursor = "grab";
      startLoop(); // hand off to the inertia loop
    }

    // ── Touch / swipe ────────────────────────────────────────────────────────
    let touchStartX  = 0;
    let touchStartPos = 0;
    let touchLastX   = 0;

    function onTouchStart(e) {
      touchStartX   = e.touches[0].clientX;
      touchStartPos = state.pos;
      touchLastX    = touchStartX;
      state.vel     = 0;
    }

    function onTouchMove(e) {
      e.preventDefault(); // stops the page from scrolling during swipe
      const dx  = e.touches[0].clientX - touchStartX;
      state.pos = touchStartPos - dx / STEP_PX; // unbounded for looping
      state.vel = -(e.touches[0].clientX - touchLastX) / STEP_PX;
      touchLastX = e.touches[0].clientX;
      applyTransforms();
    }

    function onTouchEnd() {
      startLoop();
    }

    // ── Register listeners ───────────────────────────────────────────────────
    container.addEventListener("wheel",      onWheel,      { passive: false });
    container.addEventListener("mousedown",  onMouseDown);
    window.addEventListener(   "mousemove",  onMouseMove);
    window.addEventListener(   "mouseup",    onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove",  onTouchMove,  { passive: false });
    container.addEventListener("touchend",   onTouchEnd);
    container.style.cursor = "grab";

    // Initial paint and start loop
    applyTransforms();
    startLoop();

    // ── Cleanup on unmount ───────────────────────────────────────────────────
    return () => {
      if (state.raf) cancelAnimationFrame(state.raf);
      container.removeEventListener("wheel",      onWheel);
      container.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener(   "mousemove",  onMouseMove);
      window.removeEventListener(   "mouseup",    onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove",  onTouchMove);
      container.removeEventListener("touchend",   onTouchEnd);
    };
  }, [photos.length]); // only re-register if the number of photos changes

  if (!photos.length) return null;

  return (
    <section className="home-carousel">
      {/* Track — items are absolutely centered inside here */}
      <ul ref={listRef} className="home-carousel-track">
        {photos.map((photo, i) => (
          <li key={i} className="home-carousel-item">
            <img
              src={photo.src}
              alt={photo.title}
              className="home-carousel-img"
              draggable={false} /* prevent browser's built-in image drag ghost */
            />
          </li>
        ))}
      </ul>

      {/* Title — slides out/in when active photo changes */}
      <p className={`home-carousel-title ${titleIn ? "home-carousel-title--in" : "home-carousel-title--out"}`}>
        {photos[activeIndex]?.title}
      </p>
    </section>
  );
}
