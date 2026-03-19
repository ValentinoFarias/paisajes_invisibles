import { getTranslations } from "next-intl/server";
import SantiagoMap from "../components/SantiagoMap";
import LangToggle from "../components/LangToggle";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="min-h-screen bg-black">
      <nav className="flex items-center justify-between">
        <h1 className="text-white">{t("title")}</h1>
        <LangToggle />
      </nav>
      <SantiagoMap />
    </div>
  );
}
