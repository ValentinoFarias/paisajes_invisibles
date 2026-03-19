import MenuBar from "./MenuBar";

export default function NavBar() {
  return (
    <nav className="flex w-full items-center justify-center gap-200 p-4">
      <div className="flex items-center gap-3">
        <MenuBar />
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          PAISAJES
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          style={{
            color: "var(--color-secondary)",
            fontFamily: "var(--font-title-primary)",
          }}
        >
          INVISIBLES
        </span>
      </div>
    </nav>
  );
}
