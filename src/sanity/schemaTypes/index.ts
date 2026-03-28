import { type SchemaTypeDefinition } from 'sanity'
import { victima } from './victima'
import { media } from './media'

/**
 * Registra todos los tipos de documento del proyecto.
 * Cada nuevo schema se importa y se agrega al array "types".
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [victima, media],
}
