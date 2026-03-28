/**
 * Layout raíz para Sanity Studio.
 * Como /studio está fuera del grupo [locale], necesita su propio
 * <html> y <body> para que Next.js no arroje error.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
