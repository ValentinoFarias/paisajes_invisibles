"use client";

// PaisajesSidebar.jsx
// Client Component that owns the selectedCase state for PaisajesPage.
// Kept separate so PaisajesPage itself stays a Server Component and can
// render async components like NavBar without errors.

import { useState } from "react";
import Cardinals from "@/components/Cardinals";
import CasePanel from "@/components/CasePanel";

export default function PaisajesSidebar() {
  const [selectedCase, setSelectedCase] = useState(null);

  // TODO: also call a prop/callback to move the ChileMap camera when ready
  function handleSelectCase(caseData) {
    setSelectedCase(caseData);
  }

  return (
    <>
      <Cardinals
        onSelect={handleSelectCase}
        selectedId={selectedCase?.id}
      />
      <CasePanel selectedCase={selectedCase} />
    </>
  );
}
