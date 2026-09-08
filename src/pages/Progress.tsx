import { useNavigate } from "react-router-dom";
import { books } from "../content/books";
import { subjects } from "../content/subjects";
import { paletteFor } from "../design/palette";
import { plural } from "../lib/format";
import type { L } from "../lib/layout";
import type { ProgressApi } from "../lib/progress";

export function Progress({ L, progress }: { L: L; progress: ProgressApi }) {
  const navigate = useNavigate();
  const subject = subjects[0];
  const { passed, doneCount, doneHours } = progress;

  const open = (i: number) => {
    if (!progress.isUnlocked(i)) return;
    const b = books[i];
    if (b.sections.length) navigate(`/s/${subject.id}/${b.slug}`);
  };

  const labelFor = (i: number) => {
    const b = books[i];
    if (passed[b.slug] !== undefined) return `${passed[b.slug]}/5`;
    if (!progress.isUnlocked(i)) return "закрыта";
    return b.sections.length ? "открыта" : "скоро";
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: L.pad, width: "100%" }}>
      <div
        style={{
          display: "flex", alignItems: L.meHeadAlign, justifyContent: "space-between",
          gap: 24, flexDirection: L.meHeadDir,
        }}
      >
        <div>
          <h1 style={{ fontSize: L.h1, lineHeight: 0.98, letterSpacing: "-0.04em" }}>
            {doneCount} из {books.length}
          </h1>
          <p style={{ marginTop: 16, fontSize: L.sub, lineHeight: 1.4, color: "var(--ink-2)" }}>
            {doneCount === 0
              ? "Пройдите игру, чтобы закрыть тему."
              : `Закрыто ${doneHours} ${plural(doneHours, "час", "часа", "часов")}`}
          </p>
        </div>
        <button
          className="btn"
          style={{
            padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500,
            whiteSpace: "nowrap", backgroundColor: "var(--ink)", color: "#FFFFFF",
            transition: "opacity 160ms ease",
          }}
        >
          Войти
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, height: L.barH, marginTop: 44 }}>
        {books.map((b, i) => {
          const done = passed[b.slug] !== undefined;
          return (
            <button
              key={b.slug}
              className="bar"
              onClick={() => open(i)}
              aria-label={`Тема ${b.no}: ${labelFor(i)}`}
              style={{
                flex: "1 1 0", borderRadius: 10, backgroundSize: "240% 240%",
                animation: done ? `holoFlow ${10 + (i % 5)}s ease-in-out infinite` : "none",
                backgroundImage: done ? paletteFor(i, subject.hue, subject.hueStep).holo : "none",
                backgroundColor: done ? "transparent" : "rgba(20,20,15,0.08)",
                transition: "background 320ms ease, transform 220ms ease",
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 44 }}>
        {books.map((b, i) => {
          const done = passed[b.slug] !== undefined;
          const p = paletteFor(i, subject.hue, subject.hueStep);
          return (
            <button
              key={b.slug}
              className="row"
              onClick={() => open(i)}
              style={{
                display: "grid", gridTemplateColumns: L.meCols, gap: L.meGap, alignItems: "center",
                padding: L.rowPad, borderRadius: 16, textAlign: "left",
                transition: "background 140ms ease",
              }}
            >
              <span
                style={{
                  width: 28, height: 28, borderRadius: 999, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500,
                  color: "var(--ink)",
                  backgroundColor: done ? p.color : "transparent",
                  boxShadow: done
                    ? `0 0 0 5px color-mix(in oklab, ${p.color} 34%, transparent)`
                    : "inset 0 0 0 1.5px rgba(20,20,15,0.16)",
                  transform: done ? "scale(1)" : "scale(0.72)",
                  transition:
                    "background 320ms var(--ease), box-shadow 320ms var(--ease), transform 320ms var(--ease-back)",
                }}
              >
                {done ? "✓" : ""}
              </span>
              <span
                style={{
                  fontSize: L.rowTitle, lineHeight: 1.3, letterSpacing: "-0.015em",
                  color: done ? "var(--ink)" : "var(--ink-2)", textWrap: "pretty",
                }}
              >
                {b.title}
              </span>
              <span style={{ gridColumn: L.meScoreCol, fontSize: 17, color: done ? "var(--ink-2)" : "var(--ink-3)" }}>
                {labelFor(i)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
