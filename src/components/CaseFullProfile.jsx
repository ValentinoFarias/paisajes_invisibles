// CaseFullProfile.jsx
// Shown in InvisiblesPage for a single victim.
// Displays the full history, family interviews, and images.
// Receives the full case object as `caseData`.

import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";

export default function CaseFullProfile({ caseData }) {
  return (
    <article className="case-profile">

      {/* Full name header */}
      <h1 className="case-profile-name">{caseData.name}</h1>

      {/* Photo gallery — images are Cloudinary public IDs stored in cases.js */}
      {caseData.images.length > 0 && (
        <div className="case-profile-gallery">
          {caseData.images.map((publicId) => (
            <div key={publicId} className="case-profile-image-wrapper">
              <Image
                src={cloudinaryUrl(publicId, { width: 1200 })}
                alt={`Fotografía de ${caseData.name}`}
                fill
                className="case-profile-image"
              />
            </div>
          ))}
        </div>
      )}

      {/* Full biographical history */}
      {caseData.fullHistory ? (
        <div className="case-profile-history">
          <p>{caseData.fullHistory}</p>
        </div>
      ) : (
        <p className="case-profile-placeholder">
          Historia completa por agregar.
        </p>
      )}

      {/* Family interviews — each entry has a speaker name and a quote */}
      {caseData.familyInterviews.length > 0 && (
        <div className="case-profile-interviews">
          {caseData.familyInterviews.map((interview, index) => (
            <blockquote key={index} className="case-profile-quote">
              <p>"{interview.quote}"</p>
              <footer className="case-profile-quote-author">
                — {interview.speaker}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </article>
  );
}
