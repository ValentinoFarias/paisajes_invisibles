import MenuBar from "./MenuBar";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="navbar-responsive flex w-full items-center justify-center gap-200 p-4">
      <div className="navbar-group flex items-center gap-3">
        <MenuBar />
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          <Link href="/paisajes" className="navbar-link hover:text-gray-300">
            PAISAJES
          </Link>
        </span>
      </div>
      <div className="navbar-group flex items-center gap-3">
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          <Link href="/invisibles" className="navbar-link hover:text-gray-300">
            INVISIBLES
          </Link>
        </span>
      </div>
    </nav>
  );
}
