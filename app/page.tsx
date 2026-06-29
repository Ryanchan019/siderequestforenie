"use client";

import { CSSProperties, useRef, useState } from "react";

const cinemaLinks = [
  {
    title: "Yorck Kinos",
    detail: "Many Berlin cinemas, often with OV / OmU screenings",
    href: "https://www.yorck.de/filme"
  },
  {
    title: "Odeon",
    detail: "A classic English-language cinema in Schoneberg",
    href: "https://www.yorck.de/kinos/odeon"
  },
  {
    title: "Babylon Kreuzberg",
    detail: "Cozy OV / OmU program cinema near Kottbusser Tor",
    href: "https://www.yorck.de/kinos/babylon-kreuzberg"
  },
  {
    title: "Zoo Palast",
    detail: "Big-screen cinema with a very Berlin date-night feeling",
    href: "https://zoopalast.premiumkino.de/programm"
  },
  {
    title: "CineStar CUBIX",
    detail: "Central cinema at Alexanderplatz with current releases",
    href: "https://www.cinestar.de/kino-berlin-cubix-am-alexanderplatz"
  },
  {
    title: "CinemaxX Potsdamer Platz",
    detail: "Large cinema with plenty of weekly showtimes",
    href: "https://www.cinemaxx.de/programm/berlin-potsdamer-platz"
  }
];

type Step = "invite" | "movies" | "convince" | "done";
type InvitePage = "cover" | "intro" | "reward" | "question";

const confettiPieces = [
  { x: -118, y: -126, rotate: -38, color: "#c12d3e" },
  { x: -82, y: -184, rotate: 22, color: "#d7a15e" },
  { x: -42, y: -144, rotate: 68, color: "#f5ead7" },
  { x: 0, y: -198, rotate: -12, color: "#7b121f" },
  { x: 38, y: -152, rotate: 42, color: "#ff5868" },
  { x: 82, y: -186, rotate: -64, color: "#2b1116" },
  { x: 124, y: -122, rotate: 28, color: "#c12d3e" },
  { x: -132, y: -68, rotate: 72, color: "#d7a15e" },
  { x: 138, y: -62, rotate: -24, color: "#f5ead7" },
  { x: -68, y: -92, rotate: -82, color: "#7b121f" },
  { x: 58, y: -104, rotate: 88, color: "#ff5868" },
  { x: 8, y: -122, rotate: 36, color: "#2b1116" }
];

const formspreeEndpoint = "https://formspree.io/f/xaqgjarp";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState<Step>("invite");
  const [invitePage, setInvitePage] = useState<InvitePage>("cover");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [convinceAttempts, setConvinceAttempts] = useState(0);
  const [convincePosition, setConvincePosition] = useState({ x: 0, y: 0 });
  const [note, setNote] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicUnavailable, setMusicUnavailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio || musicUnavailable) {
      return;
    }

    try {
      if (audio.paused) {
        audio.volume = 0.38;
        await audio.play();
        setIsMusicPlaying(true);
      } else {
        audio.pause();
        setIsMusicPlaying(false);
      }
    } catch {
      setMusicUnavailable(true);
      setIsMusicPlaying(false);
    }
  }

  function renderMusicControl() {
    return (
      <div className="music-panel">
        <audio
          loop
          onError={() => setMusicUnavailable(true)}
          onPause={() => setIsMusicPlaying(false)}
          onPlay={() => setIsMusicPlaying(true)}
          preload="metadata"
          ref={audioRef}
          src="/audio/tao-zhe-that-girl.mp3"
        />
        <button
          aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
          className={`music-button cd-icon ${isMusicPlaying ? "cd-icon-playing" : ""}`}
          disabled={musicUnavailable}
          onClick={toggleMusic}
          title={musicUnavailable ? "Add tao-zhe-that-girl.mp3 first" : "那个女孩 - 陶喆"}
          type="button"
        >
          <span className="cd-hole" />
        </button>
        <p className="music-note">play a song u won’t understand the lyrics haha</p>
      </div>
    );
  }

  function acceptSideRequest() {
    if (isCelebrating) {
      return;
    }

    setIsCelebrating(true);
    window.setTimeout(() => {
      setStep("movies");
    }, 850);
  }

  function needMoreConvincing() {
    if (convinceAttempts >= 3) {
      setStep("convince");
      return;
    }

    const nextAttempt = convinceAttempts + 1;
    const runawayButton = document.querySelector(".runaway-button");
    const acceptButton = document.querySelector(".main-accept-button");
    const runawayRect = runawayButton?.getBoundingClientRect();
    const acceptRect = acceptButton?.getBoundingClientRect();
    const margin = 16;

    if (!runawayRect || !acceptRect) {
      setConvinceAttempts(nextAttempt);
      return;
    }

    const naturalLeft = runawayRect.left - convincePosition.x;
    const naturalTop = runawayRect.top - convincePosition.y;
    const maxLeft = Math.max(margin, window.innerWidth - runawayRect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - runawayRect.height - margin);
    const blocked = {
      left: acceptRect.left - 12,
      right: acceptRect.right + 12,
      top: acceptRect.top - 12,
      bottom: acceptRect.bottom + 12
    };

    let nextLeft = naturalLeft;
    let nextTop = naturalTop;

    for (let attempt = 0; attempt < 24; attempt += 1) {
      const candidateLeft = margin + Math.random() * (maxLeft - margin);
      const candidateTop = margin + Math.random() * (maxTop - margin);
      const candidate = {
        left: candidateLeft,
        right: candidateLeft + runawayRect.width,
        top: candidateTop,
        bottom: candidateTop + runawayRect.height
      };
      const overlapsAccept =
        candidate.left < blocked.right &&
        candidate.right > blocked.left &&
        candidate.top < blocked.bottom &&
        candidate.bottom > blocked.top;

      if (!overlapsAccept) {
        nextLeft = candidateLeft;
        nextTop = candidateTop;
        break;
      }
    }

    setConvinceAttempts(nextAttempt);
    setConvincePosition({
      x: Math.round(nextLeft - naturalLeft),
      y: Math.round(nextTop - naturalTop)
    });
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
    if (!note.trim()) {
      setError("Write your movie idea first, please.");
      return;
    }

    await sendForm({
      _subject: "Enie picked a movie",
      kind: "movie choice",
      note: note.trim()
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
        {renderMusicControl()}
        <section className="movie-wrap">
          <div className="thank-you">
            <div className="mission-progress" aria-label="Mission upload progress">
              <span />
            </div>
            <h1>GOT IT!</h1>
            <p>checking popcorn availability...</p>
            <p>estimated review time: 1-2 bussiness time 😊</p>
          </div>
        </section>
      </main>
    );
  }

  if (step === "convince") {
    return (
      <main className="page-shell">
        {renderMusicControl()}
        <section className="invite-wrap" aria-label="More convincing">
          <article className="letter compact-letter">
            <div className="animal-stickers" aria-hidden="true">
              <span className="animal-sticker dodo-sticker">🦤</span>
              <span className="animal-sticker mouse-sticker">🐭</span>
            </div>
            <div className="letter-kicker fixed-salutation">Dear Enie,</div>
            <p className="question single-question">So... are u free next week?</p>
            <div className="mini-actions">
              <button
                className="mini-button accept-button"
                disabled={isSubmitting}
                onClick={() => submitAvailability("yes")}
                type="button"
              >
                yes
              </button>
              <button
                className="mini-button convince-button"
                disabled={isSubmitting}
                onClick={() => submitAvailability("no")}
                type="button"
              >
                no
              </button>
            </div>
            <div className="signature fixed-signature">Ryan</div>
            {error ? <p className="error-text">{error}</p> : null}
          </article>
        </section>
      </main>
    );
  }

  if (step === "movies") {
    return (
      <main className="page-shell">
        {renderMusicControl()}
        <section className="movie-wrap" aria-label="Movie choice">
          <h1 className="section-title">what movie do u want to watch?</h1>
          <p className="section-subtitle">
            I prefer English movies, or ones with German subtitles are also fine,
            because with subtitles I can understand it, I just cannot catch the
            listening haha. And I already watched Toy Story 5. Here I list some
            of the movie list of the cinema👀
          </p>
          <div className="movie-grid">
            {cinemaLinks.map((cinema) => (
              <a
                className="movie-card cinema-link"
                href={cinema.href}
                key={cinema.title}
                rel="noreferrer"
                target="_blank"
              >
                <span className="movie-card-top">
                  <span>
                    <h2 className="movie-title">{cinema.title}</h2>
                    <p className="movie-meta">{cinema.detail}</p>
                  </span>
                  <span className="movie-arrow" aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
          <p className="return-note">
            After checking the weekly programs, remember to come back and submit
            your choice in the box. 🙃
          </p>

          <textarea
            className="note-box"
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a movie, cinema, time, or snack preference."
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
      {renderMusicControl()}
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
        <article className={`letter story-letter ${invitePage === "cover" ? "closed-letter" : ""}`}>
          {invitePage === "cover" ? (
            <div className="letter-cover" aria-label="Closed letter">
              <div className="envelope-art" aria-hidden="true">
                <span className="envelope-flap" />
                <span className="envelope-seal">R</span>
              </div>
            </div>
          ) : (
            <>
              <div className="animal-stickers" aria-hidden="true">
                <span className="animal-sticker dodo-sticker">🦤</span>
                <span className="animal-sticker mouse-sticker">🐭</span>
              </div>
              <div className="letter-kicker fixed-salutation">Dear Enie,</div>
              <div className={`intro-sequence ${invitePage !== "intro" ? "intro-sequence-faded" : ""}`} aria-hidden={invitePage !== "intro"}>
                <p className="intro-line intro-line-one">Thanks again for the ice cream 🍦</p>
                <p className="intro-line intro-line-two">Since you paid last time…</p>
                <p className="intro-line intro-line-three">I think it’s my turn now. 😌</p>
              </div>
              <div className={`reward-page ${invitePage === "reward" ? "reward-page-visible" : ""} ${invitePage === "question" ? "reward-page-faded" : ""}`}>
                <h1 className="reward-title reward-line reward-title-line">Reward includes:</h1>
                <ul>
                  <li className="reward-line reward-line-one">✅ One movie ticket</li>
                  <li className="reward-line reward-line-two">✅ Unlimited popcorn sharing (negotiable)</li>
                  <li className="reward-line reward-line-three">✅ Occasional bad jokes</li>
                </ul>
              </div>
              <div className={`side-request-page ${invitePage === "question" ? "side-request-page-visible" : ""}`}>
                <p className="question side-request-question">So… would you like to watch a movie with me this week? 🍿</p>
              </div>
              <div className="signature fixed-signature">Ryan</div>
            </>
          )}
        </article>

        <div className="story-action-stage">
          {invitePage !== "question" ? (
            <button
              className={`story-next-button ${invitePage === "cover" ? "open-letter-button" : ""}`}
              onClick={() =>
                setInvitePage(
                  invitePage === "cover"
                    ? "intro"
                    : invitePage === "intro"
                      ? "reward"
                      : "question"
                )
              }
              type="button"
            >
              {invitePage === "cover" ? "open" : "next"}
            </button>
          ) : (
            <div className="cta-stage cta-stage-visible" aria-label="Answer buttons">
              <button
                className="cta-button accept-button main-accept-button"
                disabled={isCelebrating}
                onClick={acceptSideRequest}
                type="button"
              >
                accept the siderequest 🎟️
              </button>
              <button
                className="cta-button convince-button runaway-button"
                onClick={needMoreConvincing}
                style={{
                  transform: `translate(${convincePosition.x}px, ${convincePosition.y}px)`
                }}
                type="button"
              >
                need more convincing 🤔
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
