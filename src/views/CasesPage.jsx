// CasesPage.jsx
// Page-level wrapper for case detail routes.
// Renders NavBar + CaseInvisiblesProfile component.

import NavBar from "@/components/NavBar";
import CaseInvisiblesProfile from "@/components/CaseInvisiblesProfile";

export default function CasesPage({ caseData, locale }) {
  return (
    <main className="paula-lorca-page min-h-screen">
      <NavBar />
      <CaseInvisiblesProfile caseData={caseData} locale={locale} />
    </main>
  );
}
