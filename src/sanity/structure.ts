import type {StructureResolver} from 'sanity/structure'

/**
 * Estructura personalizada del Studio.
 *
 * Crea una carpeta "Gallery" con tres sub-pestañas:
 *  - Gráficas   → documentos media con categoria === "graficas"
 *  - Paisajes   → documentos media con categoria === "paisajes"
 *  - Protestas  → documentos media con categoria === "protestas"
 *
 * Los demás tipos de documento (como "victima") se listan normalmente.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Carpeta "Gallery" con tres sub-listas filtradas por categoría ──
      S.listItem()
        .title('Gallery')
        .child(
          S.list()
            .title('Gallery')
            .items([
              // Sub-pestaña: Gráficas
              S.listItem()
                .title('Gráficas')
                .child(
                  S.documentList()
                    .title('Gráficas')
                    .filter('_type == "media" && categoria == "graficas"')
                ),

              // Sub-pestaña: Paisajes
              S.listItem()
                .title('Paisajes')
                .child(
                  S.documentList()
                    .title('Paisajes')
                    .filter('_type == "media" && categoria == "paisajes"')
                ),

              // Sub-pestaña: Protestas
              S.listItem()
                .title('Protestas')
                .child(
                  S.documentList()
                    .title('Protestas')
                    .filter('_type == "media" && categoria == "protestas"')
                ),
            ])
        ),

      // ── Resto de tipos de documento (excluyendo "media" para no duplicar) ──
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== 'media'
      ),
    ])
