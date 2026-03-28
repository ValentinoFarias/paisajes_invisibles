import { client } from '@/sanity/lib/client'

/**
 * Query GROQ que obtiene todas las víctimas publicadas.
 *
 * - Filtra solo documentos donde publicado == true
 * - Filtra la descripción localizada por el idioma recibido ($locale)
 * - Resuelve la URL de la foto usando asset->url
 *
 * El parámetro $locale se pasa al ejecutar la query (ej. "es" o "en").
 */
const VICTIMAS_QUERY = /* groq */ `
  *[_type == "victima" && publicado == true] | order(nombre asc) {
    _id,
    nombre,
    edad,
    fechaDelHecho,
    lugar,
    // Extrae solo el valor del idioma solicitado del array localizado
    "descripcion": descripcion[_key == $locale][0].value,
    // Resuelve la URL completa de la imagen desde el asset
    "fotoUrl": foto.asset->url,
    foto
  }
`

/**
 * Tipo de datos que devuelve la query.
 * Útil para tipar los componentes que consumen estos datos.
 */
export type Victima = {
  _id: string
  nombre: string
  edad?: number
  fechaDelHecho: string
  lugar?: string
  descripcion?: string
  fotoUrl?: string
  foto?: {
    asset: {
      _ref: string
    }
    hotspot?: {
      x: number
      y: number
    }
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    }
  }
}

/**
 * Obtiene la lista de víctimas publicadas, filtrada por idioma.
 *
 * @param locale — código de idioma ("es" o "en")
 * @returns — array de víctimas con la descripción en el idioma pedido
 *
 * Ejemplo de uso en un Server Component:
 *   const victimas = await getVictimas('es')
 */
export async function getVictimas(locale: string): Promise<Victima[]> {
  return client.fetch<Victima[]>(VICTIMAS_QUERY, { locale })
}
