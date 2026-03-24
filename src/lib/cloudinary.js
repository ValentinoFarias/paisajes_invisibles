// src/lib/cloudinary.js
// Helper to build Cloudinary image URLs.
//
// Instead of storing local file paths like "/cases/romario-veloz/photo.jpg",
// cases.js stores Cloudinary public IDs like:
//   "paisajes-invisibles/familias/ROMARIO VELOZ/photo"
//
// This function turns that public ID into a full URL, e.g.:
//   https://res.cloudinary.com/dik90bqk4/image/upload/paisajes-invisibles/familias/ROMARIO VELOZ/photo.webp

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Returns the full Cloudinary URL for a given public ID.
 *
 * @param {string} publicId  - The Cloudinary public ID (no file extension needed)
 * @param {object} options   - Optional transform options
 * @param {number} options.width   - Resize to this width (Cloudinary does it on the fly)
 * @param {number} options.quality - Image quality 1–100 (default: auto)
 * @returns {string} Full image URL
 *
 * Example:
 *   cloudinaryUrl("paisajes-invisibles/familias/ROMARIO VELOZ/photo")
 *   → "https://res.cloudinary.com/dik90bqk4/image/upload/f_auto,q_auto/paisajes-invisibles/familias/ROMARIO VELOZ/photo"
 */
export function cloudinaryUrl(publicId, { width, quality } = {}) {
  // Build the transformation string (e.g. "w_1200,q_85,f_auto")
  // f_auto → Cloudinary picks the best format for each browser (WebP, AVIF, etc.)
  // q_auto → Cloudinary auto-adjusts quality for smallest file without visible loss
  const transforms = ["f_auto", quality ? `q_${quality}` : "q_auto", width ? `w_${width}` : null]
    .filter(Boolean) // remove nulls
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}
