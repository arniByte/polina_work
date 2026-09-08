import { useRef } from "react";
import type { Book } from "../content/types";
import type { Palette } from "../design/palette";
import type { L } from "../lib/layout";
import { pad } from "../lib/format";

/* Шер-карточка 4:5 под сторис. Вращается по указателю, слои внутри едут
   против него — так голограмма читается как физический материал.
   touch-action: none, иначе на телефоне жест уводит страницу в скролл. */
export function ShareCard({
  book, palette, score, total, rank, name, subjectLabel, L,
}: {
  book: Book;
  palette: Palette;
  score: number;
  total: number;
  rank: string;
  name: string;
  subjectLabel: string;
  L: L;
}) {
  const card = useRef<HTMLDivElement>(null);
  const holo = useRef<HTMLSpanElement>(null);
  const glare = useRef<HTMLSpanElement>(null);

  // Палец: захватываем указатель, иначе движение уходит странице и наклон рвётся.
  const grab = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const tilt = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
    el.style.transition = "transform 80ms linear, box-shadow 420ms ease";
    el.style.transform = `perspective(900px) rotateY(${(px * 18).toFixed(2)}deg) rotateX(${(-py * 15).toFixed(2)}deg) scale(1.02)`;
    el.style.boxShadow = `${(-px * 30).toFixed(0)}px ${(44 - py * 22).toFixed(0)}px 80px -40px rgba(20,20,15,0.6)`;
    if (holo.current) {
      holo.current.style.transition = "opacity 200ms ease";
      holo.current.style.opacity = "0.6";
      holo.current.style.transform = `translate3d(${(-px * 26).toFixed(1)}%, ${(-py * 18).toFixed(1)}%, 0)`;
    }
    if (glare.current) {
      glare.current.style.transition = "opacity 200ms ease, transform 120ms linear";
      glare.current.style.opacity = "0.9";
      glare.current.style.transform = `translate3d(${(px * 60).toFixed(1)}%, ${(py * 60).toFixed(1)}%, 0)`;
    }
  };

  const rest = () => {
    const el = card.current;
    if (el) {
      el.style.transition = "transform 620ms var(--ease), box-shadow 520ms ease";
      el.style.transform = "";
      el.style.boxShadow = "";
    }
    [holo.current, glare.current].forEach((n) => {
      if (!n) return;
      n.style.transition = "opacity 520ms ease, transform 620ms var(--ease)";
      n.style.opacity = "0";
      n.style.transform = "";
    });
  };

  return (
    <div
      ref={card}
      onPointerDown={grab}
      onPointerMove={tilt}
      onPointerLeave={rest}
      onPointerUp={rest}
      onPointerCancel={rest}
      style={{
        position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: 28,
        overflow: "hidden", padding: L.cardPadIn, display: "flex", flexDirection: "column",
        justifyContent: "space-between", touchAction: "none", willChange: "transform",
        transformStyle: "preserve-3d", backgroundSize: "360% 360%",
        animation: "holoFlow 12s ease-in-out infinite",
        backgroundImage: palette.holo, boxShadow: "var(--shadow-card)",
      }}
    >
      <span
        ref={holo}
        style={{
          position: "absolute", inset: "-70%", pointerEvents: "none", opacity: 0,
          mixBlendMode: "overlay", filter: "blur(16px) saturate(150%)", transition: "opacity 420ms ease",
          background:
            "repeating-linear-gradient(105deg, oklch(0.90 0.15 20) 0%, oklch(0.91 0.14 62) 7%, oklch(0.91 0.14 128) 14%, oklch(0.90 0.15 196) 21%, oklch(0.90 0.15 268) 28%, oklch(0.90 0.15 330) 35%, oklch(0.90 0.15 20) 42%)",
        }}
      />
      <span
        ref={glare}
        style={{
          position: "absolute", inset: "-20%", pointerEvents: "none", opacity: 0, filter: "blur(8px)",
          transition: "opacity 420ms ease",
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 38%, transparent 66%)",
        }}
      />
      <span
        style={{
          position: "absolute", top: "-10%", left: "-10%", width: "60%", height: "46%",
          pointerEvents: "none", filter: "blur(28px)",
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.7) 0%, transparent 70%)",
        }}
      />

      <div style={{ position: "relative", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, transform: "translateZ(30px)" }}>
        <span style={{ fontSize: L.cardBrand, fontWeight: 500, letterSpacing: "-0.02em" }}>ПИКС</span>
        <span style={{ fontSize: L.cardMeta, color: "rgba(20,20,15,0.72)" }}>{pad(book.no)}</span>
      </div>

      <div style={{ position: "relative", transform: "translateZ(30px)" }}>
        <div style={{ fontSize: L.cardScore, lineHeight: 0.9, letterSpacing: "-0.05em", fontWeight: 500 }}>
          {score}
          <span style={{ opacity: 0.42 }}>/{total}</span>
        </div>
        <div style={{ marginTop: 18, fontSize: L.cardRank, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 500, textWrap: "balance" }}>
          {book.title}
        </div>
      </div>

      <div
        style={{
          position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 16, fontSize: L.cardMeta, color: "rgba(20,20,15,0.72)", transform: "translateZ(30px)",
        }}
      >
        <div>
          <div style={{ color: "var(--ink)", fontWeight: 500 }}>{name || "Имя студента"}</div>
          <div style={{ marginTop: 4 }}>{subjectLabel}</div>
        </div>
        <span style={{ textAlign: "right" }}>{rank}</span>
      </div>
    </div>
  );
}
