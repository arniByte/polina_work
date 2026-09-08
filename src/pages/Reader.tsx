import { Link, useNavigate, useParams } from "react-router-dom";
import { bookBySlug, bookIndex, books } from "../content/books";
import { subjectById, subjects } from "../content/subjects";
import { hasQuiz } from "../content/quiz";
import { paletteFor } from "../design/palette";
import { Blocks } from "../components/Blocks";
import { nextTopicAfter } from "../lib/progress";
import type { ProgressApi } from "../lib/progress";
import type { L } from "../lib/layout";

export function Reader({ L, progress }: { L: L; progress: ProgressApi }) {
  const { subjectId = "law", slug = "" } = useParams();
  const navigate = useNavigate();
  const subject = subjectById(subjectId) ?? subjects[0];
  const book = bookBySlug(slug);
  const i = bookIndex(slug);

  if (!book || i < 0) {
    return (
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: L.pad, width: "100%" }}>
        <h1 style={{ fontSize: L.h1, letterSpacing: "-0.04em" }}>Темы нет</h1>
        <Link to={`/s/${subject.id}`} style={{ fontSize: 17, color: "var(--ink-2)" }}>
          ← Все темы
        </Link>
      </div>
    );
  }

  const palette = paletteFor(i, subject.hue, subject.hueStep);
  const passedScore = progress.passed[book.slug];
  const isPassed = passedScore !== undefined;
  const next = nextTopicAfter(i);
  const empty = book.sections.length === 0;

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: L.pad, width: "100%" }}>
      <Link
        to={`/s/${subject.id}`}
        style={{ fontSize: 17, color: "var(--ink-2)", marginBottom: 40, display: "inline-block" }}
      >
        ← Все темы
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: L.readerCols, gap: L.readerGap, alignItems: "start" }}>
        <div>
          <div style={{ width: 84, height: 10, borderRadius: 999, background: palette.color, marginBottom: 28 }} />
          <h1 style={{ fontSize: L.readH1, lineHeight: 1.03, letterSpacing: "-0.035em", textWrap: "balance" }}>
            {book.title}
          </h1>
          {book.summary && (
            <p style={{ marginTop: 24, fontSize: L.lead, lineHeight: 1.5, color: "var(--ink-card)", maxWidth: 660, textWrap: "pretty" }}>
              {book.summary}
            </p>
          )}

          {empty ? (
            <div style={{ marginTop: 40, borderRadius: 24, padding: L.quizPad, background: "var(--surface)" }}>
              <div style={{ fontSize: L.h2s, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 500 }}>
                Конспект в работе
              </div>
              <p style={{ marginTop: 12, fontSize: L.body, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 460 }}>
                Тема появится здесь целиком: разбор, статьи и ловушки.
              </p>
              <button
                className="btn"
                onClick={() => navigate(`/s/${subject.id}`)}
                style={{
                  marginTop: 28, padding: L.btnPad, borderRadius: 999, fontSize: L.btn,
                  fontWeight: 500, backgroundColor: palette.color, color: "var(--ink)",
                  transition: "transform 320ms var(--ease)",
                }}
              >
                К темам
              </button>
            </div>
          ) : (
            <>
              <div style={{ height: 1, background: "var(--line)", margin: "56px 0" }} />

              {book.sections.map((s, k) => (
                <section key={k} style={{ marginBottom: 72 }}>
                  <h2 style={{ marginBottom: 28, fontSize: L.h2s, lineHeight: 1.12, letterSpacing: "-0.025em", textWrap: "pretty" }}>
                    {s.title}
                  </h2>
                  <Blocks blocks={s.blocks} L={L} accent={palette.color} />
                </section>
              ))}

              <div style={{ borderRadius: 24, padding: L.quizPad, background: "var(--surface)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: L.stepGap, flexWrap: "wrap", fontSize: L.body }}>
                  <span style={{ color: "var(--ink-2)" }}>Конспект прочитан</span>
                  <span style={{ color: "var(--line-num)" }}>→</span>
                  <span style={{ color: isPassed ? "var(--ink-2)" : "var(--ink)" }}>Проверка</span>
                  <span style={{ color: "var(--line-num)" }}>→</span>
                  <span style={{ color: isPassed ? "var(--ink)" : "var(--ink-faint)" }}>Следующая тема</span>
                </div>

                <div style={{ marginTop: 28, fontSize: L.h2s, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 500 }}>
                  Проверить тему в игре
                </div>
                <p style={{ marginTop: 12, fontSize: L.body, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 520 }}>
                  Пять ситуаций. Четыре верных ответа открывают следующую тему.
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
                  <button
                    className="btn"
                    onClick={() => navigate(`/s/${subject.id}/${book.slug}/quiz`)}
                    disabled={!hasQuiz(book.slug)}
                    style={{
                      padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500,
                      whiteSpace: "nowrap", color: "var(--ink)", backgroundSize: "360% 100%",
                      animation: hasQuiz(book.slug) ? "holoFlow 9s ease-in-out infinite" : "none",
                      backgroundImage: hasQuiz(book.slug) ? palette.holo : "none",
                      backgroundColor: hasQuiz(book.slug) ? "transparent" : "var(--active)",
                      boxShadow: hasQuiz(book.slug) ? "var(--shadow-btn)" : "none",
                      cursor: hasQuiz(book.slug) ? "pointer" : "default",
                      transition: "transform 320ms var(--ease)",
                    }}
                  >
                    {isPassed ? "Пройти ещё раз" : hasQuiz(book.slug) ? "Пройти проверку" : "Проверка готовится"}
                  </button>

                  <button
                    className="btn"
                    onClick={() => next && isPassed && navigate(`/s/${subject.id}/${next.slug}`)}
                    disabled={!isPassed || !next}
                    style={{
                      padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500,
                      whiteSpace: "nowrap", backgroundSize: "360% 100%",
                      animation: isPassed && next ? "holoFlow 9s ease-in-out infinite" : "none",
                      backgroundImage: isPassed && next ? palette.holo : "none",
                      backgroundColor: isPassed && next ? "transparent" : "var(--hover)",
                      color: isPassed && next ? "var(--ink)" : "var(--ink-mute)",
                      cursor: isPassed && next ? "pointer" : "default",
                      transition: "transform 320ms var(--ease)",
                    }}
                  >
                    {isPassed ? (next ? "Следующая тема →" : "Это последняя тема") : "Откроется после проверки"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ position: L.railPos, top: 116, display: "flex", flexDirection: "column", gap: 32 }}>
          {book.sections.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {book.sections.map((s, k) => (
                <div key={k} style={{ fontSize: 17, lineHeight: 1.4, color: "var(--ink-2)", textWrap: "pretty" }}>
                  {s.title}
                </div>
              ))}
            </div>
          )}
          {book.links.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {book.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: 17, lineHeight: 1.4, textWrap: "pretty" }}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Соседняя тема — используется в шапке результата. */
export const neighbours = (slug: string) => {
  const i = bookIndex(slug);
  return { prev: books[i - 1], next: books[i + 1] };
};
