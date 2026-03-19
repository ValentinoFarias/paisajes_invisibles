import NavBar from "@/components/NavBar";

const INTRO_ES = `Paula, mayor de seis hermanos y madre de dos niños, su familia y vecinos la recuerdan siempre alegre y muy cercana a Dios.

La noche de su muerte y minutos antes del toque de queda, Paula sale a comprar al negocio de la esquina vistiendo solo una bata. A pocas cuadras del lugar, un supermercado estaba siendo saqueado e incendiado. En la madrugada, su cuerpo fue encontrado por bomberos, junto al de otra mujer (Alicia Cofré, 42), cerca de la salida del local.

Su familia cree que por su curiosidad y el caos, Paula fue atrapada y puesta dentro del lugar para justificar la violencia de las protestas. Su cuerpo, no calcinado pese a estar dentro de un lugar de incendio, presentaba signos de tortura.`;

const INTRO_EN = `Paula, the oldest of six siblings and mother of two children, is remembered as a very joyful woman, and very close to God.

The night of her death, minutes before the curfew, Paula went out to a corner store wearing only a night robe. Meanwhile, a nearby supermarket was being looted and burned down only a few blocks from Paula's. Later that night, firefighters found her body alongside another woman (Alicia Cofré, 42) near the supermarket exit.

Her family believes Paula got trapped in the chaos, arrested, and later placed inside by military forces to plant evidence of a violent protest. Although after being inside a burned-out store, her body was not calcinated and showed signs of torture.`;

const QUOTE_ES = `(...)Ese día estábamos comiendo en el otro comedor y veo que (Paula) va saliendo y le veo la pura parte del talón. Le pregunto a la vieja “¿La Paula salió?” y me dice, “fue a comprar una bebida”, ojalá se venga al tiro, iba a estar con la cuestión del toque de queda. (...)

Ramon Lorca, padre de Paula`;

const QUOTE_EN = `(...)We were having dinner that day, and I noticed Paula was going out. I only got to see the heel of her shoe! So, I asked my wife where she was going, and she said: "To the corner store to get some sodas." I thought: hopefully, she would return soon because the curfew was about to start. (...)

Ramon Lorca, Paula's father.`;

export default function PaulaLorcaPage() {
  return (
    <main className="paula-lorca-page min-h-screen">
      <NavBar />
      <section className="paula-lorca-content">
        <h1 className="paula-lorca-title">PAULA LORCA</h1>

        <div className="paula-lorca-book-wrap">
          <img
            src="/assets/images/paulalorca/book.png"
            alt="Álbum abierto con imágenes y anotaciones"
            className="paula-lorca-book-image"
          />
        </div>

        <section className="paula-lorca-intro-grid">
          <p className="paula-lorca-text">{INTRO_ES}</p>
          <p className="paula-lorca-text">{INTRO_EN}</p>
        </section>

        <section className="paula-lorca-gallery-top">
          <figure className="paula-lorca-photo paula-lorca-photo-a">
            <img
              src="/assets/images/paulalorca/1.png"
              alt="Familia reunida en una mesa"
            />
          </figure>
          <figure className="paula-lorca-photo paula-lorca-photo-b">
            <img
              src="/assets/images/paulalorca/2.png"
              alt="Tela blanca colgando en un interior"
            />
          </figure>
          <figure className="paula-lorca-photo paula-lorca-photo-c">
            <img
              src="/assets/images/paulalorca/3.png"
              alt="Paisaje urbano con vegetación"
            />
          </figure>
        </section>

        <section className="paula-lorca-quote-grid">
          <p className="paula-lorca-quote">{QUOTE_ES}</p>
          <p className="paula-lorca-quote">{QUOTE_EN}</p>
        </section>

        <section className="paula-lorca-gallery-bottom">
          <figure className="paula-lorca-photo paula-lorca-photo-d">
            <img
              src="/assets/images/paulalorca/4.png"
              alt="Interior oscuro con línea de luz"
            />
          </figure>
          <figure className="paula-lorca-photo paula-lorca-photo-e">
            <img
              src="/assets/images/paulalorca/5.png"
              alt="Retrato enmarcado en una pared"
            />
          </figure>
        </section>
      </section>
    </main>
  );
}
