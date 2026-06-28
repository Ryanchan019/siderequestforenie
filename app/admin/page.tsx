"use client";

import { FormEvent, useState } from "react";

type ResponseRow = {
  id: string;
  movie: string;
  note: string | null;
  user_agent: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  async function loadResults(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await fetch(`/api/results?password=${encodeURIComponent(password)}`);

      if (!result.ok) {
        throw new Error("Could not load results.");
      }

      const data = (await result.json()) as { responses: ResponseRow[] };
      setResponses(data.responses);
      setHasLoaded(true);
    } catch {
      setError("Password not accepted, or results could not load.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="admin-wrap" aria-label="Ryan admin results">
        <h1 className="section-title">Ryan's movie replies</h1>
        <p className="section-subtitle">Private little control room for Enie's answer.</p>

        <form className="admin-login" onSubmit={loadResults}>
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin password"
            type="password"
            value={password}
          />
          <button className="admin-button" disabled={isLoading || !password} type="submit">
            {isLoading ? "checking..." : "show results"}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </form>

        {hasLoaded ? (
          <div className="results-list" style={{ marginTop: 16 }}>
            {responses.length === 0 ? (
              <div className="result-card">
                <div className="result-movie">No replies yet</div>
                <div className="result-meta">The suspense is doing its thing.</div>
              </div>
            ) : (
              responses.map((response) => (
                <article className="result-card" key={response.id}>
                  <div className="result-movie">{response.movie}</div>
                  {response.note ? <div className="result-note">{response.note}</div> : null}
                  <div className="result-meta">
                    {new Date(response.created_at).toLocaleString()} ·{" "}
                    {response.user_agent || "unknown device"}
                  </div>
                </article>
              ))
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
