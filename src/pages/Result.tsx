import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { bookBySlug, bookIndex } from "../content/books";
import { subjectById, subjects } from "../content/subjects";
import { PASS, QUIZ_LEN } from "../content/quiz";
import { paletteFor } from "../design/palette";
import { ShareCard } from "../components/ShareCard";
import { renderCardBlob, rankFor } from "../lib/shareCard";
import { nextTopicAfter } from "../lib/progress";
import type { ProgressApi } from "../lib/progress";
import type { L } from "../lib/layout";

export function Result({ L, progress }: { L: L; progress: ProgressApi }) {
  const { subjectId = "law", slug = "" } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { score?: number; total?: number } | null };
  const subject = subjectById(subjectId) ?? subjects[0];
  const book = bookBySlug(slug);
  const i = bookIndex(slug);

  const score = state?.score ?? 0;
  const total = state?.total ?? QUIZ_LEN;
  const [saveLabel, setSaveLabel] = useState("Сохранить");
  const [shareLabel, setShareLabel] = useState("Поделиться");
  const saved = useRef(false);

  // Результат засчитывается один раз за приход на экран.
  useEffect(() => {
    if (!book || saved.current) return;
    saved.current = true;
    progress.submit(book.slug, score);
  }, [book, score, progress]);

  if (!book || i < 0) {
    navigate(`/s/${subject.id}`, { replace: true });
    return null;
  }

  // Прямой заход по ссылке без прохождения игры — отправляем в конспект.
  if (!state) {
    navigate(`/s/${subject.id}/${slug}`, { replace: true });
    return null;
  }

  const palette = paletteFor(i, subject.hue, subject.hueStep);
  const passed = score >= PASS;
  const rank = rankFor(score, total, PASS);
  const next = nextTopicAfter(i);

  const makeBlob = () =>
    renderCardBlob({
      book, hue: palette.hue, score, total, pass: PASS,
      name: progress.name, subjectLabel: subject.label,
    });

  const save = async () => {
    setSaveLabel("…");
    try {
      const blob = await makeBlob();
      if (!blob) throw new Error("no blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `piks-${slug}-${score}of${total}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setSaveLabel("Сохранено");
    } catch {
      setSaveLabel("Не вышло");
    }
    setTimeout(() => setSaveLabel("Сохранить"), 2600);
  };

  const share = async () => {
    try {
      const blob = await makeBlob();
      if (blob) {
        const file = new File([blob], "piks-result.png", { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "ПИКС" });
          return;
        }
      }
    } catch {
      /* пользователь закрыл шит — молча уходим в сохранение */
    }
    setShareLabel("Поделиться");
    save();
  };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: L.pad, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: L.resultCols, gap: L.resultGap, alignItems: "start" }}>
        <div>
          <h1 style={{ maxWidth: "100%", fontSize: L.resultH1, lineHeight: 1.02, letterSpacing: "-0.035em", textWrap: "balance" }}>
            {rank}
          </h1>
          <p style={{ marginTop: 18, fontSize: L.sub, lineHeight: 1.4, color: "var(--ink-2)", maxWidth: 460, textWrap: "pretty" }}>
            {passed
              ? "Следующая тема открыта."
              : `Нужно ${PASS} верных из ${total}. Вернитесь к конспекту и попробуйте снова.`}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 44 }}>
            {passed && next && (
              <button
                className="btn"
                onClick={() => navigate(`/s/${subject.id}/${next.slug}`)}
                style={{
                  padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500, maxWidth: "100%",
                  color: "var(--ink)", backgroundSize: "360% 100%",
                  animation: "holoFlow 9s ease-in-out infinite", backgroundImage: palette.holo,
                  boxShadow: "var(--shadow-btn)", transition: "transform 320ms var(--ease)",
                }}
              >
                Следующая тема →
              </button>
            )}
            {!passed && (
              <button
                className="btn"
                onClick={() => navigate(`/s/${subject.id}/${slug}`)}
                style={{
                  padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500,
                  whiteSpace: "nowrap", backgroundColor: "var(--ink)", color: "#FFFFFF",
                  transition: "transform 320ms var(--ease)",
                }}
              >
                К конспекту
              </button>
            )}
            <button
              className="btn btn--ghost"
              onClick={() => navigate(`/s/${subject.id}/${slug}/quiz`)}
              style={{ padding: L.btnPad, borderRadius: 999, fontSize: L.btn, color: "var(--ink-card)", transition: "background 160ms ease" }}
            >
              Ещё раз
            </button>
          </div>
        </div>

        <div style={{ maxWidth: L.cardW, width: "100%" }}>
          <ShareCard
            book={book}
            palette={palette}
            score={score}
            total={total}
            rank={rank}
            name={progress.name}
            subjectLabel={subject.label}
            L={L}
          />

          <input
            value={progress.name}
            onChange={(e) => progress.setName(e.target.value)}
            placeholder="Ваше имя для карточки"
            style={{
              marginTop: 18, width: "100%", padding: "14px 20px", border: "none", borderRadius: 999,
              fontSize: 17, color: "var(--ink)", background: "var(--surface)",
              boxShadow: "inset 0 0 0 1px rgba(20,20,15,0.12)", outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <button
              className="btn"
              onClick={share}
              style={{
                flex: "1 1 140px", textAlign: "center", padding: "14px 22px", borderRadius: 999,
                fontSize: 17, fontWeight: 500, backgroundColor: "var(--ink)", color: "#FFFFFF",
                transition: "transform 320ms var(--ease)",
              }}
            >
              {shareLabel}
            </button>
            <button
              className="btn btn--ghost"
              onClick={save}
              style={{
                flex: "1 1 140px", textAlign: "center", padding: "14px 22px", borderRadius: 999,
                fontSize: 17, color: "var(--ink-card)", boxShadow: "inset 0 0 0 1px rgba(20,20,15,0.12)",
                transition: "background 160ms ease",
              }}
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
