import { useRef } from "react";
import type { Palette } from "../design/palette";
import type { L } from "../lib/layout";
import { pad } from "../lib/format";

export type ChipState = "passed" | "open" | "soon" | "locked";

type Props = {
  no: number;
  palette: Palette;
  state: ChipState;
  selected: boolean;
  L: L;
  /** Доля ширины ряда: выбранный корешок весит 3.4, остальные 1. */
  width: string;
  onSelect: () => void;
};

/* Корешок темы. Параллакс-голограмма живёт только на выбранном и только
   пока тема открыта: у запертой карточка не наклоняется вовсе. */
export function TopicChip({ no, palette, state, selected, L, width, onSelect }: Props) {
  const card = useRef<HTMLButtonElement>(null);
  const holo = useRef<HTMLSpanElement>(null);
  const glare = useRef<HTMLSpanElement>(null);

  const locked = state === "locked";
  const interactive = selected && !locked;

  // Палец ведёт параллакс так же, как курсор: захватываем указатель,
  // иначе первое же движение уходит в скролл страницы.
  const grab = (e: React.PointerEvent) => {
    if (!interactive || e.pointerType === "mouse") return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const parallax = (e: React.PointerEvent) => {
    if (!interactive) return;
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
    el.style.transition = "transform 80ms linear, box-shadow 420ms ease";
    el.style.transform = `perspective(760px) rotateY(${(px * 17).toFixed(2)}deg) rotateX(${(-py * 14).toFixed(2)}deg) scale(1.03)`;
    el.style.boxShadow = `${(-px * 26).toFixed(0)}px ${(26 - py * 18).toFixed(0)}px 52px -26px rgba(20,20,15,0.5)`;
    if (holo.current) {
      holo.current.style.transition = "opacity 200ms ease";
      holo.current.style.opacity = "0.62";
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

  const background = locked ? palette.matte : selected ? palette.grad : palette.color;

  return (
    <button
      ref={card}
      className={interactive ? "chip chip--live" : "chip"}
      onClick={onSelect}
      onPointerDown={grab}
      onPointerMove={parallax}
      onPointerLeave={rest}
      onPointerUp={rest}
      onPointerCancel={rest}
      aria-label={`Тема ${pad(no)}${locked ? ", закрыта" : ""}`}
      style={{
        position: "relative",
        borderRadius: L.chipRadius,
        display: "flex",
        overflow: "hidden",
        alignItems: L.chipAlign,
        justifyContent: L.chipJustify,
        padding: L.chipPad,
        fontSize: L.chipFont,
        fontWeight: 500,
        willChange: "transform",
        transformStyle: "preserve-3d",
        // Вертикальный скролл страницы остаётся, горизонтальное движение — параллакс.
        touchAction: interactive ? "pan-y" : "auto",
        flex: "0 0 auto",
        width,
        height: (selected ? L.chipHSel : L.chipH) + "px",
        background,
        opacity: selected ? 1 : 0.86,
        transition:
          "width 460ms var(--ease-chip), height 420ms var(--ease-chip), transform 520ms var(--ease), opacity 300ms ease, background 500ms ease, box-shadow 420ms ease",
      }}
    >
      <span
        ref={holo}
        style={{
          position: "absolute", inset: "-70%", pointerEvents: "none", opacity: 0,
          mixBlendMode: "overlay", filter: "blur(26px) saturate(135%)", transition: "opacity 420ms ease",
          background:
            "linear-gradient(105deg, oklch(0.92 0.12 350) 0%, oklch(0.93 0.11 30) 14%, oklch(0.94 0.10 78) 28%, oklch(0.93 0.11 140) 43%, oklch(0.92 0.12 196) 57%, oklch(0.92 0.12 250) 72%, oklch(0.92 0.12 300) 86%, oklch(0.92 0.12 350) 100%)",
        }}
      />
      <span
        ref={glare}
        style={{
          position: "absolute", inset: "-20%", pointerEvents: "none", opacity: 0,
          filter: "blur(6px)", transition: "opacity 420ms ease",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.16) 38%, transparent 66%)",
        }}
      />
      <span style={{ position: "relative", transform: "translateZ(24px)", color: locked ? "rgba(20,20,15,0.42)" : "var(--ink)" }}>
        {pad(no)}
      </span>
      {locked && (
        <span
          style={{
            position: "absolute", top: L.lockTop, right: L.lockRight,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.34,
          }}
        >
          <svg width="12" height="15" viewBox="0 0 12 15" fill="none" aria-hidden="true">
            <path d="M2.6 6V4a3.4 3.4 0 0 1 6.8 0v2" stroke="#14140F" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="1" y="6" width="10" height="7.6" rx="2" fill="#14140F" />
          </svg>
        </span>
      )}
    </button>
  );
}
