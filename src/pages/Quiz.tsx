import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { bookBySlug, bookIndex } from "../content/books";
import { subjectById, subjects } from "../content/subjects";
import { buildAttempt } from "../content/quiz";
import { paletteFor } from "../design/palette";
import { pad } from "../lib/format";
import type { L } from "../lib/layout";

/* Игра-проверка. Счёт копится здесь и уезжает на экран результата через
   navigate(state) — перезагрузка страницы результата честно начинает заново. */
export function Quiz({ L }: { L: L }) {
  const { subjectId = "law", slug = "" } = useParams();
  const navigate = useNavigate();
  const subject = subjectById(subjectId) ?? subjects[0];
  const book = bookBySlug(slug);
  const i = bookIndex(slug);
  // Набор фиксируется на всю попытку: иначе каждый ре-рендер тасовал бы вопросы.
  const [list] = useState(() => buildAttempt(slug));

  const [qi, setQi] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => window.scrollTo({ top: 0 }), [qi]);

  // Редирект элементом, а не вызовом в рендере: navigate() отсюда обновляет
  // роутер во время отрисовки и оставляет пустой экран на прежнем URL.
  if (!book || list.length === 0) return <Navigate to={`/s/${subject.id}`} replace />;

  const palette = paletteFor(i, subject.hue, subject.hueStep);
  const q = list[qi];
  const answered = pick !== null;
  const last = qi + 1 >= list.length;

  const answer = (k: number) => {
    if (answered) return;
    setPick(k);
    if (q.correct === k) setScore((s) => s + 1);
  };

  const forward = () => {
    if (last) {
      navigate(`/s/${subject.id}/${slug}/result`, { state: { score, total: list.length } });
      return;
    }
    setQi((n) => n + 1);
    setPick(null);
  };

  const optionStyle = (k: number) => {
    if (!answered) return { background: "var(--surface)", color: "var(--ink)", boxShadow: "var(--opt-ring)" };
    if (k === q.correct) return { background: "var(--ok-bg)", color: "var(--ink)", boxShadow: "var(--ok-ring)" };
    if (k === pick) return { background: "var(--bad-bg)", color: "var(--bad-ink)", boxShadow: "var(--bad-ring)" };
    return { background: "var(--surface)", color: "var(--ink-mute)", boxShadow: "var(--opt-ring)" };
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: L.pad, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <span style={{ fontSize: 17, color: "var(--ink-2)" }}>Тема {pad(book.no)}</span>
        <span style={{ fontSize: 17, color: "var(--ink-2)" }}>
          {qi + 1} из {list.length}
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
        {list.map((_, k) => (
          <div
            key={k}
            style={{
              flex: "1 1 0",
              height: 4,
              borderRadius: 999,
              transition: "background 320ms ease",
              background: k < qi ? palette.color : k === qi ? "var(--ink)" : "rgba(20,20,15,0.12)",
            }}
          />
        ))}
      </div>

      <h1
        style={{
          marginTop: L.qTop, fontSize: L.qFont, lineHeight: 1.15,
          letterSpacing: "-0.02em", fontWeight: 500, textWrap: "pretty",
        }}
      >
        {q.q}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
        {q.a.map((text, k) => (
          <button
            key={k}
            className="opt"
            onClick={() => answer(k)}
            style={{
              textAlign: "left",
              borderRadius: 18,
              padding: L.optPad,
              fontSize: L.body,
              lineHeight: 1.4,
              textWrap: "pretty",
              cursor: answered ? "default" : "pointer",
              transition: "background 260ms ease, box-shadow 260ms ease, color 260ms ease, transform 260ms var(--ease)",
              ...optionStyle(k),
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: 28, animation: "pageIn 420ms var(--ease) both" }}>
          <p style={{ fontSize: L.body, lineHeight: 1.6, color: "var(--ink-card)", textWrap: "pretty" }}>{q.why}</p>
          <button
            className="btn"
            onClick={forward}
            style={{
              marginTop: 28, padding: L.btnPad, borderRadius: 999, fontSize: L.btn,
              fontWeight: 500, backgroundColor: "var(--ink)", color: "#FFFFFF",
              transition: "transform 320ms var(--ease)",
            }}
          >
            {last ? "Показать результат" : "Дальше"}
          </button>
        </div>
      )}
    </div>
  );
}
