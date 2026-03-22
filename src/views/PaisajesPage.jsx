import NavBar from "@/components/NavBar";
import ChileMap from "@/components/ChileMap";

export default function PaisajesPage() {
  return (
    <main className="paisajes-page min-h-screen bg-black">
      <NavBar />

      {/* Two-column layout: model on the left, text on the right */}
      <div className="paisajes-split">

        {/* Left half — 3D terrain viewer */}
        <div className="paisajes-split-model">
          <ChileMap />
        </div>

        {/* Right half — add your text content here */}
        <div className="paisajes-split-text">
          <p>Your text goes here</p>
        </div>

      </div>
    </main>
  );
}
