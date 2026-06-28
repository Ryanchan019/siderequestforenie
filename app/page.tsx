"use client";

import { CSSProperties, useMemo, useState } from "react";

const movies = [
  {
    title: "Das Sommerbuch",
    detail: "Drama, soft summer feeling, based on Tove Jansson"
  },
  {
    title: "Glennkill: Ein Schafskrimi",
    detail: "Comedy mystery, light and very date-night friendly"
  },
  {
    title: "The Love That Remains",
    detail: "Drama about a family navigating a year of change"
  },
  {
    title: "Supergirl",
    detail: "Bright action adventure, superhero cinema mood"
  },
  {
    title: "Hallo Betty",
    detail: "Feelgood drama about the Betty Bossi cooking figure"
  },
  {
    title: "Sommer",
    detail: "A gentle romance from Eric Rohmer's seasons cycle"
  },
  {
    title: "Inception",
    detail: "A big-screen classic if we want something dreamy"
  },
  {
    title: "Something else",
    detail: "You choose and I will happily follow"
  }
];

type Step = "invite" | "movies" | "done";

const confettiPieces = [
  { x: -118, y: -126, rotate: -38, color: "#ff7ab6" },
  { x: -82, y: -184, rotate: 22, color: "#ffe66d" },
  { x: -42, y: -144, rotate: 68, color: "#a8f0d6" },
  { x: 0, y: -198, rotate: -12, color: "#c9b8ff" },
  { x: 38, y: -152, rotate: 42, color: "#ff9f6e" },
  { x: 82, y: -186, rotate: -64, color: "#7dd7ff" },
  { x: 124, y: -122, rotate: 28, color: "#ff7ab6" },
  { x: -132, y: -68, rotate: 72, color: "#ffe66d" },
  { x: 138, y: -62, rotate: -24, color: "#a8f0d6" },
  { x: -68, y: -92, rotate: -82, color: "#c9b8ff" },
  { x: 58, y: -104, rotate: 88, color: "#ff9f6e" },
  { x: 8, y: -122, rotate: 36, color: "#7dd7ff" }
];

const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export default function Home() {
  const [step, setStep] = useState<Step>("invite");
  const [noPosition, setNoPosition] = useState({ left: 182, top: 32 });
  const [noScale, setNoScale] = useState(1);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sparkleText = useMemo(() => {
    return selectedMovie === "Something else"
      ? "Write your dream movie, cinema, or snack request below."
      : "Optional: add a cinema, time, or snack preference.";
  }, [selectedMovie]);

  function moveNoButton() {
    const stageWidth = Math.min(window.innerWidth - 44, 460);
    const buttonWidth = 132 * noScale;
    const maxLeft = Math.max(0, stageWidth - buttonWidth);
    const maxTop = 82;

    setNoPosition({
      left: Math.round(Math.random() * maxLeft),
      top: Math.round(Math.random() * maxTop)
    });
    setNoScale((currentScale) => Math.max(0.48, Number((currentScale - 0.09).toFixed(2))));
  }

  function sayYes() {
    if (isCelebrating) {
      return;
    }

    setIsCelebrating(true);
    window.setTimeout(() => {
      setStep("movies");
    }, 850);
  }

  async function submitChoice() {
    if (!selectedMovie) {
      setError("Pick a movie first, please.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        movie: selectedMovie,
        note,
        from: "Dear Enie movie invite",
        submittedAt: new Date().toISOString()
      };
      const response = await fetch(formspreeEndpoint || "/api/rsvp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Could not save the answer.");
      }

      setStep("done");
    } catch {
      setError("Tiny internet hiccup. Can you try once more?");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <main className="page-shell">
        <section className="movie-wrap">
          <div className="thank-you">
            <h1>yay, saved</h1>
            <p>Ryan has your movie answer now. This is already a tiny win.</p>
          </div>
        </section>
      </main>
    );
  }

  if (step === "movies") {
    return (
      <main className="page-shell">
        <section className="movie-wrap" aria-label="Movie choice">
          <h1 className="section-title">what movie do u want to watch?</h1>
          <p className="section-subtitle">
            A small Berlin-week shortlist. Choose the one that feels most fun.
          </p>

          <div className="movie-grid">
            {movies.map((movie) => (
              <button
                className={`movie-card ${selectedMovie === movie.title ? "selected" : ""}`}
                key={movie.title}
                onClick={() => setSelectedMovie(movie.title)}
                type="button"
              >
                <span className="movie-card-top">
                  <span>
                    <h2 className="movie-title">{movie.title}</h2>
                    <p className="movie-meta">{movie.detail}</p>
                  </span>
                  <span className="movie-dot" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>

          <textarea
            className="note-box"
            onChange={(event) => setNote(event.target.value)}
            placeholder={sparkleText}
            value={note}
          />

          <button
            className="submit-button"
            disabled={isSubmitting}
            onClick={submitChoice}
            type="button"
          >
            {isSubmitting ? "saving..." : "send to Ryan"}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="invite-wrap" aria-label="Invitation letter">
        {isCelebrating ? (
          <div className="celebration-burst" aria-hidden="true">
            {confettiPieces.map((piece, index) => (
              <span
                className="confetti-piece"
                key={`${piece.x}-${piece.y}-${index}`}
                style={
                  {
                    "--confetti-color": piece.color,
                    "--confetti-x": `${piece.x}px`,
                    "--confetti-y": `${piece.y}px`,
                    "--confetti-rotate": `${piece.rotate}deg`,
                    "--confetti-delay": `${index * 22}ms`
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
        <article className="letter">
          <div className="animal-stickers" aria-hidden="true">
            <span className="animal-sticker dodo-sticker">🦤</span>
            <span className="animal-sticker mouse-sticker">🐭</span>
          </div>
          <div className="letter-kicker reveal-line">Dear Enie,</div>
          <p className="reveal-line">I was wondering...</p>
          <p className="question reveal-line">do u wanna watch a movie with me this week?</p>
          <div className="signature reveal-line">Ryan</div>
        </article>

        <div className="button-stage" aria-label="Answer buttons">
          <button
            className="choice-button yes-button"
            disabled={isCelebrating}
            onClick={sayYes}
            type="button"
          >
            yes
          </button>
          <button
            className="choice-button no-button"
            onClick={moveNoButton}
            onMouseEnter={moveNoButton}
            style={{ left: noPosition.left, top: noPosition.top, transform: `scale(${noScale})` }}
            type="button"
          >
            no
          </button>
        </div>
      </section>
    </main>
  );
}
