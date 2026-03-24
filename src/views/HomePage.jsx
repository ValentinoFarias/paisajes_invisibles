import { getTranslations } from "next-intl/server";
import NavBar from "../components/NavBar";
import HomeCarousel from "../components/HomeCarousel";

// ─── Photos shown in the home page carousel ───────────────────────────────────
// Replace these with your actual Cloudinary URLs and titles.
// Format: https://res.cloudinary.com/dik90bqk4/image/upload/<public_id>
const CAROUSEL_PHOTOS = [
  {
    src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365786/001_09_nuestramirada_Victimas_Chile__JAM7447_toczqe.webp",
  },
  {
    src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365773/_JAM8587_protesta_muerte_jorge_mora039_jlcm7f.webp",
  },
  {
    src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365770/_JAM8380_nkeg99.webp",
  },
  {
    src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365448/_JAM1224_vd9qsg.webp",
  },
  {
    src: "https://res.cloudinary.com/dik90bqk4/image/upload/v1774365437/_JAM1002_dusyu7.webp",
  },
];

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="home_background home-page min-h-screen">
      <NavBar />
      <main className="home-content">
        <p className="home-text home-main-text">{t("text")}</p>
      </main>
      {/* Carousel is outside home-content so it is a natural full-width child of the page */}
      <HomeCarousel photos={CAROUSEL_PHOTOS} />
    </div>
  );
}
