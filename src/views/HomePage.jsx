import { getTranslations } from "next-intl/server";
import NavBar from "../components/NavBar";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="home_background min-h-screen">
      <NavBar />
      <p className="home-text">{t("text")}</p>
    </div>
  );
}
