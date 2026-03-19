import { getTranslations } from "next-intl/server";
import NavBar from "../components/NavBar";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="home_background home-page min-h-screen">
      <NavBar />
      <main className="home-content">
        <p className="home-text home-main-text">{t("text")}</p>
      </main>
    </div>
  );
}
