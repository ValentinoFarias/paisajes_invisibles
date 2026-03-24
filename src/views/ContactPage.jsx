import NavBar from "@/components/NavBar";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <NavBar />
      <div className="contact-body">
        <a href="mailto:hola@javieralvarez.com" className="contact-email">
          hola@javieralvarez.com
        </a>
      </div>
    </main>
  );
}
