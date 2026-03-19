import NavBar from "@/components/NavBar";
import Link from "next/link";

const INVISIBLES_NAMES = [
  ["PAULA", "LORCA"],
  ["ROMARIO", "VELOZ"],
  ["KEVIN", "GOMEZ"],
  ["CESAR", "MAELLA"],
  ["CRISTIAN", "VALDEBENITO"],
  ["SEBASTIAN", "QUEVEDO"],
];

export default function InvisiblesPage() {
  return (
    <main className="invisibles-page">
      <NavBar />
      <section className="invisibles-content">
        <div className="invisibles-grid">
          <span className="invisibles-grid-line invisibles-grid-line-v" aria-hidden />
          <span className="invisibles-grid-line invisibles-grid-line-h1" aria-hidden />
          <span className="invisibles-grid-line invisibles-grid-line-h2" aria-hidden />
          {INVISIBLES_NAMES.map(([firstName, lastName], index) => (
            <article className="invisibles-card" key={`${firstName}-${lastName}`}>
              {index === 0 ? (
                <Link href="/paulalorca" className="invisibles-name-link">
                  <h2 className="invisibles-name">
                    {firstName}
                    <br />
                    {lastName}
                  </h2>
                </Link>
              ) : (
                <h2 className="invisibles-name">
                  {firstName}
                  <br />
                  {lastName}
                </h2>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
