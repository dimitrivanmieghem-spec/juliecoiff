"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#faf8f5", fontFamily: "Arial, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p style={{ fontSize: "3rem", marginBottom: "1.5rem" }} aria-hidden="true">✂️</p>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#3d2c1e",
              marginBottom: "0.75rem",
            }}
          >
            Oups, quelque chose s&apos;est mal passé.
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#9c7a5f", marginBottom: "2rem", maxWidth: "24rem", lineHeight: 1.6 }}>
            Une erreur critique est survenue. Veuillez rafraîchir la page ou réessayer.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                background: "#b85d38",
                color: "#fff",
                border: "none",
                borderRadius: "1rem",
                padding: "0.875rem 1.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Réessayer
            </button>
            <a
              href="/"
              style={{
                border: "1px solid rgba(184,93,56,0.3)",
                color: "#b85d38",
                borderRadius: "1rem",
                padding: "0.875rem 1.5rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
