"use client";
// ─────────────────────────────────────────────────────────────────────────────
// InvisiblesContent.jsx
//
// This component renders the full "Invisibles" page.
// It combines THREE visual effects:
//
//   1. INFINITE LOOP    — When you reach the bottom of the list it instantly
//                         teleports you back to the top, creating the illusion
//                         that the list never ends.
//
//   2. IMAGE REVEAL     — Images are hidden by default. While you scroll they
//                         fade in, and fade out 200ms after you stop scrolling.
//
//   3. HOVER FREEZE     — When you hover over an entry its image stays visible,
//                         and stays visible for 1 more second after you leave.
//
// CONCEPTS USED IN THIS FILE:
//   • useEffect  — run side-effects after the component mounts
//   • useRef     — store a mutable value that does NOT cause a re-render
//   • useState   — store a value that DOES cause a re-render when it changes
//   • IntersectionObserver — browser API that watches when an element enters/
//                            leaves the visible area (the "viewport")
//   • Cleanup function — code that runs when the component is removed from the
//                        page, used to stop event listeners / observers
// ─────────────────────────────────────────────────────────────────────────────

// ── React hooks we need ──────────────────────────────────────────────────────
// useEffect  → lets us run code AFTER the component is painted on screen
// useRef     → gives us a box to store a value between renders without
//              triggering a new render (great for DOM nodes and timers)
// useState   → gives us a reactive value: when it changes React re-renders
import { useEffect, useRef, useState } from "react";

// ── Next.js navigation ──────────────────────────────────────────────────────
// useRouter  → programmatic navigation (router.push) so clicking a case
//              navigates to /case/[id] without a full page reload
// useParams  → reads the current URL params so we know the active locale
import { useRouter, useParams } from "next/navigation";

// ── Data ─────────────────────────────────────────────────────────────────────
// CASES is an array of objects, one per project/case, imported from a
// separate data file so this component stays clean and focused on UI logic.
import { CASES } from "@/data/cases";


// =============================================================================
// InvisiblesContent — main exported component
// =============================================================================
export default function InvisiblesContent() {

  // ── Refs ───────────────────────────────────────────────────────────────────
  // useRef(null) creates a "ref object" with a `.current` property set to null.
  // When we put `ref={gridRef}` on a JSX element, React sets `.current` to
  // that real DOM node as soon as the component mounts.
  // We use refs here instead of state because we never want changing these
  // values to re-render the component — we just need to READ the DOM node.

  const gridRef    = useRef(null); // points to the real <div class="inv-grid">
  const clonesRef  = useRef(null); // points to the clone <div class="inv-clones">
  const scrollTRef = useRef(null); // stores the setTimeout ID for image-reveal
                                   // (we save it so we can cancel it with
                                   //  clearTimeout if the user scrolls again
                                   //  before the 200ms timer fires)


  // ── useEffect — runs once after the component first mounts ─────────────────
  // The empty array [] at the end is the "dependency array".
  // An empty [] means: "run this effect only once, when the component mounts."
  // Without [], the effect would re-run every time the component re-renders.
  useEffect(() => {

    // ── Prevent rubber-band scrolling ────────────────────────────────────────
    // On iOS/Safari, when you scroll past the top or bottom, the page
    // "bounces" back. That bounce would briefly reveal the gap between the
    // real grid and the clone, breaking the seamless loop illusion.
    // `overscroll-behavior: none` disables that bounce.
    document.documentElement.style.setProperty("overscroll-behavior", "none");

    // ── Start scroll at position 1 instead of 0 ──────────────────────────────
    // If we start at scrollY === 0, some browsers fire the IntersectionObserver
    // immediately because the page hasn't scrolled yet and the clone might
    // technically be in the viewport at height=0. Starting at 1px avoids that.
    window.scrollTo({ top: 1, behavior: "instant" });


    // ════════════════════════════════════════════════════════════════════════
    // EFFECT 1 — Infinite loop via IntersectionObserver
    // ════════════════════════════════════════════════════════════════════════
    //
    // HOW THE TRICK WORKS:
    //   • We render the list TWICE: once in the real grid, once in a hidden
    //     "clone" div placed below the real grid.
    //   • The clone is visually cut off (overflow: hidden) so users can't
    //     actually see it — it only exists to be "observed".
    //   • As soon as any pixel of the clone enters the viewport, the observer
    //     fires and we instantly jump the scroll position back to the same
    //     relative position inside the real grid.
    //   • Because the jump is `behavior: "instant"` the user never notices.
    //
    // IntersectionObserver(callback, options)
    //   • callback   — a function that receives an array of "entries". Each
    //                  entry describes one observed element and whether it is
    //                  currently intersecting the viewport.
    //   • threshold: 0 — fire as soon as even 1px of the element is visible.

    const observer = new IntersectionObserver(
      (entries) => {
        // `entries` is an array — we loop over it in case there are multiple
        // observed elements (here we only observe one, but it's best practice).
        for (const entry of entries) {

          // `isIntersecting` is true when the element is inside the viewport.
          // `gridRef.current` check ensures the real grid DOM node exists.
          if (entry.isIntersecting && gridRef.current) {

            // Find the navbar so we know how tall it is.
            // We need this because the navbar is fixed at the top of the screen,
            // and we don't want to teleport to a position where it covers content.
            const nav       = document.querySelector(".navbar-responsive");
            const navHeight = nav ? nav.offsetHeight : 0;

            // `window.scrollY`         — how many pixels the page has scrolled down
            // `gridRef.current.offsetHeight` — total pixel height of the real grid
            //
            // If the user has scrolled PAST the real grid, `overscroll` is how
            // many extra pixels into the clone they have gone.
            // Example: real grid is 3000px tall, user is at scrollY 3100 →
            //          overscroll = 3100 - 3000 = 100px into the clone.
            const overscroll = window.scrollY - gridRef.current.offsetHeight;

            // Teleport to the same relative position inside the real grid.
            // `Math.max(navHeight, overscroll)` ensures we land at least below
            // the navbar even if overscroll calculates to something smaller.
            window.scrollTo({
              top:      Math.max(navHeight, overscroll),
              behavior: "instant", // no smooth animation — instant jump
            });
          }
        }
      },
      { threshold: 0 } // fire as soon as 1px is visible
    );

    // Start observing the clone div.
    // We check clonesRef.current first because React guarantees the ref is set
    // by the time useEffect runs, but it's good defensive practice.
    if (clonesRef.current) observer.observe(clonesRef.current);


    // ════════════════════════════════════════════════════════════════════════
    // EFFECT 2 — Image reveal while scrolling
    // ════════════════════════════════════════════════════════════════════════
    //
    // STRATEGY: CSS class toggling
    //   • By default, `.inv-entry img` is invisible (opacity 0, transform, etc.)
    //   • When the class `inv-scrolling` is on the grid, CSS makes images visible.
    //   • We add `inv-scrolling` on every scroll event, then set a 800ms timer
    //     to remove it. Each new scroll event RESETS the timer (clearTimeout),
    //     so the class stays while the user is actively scrolling and disappears
    //     800ms after they stop.
    //
    // This is called a "debounce" pattern — very common in web development to
    // avoid firing expensive code on every single scroll/resize/keypress event.

    function onScroll() {
      if (gridRef.current) {
        // Add the CSS class that makes images visible
        gridRef.current.classList.add("inv-scrolling");

        // Cancel the previous "remove class" timer (if it's still counting down)
        clearTimeout(scrollTRef.current);

        // Start a new 800ms timer to remove the class after scrolling stops.
        // We store the timer ID in scrollTRef.current so we can cancel it above.
        scrollTRef.current = setTimeout(() => {
          // `?.` is optional chaining — it safely does nothing if gridRef.current
          // is null (e.g. if the component unmounted before the timer fired).
          gridRef.current?.classList.remove("inv-scrolling");
        }, 800); // 800 milliseconds after the last scroll event
      }
    }

    // Attach the scroll listener to the window (the whole page scroll).
    // `{ passive: true }` is a performance hint that tells the browser:
    //   "this listener will NEVER call event.preventDefault()"
    // which lets the browser scroll more smoothly without waiting for our JS.
    window.addEventListener("scroll", onScroll, { passive: true });


    // ════════════════════════════════════════════════════════════════════════
    // CLEANUP — runs when the component is removed from the page (unmounted)
    // ════════════════════════════════════════════════════════════════════════
    //
    // Every useEffect that creates side effects (observers, event listeners,
    // timers) MUST clean them up. If we don't:
    //   • The scroll listener would keep running even on other pages → memory leak
    //   • The observer would keep observing a DOM node that no longer exists
    //   • The timer might try to update a component that is gone → React warning
    //
    // The function we return from useEffect IS the cleanup function.
    // React calls it automatically when the component unmounts.
    return () => {
      observer.disconnect();                                    // stop observing
      window.removeEventListener("scroll", onScroll);          // remove listener
      clearTimeout(scrollTRef.current);                        // cancel timer
      document.documentElement.style.removeProperty("overscroll-behavior"); // undo CSS
    };

  }, []); // ← empty array: run this effect only once on mount


  // ── JSX — what actually renders on screen ───────────────────────────────────
  // The <> </> is a "React Fragment" — it lets us return two sibling elements
  // without adding an extra wrapper <div> to the real DOM.
  return (
    <>
      {/* ── Real grid ──────────────────────────────────────────────────────
          This is the actual list the user sees and scrolls through.
          `ref={gridRef}` wires this DOM node to our gridRef so useEffect
          can read its height and toggle CSS classes on it.                */}
      <div ref={gridRef} className="inv-grid">

        {/* CASES.map() iterates over every case object and renders one
            <InvEntry> per case. `key` must be unique — React uses it
            internally to track which item is which when the list updates. */}
        {CASES.map((c) => (
          <InvEntry key={c.id} caseData={c} />
        ))}

      </div>

      {/* ── Clone grid ─────────────────────────────────────────────────────
          An identical copy of the list placed below the real grid.
          It is visually hidden via CSS (overflow: hidden, height: 100dvh)
          so the user never actually sees it — it only exists so that the
          IntersectionObserver can fire when the user reaches the bottom.

          `aria-hidden="true"` hides this from screen readers because it
          is a presentational duplicate, not real content.                 */}
      <div ref={clonesRef} className="inv-clones" aria-hidden="true">

        {/* Same map as above, but with a `clone-` prefix on the key so
            React knows these are different elements from the ones above. */}
        {CASES.map((c) => (
          <InvEntry key={`clone-${c.id}`} caseData={c} />
        ))}

      </div>
    </>
  );
}


// =============================================================================
// InvEntry — single row / card inside the grid
// =============================================================================
//
// This is a CHILD component. It receives `caseData` as a prop (short for
// "property") — that's how parent components pass data down to children.
//
// EFFECT 3 — Hover freeze
//   • When the mouse enters, we set `hovered = true` immediately.
//   • When the mouse leaves, we wait 1 second before setting `hovered = false`.
//   • `hovered` controls the `inv-hovered` CSS class which keeps the image
//     visible regardless of whether the parent has `inv-scrolling` or not.
//
// WHY USE STATE HERE?
//   `hovered` is stored in useState because changing it must cause a RE-RENDER
//   so that the className on the <div> updates (adding/removing `inv-hovered`).
//   If we used a ref instead, the DOM class would never update.
// =============================================================================

// Destructure `caseData` from the props object — a common JS shortcut.
// Writing `function InvEntry({ caseData })` is the same as:
//   function InvEntry(props) { const caseData = props.caseData; ... }
function InvEntry({ caseData }) {

  // `hovered` starts as false (not hovered).
  // `setHovered` is the function we call to change it.
  const [hovered, setHovered] = useState(false);

  // Stores the ID of the 1-second delay timer so we can cancel it if the
  // user quickly moves the mouse back in before the timer fires.
  const hoverTRef = useRef(null);

  // ── Navigation ──────────────────────────────────────────────────────────────
  // useRouter gives us router.push() to navigate programmatically.
  // useParams gives us the current locale (e.g. "es" or "en") from the URL.
  const router = useRouter();
  const { locale } = useParams();

  // ── Resolve the image source ────────────────────────────────────────────────
  // `caseData.images` is an array of Cloudinary URLs (could be empty or missing).
  // `?.` optional chaining — safely returns undefined if `images` doesn't exist,
  //       instead of throwing "Cannot read property '0' of undefined".
  // `?? null` nullish coalescing — if the value is undefined or null, use null.
  // So `imgSrc` is either a URL string, or null if no images are available.
  const imgSrc = caseData.images?.[0] ?? null;


  // ── Mouse event handlers ────────────────────────────────────────────────────

  function handleMouseEnter() {
    // Cancel any running "un-hover" timer so that quickly re-entering doesn't
    // cause the image to disappear mid-hover.
    clearTimeout(hoverTRef.current);
    // Show the image immediately
    setHovered(true);
  }

  function handleMouseLeave() {
    // Don't hide the image right away — wait 1 second (1000ms).
    // This creates the "freeze" effect: the image lingers after you leave.
    hoverTRef.current = setTimeout(() => setHovered(false), 1000);
  }

  // ── Click handler ───────────────────────────────────────────────────────────
  // Navigates to the case detail page: /es/case/paula-lorca (for example).
  // Uses the case's `id` field as the URL slug.
  function handleClick() {
    router.push(`/${locale}/case/${caseData.id}`);
  }


  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <div
      // Template literal to build the class string dynamically:
      //   • Always has "inv-entry"
      //   • Adds " inv-hovered" only when hovered is true
      // The ternary `condition ? valueIfTrue : valueIfFalse` is a common
      // inline if/else pattern in JSX.
      className={`inv-entry${hovered ? " inv-hovered" : ""}`}

      // Attach our mouse handlers to the real DOM events
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}

      // Navigate to the case detail page on click
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {/* Only render the <img> if imgSrc is not null.
          The `&&` short-circuit pattern is the standard React way to
          conditionally render: if the left side is falsy, React renders nothing. */}
      {imgSrc && (
        <img src={imgSrc} alt={caseData.name} />
      )}

      {/* The project/case name shown as a text label */}
      <span className="inv-entry-name">{caseData.name}</span>
    </div>
  );
}
