'use client'

/**
 * Configuración de Sanity Studio, montado en `/app/studio/[[...tool]]/page.tsx`.
 *
 * Plugins activos:
 *  - structureTool  → árbol personalizado de documentos
 *  - visionTool     → consola GROQ dentro del Studio
 *  - internationalizedArray → campos de texto localizados (ES / EN)
 *  - languageFilter  → filtrar contenido por idioma en el Studio
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { languageFilter } from '@sanity/language-filter'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

// Idiomas disponibles para los campos localizados
const languages = [
  { id: 'es', title: 'Español' },
  { id: 'en', title: 'English' },
]

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    // Árbol de documentos en la barra lateral
    structureTool({ structure }),

    // Consola GROQ para probar queries
    visionTool({ defaultApiVersion: apiVersion }),

    // Campos localizados con sanity-plugin-internationalized-array
    // Registra los tipos "internationalizedArrayString" e
    // "internationalizedArrayText" para usar en los schemas
    internationalizedArray({
      languages,
      defaultLanguages: ['es'], // Español se pre-crea al abrir un documento nuevo
      fieldTypes: ['string', 'text'], // Tipos de campo que se pueden localizar
    }),

    // Filtro de idioma en el Studio — muestra/oculta campos por idioma
    languageFilter({
      supportedLanguages: languages,
      defaultLanguages: ['es'], // Español visible por defecto
      documentTypes: ['victima'], // Aplicar solo a documentos de tipo "victima"
      filterField: (enclosingType, member, selectedLanguageIds) => {
        // Filtrar solo los campos de tipo internationalizedArray
        // (los que tienen _key con el código de idioma)
        return !enclosingType.name.startsWith('internationalizedArray') || selectedLanguageIds.includes(member.name)
      },
    }),
  ],
})
