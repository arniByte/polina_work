import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { books, totalHoursOf } from "../content/books";
import { subjectById, subjects } from "../content/subjects";
import { paletteFor } from "../design/palette";
import { TopicChip, type ChipState } from "../components/TopicChip";
import type { L } from "../lib/layout";
import { plural, pad } from "../lib/format";
import type { ProgressApi } from "../lib/progress";

const SEL_WEIGHT = 3.4;

export function Shelf({ L, progress }: { L: L; progress: ProgressApi }) {
  const { subjectId = "law" } = useParams();
  const navigate = useNavigate();
  const subject = subjectById(subjectId) ?? subjects[0];
  const [sel, setSel] = useState(0);
  const flip = useRef<HTMLDivElement>(null);
  const qr = useRef<HTMLDivElement>(null);

  // Панель темы переигрывает flipIn при каждой смене выбора.
  useEffect(() => {
    const el = flip.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "flipIn 480ms var(--ease-chip) both";
  }, [sel]);

  // QR всплывает и уходит по видимости, а не по разовому появлению.
  useEffect(() => {
    const el = qr.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const vis = e.intersectionRatio > 0.35;
          el.style.opacity = vis ? "1" : "0";
          el.style.transform = vis ? "none" : "translateY(56px) scale(0.96)";
        }),
      { threshold: [0, 0.35, 0.7] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [L.wide]);

  const current = books[sel];
  const currentPalette = paletteFor(sel, subject.hue, subject.hueStep);
  const unlocked = progress.isUnlocked(sel);
  const hasNotes = current.sections.length > 0;

  const stateOf = (i: number): ChipState => {
    if (!progress.isUnlocked(i)) return "locked";
    if (progress.passed[books[i].slug] !== undefined) return "passed";
    return books[i].sections.length ? "open" : "soon";
  };

  const open = () => {
    if (!hasNotes || !unlocked) return;
    navigate(`/s/${subject.id}/${current.slug}`);
  };

  const select = (i: number) => {
    // Второй клик по уже выбранному корешку открывает конспект.
    if (i === sel) {
      if (books[i].sections.length && progress.isUnlocked(i)) navigate(`/s/${subject.id}/${books[i].slug}`);
      return;
    }
    setSel(i);
  };

  const gapPx = L.shelfGap * (books.length - 1);
  const totalWeight = SEL_WEIGHT + (books.length - 1);
  const widthFor = (i: number) =>
    L.m ? "100%" : `calc((100% - ${gapPx}px) * ${i === sel ? SEL_WEIGHT : 1} / ${totalWeight})`;

  const gate = books.findIndex((b) => b.slug === current.slug) - 1;
  const btn = !unlocked
    ? { label: `Откроется после темы ${pad(books[Math.max(0, gate)].no)}`, live: false }
    : hasNotes
      ? { label: "Читать", live: true }
      : { label: "Скоро", live: false };

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: L.pad, width: "100%" }}>
      <h1 style={{ fontSize: L.h1, lineHeight: 0.98, letterSpacing: "-0.04em", maxWidth: 900, textWrap: "balance" }}>
        {subject.title}
      </h1>
      <p style={{ marginTop: 18, fontSize: L.sub, lineHeight: 1.4, color: "var(--ink-2)" }}>
        {books.length} тем, {totalHoursOf(books)} {plural(totalHoursOf(books), "час", "часа", "часов")}
      </p>

      <div style={{ display: "flex", flexDirection: "column", marginTop: L.shelfTop }}>
      <div
        style={{
          display: "flex",
          gap: L.shelfGap,
          flexDirection: L.shelfDir,
          height: L.shelfH,
          order: 2,
        }}
      >
        {books.map((b, i) => (
          <TopicChip
            key={b.slug}
            no={b.no}
            palette={paletteFor(i, subject.hue, subject.hueStep)}
            state={stateOf(i)}
            selected={i === sel}
            L={L}
            width={widthFor(i)}
            onSelect={() => select(i)}
          />
        ))}
      </div>

      <div
        ref={flip}
        style={{
          // На телефоне панель идёт первой: ряд из 16 корешков увёл бы её за экран.
          order: L.m ? 1 : 3,
          marginTop: L.m ? 0 : L.flipTop,
          marginBottom: L.m ? 24 : 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
          transformOrigin: "top center",
        }}
      >
        <div style={{ maxWidth: 780 }}>
          <h2 style={{ fontSize: L.h2, lineHeight: 1.05, letterSpacing: "-0.03em", textWrap: "balance" }}>
            {current.title}
          </h2>
          <p style={{ marginTop: 16, fontSize: L.sub, lineHeight: 1.4, color: "var(--ink-2)", textWrap: "pretty" }}>
            {current.subtitle}
          </p>
        </div>
        <button
          className="btn"
          onClick={open}
          disabled={!btn.live}
          style={{
            padding: L.btnPad,
            borderRadius: 999,
            fontSize: L.btn,
            fontWeight: 500,
            whiteSpace: "nowrap",
            // Только longhand: React сбрасывает shorthand background и вместе с ним
            // стирает уже выставленный backgroundImage.
            backgroundColor: btn.live ? "transparent" : "var(--active)",
            backgroundImage: btn.live ? currentPalette.holo : "none",
            backgroundSize: "360% 100%",
            animation: btn.live ? "holoFlow 9s ease-in-out infinite" : "none",
            color: btn.live ? "var(--ink)" : "var(--ink-2)",
            boxShadow: btn.live ? "var(--shadow-btn)" : "none",
            cursor: btn.live ? "pointer" : "default",
            transition: "transform 320ms var(--ease), box-shadow 320ms ease",
          }}
        >
          {btn.label}
        </button>
      </div>
      </div>

      {L.wide && (
        <div
          ref={qr}
          style={{
            marginTop: 160,
            display: "flex",
            alignItems: "center",
            gap: 36,
            opacity: 0,
            transform: "translateY(56px) scale(0.96)",
            transition: "opacity 700ms var(--ease), transform 700ms var(--ease)",
          }}
        >
          <div
            style={{
              width: 168, height: 168, borderRadius: 28, background: "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 19, color: "var(--ink-3)", boxShadow: "var(--shadow-qr)",
            }}
          >
            QR
          </div>
          <div>
            <div style={{ fontSize: 30, letterSpacing: "-0.02em", fontWeight: 500 }}>ПИКС в кармане</div>
            <p style={{ marginTop: 12, fontSize: 20, lineHeight: 1.45, color: "var(--ink-2)", maxWidth: 380 }}>
              Наведите камеру телефона — конспекты откроются там же.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
