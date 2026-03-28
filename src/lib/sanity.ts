/**
 * Cliente de Sanity para usar en componentes y páginas de Next.js.
 *
 * Re-exporta el cliente ya configurado en src/sanity/lib/ y añade
 * helpers listos para usar en el App Router (Server Components, etc.).
 */

// Cliente base — ya tiene projectId, dataset, apiVersion y useCdn
export { client } from '@/sanity/lib/client'

// Helper para construir URLs de imágenes de Sanity
// Uso: urlFor(doc.foto).width(400).url()
export { urlFor } from '@/sanity/lib/image'

// sanityFetch — wrapper con Live Content API (contenido en tiempo real)
// SanityLive  — componente React para inyectar en el layout
export { sanityFetch, SanityLive } from '@/sanity/lib/live'
