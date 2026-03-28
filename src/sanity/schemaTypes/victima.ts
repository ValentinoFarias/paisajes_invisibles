import { defineField, defineType } from 'sanity'

/**
 * Schema para el documento "victima" (víctima).
 *
 * Cada registro representa a una persona afectada, con campos localizados
 * (ES/EN) para la descripción, usando sanity-plugin-internationalized-array.
 */
export const victima = defineType({
  name: 'victima',
  // Título que aparece en la barra lateral del Studio
  title: 'Víctima',
  type: 'document',
  fields: [
    /* ------------------------------------------------------------------ */
    /*  nombre — nombre completo (obligatorio)                            */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required().error('El nombre es obligatorio'),
    }),

    /* ------------------------------------------------------------------ */
    /*  edad — edad al momento del hecho                                  */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'edad',
      title: 'Edad',
      type: 'number',
      validation: (rule) => rule.min(0).max(150),
    }),

    /* ------------------------------------------------------------------ */
    /*  fechaDelHecho — fecha en que ocurrió el hecho (obligatorio)       */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'fechaDelHecho',
      title: 'Fecha del hecho',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (rule) => rule.required().error('La fecha del hecho es obligatoria'),
    }),

    /* ------------------------------------------------------------------ */
    /*  lugar — ubicación del hecho                                       */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'lugar',
      title: 'Lugar',
      type: 'string',
    }),

    /* ------------------------------------------------------------------ */
    /*  descripcion — texto localizado (ES/EN)                            */
    /*  Usa internationalizedArrayText del plugin                         */
    /*  sanity-plugin-internationalized-array                             */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      // Este tipo lo registra el plugin con el nombre
      // "internationalizedArrayText" (text = textarea multilínea)
      type: 'internationalizedArrayText',
    }),

    /* ------------------------------------------------------------------ */
    /*  foto — imagen principal con hotspot/crop                          */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true, // Permite seleccionar punto focal y recorte
      },
    }),

    /* ------------------------------------------------------------------ */
    /*  publicado — controla visibilidad en el sitio (default: false)     */
    /* ------------------------------------------------------------------ */
    defineField({
      name: 'publicado',
      title: 'Publicado',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  /* -------------------------------------------------------------------- */
  /*  preview — cómo se muestra cada registro en la lista del Studio      */
  /* -------------------------------------------------------------------- */
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'lugar',
      media: 'foto',
    },
  },
})
