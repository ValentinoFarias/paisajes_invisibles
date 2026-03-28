import { defineField, defineType } from 'sanity'

/**
 * Schema para el documento "media".
 *
 * Colección genérica de imágenes subidas al Studio.
 * Útil para galerías, fondos y cualquier recurso visual
 * que no esté vinculado directamente a una víctima.
 */
export const media = defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    /* ------------------------------------------------------------------ */
    /*  titulo — nombre descriptivo de la imagen                          */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().error('El título es obligatorio'),
    }),

    /* ------------------------------------------------------------------ */
    /*  imagen — archivo de imagen con hotspot                            */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required().error('La imagen es obligatoria'),
    }),

    /* ------------------------------------------------------------------ */
    /*  alt — texto alternativo para accesibilidad                        */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Describe la imagen para lectores de pantalla y SEO',
    }),

    /* ------------------------------------------------------------------ */
    /*  categoria — etiqueta para filtrar imágenes (ej. "galería")        */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Gráficas', value: 'graficas' },
          { title: 'Paisajes', value: 'paisajes' },
          { title: 'Protestas', value: 'protestas' },
          { title: 'Portada', value: 'portada' },
          { title: 'Fondo', value: 'fondo' },
          { title: 'Otro', value: 'otro' },
        ],
      },
    }),
  ],

  /* -------------------------------------------------------------------- */
  /*  preview — vista previa en la lista del Studio                       */
  /* -------------------------------------------------------------------- */
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'categoria',
      media: 'imagen',
    },
  },
})
