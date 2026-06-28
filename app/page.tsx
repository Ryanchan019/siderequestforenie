"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

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

type Step = "invite" | "movies" | "convince" | "done";

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

const formspreeEndpoint = "https://formspree.io/f/xaqgjarp";

export default function Home() {
  const [step, setStep] = useState<Step>("invite");
  const [introComplete, setIntroComplete] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroComplete(true), 9400);
    return () => window.clearTimeout(timer);
  }, []);

  const sparkleText = useMemo(() => {
    return selectedMovie === "Something else"
      ? "Write your dream movie, cinema, or snack request below."
      : "Optional: add a cinema, time, or snack preference.";
  }, [selectedMovie]);

  function acceptSideRequest() {
    if (isCelebrating) {
      return;
    }

    setIsCelebrating(true);
    window.setTimeout(() => {
      setStep("movies");
    }, 850);
  }

  async function sendForm(payload: Record<string, string>) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Dear Enie movie invite",
          submittedAt: new Date().toISOString(),
          ...payload
        })
      });

      if (!response.ok) {
        throw new Error("Could not send the answer.");
      }

      setStep("done");
    } catch {
      setError("Tiny internet hiccup. Can you try once more?");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitChoice() {
    if (!selectedMovie) {
      setError("Pick a movie first, please.");
      return;
    }

    await sendForm({
      _subject: "Enie picked a movie",
      kind: "movie choice",
      movie: selectedMovie,
      note
    });
  }

  async function submitAvailability(answer: "yes" | "no") {
    await sendForm({
      _subject: "Enie answered next week",
      kind: "next week availability",
      freeNextWeek: answer
    });
  }

  if (step === "done") {
    return (
      <main className="page-shell">
        <section className="movie-wrap">
          <div className="thank-you">
            <h1>yay, sent</h1>
            <p>Ryan has the answer now. Tiny mission accomplished.</p>
          </div>
        </section>
      </main>
    );
  }

  if (step === "convince") {
    return (
      <main className="page-shell">
        <section className="invite-wrap" aria-label="More convincing">
          <article className="letter compact-letter">
            <div className="animal-stickers" aria-hidden="true">
              <span className="animal-sticker dodo-sticker">🦤</span>
              <span className="animal-sticker mouse-sticker">🐭</span>
            </div>
            <p className="question single-question">So... are u free next week?</p>
            <div className="convince-actions">
              <button
                className="cta-button accept-button"
                disabled={isSubmitting}
                onClick={() => submitAvailability("yes")}
                type="button"
              >
                yes
              </button>
              <button
                className="cta-button convince-button"
                disabled={isSubmitting}
                onClick={() => submitAvailability("no")}
                type="button"
              >
                no
              </button>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
          </article>
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
            {isSubmitting ? "saving..." : "send"}
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
        <article className="letter story-letter">
          <div className="animal-stickers" aria-hidden="true">
            <span className="animal-sticker dodo-sticker">🦤</span>
            <span className="animal-sticker mouse-sticker">🐭</span>
          </div>
          <div className="intro-sequence" aria-hidden={introComplete}>
            <p className="intro-line intro-line-one">Thanks again for the ice cream 🍦</p>
            <p className="intro-line intro-line-two">Since you paid last time...</p>
            <p className="intro-line intro-line-three">I think it’s my turn now. 😌</p>
          </div>
          <div className={`reward-page ${introComplete ? "reward-page-visible" : ""}`}>
            <h1>Reward includes:</h1>
            <ul>
              <li>✅ One movie ticket</li>
              <li>✅ Unlimited popcorn sharing (negotiable)</li>
              <li>✅ Occasional bad jokes</li>
            </ul>
            <div className="letter-divider">⸻</div>
          </div>
        </article>

        <div className={`cta-stage ${introComplete ? "cta-stage-visible" : ""}`} aria-label="Answer buttons">
          <button
            className="cta-button accept-button"
            disabled={isCelebrating || !introComplete}
            onClick={acceptSideRequest}
            type="button"
          >
            Accept Side Request 🎟️
          </button>
          <button
            className="cta-button convince-button"
            disabled={!introComplete}
            onClick={() => setStep("convince")}
            type="button"
          >
            Need more convincing 🤔
          </button>
        </div>
      </section>
    </main>
  );
}
