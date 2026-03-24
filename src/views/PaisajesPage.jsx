// PaisajesPage.jsx — Server Component (no "use client")
// State lives in PaisajesSidebar so this page can render async
// Server Components like NavBar without errors.

import NavBar from "@/components/NavBar";
import ChileMap from "@/components/ChileMap";
import PaisajesSidebar from "@/components/PaisajesSidebar";

export default function PaisajesPage() {
  return (
    <main className="paisajes-page min-h-screen bg-black">
      <NavBar />

      {/* Two-column layout: model on the left, sidebar on the right */}
      <div className="paisajes-split">

        {/* Left half — 3D terrain viewer */}
        {/* TODO: pass selectedCase.coords here once camera API is ready */}
        <div className="paisajes-split-model">
          <ChileMap />
        </div>

        {/* Right half — Cardinals list + CasePanel (client, owns state) */}
        <div className="paisajes-split-text">
          <PaisajesSidebar />
        </div>

      </div>
    </main>
  );
}
