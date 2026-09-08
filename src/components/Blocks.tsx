import type { Block } from "../content/types";
import type { L } from "../lib/layout";

const TONES = {
  note: { bg: "var(--note-bg)", ink: "var(--note-ink)", body: "var(--note-body)" },
  trap: { bg: "var(--trap-bg)", ink: "var(--trap-ink)", body: "var(--trap-body)" },
  exam: { bg: "var(--exam-bg)", ink: "var(--exam-ink)", body: "var(--exam-body)" },
} as const;

export function Blocks({ blocks, L, accent }: { blocks: Block[]; L: L; accent: string }) {
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} style={{ marginBottom: 26 }}>
          {b.kind === "lead" && (
            <p style={{ fontSize: L.lead, lineHeight: 1.5, color: "var(--ink)", textWrap: "pretty" }}>{b.text}</p>
          )}

          {b.kind === "text" && (
            <p style={{ fontSize: L.body, lineHeight: 1.65, color: "var(--ink-body)", textWrap: "pretty" }}>{b.text}</p>
          )}

          {b.kind === "define" && (
            <div style={{ background: "var(--surface)", borderRadius: 20, padding: L.cardPad }}>
              <div style={{ fontSize: L.cardTitle, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 12 }}>
                {b.term}
              </div>
              <p style={{ fontSize: L.body, lineHeight: 1.6, color: "var(--ink-card)", textWrap: "pretty" }}>{b.text}</p>
              <div style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 16 }}>{b.article}</div>
            </div>
          )}

          {b.kind === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {b.title && (
                <div style={{ fontSize: L.cardTitle, fontWeight: 500, letterSpacing: "-0.015em", textWrap: "pretty" }}>
                  {b.title}
                </div>
              )}
              {b.items.map((text, j) => (
                <div key={j} style={{ display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: 8, alignItems: "start" }}>
                  <span style={{ fontSize: L.body, lineHeight: 1.6, color: "var(--line-num)" }}>{j + 1}</span>
                  <span style={{ fontSize: L.body, lineHeight: 1.6, color: "var(--ink-body)", textWrap: "pretty" }}>{text}</span>
                </div>
              ))}
            </div>
          )}

          {b.kind === "callout" && (
            <div style={{ borderRadius: 20, padding: L.cardPad, background: TONES[b.tone].bg }}>
              <div
                style={{
                  fontSize: L.cardTitle, fontWeight: 500, letterSpacing: "-0.015em",
                  marginBottom: 10, color: TONES[b.tone].ink,
                }}
              >
                {b.title}
              </div>
              <p style={{ fontSize: L.body, lineHeight: 1.6, color: TONES[b.tone].body, textWrap: "pretty" }}>{b.text}</p>
            </div>
          )}

          {b.kind === "quote" && (
            <blockquote style={{ margin: "8px 0", padding: "0 0 0 24px", borderLeft: `3px solid ${accent}` }}>
              <p style={{ fontSize: L.quote, lineHeight: 1.45, letterSpacing: "-0.015em", color: "var(--ink)", textWrap: "pretty" }}>
                {b.text}
              </p>
              <div style={{ fontSize: 17, color: "var(--ink-2)", marginTop: 14 }}>{b.source}</div>
            </blockquote>
          )}
        </div>
      ))}
    </>
  );
}
