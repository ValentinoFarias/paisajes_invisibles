"use client";
// GalleryPage.jsx
// Renders the gallery UI. All state and logic lives in useGalleryLayout.

import NavBar from "@/components/NavBar";
import { useGalleryLayout, CATEGORIES } from "@/components/GalleryLayout";

export default function GalleryPage({ sanityPhotos = {} }) {
  // Pass Sanity photos to the hook so they merge with Cloudinary ones
  const {
    activeCategory,
    setActiveCategory,
    photos,
    lightbox,
    setLightbox,
    handleKeyDown,
  } = useGalleryLayout(sanityPhotos);

  return (
    <main className="gallery-page" onKeyDown={handleKeyDown}>
      <NavBar />

      <div className="gallery-body">

        {/* Left sidebar — category menu */}
        <aside className="gallery-sidebar">
          <nav className="gallery-sidebar-nav">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gallery-sidebar-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right — photo grid */}
        <div className="gallery-grid">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => setLightbox(photo)}
              >
                <img src={photo.src} alt={photo.alt} className="gallery-img" />
              </div>
            ))
          ) : (
            <p className="gallery-empty">No photos in this category yet.</p>
          )}
        </div>

      </div>

      {/* Lightbox — blurred backdrop + enlarged photo. Click outside to close. */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="gallery-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
