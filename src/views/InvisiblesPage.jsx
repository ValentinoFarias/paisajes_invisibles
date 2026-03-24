import NavBar from "@/components/NavBar";
import Link from "next/link";
import { CASES } from "@/data/cases";

// Splits a full uppercase name into [firstName, lastName] for the two-line display.
// "ROMARIO VELOZ" → ["ROMARIO", "VELOZ"]
// Names with more than two words use the first word as firstName, the rest as lastName.
function splitName(fullName) {
  const parts = fullName.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return [firstName, lastName];
}

export default function InvisiblesPage() {
  return (
    <main className="invisibles-page">
      <NavBar />
      <section className="invisibles-content">
        <div className="invisibles-grid">
          <span className="invisibles-grid-line invisibles-grid-line-v" aria-hidden />
          <span className="invisibles-grid-line invisibles-grid-line-h1" aria-hidden />
          <span className="invisibles-grid-line invisibles-grid-line-h2" aria-hidden />

          {CASES.map((caseData) => {
            const [firstName, lastName] = splitName(caseData.name);

            return (
              <article className="invisibles-card" key={caseData.id}>
                {/* Paula Lorca is the only case with a dedicated page so far.
                    All others will get their own route as content is added. */}
                {caseData.id === "paula-lorca" ? (
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
            );
          })}
        </div>
      </section>
    </main>
  );
}
