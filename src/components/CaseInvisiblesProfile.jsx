"use client";
// CaseInvisiblesProfile.jsx
// Editorial layout for a single case. Shows title, book image,
// localized intro, photo carousel, and localized quote.
// Receives a full case object as `caseData` from cases.js.

import { useState } from "react";

export default function CaseInvisiblesProfile({ caseData, locale }) {
  const {
    name = "",
    introEs = "",
    introEn = "",
    quoteEs = "",
    quoteEn = "",
    bookImage = null,
    casePhotos = [],
  } = caseData;

  // Pick the correct language based on the current locale
  const intro = locale === "es" ? introEs : introEn;
  const quote = locale === "es" ? quoteEs : quoteEn;

  // ── Carousel state ────────────────────────────────────────────────────────
  // Tracks which photo is currently visible (index into casePhotos array)
  const [current, setCurrent] = useState(0);

  // Go to previous photo, wrapping around to the last one
  function prev() {
    setCurrent((i) => (i === 0 ? casePhotos.length - 1 : i - 1));
  }

  // Go to next photo, wrapping around to the first one
  function next() {
    setCurrent((i) => (i === casePhotos.length - 1 ? 0 : i + 1));
  }

  return (
    <section className="paula-lorca-content">
      {/* Case name */}
      <h1 className="paula-lorca-title">{name}</h1>

      {/* Book / album image */}
      {bookImage && (
        <div className="paula-lorca-book-wrap">
          <img
            src={bookImage}
            alt={`Álbum de ${name}`}
            className="paula-lorca-book-image"
          />
        </div>
      )}

      {/* Intro text */}
      {intro && (
        <section className="paula-lorca-intro-grid">
          <p className="paula-lorca-text">{intro}</p>
        </section>
      )}

      {/* Photo carousel — all casePhotos in one slider */}
      {casePhotos.length > 0 && (
        <div className="case-carousel">
          {/* Previous button */}
          <button
            className="case-carousel-btn case-carousel-prev"
            onClick={prev}
            aria-label="Previous photo"
          >
            &#8592;
          </button>

          {/* Image container — slides horizontally via translateX */}
          <div className="case-carousel-track">
            <img
              src={casePhotos[current].src}
              alt={casePhotos[current].alt}
              className="case-carousel-img"
            />
          </div>

          {/* Next button */}
          <button
            className="case-carousel-btn case-carousel-next"
            onClick={next}
            aria-label="Next photo"
          >
            &#8594;
          </button>

          {/* Dot indicators — one per photo, filled for the active one */}
          <div className="case-carousel-dots">
            {casePhotos.map((_, i) => (
              <button
                key={i}
                className={`case-carousel-dot${i === current ? " active" : ""}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quote text */}
      {quote && (
        <section className="paula-lorca-quote-grid">
          <p className="paula-lorca-quote">{quote}</p>
        </section>
      )}
    </section>
  );
}
