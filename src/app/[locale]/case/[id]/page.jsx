// Dynamic case route — /[locale]/case/[id]
// Looks up the case by its id slug in cases.js and renders CasesPage.
// If the case doesn't exist, shows a 404 via Next.js notFound().

import { notFound } from "next/navigation";
import { CASES } from "@/data/cases";
import CasesPage from "@/views/CasesPage";

export default async function CaseRoute({ params }) {
  // Await params (required in Next.js 15 app router)
  const { id, locale } = await params;

  // Find the case matching the URL slug
  const caseData = CASES.find((c) => c.id === id);

  // If no case matches the id, show a 404 page
  if (!caseData) return notFound();

  return <CasesPage caseData={caseData} locale={locale} />;
}
