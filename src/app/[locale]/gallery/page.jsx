import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import GalleryPage from "@/views/GalleryPage";

/**
 * Fetches all gallery images from Sanity and groups them by category.
 * Returns an object like: { Grafica: [...], Paisajes: [...], Protestas: [...] }
 * Each photo has { src, alt } just like the Cloudinary ones.
 */
async function getSanityGalleryPhotos() {
  // GROQ query: get all media documents that have a gallery category
  const docs = await client.fetch(
    `*[_type == "media" && categoria in ["graficas", "paisajes", "protestas"]]{
      titulo,
      imagen,
      alt,
      categoria
    }`
  );

  // Map Sanity category values to the UI category names
  const categoryMap = {
    graficas: "Grafica",
    paisajes: "Paisajes",
    protestas: "Protestas",
  };

  // Group photos by category, converting Sanity image refs to URLs
  const grouped = { Grafica: [], Paisajes: [], Protestas: [] };

  for (const doc of docs) {
    const uiCategory = categoryMap[doc.categoria];
    if (!uiCategory) continue;

    grouped[uiCategory].push({
      src: urlFor(doc.imagen).url(),
      alt: doc.alt || doc.titulo || "",
    });
  }

  return grouped;
}

export default async function Gallery() {
  // Fetch Sanity photos on the server before rendering
  const sanityPhotos = await getSanityGalleryPhotos();

  return <GalleryPage sanityPhotos={sanityPhotos} />;
}